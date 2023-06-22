import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyDutchNFT", function () {
  async function deployMyDutchNFT() {
    
    const [owner, account1, account2] = await ethers.getSigners();

    const DutchNFT = await ethers.getContractFactory("MyDutchNFT");
    const dutch_nft = await DutchNFT.deploy();

    return { dutch_nft, owner, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      const { dutch_nft, owner, account1 } = await loadFixture(deployMyDutchNFT);
      expect(await dutch_nft.name()).to.equal("MyDutchNFT");
    });

    it("Should set the right symbol", async function () {
        const { dutch_nft, owner, account1 } = await loadFixture(deployMyDutchNFT);
  
        expect(await dutch_nft.symbol()).to.equal("DNFT");
    });
  });

describe("Minting", function () {
    it("Mint NFTs and cross verify owner address of NFT ids", async function () {
        const { dutch_nft, owner, account1,account2 } = await loadFixture(deployMyDutchNFT);
        const mint1 = await dutch_nft.connect(account1).safeMint(account1.address);
        const mint2 = await dutch_nft.connect(account2).safeMint(account2.address);
        expect(await dutch_nft.ownerOf(1)).to.eq(account1.address)
        expect(await dutch_nft.ownerOf(2)).to.eq(account2.address)
        expect(await dutch_nft.symbol()).to.equal("DNFT");
    });
});
});
