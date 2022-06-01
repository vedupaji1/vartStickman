import {
    ethers
} from "ethers";
const decoder = new ethers.utils.AbiCoder();
const getListedNFTData = async (id, provider) => {
    let idInHex = (Number.parseInt(id)).toString(16);
    let paddedId = "0x" + idInHex.padStart(64, "0");
    let logsData_NFT = await provider.getLogs({
        fromBlock: 0,
        address: '0xd4510f9c951e9d724fc0eda47cf74a5cc147466c',
        topics: [
            "0xbd5d1836d4114b1a1785c873a084824203ab9c294b3694e6a9fa69234a9113c6",
            null,
            paddedId
        ]
    })
    let filteredData = decoder.decode(["address", "uint"], logsData_NFT[0].data)
    let listedNFTData = {
        owner: "0x" + logsData_NFT[0].topics[1].substring(26, 66),
        listingId: Number.parseInt(logsData_NFT[0].topics[3]),
        price: (filteredData[1]._hex)
    }
    return listedNFTData
}

export default getListedNFTData;