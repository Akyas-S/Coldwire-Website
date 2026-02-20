"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import styles from "./help.module.css";

// Each item has a question and an answer
const questions = [
  {
    question: "How do I register a new batch?",
    answer:
      "Go to the Product Form page in the sidebar. Fill in all the required fields like the batch ID, product name, and weight. Once everything looks good, click the Submit button at the bottom to save the batch.",
  },
  {
    question: "What do the sensor alerts mean?",
    answer:
      "Alerts are triggered automatically when a sensor reading goes outside the safe range. For example, if the temperature gets too high or the humidity drops too low, you will see a warning. Check the Sensor Logs page for more details on what happened and when.",
  },
  {
    question: "How do I track a delivery?",
    answer:
      "Navigate to the Tracking page under the Logistics section in the sidebar. Type in your batch ID in the search box and press enter. You will see a map showing the current location of the delivery along with a timeline of stops.",
  },
  {
    question: "Who do I contact for support?",
    answer:
      "You can reach our support team any time by visiting the Contact Us page. Fill out the form and we will get back to you as soon as possible. You can also email us directly at contact@coldwire.com or call +60 1785493075. We are available 24/7.",
  },
];

export default function HelpPage() {
  // openIndex tracks which dropdown is currently open.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // If the clicked item is already open, close it. Otherwise open the new one.
  function handleClick(index: number) {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  }

  return (
    <main>
      <TopBar title="Help" />

      <div className={styles.pageWrapper}>
        <h1 className={styles.heading}>HELP</h1>

        <p className={styles.subtitle}>
          Find answers to common questions below. Click on a question to see the answer.
        </p>

        <div className={styles.list}>
          {questions.map((item, index) => (
            <div key={index} className={styles.dropdown}>
              
              <button
                className={styles.question}
                onClick={() => handleClick(index)}
              >
                <span>{item.question}</span>
                <span className={styles.icon}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              
              {openIndex === index && (
                <div className={styles.answer}>{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
