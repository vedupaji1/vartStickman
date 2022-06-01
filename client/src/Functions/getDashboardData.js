const getDashboardData = async (contract_NFT, contract_Marketplace) => {
    let unfilteredData = await contract_Marketplace.getListings();
    let filteredData = [];
    for (let i = 0; i < unfilteredData.length; i++) {
        if (unfilteredData[i].isSold === false) {
            let nftId = Number.parseInt(unfilteredData[i].id._hex);
            filteredData.push({
                id: nftId,
                owner: unfilteredData[i].owner,
                price: (unfilteredData[i].price._hex),
                uri: await contract_NFT.tokenURI(nftId),
                listingId: i + 1
            })
        }
    }
    return filteredData;
}

export default getDashboardData;