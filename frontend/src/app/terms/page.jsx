"use client";
import styles from "./terms.module.css";

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>TERMS OF SERVICE</h1>
                <p>Last updated: December 2024</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>1. ACCEPTANCE OF TERMS</h2>
                    <p>
                        By accessing and using this job portal, you accept and agree to be bound by 
                        the terms and provision of this agreement. If you do not agree to these terms, 
                        please do not use this service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. USE OF SERVICE</h2>
                    <p>
                        You agree to use this service only for lawful purposes and in a way that does 
                        not infringe the rights of, restrict or inhibit anyone else's use and enjoyment 
                        of the service.
                    </p>
                    <ul>
                        <li>You must be at least 18 years old to use this service</li>
                        <li>You are responsible for maintaining the confidentiality of your account</li>
                        <li>You must provide accurate and complete information</li>
                        <li>You may not use the service for any illegal or unauthorized purpose</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. USER ACCOUNTS</h2>
                    <p>
                        When you create an account with us, you must provide information that is 
                        accurate, complete, and current at all times. Failure to do so constitutes 
                        a breach of the Terms.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. JOB POSTINGS</h2>
                    <p>
                        Employers are responsible for the accuracy and legality of their job postings. 
                        We reserve the right to remove any job posting that violates our policies or 
                        applicable laws.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. PRIVACY</h2>
                    <p>
                        Your use of the service is also governed by our Privacy Policy. Please review 
                        our Privacy Policy to understand our practices.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>6. INTELLECTUAL PROPERTY</h2>
                    <p>
                        The service and its original content, features, and functionality are owned 
                        by the job portal and are protected by international copyright, trademark, 
                        patent, trade secret, and other intellectual property laws.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. TERMINATION</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or 
                        liability, for any reason whatsoever, including without limitation if you 
                        breach the Terms.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. LIMITATION OF LIABILITY</h2>
                    <p>
                        In no event shall the job portal, nor its directors, employees, partners, 
                        agents, suppliers, or affiliates, be liable for any indirect, incidental, 
                        special, consequential or punitive damages.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>9. CHANGES TO TERMS</h2>
                    <p>
                        We reserve the right to modify or replace these Terms at any time. If a 
                        revision is material, we will try to provide at least 30 days' notice prior 
                        to any new terms taking effect.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>10. CONTACT US</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at 
                        support@jobportal.com
                    </p>
                </section>
            </div>
        </div>
    );
}
