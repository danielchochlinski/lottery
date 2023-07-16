import React from "react";
import styles from "./MainView.module.scss";
import LotteryInfo from "./components/LotteryInfo";
import Participants from "./components/Participants";
const MainView = () => {
  return (
    <div className={styles.container}>
      <LotteryInfo />
      <Participants />
    </div>
  );
};

export default MainView;
