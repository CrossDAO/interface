import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import type { AppProps } from "next/app";
import { chains, wagmiConfig } from "@/lib/wallet";
import Header from "@/components/Header";

import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Header />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
