import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import ModalManager from "@/common/components/modal/components/ModalManager";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ModalManager />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

