//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTDutchAuction {
    using SafeMath for uint256;

    IERC721 public NFTAddress;
    uint256 public NFTId;
    uint256 public auctionStartBlock;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;
    uint256 public auctionEndBlock;
    address payable public owner;
    bool private isAuctionOver;

    constructor(
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        NFTAddress = IERC721(erc721TokenAddress);
        NFTId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice = reservePrice.add(
            numBlocksAuctionOpen.mul(offerPriceDecrement)
        );
        auctionStartBlock = block.number;
        auctionEndBlock = block.number + numBlocksAuctionOpen;
        owner = payable(msg.sender);
        isAuctionOver = false;
    }

    function placeBid() public payable returns (address) {
        require(msg.sender != owner, "Owner can't bid");
        require(isAuctionOver == false, "Auction is ended!");
        require(block.number <= auctionEndBlock, "Auction is ended!");

        uint256 goneBlocks = auctionEndBlock - block.number;
        uint256 currentPrice = initialPrice - goneBlocks * offerPriceDecrement;

        if (msg.value >= currentPrice) {
            NFTAddress.safeTransferFrom(owner, msg.sender, NFTId);
            owner.transfer(msg.value);
            isAuctionOver = true;
        } else {
            address payable bidder = payable(msg.sender);
            bidder.transfer(msg.value);
        }
        return msg.sender;
    }
}
