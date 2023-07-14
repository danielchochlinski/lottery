import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

const chains = [sepolia];
const projectId = process.env.REACT_APP_PROJECT_ID || "";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <WagmiConfig config={wagmiConfig}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
);
