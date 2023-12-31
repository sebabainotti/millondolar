import React, { useState, useEffect } from 'react';
import ConnectWalletPage from './pages/connectWallet';
import box from './images/yo.png';
import Web3 from 'web3';
import BigNumber from "bignumber.js";
import Disclaimer from './pages/disclaimer';

const App = () => {
  const [total, setTotal] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [percentageClass, setPercentageClass] = useState('');
  const [change, setChange] = useState(false);
  const gancho = 0;
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleShowDisclaimer = () => {
    setShowDisclaimer(true);
  };

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
  };


  const updateTotals = () => {
    setChange(true);
  }
  useEffect(() => {

    async function getTotalInvested() {
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
          let web3Instance = web3;
          const contractAddress = '0xf865853847a571c12a8e956c9f2ce28e2487a563';
          const contractABI = require('../src/contracts/SmartSocialHelp_1/abi.json');
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          let totalValueInWei = BigNumber(await contractInstance.methods.getTotalAmount().call());
          let valueEthInUsd = parseInt(await contractInstance.methods.getConversionRate(1).call());
          let totalValueInEth = (totalValueInWei.dividedBy(new BigNumber(1000000000000000000)));
          let totalValueInUsd = totalValueInEth.multipliedBy(new BigNumber(valueEthInUsd))
          let result = parseInt(totalValueInUsd);
          result = result + gancho;
          let percentage = parseInt(result * 100 / 1000000);
          result = 1000000 - result;
          setTotal(result);
          setPercentage(percentage);
          setPercentageClass('progress percent' + percentage.toString());
        }
        return 0;
      } catch (error) {
        console.log(error);
      }
    }
    getTotalInvested();
  }, [change]);
  return (
    <div className="App">
      <section id="stats">
        <div className="row narrow section-intro ">
          <div className="col-twelve">
            <h1 className="animate-this fadeInUp animated">I want to be a millionaire without scamming people</h1>
          </div>
        </div>
        <div className="row narrow section-intro ">
          <div className="col-twelve">
            <img src={box} style={{ width: "30%", marginBottom: "40px" }} alt="box" />
          </div>
          <p className="lead animate-this">You want to help me? Invest to reveal my identity.</p>
        </div>
        <div className="col-twelve col-bar tab-full">
          <ul className="skill-bars">
            <li>
              <div className={percentageClass}><span>{percentage}%</span></div>
              <p>Only missing {total} dollars left for there to be one more millionaire in this world</p>
            </li>
          </ul>
        </div>
        <div className="row narrow section-intro ">
          <div className="col-twelve">
            <ConnectWalletPage updateTotals={updateTotals} />
          </div>
        </div>
      </section>
      <footer>
        <div className="col-twelve tab-full">
          <div className="copyright">
            <a style={{ cursor: "pointer" }} onClick={handleShowDisclaimer} href="#">disclaimer</a>
            {
              showDisclaimer && (
                <div className="popup">
                  <div className="popup-content">
                    <span className="close" onClick={handleCloseDisclaimer}>
                      &times;
                    </span>
                    <Disclaimer />
                  </div>
                </div>
              )}
          </div>
        </div>
      </footer>
    </div>

  );
}

export default App;
