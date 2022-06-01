import {
    ethers
} from "ethers";
const getUserNFTData = async (userAddress, provider, signer) => {
    let tempAddress = "0x000000000000000000000000" + userAddress.substring(2, 63) // For Filtering Logs Data We Need Vales Of 64 Bytes And Here We Are Converting Users Address To 64 Bytes Or 0x+64 Characters Containing Address.

    let userData = {
        address: userAddress,
        nft: [],
        listed: []
    }

    let logsData_NFT = await provider.getLogs({
        fromBlock: 0,
        address: '0x9f6E11CB31F566e55Ec4dD582ccD2903a7C8c401',
        topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            null,
            tempAddress
        ]
    })

    let logsData_Marketplace = await provider.getLogs({
        fromBlock: 0,
        address: '0xD4510F9c951e9d724Fc0eDA47cf74a5cc147466C',
        topics: [
            "0xbd5d1836d4114b1a1785c873a084824203ab9c294b3694e6a9fa69234a9113c6",
            tempAddress
        ]
    })

    let tempArr = [];

    let contract_NFT = new ethers.Contract("0x9f6E11CB31F566e55Ec4dD582ccD2903a7C8c401", [{
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }],
        "name": "ownerOf",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }],
        "name": "tokenURI",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    }], signer);

    for (let i = 0; i < logsData_NFT.length; i++) {
        try {
            let curNFTId = Number.parseInt(logsData_NFT[i].topics[3]);
            if (await contract_NFT.ownerOf(curNFTId) === userAddress && tempArr.indexOf(curNFTId) === -1) {
                tempArr.push(curNFTId);
                userData.nft.push({
                    id: curNFTId,
                    url: await contract_NFT.tokenURI(curNFTId)
                });
            }
        } catch (error) {}
    }

    let contract_Marketplace = new ethers.Contract("0xD4510F9c951e9d724Fc0eDA47cf74a5cc147466C", [{
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "listedItems",
        "outputs": [{
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "contract IERC721",
                "name": "contractInstance",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isSold",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }], signer);

    for (let i = 0; i < logsData_Marketplace.length; i++) {
        try {
            let curItemId = Number.parseInt(logsData_Marketplace[i].topics[3]);
            let itemData = await contract_Marketplace.listedItems(curItemId - 1);
            let nftId = Number.parseInt(itemData.id);
            if (itemData.isSold === false) {
                userData.listed.push({
                    id: nftId,
                    url: await contract_NFT.tokenURI(nftId),
                    price: (itemData.price._hex),
                    listingId: curItemId
                });
            }
        } catch (error) {}
    }

    return userData;
}

export default getUserNFTData;