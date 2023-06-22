# Sample Hardhat Project

This project is about a basic DutchAuction. It sells NFT based on higher bid within certain block time.

Commands:

```shell
npx hardhat help
npx hardhat test
npx hardhat coverage
```

# Version

> solidity-coverage: v0.8.2

# Instrumenting for coverage...

> MyDutchNFT.sol
> NFTDutchAuction.sol

# Covergae Report

> HardhatEVM: v2.12.7
> network: hardhat

## MyDutchNFT
### Deployment
- ✔ Should set the right name (144ms)
- ✔ Should set the right symbol
### Minting
- ✔ Mint NFTs and cross verify owner address of NFT ids (66ms)

## NFTDutchAuction
### Deployment
- ✔ Should set the right owner (140ms)
- ✔ Should set the right erc721 address
- ✔ Should set the right erc721 token ID
- ✔ Should set the right reserve price
- ✔ Should set the right number of block auction open
- ✔ Should set the right offer price decrement
- ✔ Should have address for nft token id 1 as same as owner's address
### Auction - Placebid
- ✔ Should not accept bid from owner
- ✔ Should reject bids after the auction has ended (54ms)
- ✔ Should reject bids after the no of blocks open count reached (74ms)
- ✔ Should reject a bid if price lesser and transfer back it to buyer
- ✔ Should accept a valid bid and token transfered to buyer

15 passing (594ms)

----------------------|----------|----------|----------|----------|----------------|
File | % Stmts | % Branch | % Funcs | % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
contracts/ | 100 | 100 | 100 | 100 | |
MyDutchNFT.sol | 100 | 100 | 100 | 100 | |
NFTDutchAuction.sol | 100 | 100 | 100 | 100 | |
----------------------|----------|----------|----------|----------|----------------|
All files | 100 | 100 | 100 | 100 | |
----------------------|----------|----------|----------|----------|----------------|
