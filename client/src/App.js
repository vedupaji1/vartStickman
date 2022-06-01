import React, { useState, useEffect, createContext } from 'react'
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom"
import "./App.css";
import StickmanNFT_ABI from "./Contract/StickmanNFT_ABI.json";
import Marketplace_ABI from "./Contract/Marketplace_ABI.json";
import getUserNFTData from "./Functions/getUserNFTData.js";
import getDashboardData from './Functions/getDashboardData';
import Header from './Components/Header/Header';
import Dashboard from "./Components/Dashboard/Dashboard";
import Loading from "./Components/Loading";
import Error404 from "./Components/Error404";

const requiredInfo = createContext();

const App = () => {

  const [contractETH, setContractETH] = useState(null);
  const [provider, setProvider] = useState(null);
  const dispatch = useDispatch();
  let isLoading = useSelector(state => state.isLoading.data);

  const reloadPage = () => {
    window.location.reload();
  }

  if (window.ethereum) { // This Statement Will Caught When Account Will Changed In Metamask.
    window.ethereum.on('accountsChanged', () => reloadPage());
  }

  useEffect(() => {
    const init = async () => {
      if ((window.ethereum !== undefined)) { // This Statement Checks That Whether User Have Metamask Or Not,  
        dispatch({ type: "setIsMetamask", payload: true });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        await provider.send("eth_requestAccounts", []); // It Will Send Request For Connecting To Metamask.
        const signer = provider.getSigner();
        setProvider(provider)
        dispatch({ type: "setCurUserAddress", payload: await signer.getAddress() });
        let contract_NFT = new ethers.Contract(process.env.REACT_APP_CONTRACT_NFT, StickmanNFT_ABI, signer);
        let contract_Marketplace = new ethers.Contract(process.env.REACT_APP_CONTRACT_MARKETPLACE, Marketplace_ABI, signer);
        setContractETH({
          contract_NFT: contract_NFT,
          contract_Marketplace: contract_Marketplace
        });

        try {
          dispatch({ type: "setDashboardData", payload: await getDashboardData(contract_NFT, contract_Marketplace) });
          dispatch({ type: "setMainUserData", payload: await getUserNFTData(await signer.getAddress(), provider, signer) });
          dispatch({ type: "setIsLoading", payload: false })
        } catch (error) {
          console.log(error);
        }
      } else {
        dispatch({ type: "setIsMetamask", payload: false })
        let provider = ethers.getDefaultProvider("rinkeby");
        setProvider(provider)
        // let provider = new InfuraProvider("ropsten");
        let wallet = new ethers.Wallet(process.env.REACT_APP_TEMP_WALLET);
        let signer = wallet.connect(provider)
        let contract_NFT = new ethers.Contract(process.env.REACT_APP_CONTRACT_NFT, StickmanNFT_ABI, signer);
        let contract_Marketplace = new ethers.Contract(process.env.REACT_APP_CONTRACT_MARKETPLACE, Marketplace_ABI, signer);
        setContractETH({
          contract_NFT: contract_NFT,
          contract_Marketplace: contract_Marketplace
        });
        try {
          dispatch({ type: "setDashboardData", payload: await getDashboardData(contract_NFT, contract_Marketplace) });
          dispatch({ type: "setIsLoading", payload: false })
        } catch (error) {
          console.log(error);
        }
      }
    }
    init();
  }, [])

  return (
    <>
      <requiredInfo.Provider value={{
        contractETH: contractETH,
        provider: provider
      }}>
        <Header />
        <Switch>
          <Route exact path='/:userAddressOrNFTId?'>
            <Dashboard />
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Switch>
      </requiredInfo.Provider>
      {
        isLoading === true ? <Loading /> : <></>
      }
    </>
  )
}

export default App
export { requiredInfo };