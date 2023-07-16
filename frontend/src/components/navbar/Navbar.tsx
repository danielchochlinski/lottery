import React from "react";
import { Web3Button } from "@web3modal/react";

import { Web3NetworkSwitch } from "@web3modal/react";

import styles from "./Navbar.module.scss";
const Navbar = () => {
  return (
    <div className={styles.container}>
      <div>
        <span>Some Awesome Lottery</span>
      </div>
      <div>
        <Web3Button />
        <Web3NetworkSwitch />
      </div>
    </div>
  );
};

export default Navbar;
