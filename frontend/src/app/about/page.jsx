"use client";
import styles from "./about.module.css";

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>ABOUT US</h1>
                <p>Connecting talent with opportunity</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>WHO WE ARE</h2>
                    <p>
                        We are a modern job portal dedicated to connecting talented professionals 
                        with forward-thinking employers. Our platform simplifies the hiring process 
                        and helps job seekers find their perfect career match.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>OUR MISSION</h2>
                    <p>
                        To revolutionize the job search experience by providing a straightforward, 
                        efficient platform that benefits both job seekers and employers. We believe 
                        in transparency, simplicity, and putting people first.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>WHAT WE OFFER</h2>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <h3>FOR JOB SEEKERS</h3>
                            <ul>
                                <li>Easy job search and filtering</li>
                                <li>Direct messaging with employers</li>
                                <li>Application tracking</li>
                                <li>Profile management</li>
                            </ul>
                        </div>
                        <div className={styles.feature}>
                            <h3>FOR EMPLOYERS</h3>
                            <ul>
                                <li>Simple job posting</li>
                                <li>Applicant management</li>
                                <li>Direct candidate communication</li>
                                <li>Dashboard analytics</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
