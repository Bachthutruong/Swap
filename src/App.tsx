import { useState, useEffect } from "react";
import "./App.css";
import { Widget } from "@kyberswap/widgets";
import { init, useWallets, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import walletConnectModule from "@web3-onboard/walletconnect";

const injected = injectedModule();
const walletConnect = walletConnectModule();

// initialize Onboard
init({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://ethereum.kyberengineering.io",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon.kyberengineering.io",
    },
    {
      id: '0x38',
      token: 'BNB',
      label: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
  ],
});

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  // create an ethers provider
  let ethersProvider: any;

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
  }

  const connectedWallets = useWallets();

  const [chainId, setChainId] = useState(1);

  useEffect(() => {
    ethersProvider?.getNetwork().then((res: any) => setChainId(res.chainId));
  }, [ethersProvider]);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets") || "[]"
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        const walletConnected = await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  const lightTheme = {
    text: "#222222",
    subText: "#5E5E5E",
    primary: "#FFFFFF",
    dialog: "#FBFBFB",
    secondary: "#F5F5F5",
    interactive: "#E2E2E2",
    stroke: "#505050",
    accent: "#28E0B9",
    success: "#189470",
    warning: "#FF9901",
    error: "#FF537B",
    fontFamily: "Work Sans",
    borderRadius: "16px",
    buttonRadius: "999px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
  };

  const darkTheme = {
    text: "#FFFFFF",
    subText: "#A9A9A9",
    primary: "#1C1C1C",
    dialog: "#313131",
    secondary: "#0F0F0F",
    interactive: "#292929",
    stroke: "#505050",
    accent: "#28E0B9",
    success: "#189470",
    warning: "#FF9901",
    error: "#FF537B",
    fontFamily: "Work Sans",
    borderRadius: "16px",
    buttonRadius: "999px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
  };

  const [theme, setTheme] = useState<any>(darkTheme);
  const [enableRoute, setEnableRoute] = useState<boolean>(true);
  const [enableDexes, setEnableDexes] = useState<string>("");

  const defaultTokenOut: { [chainId: number]: string } = {
    1: "0x1068a889fd7151fb2ca9d98d268b0d0cd623fc2f",
    56: "0xda4714fee90ad7de50bc185ccd06b175d23906c1",
  };
const MY_TOKEN_LIST = [
    {
    "name": "KNC",
    "address": "0x1C954E8fe737F99f68Fa1CCda3e51ebDB291948C",
    "symbol": "KNC",
    "decimals": 18,
    "chainId": 1,
    "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/9444.png"
  },
    {
    "name": "Tether USD",
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "symbol": "USDT",
    "decimals": 6,
    "chainId": 1,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  },
  {
    "name": "USD Coin",
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "symbol": "USDC",
    "decimals": 6,
    "chainId": 1,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  },
  {
    "name": "GODZ",
    "symbol": "GODZ",
    "address": "0x1068a889fd7151fb2ca9d98d268b0d0cd623fc2f",
    "decimals": 6,
    "chainId": 1,
    "logoURI": "https://kenhcine.cgv.vn/media/catalog/product/c/g/cgv_godzilla.jpg",
  }
]
  const [feeSetting, setFeeSetting] = useState({
    feeAmount: 0,
    feeReceiver: "",
    chargeFeeBy: "currency_in" as "currency_in" | "currency_out",
    isInBps: true,
  });

  return (
    <div className="App">
      <Widget
        client="widget-react-demo"
        theme={theme}
        title={
        <div className="card">
          <h3 >Swap</h3>
          <button
            onClick={() => (wallet ? disconnect(wallet) : connect())}
            className="button"
          >
            {!wallet ? "Connect Wallet" : "Disconnect"}
          </button>
        </div>
        }
        tokenList={MY_TOKEN_LIST}
        provider={ethersProvider}
        defaultTokenOut={defaultTokenOut[chainId]}
        feeSetting={
          feeSetting.feeAmount && feeSetting.feeReceiver
            ? feeSetting
            : undefined
        }
        enableRoute={enableRoute}
        enableDexes={enableDexes}
      />
    </div>
  );
}

export default App;
