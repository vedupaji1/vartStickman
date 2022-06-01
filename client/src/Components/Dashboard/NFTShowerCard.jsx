import React, { useEffect, useState, useContext } from 'react'
import { ethers } from "ethers";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { requiredInfo } from "../../App";

const NFTShowerCard = ({ nftMainData }) => {
  let contextData = useContext(requiredInfo);
  let contract = contextData.contractETH;
  const [nftData, setNFTData] = useState(null);
  const dispatch = useDispatch();
  let history = useHistory();
  let isMetamask = useSelector(state => state.isMetamask.data);
  useEffect(() => {
    const init = async () => {
      try {
        if (nftData === null || nftData === undefined) {
          let res = await fetch(nftMainData.uri);
          let data = await res.json();
          setNFTData({ name: data.name, image: data.image });
        }
      } catch (error) {
        console.log(error);
        alert("Something Went Wrong");
        window.location.reload();
      }
    }
    init();
  })

  const buyNFT = async () => {
    if (contract.contract_Marketplace !== null && contract.contract_Marketplace !== undefined) {
      try {
        dispatch({ type: "setIsLoading", payload: true })
        let res = await contract.contract_Marketplace.purchaseItem(nftMainData.listingId, { value: nftMainData.price });
        await res.wait();
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Something Went Wrong");
        window.location.reload();
      }
    } else {
      alert("Something Went Wrong");
      window.location.reload();
    }
  }

  return (
    <>
      {
        nftData !== null && nftData !== undefined ?
          <div className="mainCardDiv">
            <div className="imageShower">
              <img src={nftData.image} alt="" />
            </div>
            <div className="nftNameAndPriceShower">
              <span>
                <span onClick={() => {
                  history.push("/" + nftMainData.id);
                }} className="nftIdShower">#{nftMainData.id}</span> {nftData.name}
              </span>
              <span className="priceShower">
                <svg style={{ height: "2rem", width: "fit-content" }} xmlns="http://www.w3.org/2000/svg" width="33" height="53" viewBox="0 0 33 53" fill="none">
                  <path d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z" fill="#343434" />
                  <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#8C8C8C" />
                  <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z" fill="#3C3C3B" />
                  <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#8C8C8C" />
                  <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#141414" />
                  <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#393939" />
                </svg> {ethers.utils.formatEther(nftMainData.price)}
              </span>
              <span onClick={() => { history.push("/" + nftMainData.owner) }} className="ownerAddressShower">{nftMainData.owner}</span>
            </div>
            {
              isMetamask === true ? <><div className="buyNFTShower" onClick={() => buyNFT()}>Buy</div></> : <></>
            }
          </div>
          : <></>
      }
    </>
  )
}

export default NFTShowerCard