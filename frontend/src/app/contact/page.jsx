"use client";
import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd send this to your backend
        console.log("Contact form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>CONTACT US</h1>
                <p>Get in touch with our team</p>
            </div>

            <div className={styles.content}>
                <div className={styles.contactInfo}>
                    <div className={styles.infoCard}>
                        <h3>EMAIL</h3>
                        <p>support@jobportal.com</p>
                    </div>
                    <div className={styles.infoCard}>
                        <h3>PHONE</h3>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <div className={styles.infoCard}>
                        <h3>ADDRESS</h3>
                        <p>123 Business St<br/>Suite 100<br/>City, State 12345</p>
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <h2>SEND US A MESSAGE</h2>
                    {submitted ? (
                        <div className={styles.successMessage}>
                            <h3>✓ MESSAGE SENT!</h3>
                            <p>We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>NAME *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>EMAIL *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SUBJECT *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>MESSAGE *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="6"
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                SEND MESSAGE
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
