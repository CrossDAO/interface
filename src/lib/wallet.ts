import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  arbitrumGoerli,
  avalancheFuji,
  baseGoerli,
  bscTestnet,
  optimismGoerli,
  polygonMumbai,
} from "viem/chains";
import { configureChains, createConfig, mainnet, sepolia } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(
  [sepolia, optimismGoerli, avalancheFuji, polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "CrossDAO",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
