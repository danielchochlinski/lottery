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
  const { data: balance }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getBalance",
    watch: true,
  });
  const { data: lotteryId }: any = useContractRead({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}` || "",
    abi: abi,
    functionName: "getLotteryId",
    watch: true,
  });

  const { data: winners }: any = useContractRead({
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
      setError(false);
      // notification({
      //   id: uniqueID(),
      //   type: "SUCCESS",
      //   message: "Congratulations you have entered the lottery",
      // });
      setAmount("");
    },
    onError(data) {
      setError(true);
    },
    onSettled(data, error) {
      // notification({
      //   id: uniqueID(),
      //   type: ,
      //   message: response.data.message,
      // });
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
      write?.();
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
