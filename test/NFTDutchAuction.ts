import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getAddress } from "ethers/lib/utils";

describe("NFTDutchAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDutchNFT() {
    const DutchNFT = await ethers.getContractFactory("DutchNFT");
    const dutch_nft = await DutchNFT.deploy();
    return { dutch_nft };
  }
  async function deployNFTDutchAuction() {
    const [owner, account1, account2, account3, account4, account5] = await ethers.getSigners();
    const { dutch_nft } = await loadFixture(deployDutchNFT);
    const nft_address = dutch_nft.address;
    await dutch_nft.connect(owner).safeMint(owner.address);
    const nft_id = 1;
    const reservePrice = "10000";
    const numBlocksAuctionOpen = 1000;

    const offerPriceDecrement = "10";

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
      const { nft_address,basic_dutch_auction } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.NFT_address()).to.equal(nft_address);
    });

    it("Should set the right erc721 token ID", async function () {
      const { nft_id,basic_dutch_auction } = await loadFixture(deployNFTDutchAuction);
      expect(await basic_dutch_auction.NFT_id()).to.equal(nft_id);
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

    it("check owner of token id 1", async function () {
      const { owner, dutch_nft, nft_id } = await loadFixture(deployNFTDutchAuction);
      expect(await dutch_nft.ownerOf(nft_id)).to.equal(owner.address);
    });


  });
describe("Auction", function () {
    it("Is auction contract approved for transfering NFT", async function () {
      const { dutch_nft,nft_id,basic_dutch_auction} = await loadFixture(deployNFTDutchAuction);
      expect(await dutch_nft.getApproved(nft_id)).to.equal(basic_dutch_auction.address)
    });

    it("Buyers will bid and bid will be refunded", async function () {
      const { basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
      const bid1 = await basic_dutch_auction.connect(account1).bid({value: '100'});
      const receipt1 = await bid1.wait()
      const gasSpent1 = receipt1.gasUsed.mul(receipt1.effectiveGasPrice)
      expect(await account1.getBalance()).to.eq(ethers.utils.parseEther("10000").sub(gasSpent1))
    });

    it("Buyer's bid will accepted and token transfered to buyer", async function () {
        const { dutch_nft,nft_id,basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
        const balance_before = await owner.getBalance();
        const bid3 = await basic_dutch_auction.connect(account3).bid({value: '50000'});
        const receipt3 = await bid3.wait()
        const gasSpent3 = receipt3.gasUsed.mul(receipt3.effectiveGasPrice)
        expect(await account3.getBalance()).to.eq(ethers.utils.parseEther("10000").sub(gasSpent3.add('50000')))
        expect (await owner.getBalance()).to.eq(balance_before.add(50000));
        expect(await dutch_nft.ownerOf(nft_id)).to.equal(account3.address);
    });

      it("Buyers can not bid after auction ended", async function () {
        const { basic_dutch_auction,owner, account1, account2, account3, account4 } = await loadFixture(deployNFTDutchAuction);
        const bid3 = await basic_dutch_auction.connect(account3).bid({value: '50000'});
        await expect(basic_dutch_auction.connect(account4).bid({value: '1000'})).to.be.revertedWith(
          "auction is ended"
        );
      });

    it("Owner can not bid", async function () {
        const { basic_dutch_auction,owner} = await loadFixture(deployNFTDutchAuction);
        await expect(basic_dutch_auction.connect(owner).bid({value: '1000'})).to.be.revertedWith(
          "owner can't bid"
        );
      });
});
});
