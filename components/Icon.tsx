import type { CSSProperties } from 'react';

export type IconName =
  | 'mail'
  | 'phone'
  | 'telegram'
  | 'whatsapp'
  | 'viber'
  | 'instagram'
  | 'linkedin'
  | 'vk'
  | 'x'
  | 'youtube'
  | 'github';

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
};

export function Icon({ name, size = 18, className, style, 'aria-label': ariaLabel }: Props) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      <use href={`/icons/social.svg#${name}`} />
    </svg>
  );
}
