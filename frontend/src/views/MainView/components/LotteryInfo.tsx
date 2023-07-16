import React, { useState } from "react";
import styles from "./LotteryInfo.module.scss";
import { useContractEvent, useContractRead } from "wagmi";
import contract_abi from "../../../assets/Lottery.json";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";
import { converter } from "../../../helper/helper";
import {
  uniqueID,
  useNotification,
} from "../../../context/notifications/NotificationProvider";

const { abi }: any = contract_abi;

const LotteryInfo = () => {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const notification = useNotification();
  const {
    data: balance,
    isError: isBalanceError,
    isLoading: isErrorLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getBalance",
    watch: true,
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });
  const {
    data: lotteryId,
    isError: isLotteryIdError,
    isLoading: isLotteryIdLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getLotteryId",
    watch: true,
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  const {
    data: winners,
    isError: isWinnersError,
    isLoading: isWinnersLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getWinners",
    watch: true,
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  const { config } = usePrepareContractWrite({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "enter",
    value: parseEther(amount),
    onSuccess(data) {
      console.log("Success", data);
      setError(false);
    },
    onError(data) {
      setError(true);
    },
  });

  const { write } = useContractWrite(config);

  const handleEnter = async () => {
    setAmount("");

    try {
      notification({
        id: uniqueID(),
        type: "WARRNING",
        message: "Your request is being processed",
      });
      await write?.();
    } catch (error) {
      console.error("Error entering the lottery:", error);
    }
  };

  useContractEvent({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    eventName: "EnteredLottery",
    listener() {
      notification({
        id: uniqueID(),
        type: "SUCCESS",
        message: "Congratulations you have entered the lottery",
      });
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <span>Lottery: #{converter(lotteryId)}</span>
        <span>Prize amount: {converter(balance)} ETH</span>
        {winners?.length !== 0 ? <span>Previous Winner</span> : <></>}
        <input
          type="number"
          placeholder="enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button disabled={!write} onClick={() => handleEnter()}>
          {error ? "Please check you balance" : "Enter Lottery"}
        </button>
      </div>
    </div>
  );
};

export default LotteryInfo;
