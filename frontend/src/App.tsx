import React, { useEffect, useState } from "react";
import "./App.scss";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import nftOne from "./assets/nft_1.png";
import nftTwo from "./assets/nft_2.png";
import nftThree from "./assets/nft_3.png";
import nftFour from "./assets/nft_4.png";
import nftFive from "./assets/nft_5.png";
import clogo from "./assets/logo.png";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { abiContract } from "./assets/abi";
import { ethers } from "ethers";
const imgMap = [nftOne, nftTwo, nftThree, nftFour, nftFive];
const targetNetworkId = parseInt(process.env.REACT_APP_TARGET_NETWORK_ID || "1"); // Example: 1 for Ethereum mainnet

const contractAddress = (process.env.REACT_APP_CONTRACT_ADDRESS || "") as `0x${string}`;
function App() {
  const [wallets, setWallets] = useState<any>([]);

  // console.log(test, "test");
  const { address, isConnected } = useAccount();
  const [mintPrice, setMintPrice] = useState<any>();
  const [error, setError] = useState(false);
  const { chain } = useNetwork();

  const [prepareError, setPrepareError] = useState<any>(null);
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

  const { data: mintPriceRead } = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "mintPrice",
    watch: true,
  });

  const { data: saleActiveRead } = useContractRead({
    address: contractAddress,
    abi: abiContract,
    functionName: "isSaleActive",
    watch: true,
  });

  useEffect(() => {
    if (mintPriceRead) {
      setMintPrice(mintPriceRead);
      console.log("Mint price fetched:", mintPriceRead);
    }
  }, [mintPriceRead]);

  const { config, error: prepareWriteError } = usePrepareContractWrite({
    address: contractAddress,
    abi: abiContract,
    functionName: "safeMint",
    value: mintPrice,

    onSuccess(data) {
      console.log("Prepare Write Success", data);
      setError(false);
    },
    onError(error) {
      console.error("Prepare Write Error", error);
      setError(true);
      setPrepareError(error);
    },
  });

  const {
    write: mintNFT,
    isLoading,
    isError,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Mint Success", data);
      setError(false);
    },
    onError(error) {
      console.error("Mint Error", error);
      setError(true);
    },
  });

  useEffect(() => {
    console.log(prepareWriteError);
  }, [prepareWriteError]);

  const handleMintClick = () => {
    if (mintNFT) {
      mintNFT();
    }
  };
  console.log(isConnected);
  const isCorrectNetwork = chain?.id === targetNetworkId;

  return (
    <>
      <section className="content-box">
        <div className="column">
          <div className="title">
            <div></div>
            <h1>Mint your NFT</h1>
            <div>
              {isConnected ? (
                <div className="title__button connect-button">
                  <button>
                    <div>
                      <Web3Button />
                    </div>
                    Connected
                  </button>
                  <span> Connected as {address} </span>
                </div>
              ) : (
                <div className="connected">
                  <button>
                    Disconnected
                    <div>
                      <Web3Button />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="content-row">
            {imgMap.map((el: string, i: number) => (
              <div className="item" key={`homepage-imgmap-${i}`}>
                <img src={el} alt="launchpad" />
              </div>
            ))}
          </div>
          <div className="content-row">
            <div className="item">
              {isConnected ? (
                <>
                  {isCorrectNetwork ? (
                    <>
                      <button onClick={handleMintClick} disabled={!isWhitelisted}>
                        MINT
                      </button>
                      <div>{isWhitelisted ? "" : "You are not whitelisted."}</div>
                    </>
                  ) : (
                    <div className="connected">
                      <button>
                        Connect to correct network
                        <div>
                          <Web3NetworkSwitch />
                        </div>
                      </button>
                    </div>
                  )}
                </>
              ) : null}
              {isError && <p>There was an error processing your transaction.</p>}
              {prepareError && <p>Prepare Error: {prepareError.message}</p>}
              {writeError && <p>Write Error: {writeError.message}</p>}
            </div>
            <div className="logo">
              <img src={clogo} alt="logo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
