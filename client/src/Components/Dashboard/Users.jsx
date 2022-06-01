import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers';
import { requiredInfo } from "../../App";
import { useSelector, useDispatch } from 'react-redux';
import getUserNFTData from '../../Functions/getUserNFTData';
import getListedNFTData from '../../Functions/getListedNFTData';
import Error404 from '../Error404';
import NFTShower from './NFTShower';
import UserDataShower from "./UserDataShower";

const Users = () => {

    let contextData = useContext(requiredInfo);
    let contract = contextData.contractETH;
    let dispatch = useDispatch();
    const [curParamData, setCurParamData] = useState(null);
    let curParameter = useSelector(state => state.curParameter.data);
    let mainUserData = useSelector(state => state.mainUserData.data);
    let searchedUserData = useSelector(state => state.searchedUserData.data);
    let searchedNFTData = useSelector(state => state.searchedNFTData.data);
    let curUserAddress = useSelector(state => state.curUserAddress.data);
    let isLoading = useSelector(state => state.isLoading.data);
    let isMetamask = useSelector(state => state.isMetamask.data);
    useEffect(() => {
        const init = async () => {
            if (contract !== null && contract !== undefined && curParameter !== null) {
                if (curParameter.isAddress === true) {
                    if ((searchedUserData === null || curParameter.param !== curParamData) && (curParameter.param !== curUserAddress)) {
                        if ((searchedUserData !== null) && (searchedUserData.address === curParameter.param)) {
                            return;
                        } else {
                            if (searchedUserData !== null) {
                                dispatch({ type: "setSearchedUserData", payload: null });
                            }
                            let provider = contextData.provider;
                            dispatch({ type: "setIsLoading", payload: true })
                            if (isMetamask === true) {
                                dispatch({ type: "setSearchedUserData", payload: await getUserNFTData(curParameter.param, provider, provider.getSigner()) });
                            } else {
                                let wallet = new ethers.Wallet(process.env.REACT_APP_TEMP_WALLET);
                                let signer = wallet.connect(provider)
                                dispatch({ type: "setSearchedUserData", payload: await getUserNFTData(curParameter.param, provider, signer) });
                            }
                            setCurParamData(curParameter.param);
                            dispatch({ type: "setIsLoading", payload: false })
                        }
                    }
                } else if (curParameter.isAddress === false) {
                    if ((searchedNFTData === null && isLoading === false)) {
                        try {
                            dispatch({ type: "setIsLoading", payload: true })
                            let nftOwner = await contract.contract_NFT.ownerOf(curParameter.param);
                            let data;
                            if (nftOwner === process.env.REACT_APP_CONTRACT_MARKETPLACE) {
                                let listedNFTData = await getListedNFTData(curParameter.param, contextData.provider);
                                data = {
                                    id: curParameter.param,
                                    uri: await contract.contract_NFT.tokenURI(curParameter.param),
                                    owner: listedNFTData.owner,
                                    listingId: listedNFTData.listingId,
                                    price: listedNFTData.price
                                };
                            } else {
                                data = {
                                    id: curParameter.param,
                                    uri: await contract.contract_NFT.tokenURI(curParameter.param),
                                    owner: nftOwner
                                };
                            }
                            dispatch({ type: "setSearchedNFTData", payload: data });
                            setCurParamData(curParameter.param);
                            dispatch({ type: "setIsLoading", payload: false })
                        } catch (error) {
                            dispatch({ type: "setIsLoading", payload: false })
                            dispatch({ type: "setCurParameter", payload: { param: curParameter.param, isAddress: null } })
                            console.log(error)
                        }
                    }
                }
            }
        }
        init();
    })

    return (
        <>
            {
                curParameter !== null && curParameter !== undefined ?
                    curParameter.isAddress === null ?
                        <Error404 />
                        : curParameter.isAddress === true ?
                            curUserAddress === curParameter.param ? mainUserData !== null && mainUserData !== undefined ? <UserDataShower userData={mainUserData} /> : <></>
                                : searchedUserData !== null && searchedUserData !== undefined ? <UserDataShower userData={searchedUserData} /> : <></>
                            : <NFTShower />
                    : <></>
            }
        </>
    )
}
// 0x3D21439ec0282Ecb775a80c7A772f154aE08609D 
// 0x33B1645219C782aF822ae78fF8865c30BfA508D9
export default Users