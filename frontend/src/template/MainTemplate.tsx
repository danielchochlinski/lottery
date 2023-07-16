import React from "react";
import Navbar from "../components/navbar/Navbar";
import styles from "./MainTemplate.module.scss";
interface TMainTemplate {
  children: React.ReactNode;
}
const MainTemplate = ({ children }: TMainTemplate) => {
  return (
    <div className={styles.container}>
      <Navbar />
      {children}
    </div>
  );
};

export default MainTemplate;
