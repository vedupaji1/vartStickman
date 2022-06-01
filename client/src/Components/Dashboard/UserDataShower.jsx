import React, { useState, useEffect, useContext } from 'react'
import { requiredInfo } from "../../App";
import { useSelector, useDispatch } from 'react-redux';
import UserNFTShowerCard from './UserNFTShowerCard';
import { FaQuestion } from "react-icons/fa";
import { create as ipfsHttpClient } from 'ipfs-http-client' // This Line Of Code Is Taken From "https://github.com/dappuniversity/nft_marketplace/blob/main/src/frontend/components/Create.js", Basically Web3.Storage Was Not Working With ReactJs Because Of This We Are Using IPFS-Client.
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const UserDataShower = ({ userData }) => {

  const [userProfileImage, setUserProfileImage] = useState(null);
  let contextData = useContext(requiredInfo);
  let contract = contextData.contractETH.contract_NFT;
  let dispatch = useDispatch();
  let curParameter = useSelector(state => state.curParameter.data);
  let curUserAddress = useSelector(state => state.curUserAddress.data);
  const [curUser, setCurUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (curUser === null || curUser !== userData.address) {
        setCurUser(userData.address)
      }
    }
    init();
  })

  useEffect(() => {
    const init = async () => {
      try {
        if (((userData.nft.length > 0 || userData.listed.length > 0))) {
          let url = userData.nft.length > 0 ?
            userData.nft[userData.nft.length - 1].url
            : userData.listed[userData.listed.length - 1].url
          let res = await fetch(url);
          let data = await res.json();
          setUserProfileImage(data.image);
        }
      } catch (error) {
        console.log(error);
        alert("Something Went Wrong");
        window.location.reload();
      }
    }
    init();
    return () => {
      setUserProfileImage(null);
    };
  }, [curUser])

  const mintNFT = async () => {
    if (contract !== null && contract !== undefined) {
      try {
        dispatch({ type: "setIsLoading", payload: true })
        let res = await fetch("/generateArt");
        let data = await res.json();
        const rootPath = await client.add(data.data.image.data);
        let imageDataLink = "https://ipfs.io/ipfs/" + rootPath.path;
        const imageProperties = JSON.stringify({
          "name": "Thug Stickman #" + 1,
          "description": "This Is Thug Stickman, Please Buy It Because For That You Dont Need Real ETH",
          "image": imageDataLink,
          "attributes": [{
            "trait_type": "Head Color",
            "value": data.data.properties.headColor
          },
          {
            "trait_type": "Eyes Color",
            "value": data.data.properties.eyesColor
          },
          {
            "trait_type": "Lips Color",
            "value": data.data.properties.lipsColor
          },
          {
            "trait_type": "Body Color",
            "value": data.data.properties.bodyColor
          },
          {
            "trait_type": "Arms Color",
            "value": data.data.properties.armsColor
          },
          {
            "trait_type": "Fingers Color",
            "value": data.data.properties.fingersColor
          },
          {
            "trait_type": "Middle Finger Color",
            "value": data.data.properties.middleFingerColor
          },
          {
            "trait_type": "Legs Color",
            "value": data.data.properties.legsColor
          },
          {
            "trait_type": "Feet Color",
            "value": data.data.properties.feetColor
          }
          ]
        })
        const imagePropertiesPath = await client.add(imageProperties);
        let imagePropertiesLink = "https://ipfs.io/ipfs/" + imagePropertiesPath.path;
        let provider = contextData.provider;
        let transactionRes = await contract.safeMint(await provider.getSigner().getAddress(), imagePropertiesLink, { value: 0 })
        await transactionRes.wait();
        alert("NFT Minted Successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Something Went Wrong");
      window.location.reload();
    }
  }

  return (
    <>
      <div className="mainUserDataShowerDiv">
        <div className="tempBackground"></div>
        <div className="subUserDataShowerDiv">
          <div className="profileShower">
            {
              userData.nft.length > 0 || userData.listed.length > 0 ?
                userProfileImage !== null && userProfileImage !== undefined ?
                  <img src={userProfileImage} alt="stickmanImage" /> : <div className="tempProfileDiv"></div>
                : <><div className="tempProfileDiv"><FaQuestion /></div></>
            }
            {
              curParameter.param === curUserAddress ? <span onClick={() => mintNFT()} className="mintNFTButton">Mint</span> : <></>
            }
            <span className="userAddressShower">{userData.address}</span>
          </div>
          <div className="ownedNFTShower">
            {
              userData.nft.slice(0).reverse().map((data, i) => (
                <UserNFTShowerCard key={i} userData={data} isListed={false} curNum={i} />
              ))
            }
            {
              userData.listed.slice(0).reverse().map((data, i) => (
                <UserNFTShowerCard key={i} userData={data} isListed={true} curNum={i} />
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDataShower