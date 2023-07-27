import React, { useState } from 'react';
import Web3 from 'web3';
import BigNumber from "bignumber.js";

const ConnectWalletPage = ({ updateTotals }) => {
    const [web3, setWeb3] = useState(null);
    const [inputValue, setInputValue] = useState('1');
    const [walletValue, setWalletValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const donar = async () => {
        try {
            let web3Instance = web3;
            if (web3Instance == null) {
                alert('Connect your wallet.');
                return;
            }
            let contractInstance = connectToSepolia(web3Instance);
            let valueEthInUsd = parseInt(await contractInstance.methods.getConversionRate(1).call());
            const amountETH = inputValue / valueEthInUsd;
            const weiAmount = web3Instance.utils.toWei(amountETH.toString(), 'ether');
            const accounts = await web3Instance.eth.getAccounts();
            var result = await contractInstance.methods.fund().send({
                from: accounts[0],
                value: weiAmount,
            }).then(transactionHash => {
                console.log('Transacción enviada. Hash:', transactionHash);
                // Esperar a que la transacción se confirme
                waitForTransactionConfirmation(web3Instance, transactionHash);
            });
            console.log('Resultado de la ejecución:', result);
        }
        catch (error) {
            console.log('Error al ejecutar la función del contrato:', error);
        }
    };

    async function waitForTransactionConfirmation(web3Instance, transactionHash) {
        while (true) {
            try {
                const receipt = await web3Instance.eth.getTransactionReceipt(transactionHash.transactionHash);
                if (receipt && receipt.blockNumber) {
                    console.log('Transacción confirmada en el bloque:', receipt.blockNumber);
                    updateTotals();
                    break;
                } else {
                    await delay(1000); // Esperar 3 segundos
                }
            } catch (error) {
                console.error('Error al obtener el recibo de la transacción:', error);
                break;
            }
        }
    }

    // Función de utilidad para esperar un tiempo determinado
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const connectToSepolia = (web3Instance) => {
        try {
            const contractAddress = '0x3b2aF9C1749E7F6375BdAFFEa22e2E2973c19ffE';
            const contractABI = require('../../src/contracts/SmartSocialHelp_1/abi.json');
            const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
            return contractInstance;
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const connectWallet = () => {
        try {
            var isConnected = true;
            var web3;
            if (typeof window.ethereum !== 'undefined') {
                web3 = new Web3(window.ethereum);
                window.ethereum.enable();
            } else if (typeof window.BinanceChain !== 'undefined') {
                web3 = new Web3(window.BinanceChain);
            } else if (typeof window.trust !== 'undefined') {
                web3 = new Web3(window.trust);
            } else if (typeof window.coinbase !== 'undefined') {
                web3 = new Web3(window.coinbase);
            } else {
                isConnected = false;
                alert('No compatible wallet was detected. Make sure you have one of the following wallets installed: MetaMask, Binance Wallet, Trust Wallet, Coinbase Wallet.')
            }
            if (isConnected) {
                const accounts = web3.eth.getAccounts();
                accounts.then(function (res) {
                    setWalletValue(res);
                })
                setWeb3(web3);
            }
            return web3;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Ups! Failed to connect wallet.')
        }
    };

    return (
        <div className="donation-box">
            <a className="button button-primary btn-donar" onClick={connectWallet}>CONNECT WALLET</a>
            <label id="wallet">{walletValue}</label>
            <div className="divInvest">
                <input type="number" className="btnnew full-width" value={inputValue} onChange={handleInputChange} />
                <label className="separator">USD</label>
            </div>
            <label id="wallet">The dollars entered will be converted into their equivalent in ETH. Network: ETH. </label>
            <br />
            <button className="button button-primary btn-donar" onClick={donar}>INVEST</button>
        </div>
    );
};
export default ConnectWalletPage;
