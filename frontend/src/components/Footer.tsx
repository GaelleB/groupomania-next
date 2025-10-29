'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} Groupomania - RÃ©seau social d&apos;entreprise
      </p>
    </footer>
  );
}

