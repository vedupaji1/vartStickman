import React, { useContext } from 'react';
import { ethers } from "ethers";
import { requiredInfo } from "../../App";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import getListedNFTData from '../../Functions/getListedNFTData';
import Logo from "../../Logo.svg";
const Header = () => {

    const contextData = useContext(requiredInfo);
    const contract = contextData.contractETH;
    let mainUserData = useSelector(state => state.mainUserData.data);
    let isMetamask = useSelector(state => state.isMetamask.data);
    let searchedNFTData = useSelector(state => state.searchedNFTData.data);
    let dispatch = useDispatch();
    const history = useHistory();

    const searchUser = async () => {
        if (contract !== null && contract !== undefined) {
            let searchInp = document.getElementsByClassName("searchBarInp")[0].value.trim();
            if (searchInp !== "") {
                try {
                    if (ethers.utils.isAddress(searchInp) === true) {
                        dispatch({ type: "setCurParameter", payload: { param: searchInp, isAddress: true } })
                        history.push("/" + searchInp);
                    }
                    else if (/[a-zA-Z]/.test(searchInp) === false) {
                        if (searchedNFTData === null || searchInp !== searchedNFTData.id) {
                            dispatch({ type: "setIsLoading", payload: true })
                            let nftOwner = await contract.contract_NFT.ownerOf(searchInp);
                            if (nftOwner !== "0x0000000000000000000000000000000000000000") {
                                if (searchedNFTData !== null) {
                                    dispatch({ type: "setSearchedNFTData", payload: null });
                                }
                                let data;
                                if (nftOwner === "0xD4510F9c951e9d724Fc0eDA47cf74a5cc147466C") {
                                    let listedNFTData = await getListedNFTData(searchInp, contextData.provider);
                                    data = {
                                        id: searchInp,
                                        uri: await contract.contract_NFT.tokenURI(searchInp),
                                        owner: listedNFTData.owner,
                                        listingId: listedNFTData.listingId,
                                        price: listedNFTData.price
                                    };
                                } else {
                                    data = {
                                        id: searchInp,
                                        uri: await contract.contract_NFT.tokenURI(searchInp),
                                        owner: nftOwner
                                    };
                                }
                                dispatch({ type: "setCurParameter", payload: { param: searchInp, isAddress: false } })
                                dispatch({ type: "setSearchedNFTData", payload: data });
                                dispatch({ type: "setIsLoading", payload: false })
                                history.push("/" + searchInp);
                            } else {
                                alert("NFT Not Exits");
                            }
                        } else {
                            history.push("/" + searchInp);
                        }
                    } else {
                        alert("Invalid Input");
                    }
                } catch (error) {
                    console.log(error)
                    alert("Invalid Input");
                    // window.location.reload();
                }
            } else {
                alert("Search Field Is Empty");
            }
        } else {
            alert("Something Went Wrong");
            window.location.reload();
        }
    }

    const checkIsEnter = async (e) => {
        if (e.key === "Enter") {
            await searchUser();
        }
    };

    return (
        <>
            <div className="headerMainDiv">
                <div className="subHeaderDiv">
                    {
                        window.innerWidth > 700 ?
                            <div className="headingText">
                                <Link to="/">
                                    <span style={{ color: "white" }}> VARt <span style={{ color: "#61dafb" }}>Stickman</span></span>
                                </Link>
                            </div>
                            : <Link to="/">
                                <img src={Logo} className="stickmanLogoImg" alt="" />
                            </Link>
                    }
                    <div className="searchBar">
                        <FaSearch onClick={() => searchUser()} />
                        <input type="text" placeholder={window.innerWidth > 420 ? "Search By Id / Address" : "Id / Address"} className="searchBarInp" onKeyDown={(e) => checkIsEnter(e)} />
                    </div>
                    <div className="userAccount">
                        {
                            isMetamask === null ?
                                <></> :
                                isMetamask === true ?
                                    mainUserData === null ?
                                        <div onClick={() => {
                                            window.location.reload();
                                        }} className="subUserAccount">Wait..</div> :
                                        <Link to={"/" + mainUserData.address}>
                                            <div className="subUserAccount">{mainUserData.address.substring(0, 5) + "..." + mainUserData.address.substring(39, 41)}</div>
                                        </Link> :
                                    <div onClick={() => {
                                        window.location.href = "https://metamask.io/"
                                    }} className="subUserAccount">Add Wallet</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header