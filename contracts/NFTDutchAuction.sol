//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./MyDutchNFT.sol";
import "./MyERC20Token.sol";

contract NFTDutchAuction {
    using SafeMath for uint256;

    MyDutchNFT public NFTAddress;
    uint256 public NFTId;
    MyERC20Token public token_address;
    uint256 public auctionStartBlock;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    uint256 public initialPrice;
    uint256 public auctionEndBlock;
    address payable public owner;
    bool private isAuctionOver;

    constructor(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        token_address = MyERC20Token(erc20TokenAddress);
        NFTAddress = MyDutchNFT(erc721TokenAddress);
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

    function placeBid(uint256 _amount) public payable returns (address) {
        require(msg.sender != owner, "Owner can't bid");
        require(block.number <= auctionEndBlock, "Auction is ended!");

        uint256 goneBlocks = auctionEndBlock - block.number;
        uint256 currentPrice = initialPrice - goneBlocks * offerPriceDecrement;

        require(_amount >= currentPrice,"Lesser price");

        token_address.transferFrom(msg.sender,owner,_amount);
        NFTAddress.safeTransferFrom(owner, msg.sender, NFTId);
        isAuctionOver = true;
       
        return msg.sender;
    }
}
