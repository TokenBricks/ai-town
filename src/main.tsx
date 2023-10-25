import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './App.tsx';
import './index.css';
import 'uplot/dist/uPlot.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ConvexClientProvider from './components/ConvexClientProvider.tsx';
import {
    ThirdwebProvider,
    coinbaseWallet,
    metamaskWallet,
    walletConnect,
} from "@thirdweb-dev/react";
import { Mumbai } from '@thirdweb-dev/chains';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexClientProvider>
        <ThirdwebProvider
            activeChain={Mumbai}
            supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
            clientId={import.meta.env.VITE_TW_CLIENT_ID as string}
        >
            <Home />
       </ThirdwebProvider>
    </ConvexClientProvider>
  </React.StrictMode>,
);
