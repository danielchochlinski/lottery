import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const Test = () => {
  const { address, isConnected } = useAccount();
  const [wallets, setWallets] = useState<any>([]);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    fetch("/wallets.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.text();
      })
      .then((text) => {
        const walletArray = text
          .split("\n")
          .map((addr) => addr.trim().toLowerCase())
          .filter(Boolean);
        setWallets(walletArray);
        console.log("Fetched wallets:", walletArray);
      })
      .catch((error) => console.error("Error fetching wallets:", error));
  }, []);

  useEffect(() => {
    if (isConnected && address && wallets.length > 0) {
      console.log("Checking address:", address.toLowerCase());
      const isWhitelisted = wallets.includes(address.toLowerCase());
      setIsWhitelisted(isWhitelisted);
      console.log("Is whitelisted:", isWhitelisted);
    }
  }, [address, isConnected, wallets]);

  return (
    <div>
      <div>Test</div>
      <div>{isWhitelisted ? "You are whitelisted!" : "You are not whitelisted."}</div>
    </div>
  );
};

export default Test;
