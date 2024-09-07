/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAIN_NAMESPACES, type IProvider } from "@web3auth/base";
import { BigNumberish, ethers } from "ethers";

// Copy from Stackr.config.js
export const domain = {
    name: "DevDiner v0",
    version: "1",
    chainId: 11155111,
    verifyingContract: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" as `0x${string}`,
}

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const getChainId = async (provider: IProvider): Promise<any> => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        // Get the connected Chain's ID
        const networkDetails = await ethersProvider.getNetwork();
        return networkDetails.chainId.toString();
    } catch (error) {
        return error;
    }
}

const getAccounts = async (provider: IProvider): Promise<any> => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        // Get user's Ethereum public address
        const address = signer.getAddress();

        return await address;
    } catch (error) {
        return error;
    }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

        const amount = ethers.parseEther("0.001");

        // Submit transaction to the blockchain
        const tx = await signer.sendTransaction({
            to: destination,
            value: amount,
            maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
            maxFeePerGas: "6000000000000", // Max fee per gas
        });

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return receipt;
    } catch (error) {
        return error as string;
    }
}

const signMessage = async (provider: IProvider, actionName: string, input: any): Promise<string> => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_ROLLUP_URL}/get-types/${actionName}`
        );

        const types = await response.json();
        return await signer.signTypedData(
            domain,
            types.eip712Types,
            input,
        );
    } catch (error) {
        return error as string;
    }
}

export default {
    getChainId,
    getAccounts,
    sendTransaction,
    signMessage,
    chainConfig
};