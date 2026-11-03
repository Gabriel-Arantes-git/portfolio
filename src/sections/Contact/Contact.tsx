import { Button } from '@/components/Button/Button';
import { EmailIcon, WhatsAppIcon } from '@/components/Icons/Icons';
import { Section } from '@/components/Section/Section';
import { profile } from '@/data/profile';
import { useT } from '@/i18n/hooks';
import { openEmail, openWhatsapp } from '@/utils/contact';
import styles from './Contact.module.scss';

export function Contact() {
  const { contact } = useT();

  return (
    <Section id="contact" index="05" title={contact.sectionTitle} dark reveal="drop">
      <p className={styles.intro}>{contact.intro}</p>

      <ul className={styles.channels}>
        <li>
          <Button className={styles.channel} onClick={openEmail}>
            <EmailIcon />
            {contact.emailLabel}{' '}
            <span className="sr-only">— {contact.emailAction}</span>
          </Button>
        </li>
        <li>
          <Button className={styles.channel} onClick={openWhatsapp}>
            <WhatsAppIcon />
            {contact.whatsappLabel}{' '}
            <span className="sr-only">— {contact.whatsappAction}</span>
          </Button>
        </li>
        <li>
          <Button className={styles.channel} href={profile.linkedin}>
            {contact.linkedin}
          </Button>
        </li>
        <li>
          <Button className={styles.channel} href={profile.github}>
            {contact.github}
          </Button>
        </li>
      </ul>

      <p className={styles.footer}>{contact.footer}</p>
    </Section>
  );
}
