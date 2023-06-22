import {  loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// Helper function to increase the number of blocks
async function increaseBlocks(numBlocks: number): Promise<void> {
  for (let i = 0; i < numBlocks; i++) {
    await ethers.provider.send("evm_mine", []);
  }
}

describe("NFTDutchAuction", function () {
  async function deployMyDutchNFT() {
    const DutchNFT = await ethers.getContractFactory("MyDutchNFT");
    const dutch_nft = await DutchNFT.deploy();
    return { dutch_nft };
  }

  async function deployNFTDutchAuction() {
    const [owner, account1, account2, account3, account4, account5] = await ethers.getSigners();
    const { dutch_nft } = await loadFixture(deployMyDutchNFT);
    const nft_address = dutch_nft.address;
    await dutch_nft.connect(owner).safeMint(owner.address);
    const nft_id = 1;
    const reservePrice = 30000;
    const numBlocksAuctionOpen = 100;
    const offerPriceDecrement = 10;

    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");
    const basic_dutch_auction = await NFTDutchAuction.deploy(nft_address,nft_id,reservePrice, numBlocksAuctionOpen, offerPriceDecrement);
    await dutch_nft.connect(owner).approve(basic_dutch_auction.address,nft_id);

    return { dutch_nft, nft_address, nft_id, basic_dutch_auction, reservePrice, numBlocksAuctionOpen, offerPriceDecrement, owner, account1, account2, account3, account4 };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { basic_dutch_auction, owner, account1 } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.owner()).to.equal(owner.address);
    });

    it("Should set the right erc721 address", async function () {
      const { nft_address, basic_dutch_auction } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.NFTAddress()).to.equal(nft_address);
    });

    it("Should set the right erc721 token ID", async function () {
      const { nft_id, basic_dutch_auction } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.NFTId()).to.equal(nft_id);
    });

    it("Should set the right reserve price", async function () {
      const { basic_dutch_auction, reservePrice } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.reservePrice()).to.equal(reservePrice);
    });

    it("Should set the right number of block auction open", async function () {
      const { basic_dutch_auction, numBlocksAuctionOpen } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.numBlocksAuctionOpen()).to.equal(numBlocksAuctionOpen);
    });

    it("Should set the right offer price decrement", async function () {
      const { basic_dutch_auction, offerPriceDecrement } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.offerPriceDecrement()).to.equal(offerPriceDecrement);
    });

    it("Should have address for nft token id 1 as same as owner's address", async function () {
      const { owner, dutch_nft, nft_id } = await loadFixture(deployNFTDutchAuction);
      expect(await dutch_nft.ownerOf(nft_id)).to.equal(owner.address);
    });
  });

  describe("Auction", function () {

    it("Should not accept bid from owner", async function () {
      const { basic_dutch_auction,owner} = await loadFixture(deployNFTDutchAuction);
      await expect(basic_dutch_auction.connect(owner).placeBid({value: '1000'})).to.be.revertedWith(
        "Owner can't bid"
      );
    });

    it("Should reject bids after the auction has ended", async function () {
      const { basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
      const bid3 = await basic_dutch_auction.connect(account3).placeBid({value: '50000'});
      await expect(basic_dutch_auction.connect(account4).placeBid({value: '1000'})).to.be.revertedWith(
        "Auction is ended!"
      );
    });

    it("Should reject bids after the no of blocks open count reached", async function () {
      const { basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
      await increaseBlocks(200);
      await expect(basic_dutch_auction.connect(account1).placeBid({ value: 100 })).to.be.revertedWith(
          "Auction is ended!"
      );
    });

    it("Should reject a bid if price lesser and transfer back it to buyer", async function () {
      const { basic_dutch_auction, owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
      const bid1:any = await basic_dutch_auction.connect(account1).placeBid({value: '100'});
      const receipt1 = await bid1.wait()
      const gasSpent1 = receipt1.gasUsed.mul(receipt1.effectiveGasPrice)
      expect(await account1.getBalance()).to.lessThan(ethers.utils.parseEther("10000").sub(gasSpent1))
    });

    it("Should accept a valid bid and token transfered to buyer", async function () {
        const { dutch_nft,nft_id,basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
        const balance_before = await owner.getBalance();
        const bid3:any = await basic_dutch_auction.connect(account3).placeBid({value: '50000'});
        const receipt3 = await bid3.wait()
        const gasSpent3 = receipt3.gasUsed.mul(receipt3.effectiveGasPrice)
        expect(await account3.getBalance()).to.eq(ethers.utils.parseEther("10000").sub(gasSpent3.add('50000')))
        expect (await owner.getBalance()).to.eq(balance_before.add(50000));
        expect(await dutch_nft.ownerOf(nft_id)).to.equal(account3.address);
    });
  });
});
