import React from "react";
import styles from "./Participants.module.scss";
import { useContractRead } from "wagmi";
import contract_abi from "../../../assets/Lottery.json";
import { spawn } from "child_process";
import { converter, formatAddress } from "../../../helper/helper";
const { abi }: any = contract_abi;

const Participants = () => {
  const {
    data: players,
    isError: isPlayersError,
    isLoading: isPlayersLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getPlayers",
    watch: true,
  });
  const {
    data: amounts,
    isError: isAmountsError,
    isLoading: isAmountsLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getAmounts",
    watch: true,
  });

  return (
    <div className={styles.container}>
      <div>
        <h3>Lottery Participants</h3>
      </div>
      <div>
        <div className={styles.inner_container}>
          <h4>User Address</h4>
          <div>
            {players?.map((el: string, i: number) => (
              <span key={`${el}+user${i}`}>{formatAddress(el)}</span>
            ))}
          </div>
        </div>
        <div className={styles.inner_container}>
          <h4>Amount</h4>
          <div>
            {amounts?.map((el: string, i: number) => (
              <span key={`${el}+amount${i}`}>{converter(el)} ETH</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
