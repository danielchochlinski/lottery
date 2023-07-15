import React, { useState } from "react";
import styles from "./LotteryInfo.module.scss";
import { useContractRead } from "wagmi";
import contract_abi from "../../../assets/Lottery.json";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";

const { abi }: any = contract_abi;

const LotteryInfo = () => {
  const [amount, setAmount] = useState<string>("");

  const {
    data: balance,
    isError: balanceErrors,
    isLoading: balanceIsLoading,
  }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getBalance",
    watch: true,
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
  });

  const { config } = usePrepareContractWrite({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "enter",
    value: parseEther(amount),
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const handleEnter = async () => {
    try {
      await write?.();
    } catch (error) {
      console.error("Error entering the lottery:", error);
    }
  };
  console.log(Number(lotteryId));
  console.log(winners);
  console.log(Number(balance));

  return (
    <div className={styles.container}>
      <span>Lottery: #{lotteryId}</span>
      <span>Previous Winner</span>
      <input
        type="text"
        placeholder="amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        //    disabled={!write}
        onClick={() => handleEnter()}
      >
        Enter Lottery
      </button>
    </div>
  );
};

export default LotteryInfo;
