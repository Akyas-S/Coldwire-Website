import { Bell } from "lucide-react";
import styles from "./TopBar.module.css";

export default function TopBar({ title }: { title: string }) {
  return (
    <div className={styles.topBar}>
      <span className={styles.topBarTitle}>{title}</span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search ..."
      />
      <div className={styles.topBarSpacer}></div>
      <Bell size={20} className={styles.bellIcon} />
    </div>
  );
}
