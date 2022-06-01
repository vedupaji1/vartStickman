import React, { useEffect } from 'react';
import { ethers } from "ethers";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NFTShowerCard from './NFTShowerCard';
import Users from "./Users";
const Dashboard = () => {

    let dispatch = useDispatch();
    let listingData = useSelector(state => state.dashboardData.data);
    let curParameter = useSelector(state => state.curParameter.data);
    let { userAddressOrNFTId } = useParams();
    useEffect(() => {
        const init = async () => {
            if ((curParameter === null || curParameter === undefined || curParameter.param !== userAddressOrNFTId) && (userAddressOrNFTId !== undefined)) {
                if (ethers.utils.isAddress(userAddressOrNFTId) === true) {
                    dispatch({ type: "setCurParameter", payload: { param: userAddressOrNFTId, isAddress: true } })
                }
                else if (/[a-zA-Z]/.test(userAddressOrNFTId) === false) {
                    dispatch({ type: "setCurParameter", payload: { param: userAddressOrNFTId, isAddress: false } })
                }
                else {
                    dispatch({ type: "setCurParameter", payload: { param: userAddressOrNFTId, isAddress: null } })
                }
            }
        }
        init();
    })

    return (
        <>
            {
                userAddressOrNFTId === null || userAddressOrNFTId === undefined ?
                    <>
                        <div className="mainDashboardDiv">
                            <div className="subDashboardDiv">
                                {
                                    listingData !== null ?
                                        listingData.slice(0).reverse().map((data, i) => (
                                            <NFTShowerCard key={i} nftMainData={data} />
                                        ))
                                        : <></>
                                }
                            </div>
                        </div>
                    </> : <Users />
            }
        </>
    )
}

export default Dashboard;