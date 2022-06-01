import React, { useState, useEffect, useContext } from 'react'
import { ethers } from "ethers";
import { useSelector, useDispatch } from 'react-redux';
import { requiredInfo } from "../../App";
import { useHistory } from 'react-router-dom';

const NFTShower = () => {
  const [nftData, setNFTData] = useState(null);
  const [curNFTId, setCurNFTId] = useState(null);
  let contextData = useContext(requiredInfo);
  let contract = contextData.contractETH;
  let dispatch = useDispatch();
  let history = useHistory();
  let searchedNFTData = useSelector(state => state.searchedNFTData.data);
  let isMetamask = useSelector(state => state.isMetamask.data);
  useEffect(() => {
    const init = async () => {
      if ((searchedNFTData !== null) && (curNFTId === null || curNFTId !== searchedNFTData.id)) {
        setCurNFTId(searchedNFTData.id)
      }
    }
    init();
  })

  useEffect(() => {
    const init = async () => {
      if ((searchedNFTData !== null)) {
        dispatch({ type: "setIsLoading", payload: true });
        let res = await fetch(searchedNFTData.uri);
        let data = await res.json();
        setNFTData(data);
        dispatch({ type: "setIsLoading", payload: false });
      }
    }
    init();
  }, [curNFTId])

  const buyNFT = async () => {
    if (contract.contract_Marketplace !== null && contract.contract_Marketplace !== undefined) {
      try {
        dispatch({ type: "setIsLoading", payload: true })
        let res = await contract.contract_Marketplace.purchaseItem(searchedNFTData.listingId, { value: searchedNFTData.price });
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
        searchedNFTData !== null && nftData !== null ?
          <>
            <div className="mainNFTShowerDiv">
              <div className="subNFTShowerDiv">
                <div className="nftImageShower"><img src={nftData.image} alt="" /></div>
                <div className="nftInfoShower">
                  <span className="nftIdShower_NFT">#{searchedNFTData.id}</span>
                  <span className="nftNameShower_NFT">{nftData.name}</span>
                  <span className="ownerAddressShower_NFT">Owned By <span onClick={() => {
                    history.push("/" + searchedNFTData.owner)
                  }}>{searchedNFTData.owner}</span></span>
                  <div className="showBuyOption_NFT">
                    {
                      searchedNFTData.listingId !== undefined ?
                        <>
                          <span className="priceText_NFT">Price</span>
                          <span className="priceShower_NFT">
                            <svg style={{ height: "3rem", width: "fit-content", marginRight: "1rem" }} xmlns="http://www.w3.org/2000/svg" width="33" height="53" viewBox="0 0 33 53" fill="none">
                              <path d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z" fill="#343434" />
                              <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#8C8C8C" />
                              <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z" fill="#3C3C3B" />
                              <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#8C8C8C" />
                              <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#141414" />
                              <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#393939" />
                            </svg> {ethers.utils.formatEther(searchedNFTData.price)}
                          </span>
                          {
                            isMetamask === true ? <> <div onClick={() => buyNFT()} className="buyNFTButton_NFT">Buy</div></> : <></>
                          }
                        </> :
                        <>
                          <div className="notForSaleMessShower">Not Listed</div>
                        </>
                    }
                  </div>
                </div>
                <div className="nftFeaturesShower">
                  {
                    nftData.attributes.map((data, i) =>
                    (
                      <div key={i} className="nftFeature">
                        <span>{data.trait_type}</span>
                        <span className="nftFeatureData">{data.value}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </> : <></>
      }
    </>
  )
}

export default NFTShower