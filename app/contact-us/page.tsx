"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import styles from "./contact.module.css";

export default function ContactUsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [subject, setSubject]     = useState("");
  const [message, setMessage]     = useState("");

 
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email, subject, message });
    alert("Message sent! (check the console)");
  }

  return (
    <main>
      <TopBar title="Contact us" />

      <div className={styles.pageWrapper}>
        <h1 className={styles.heading}>CONTACT US</h1>

        <p className={styles.subtitle}>
          Need assistance? Our support team is available to help you optimize your Command Hub and troubleshoot
          any system alerts. Contact us for expert guidance and technical support.
        </p>

        <div className={styles.twoColumn}>
          <div className={styles.leftCol}>
            <form onSubmit={handleSubmit}>
              <div className={styles.nameRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder=""
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=""
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>

          <div className={styles.rightCol}>
            <h2 className={styles.directHeading}>Prefer a Direct Approach ?</h2>
            <p className={styles.infoItem}>contact@coldwire.com</p>
            <p className={styles.infoItem}>+60 1785493075</p>
            <p className={styles.infoItem}>Monday to Sunday - 24/7</p>

            <iframe
              className={styles.mapFrame}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0270010185595!2d101.61656857573604!3d3.066729353557466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4bc8a5b8f30f%3A0x9d7f3a1e2d1b3b0c!2sTaylor's%20University!5e0!3m2!1sen!2smy!4v1708000000000!5m2!1sen!2smy"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <p className={styles.infoItem} style={{ marginTop: "12px", fontWeight: 500 }}>
              Visit Our Office
            </p>
            <p className={styles.infoItem}>
              {"Taylor's, Subang Jaya, Malaysia"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
