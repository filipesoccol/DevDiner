'use client'

import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import RPC from "../services/EthersRPC";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENTID || '';
const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: RPC.chainConfig },
});

const web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
        appName: "Dev Diner",
        loginMethodsOrder: ["wallet", "email"],
        // primaryButton: "externalLogin"
    }
}
const web3auth = new Web3Auth(web3AuthOptions);

const metamaskAdapter = new MetamaskAdapter();
web3auth.configureAdapter(metamaskAdapter);

interface WalletContextType {
    provider: IProvider | null;
    loggedIn: boolean;
    account: string;
    userInfo: Partial<UserInfo>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    initialized: boolean; // Add this line
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [account, setAccount] = useState<string>('');
    const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            await web3auth.initModal();
            setProvider(web3auth.provider);
            if (web3auth.connected && web3auth.provider) {
                await assignUserState();
            }
            setInitialized(true);
        } catch (error) {
            console.error(error);
            setInitialized(true);
        }
    };

    const login = async () => {
        await web3auth.connect();
        assignUserState();
    };

    const assignUserState = async () => {
        if (!web3auth.connected) return
        if (!web3auth.provider) return
        setProvider(web3auth.provider);
        setLoggedIn(true);
        setUserInfo(await web3auth.getUserInfo())
        setAccount(await RPC.getAccounts(web3auth.provider))
    }

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
        setAccount('');
        setUserInfo({});
    };

    return (
        <WalletContext.Provider value={{
            provider,
            loggedIn,
            userInfo,
            account,
            login,
            logout,
            initialized // Add this line
        }}>
            {children}
        </WalletContext.Provider>
    );
}
