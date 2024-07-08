import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import Test from "./test";

const chains = [mainnet];
const projectId = "7f3a8c8e41ad75f4081e7397434fba21";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
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
