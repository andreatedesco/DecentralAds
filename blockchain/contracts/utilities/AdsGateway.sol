// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../AdsFactory.sol";

/**
 * @title AdsGateway
 * @author Andrea Tedesco (@andreatedesco).
 * @dev Contract serving as an interface to interact with one or more AdsFactory contracts.
 */
contract AdsGateway {
    /**
     * @dev Retrieves the owner address for a given list of NFT IDs.
     * @param factory The AdsFactory contract to interact with.
     * @param ids The array of NFT IDs.
     * @return An array of owner addresses corresponding to the given NFT IDs.
     */
    function ownerOf(AdsFactory factory, uint256[] memory ids) external view returns (address[] memory) {
        address[] memory accounts = new address[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            accounts[i] = factory.ownerOfUnsafe(ids[i]);
        }

        return accounts;
    }

    /**
     * @dev Retrieves owner addresses and IPFS URIs for a given list of NFT IDs.
     * @param factory The AdsFactory contract to interact with.
     * @param ids The array of NFT IDs.
     * @return An array of owner addresses and an array of IPFS URIs corresponding to the given NFT IDs.
     */
    function infoOf(AdsFactory factory, uint256[] memory ids) external view returns (address[] memory, string[] memory) {
        address[] memory accounts = new address[](ids.length);
        string[] memory uris = new string[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            accounts[i] = factory.ownerOfUnsafe(ids[i]);
            uris[i] = factory.tokenURI(ids[i]);
        }

        return (accounts, uris);
    }

    /**
     * @dev Retrieves owner addresses and AdData for a given list of NFT IDs.
     * @param factory The AdsFactory contract to interact with.
     * @param ids The array of NFT IDs.
     * @return An array of owner addresses and an array of AdData corresponding to the given NFT IDs.
     */
    function getAds(AdsFactory factory, uint256[] memory ids) external view returns (address[] memory, AdsFactory.AdData[] memory) {
        address[] memory accounts = new address[](ids.length);
        AdsFactory.AdData[] memory ads = new AdsFactory.AdData[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            accounts[i] = factory.ownerOfUnsafe(ids[i]);
            ads[i] = factory.getAdData(ids[i]);
        }

        return (accounts, ads);
    }

    /**
     * @dev Retrieves owner addresses, AdData, and LotteryData for a given list of NFT IDs.
     * @param factory The AdsFactory contract to interact with.
     * @param ids The array of NFT IDs.
     * @return An array of owner addresses, an array of AdData, and an array of LotteryData corresponding to the given NFT IDs.
     */
    function getFullAds(AdsFactory factory, uint256[] memory ids) external view returns (address[] memory, AdsFactory.AdData[] memory, AdsFactory.LotteryData[] memory) {
        address[] memory accounts = new address[](ids.length);
        AdsFactory.AdData[] memory ads = new AdsFactory.AdData[](ids.length);
        AdsFactory.LotteryData[] memory lotteries = new AdsFactory.LotteryData[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            accounts[i] = factory.ownerOfUnsafe(ids[i]);
            ads[i] = factory.getAdData(ids[i]);
            lotteries[i] = factory.getLotteryData(ids[i]);
        }

        return (accounts, ads, lotteries);
    }

    /**
     * @dev Retrieves LotteryData for a given list of NFT IDs.
     * @param factory The AdsFactory contract to interact with.
     * @param ids The array of NFT IDs.
     * @return An array of LotteryData corresponding to the given NFT IDs.
     */
    function getLotteries(AdsFactory factory, uint256[] memory ids) external view returns (AdsFactory.LotteryData[] memory) {
        AdsFactory.LotteryData[] memory lotteries = new AdsFactory.LotteryData[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            lotteries[i] = factory.getLotteryData(ids[i]);
        }

        return (lotteries);
    }

    /**
     * @dev Retrieves contract URIs for an array of AdsFactory contracts.
     * @param factories An array of AdsFactory contracts.
     * @return An array of contract URIs corresponding to the given AdsFactory contracts.
     */
    function contractURIOf(AdsFactory[] memory factories) external view returns (string[] memory) {
        string[] memory uris = new string[](factories.length);

        for (uint256 i = 0; i < factories.length; ++i) {
            uris[i] = factories[i].contractURI();
        }

        return (uris);
    }

    /**
     * @dev Retrieves contract URIs and owner addresses for an array of AdsFactory contracts.
     * @param factories An array of AdsFactory contracts.
     * @return An array of contract URIs and an array of owner addresses corresponding to the given AdsFactory contracts.
     */
    function contractURIAndOwner(AdsFactory[] memory factories) external view returns (string[] memory, address[] memory) {
        string[] memory uris = new string[](factories.length);
        address[] memory accounts = new address[](factories.length);

        for (uint256 i = 0; i < factories.length; ++i) {
            uris[i] = factories[i].contractURI();
            accounts[i] = factories[i].owner();
        }

        return (uris, accounts);
    }
}