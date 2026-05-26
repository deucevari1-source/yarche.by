const SITE = 'https://yarche.by';

const CATEGORIES = [
  { id: '100', name: 'Создание сайтов' },
  { id: '200', name: 'AI-сотрудник' },
  { id: '300', name: 'AI-чатботы и автоматизация' },
  { id: '400', name: 'SEO-продвижение' },
  { id: '500', name: 'Telegram-боты' },
  { id: '600', name: 'Контент-агентство' },
];

type Offer = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  picture: string;
  url: string;
  shortDescription: string;
  description: string;
};

const OFFERS: Offer[] = [
  {
    id: '1001',
    name: 'Лендинг или корпоративный сайт',
    price: 650,
    categoryId: '100',
    picture: '/images/services/web.svg',
    url: '/web',
    shortDescription:
      'Одностраничник или многостраничный сайт компании. Адаптив, CMS, форма заявки. Срок 2–10 дней.',
    description:
      'Одностраничник или многостраничный сайт компании под ключ. Уникальный дизайн под бренд, адаптивная вёрстка, CMS-система по желанию, форма заявки с интеграцией CRM, SEO-оптимизация из коробки. До 15 страниц для корпоративного сайта. Срок 2–10 дней. Поддержка 1 месяц включена.',
  },
  {
    id: '1002',
    name: 'Интернет-магазин с ЕРИП',
    price: 2900,
    categoryId: '100',
    picture: '/images/services/web.svg',
    url: '/web',
    shortDescription:
      'Полноценная e-commerce платформа. Каталог, корзина, ЕРИП, личный кабинет. Срок 1–3 недели.',
    description:
      'Полноценная e-commerce платформа: каталог с фильтрами, корзина, оплата через ЕРИП и банковские карты, личный кабинет покупателя с историей заказов, интеграция со складом и службами доставки. SEO-оптимизация. Срок 1–3 недели. Поддержка 3 месяца.',
  },
  {
    id: '1003',
    name: 'Веб-приложение на React + Next.js',
    price: 2900,
    categoryId: '100',
    picture: '/images/services/web.svg',
    url: '/web/quote/react',
    shortDescription:
      'SPA / SSR на современном стеке: SaaS, маркетплейс, дашборд, портал. От 2 до 6 недель.',
    description:
      'Кастомное веб-приложение на React + Next.js — стеке Notion, TikTok, Twitch. SaaS-платформы, маркетплейсы, дашборды, корпоративные порталы. Готов к индексации с первого дня, открывается за 1–2 секунды, любая интеграция (CRM, оплата, склад, 1С). Срок 2–6 недель. Поддержка 3 месяца.',
  },
  {
    id: '2001',
    name: 'AI-консультант (базовый тариф)',
    price: 1390,
    categoryId: '200',
    picture: '/images/services/ai-employee.svg',
    url: '/ai-employee',
    shortDescription: 'AI-сотрудник для базовой поддержки клиентов и обработки заявок.',
    description:
      'AI-сотрудник на базе современных LLM-моделей для базовой поддержки клиентов: ответы на типовые вопросы, обработка заявок, FAQ. Интеграция с сайтом, мессенджерами и CRM. Базовая настройка под ваш бизнес.',
  },
  {
    id: '2002',
    name: 'AI-менеджер продаж',
    price: 2900,
    categoryId: '200',
    picture: '/images/services/ai-employee.svg',
    url: '/ai-employee',
    shortDescription:
      'AI ведёт диалог с клиентом, квалифицирует лида, передаёт горячих менеджеру.',
    description:
      'AI-менеджер продаж: ведёт диалог с клиентом по вашему сценарию, квалифицирует лида, выявляет потребности, передаёт горячих менеджерам. Интеграция с CRM, мессенджерами, базой знаний. Обучение на ваших скриптах и кейсах.',
  },
  {
    id: '2003',
    name: 'AI-аналитик и автоматизация',
    price: 5900,
    categoryId: '200',
    picture: '/images/services/ai-employee.svg',
    url: '/ai-employee',
    shortDescription:
      'Полная автоматизация рутинных процессов: отчёты, аналитика, документооборот.',
    description:
      'Комплексное внедрение AI в бизнес-процессы: автоматизация отчётов, аналитика данных, обработка документов, прогнозы. Интеграция с вашими системами (1С, CRM, базы данных). Обучение команды.',
  },
  {
    id: '3001',
    name: 'Пилотный AI-чатбот',
    price: 690,
    categoryId: '300',
    picture: '/images/services/ai.svg',
    url: '/ai',
    shortDescription: 'AI-чатбот на ваш сайт: ответы на вопросы, сбор контактов.',
    description:
      'Пилотный AI-чатбот для сайта: отвечает на типовые вопросы клиентов на базе вашей базы знаний, собирает контакты, передаёт сложные запросы менеджеру. Установка за 2–3 дня. Подключение к OpenAI / локальным моделям.',
  },
  {
    id: '3002',
    name: 'Внедрение AI в бизнес-процессы',
    price: 2900,
    categoryId: '300',
    picture: '/images/services/ai.svg',
    url: '/ai',
    shortDescription:
      'Комплексное внедрение AI: автоматизация задач, рекомендации, предиктивная аналитика.',
    description:
      'Внедрение искусственного интеллекта в ваши процессы: автоматизация рутинных задач, рекомендательные системы, предиктивная аналитика, интеграция с CRM и складом. Анализ бизнеса, выбор моделей, разработка, обучение команды.',
  },
  {
    id: '4001',
    name: 'SEO-продвижение базовое',
    price: 590,
    categoryId: '400',
    picture: '/images/services/seo.svg',
    url: '/seo',
    shortDescription:
      'Ежемесячное SEO в Google и Яндекс: технический аудит, контент, отчёты. От 590 BYN/мес.',
    description:
      'Базовый тариф SEO-продвижения сайта в Google и Яндекс. Технический аудит, оптимизация ключевых страниц, контент-план, ежемесячные отчёты. Подходит для малого бизнеса с локальной аудиторией.',
  },
  {
    id: '4002',
    name: 'Технический SEO-аудит',
    price: 990,
    categoryId: '400',
    picture: '/images/services/seo.svg',
    url: '/seo',
    shortDescription:
      'Разовый аудит сайта: что мешает индексации и ранжированию, как починить. От 990 BYN.',
    description:
      'Разовый технический аудит сайта: проверка индексации, Core Web Vitals, структуры URL, разметки Schema.org, sitemap, robots.txt, дубликатов, скорости загрузки. Подробный отчёт с приоритизированным списком работ.',
  },
  {
    id: '4003',
    name: 'SEO-продвижение премиум',
    price: 1990,
    categoryId: '400',
    picture: '/images/services/seo.svg',
    url: '/seo',
    shortDescription:
      'Полный цикл: семантика, контент, ссылки, A/B. Для конкурентных ниш. От 1 990 BYN/мес.',
    description:
      'Премиум-тариф SEO: расширенное семантическое ядро, контент-стратегия с регулярными публикациями, линкбилдинг, A/B-тесты посадочных, расширенная аналитика. Подходит для конкурентных ниш и федеральных проектов.',
  },
  {
    id: '5001',
    name: 'Простой Telegram-бот',
    price: 350,
    categoryId: '500',
    picture: '/images/services/tg-bots.svg',
    url: '/tg-bots',
    shortDescription:
      'Бот для типовых задач: ответы на FAQ, запись на услуги, рассылка. От 350 BYN.',
    description:
      'Простой Telegram-бот для типовых задач: ответы на FAQ, запись на услуги, отправка уведомлений, рассылка. Без сложных интеграций. Срок 2–5 дней. Хостинг на ваш выбор.',
  },
  {
    id: '5002',
    name: 'Telegram-бот с интеграциями',
    price: 990,
    categoryId: '500',
    picture: '/images/services/tg-bots.svg',
    url: '/tg-bots',
    shortDescription:
      'Бот с CRM, базой данных, оплатой. Заменяет 2–3 сотрудников на рутине.',
    description:
      'Telegram-бот с интеграциями: связь с CRM, базой данных, оплатой (ЕРИП, карты), внешними API. Заменяет 2–3 сотрудников на рутинных задачах. Срок 1–2 недели.',
  },
  {
    id: '5003',
    name: 'Корпоративный Telegram-бот',
    price: 2490,
    categoryId: '500',
    picture: '/images/services/tg-bots.svg',
    url: '/tg-bots',
    shortDescription:
      'Сложный бот для команды: документооборот, аналитика, мультиязычность.',
    description:
      'Корпоративный Telegram-бот: документооборот, внутренние процессы, аналитика, мультиязычность, разграничение прав. Подходит для команд от 20 человек. Полная адаптация под ваши процессы.',
  },
  {
    id: '6001',
    name: 'Контент-маркетинг базовый',
    price: 350,
    categoryId: '600',
    picture: '/images/services/content.svg',
    url: '/content',
    shortDescription:
      'Статьи в блог и посты в соцсети. 4–6 материалов в месяц. От 350 BYN/мес.',
    description:
      'Базовый тариф контент-агентства: 4–6 материалов в месяц для блога и социальных сетей. Темы согласовываются, тексты пишут авторы с экспертизой в вашей нише. Подходит для начала контент-маркетинга.',
  },
  {
    id: '6002',
    name: 'Контент-маркетинг стандарт',
    price: 890,
    categoryId: '600',
    picture: '/images/services/content.svg',
    url: '/content',
    shortDescription:
      '12–15 материалов в месяц + распространение + SEO. От 890 BYN/мес.',
    description:
      'Стандартный тариф: 12–15 материалов в месяц для блога и соцсетей, распространение в каналах, SEO-оптимизация текстов под ключевые запросы. Ежемесячная аналитика и корректировка стратегии.',
  },
  {
    id: '6003',
    name: 'Контент-маркетинг премиум',
    price: 1900,
    categoryId: '600',
    picture: '/images/services/content.svg',
    url: '/content',
    shortDescription:
      'Полный продакшн: тексты, видео, инфографика, рекламные тексты. От 1 900 BYN/мес.',
    description:
      'Премиум-тариф: полный контент-продакшн — длинные тексты, видео, инфографика, посадочные страницы, рекламные тексты. Свой редактор и видеограф. Подходит для брендов с активным digital-присутствием.',
  },
];

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildYml(): string {
  const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const categoriesXml = CATEGORIES.map(
    (c) => `            <category id="${c.id}">${xmlEscape(c.name)}</category>`,
  ).join('\n');

  const offersXml = OFFERS.map(
    (o) => `            <offer id="${o.id}" available="true">
                <name>${xmlEscape(o.name)}</name>
                <vendor>ЯРЧЕ</vendor>
                <price>${o.price}</price>
                <currencyId>BYN</currencyId>
                <categoryId>${o.categoryId}</categoryId>
                <picture>${SITE}${o.picture}</picture>
                <url>${SITE}${o.url}</url>
                <shortDescription>${xmlEscape(o.shortDescription)}</shortDescription>
                <description>${xmlEscape(o.description)}</description>
            </offer>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date}">
    <shop>
        <name>ЯРЧЕ</name>
        <company>ЯРЧЕ — digital-агентство в Минске</company>
        <url>${SITE}</url>
        <currencies>
            <currency id="BYN" rate="1"/>
        </currencies>
        <categories>
${categoriesXml}
        </categories>
        <offers>
${offersXml}
        </offers>
    </shop>
</yml_catalog>
`;
}

export function GET() {
  return new Response(buildYml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
