import React , {useEffect , useState} from "react";

import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        TransactionContract
    });
}

export const TransactionProvider = ({ children}) => {

    const [currentAccount, setCurrentAccount] = useState();

    const checkIfWalletisConnected = async () => {

        try {
            if(!ethereum) return alert("Please install metamask")
    
    
            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No Account found");
            }
    
            console.log(accounts);
            
        } catch (error) {
            console.log(error);

            throw new Error("NO ethereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0])
        }catch(error){
            console.log(error);

            throw new Error("NO ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletisConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet,currentAccount }}>
            {children}

        </TransactionContext.Provider>
    );
}