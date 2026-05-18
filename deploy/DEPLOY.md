# Деплой yarche-next на свой сервер (Ubuntu/Debian)

Конфигурация: **nginx как reverse-proxy → Node.js (Next.js standalone server) на 127.0.0.1:3000**, под выделенным пользователем `yarche`, под systemd. SSL через Let's Encrypt.

---

## 0. Предусловия

- Ubuntu 22.04 LTS или новее (или Debian 12+)
- Домен `yarche.by` указывает A/AAAA-записями на IP этого сервера
- Открыты порты 80, 443
- Доступ по SSH с правами sudo
- Git-репозиторий с этим кодом на GitHub/GitLab (если ещё не запушен — см. шаг **2**)

---

## 1. Первоначальная установка (один раз на сервере)

### 1.1 Системные пакеты

```bash
sudo apt update
sudo apt install -y curl git nginx certbot python3-certbot-nginx ufw
```

### 1.2 Node.js 22 LTS (через NodeSource)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # должно быть v22.x
```

### 1.3 Файрволл (если используется ufw)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 1.4 Системный пользователь и каталог

```bash
sudo useradd --system --shell /bin/bash --home-dir /opt/yarche-next --create-home yarche
sudo chown -R yarche:yarche /opt/yarche-next
```

---

## 2. Загрузка кода в git (один раз, локально)

Проект уже инициализирован как git-репо (это сделал `create-next-app`). Если ещё не запушен:

```bash
cd c:\projects\yarche-next
git add .
git commit -m "Initial Next.js 16 migration"

# Создай пустой репо на GitHub/GitLab, потом:
git branch -M main
git remote add origin git@github.com:<your-account>/yarche-next.git
git push -u origin main
```

> **ВАЖНО:** убедись, что `.gitignore` (создан `create-next-app`) исключает `node_modules`, `.next`, `.env*.local`. Это правильно для деплоя — `node_modules` ставится на сервере через `npm ci`.

---

## 3. Клонирование и первый build на сервере

### 3.1 Развернуть deploy-ключ для приватного репо

Если репо публичный — пропускай. Если приватный:

```bash
sudo -u yarche ssh-keygen -t ed25519 -C "yarche@$(hostname)" -f /opt/yarche-next/.ssh/id_ed25519 -N ""
sudo cat /opt/yarche-next/.ssh/id_ed25519.pub
# Скопируй вывод → GitHub repo → Settings → Deploy keys → Add (read-only).
```

### 3.2 Клонирование

```bash
sudo -u yarche bash -c '
  cd /opt
  rm -rf yarche-next/{,.[!.]}*    # очищаем, если что-то было от useradd
  git clone git@github.com:<your-account>/yarche-next.git /opt/yarche-next
'
```

### 3.3 Установка зависимостей + build

```bash
sudo -u yarche bash -c '
  cd /opt/yarche-next
  npm ci --no-audit --no-fund
  npm run build
'
```

### 3.4 Проверь, что стартует вручную

```bash
sudo -u yarche bash -c 'cd /opt/yarche-next && PORT=3000 HOSTNAME=127.0.0.1 NODE_ENV=production npm start' &
sleep 3
curl -I http://127.0.0.1:3000/
kill %1
```

Если HTTP/1.1 200 — ОК, идём дальше.

---

## 4. systemd-сервис

```bash
sudo cp /opt/yarche-next/deploy/yarche.service /etc/systemd/system/yarche.service
sudo systemctl daemon-reload
sudo systemctl enable --now yarche.service
sudo systemctl status yarche.service     # должно быть active (running)

# Логи в реальном времени:
sudo journalctl -u yarche.service -f
```

---

## 5. nginx

### 5.1 Положить конфиг

```bash
sudo cp /opt/yarche-next/deploy/yarche.nginx.conf /etc/nginx/sites-available/yarche.by
sudo ln -sf /etc/nginx/sites-available/yarche.by /etc/nginx/sites-enabled/yarche.by

# Удалить default site если он мешает:
sudo rm -f /etc/nginx/sites-enabled/default

# Каталог для ACME-challenge:
sudo mkdir -p /var/www/certbot
```

### 5.2 SSL через Let's Encrypt

Сначала закомментируй в конфиге блоки `listen 443 ssl` (или временно положи self-signed заглушку) — certbot должен сначала получить сертификат через port 80.

Проще всего — пусть certbot модифицирует конфиг сам:

```bash
sudo nginx -t                            # синтаксис
sudo systemctl reload nginx
sudo certbot --nginx -d yarche.by -d www.yarche.by --redirect --agree-tos -m b2b@yarche.by
```

certbot выдаст сертификат и допишет блоки `listen 443 ssl`. После этого тебе может потребоваться вручную привести конфиг к виду из `deploy/yarche.nginx.conf` (с кешем `_next/static`, security-headers, gzip и т.д.) — certbot этого не делает, он только трогает SSL-секцию.

### 5.3 Авто-обновление сертификата

certbot сам ставит cron/systemd-timer. Проверь:

```bash
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

---

## 6. Дальнейшие апдейты (скрипт `deploy.sh`)

```bash
sudo chmod +x /opt/yarche-next/deploy/deploy.sh
```

Чтобы `yarche` мог рестартить сервис без пароля, разреши конкретный sudo-вызов:

```bash
sudo tee /etc/sudoers.d/yarche-deploy > /dev/null <<'EOF'
yarche ALL=(root) NOPASSWD: /usr/bin/systemctl restart yarche.service
EOF
sudo chmod 0440 /etc/sudoers.d/yarche-deploy
```

Теперь любой апдейт:

```bash
sudo -u yarche /opt/yarche-next/deploy/deploy.sh
```

Делает: `git pull → npm ci → npm run build → systemctl restart → health check`. Старая версия отдаёт трафик до того момента, как `systemctl restart` перезапустит процесс (~1-2 сек downtime; для zero-downtime нужен blue-green с двумя портами и `nginx reload`).

---

## 7. (опционально) Webhook для авто-деплоя по git push

GitHub Webhook → endpoint на сервере → дёргает `deploy.sh`. Простейший вариант — `webhook` пакет:

```bash
sudo apt install -y webhook
```

Не пишу конфиг здесь — не критично, можно прикрутить позже. Пока хватает руками: `ssh prod 'sudo -u yarche /opt/yarche-next/deploy/deploy.sh'`.

---

## 8. Откат при поломке

```bash
sudo -u yarche bash -c '
  cd /opt/yarche-next
  git log --oneline -10
  git reset --hard <good-sha>
  npm ci && npm run build
'
sudo systemctl restart yarche.service
```

---

## 9. Healthcheck / мониторинг (опционально)

- `curl -fsS https://yarche.by/ > /dev/null` в cron каждые 5 минут с алертом в Telegram при не-200
- Или подключи UptimeRobot / Better Stack / Hetzner Status

---

## 10. Структура каталогов на сервере

```
/opt/yarche-next/         ← git clone
├── .next/                ← build output (создаётся `npm run build`)
├── app/                  ← страницы
├── components/
├── content/              ← markdown кейсов + posts.json (server-side data)
├── deploy/               ← эти файлы
├── lib/
├── node_modules/         ← `npm ci`
├── public/               ← static (CSS, fonts, images, MEDIA)
├── package.json
├── package-lock.json
└── next.config.ts
```

---

## Известные грабли

- **PORT занят.** Если 3000 уже используется чем-то, поправь `Environment=PORT=` в `yarche.service` и `proxy_pass` в nginx-конфиге.
- **node version.** Если на сервере Node <20, Next 16 не запустится. Проверь `node --version`. Поставь 22 LTS через NodeSource.
- **systemd ProtectSystem.** В юните стоит `ProtectSystem=strict` + `ReadWritePaths=/opt/yarche-next/.next` — Next должен иметь доступ только к своему `.next`. Если используешь файловое логирование куда-то ещё, добавь путь в `ReadWritePaths=`.
- **CORS / kроссдоменные API.** Виджет шлёт заявки на `https://bot.yarche.by:5050/api/lead` — это отдельный сервис, его деплой/настройка вне scope этого README.
