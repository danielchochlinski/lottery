import React from "react";
import { useWeb3Modal, Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";
import styles from "./Navbar.module.scss";
const Navbar = () => {
  const { open, close } = useWeb3Modal();

  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div className={styles.container}>
      <Web3Button />
    </div>
  );
};

export default Navbar;
