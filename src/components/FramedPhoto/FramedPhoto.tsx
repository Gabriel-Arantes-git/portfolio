import { cx } from '@/utils/classNames';
import styles from './FramedPhoto.module.scss';

interface FramedPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export function FramedPhoto({ src, alt, className }: FramedPhotoProps) {
  return (
    <div className={cx(styles.frame, className)}>
      <div className={styles.photo}>
        <img className={styles.image} src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
