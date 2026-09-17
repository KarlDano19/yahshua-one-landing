"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CertificationsSection.module.css";

const standards = [
  { name: "SOC 2 Type II", category: "Security controls", description: "Independent audit of security controls.", image: "/SOC2 TYPE 2.png", width: 359, height: 357 },
  { name: "GDPR", category: "Data privacy", description: "A commitment to responsible data handling.", image: "/EU GDPR.png", width: 278, height: 274 },
  { name: "ISO 27001", category: "Information security", description: "Certified information security management.", image: "/ISO27001-certificate-logo-4 (1).png", width: 474, height: 474 },
];

function OpenIcon() {
  return <span className={styles.arrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 17 17 7M7 7h10v10" /></svg></span>;
}

export default function CertificationsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="certifications" ref={ref} aria-labelledby="certifications-heading" className={styles.section} data-visible={visible}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Registered & certified</p>
            <h2 id="certifications-heading">Built on a foundation<br />of <span>trust.</span></h2>
          </div>
          <p className={styles.intro}>Registration, security, and privacy.<br />The standards behind the software you use every day.</p>
        </header>

        <div className={styles.layout}>
          <div className={`${styles.shell} ${styles.featured}`}>
            <article className={styles.bir}>
              <div className={styles.cardTop}><span className={styles.category}>Philippine registration</span><span className={styles.index}>01</span></div>
              <div className={styles.birBody}>
                <div className={styles.sealWell}>
                  <Image src="/BIR Registration Seal Badge_1.png" alt="BIR registered seal" width={1545} height={2000} sizes="180px" className={styles.birSeal} />
                </div>
                <div>
                  <h3>BIR<span>Registered</span></h3>
                  <p>Bureau of<br />Internal Revenue</p>
                </div>
              </div>
              <div className={styles.birFooter}>
                <p>Registration for Philippine business.</p>
                <a href="/BIR%20Registration%20Seal%20Badge_1.png" target="_blank" rel="noopener noreferrer" className={styles.badgeLink} aria-label="View BIR registration badge (opens in a new tab)">View badge <OpenIcon /></a>
              </div>
            </article>
          </div>

          <div className={styles.standards}>
            {standards.map((standard, i) => (
              <div className={styles.shell} key={standard.name} style={{ transitionDelay: `${(i + 1) * 90}ms` }}>
                <article className={styles.standard}>
                  <div className={styles.logoWell}>
                    <Image src={standard.image} alt={`${standard.name} badge`} width={standard.width} height={standard.height} sizes="72px" className={styles.logo} />
                  </div>
                  <div className={styles.standardCopy}>
                    <p className={styles.category}>{standard.category}</p>
                    <h3>{standard.name}</h3>
                    <p className={styles.description}>{standard.description}</p>
                  </div>
                  <a className={styles.iconLink} href={encodeURI(standard.image)} target="_blank" rel="noopener noreferrer" aria-label={`View ${standard.name} badge (opens in a new tab)`}><OpenIcon /></a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
