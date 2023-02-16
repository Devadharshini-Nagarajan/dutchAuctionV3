# Sample Hardhat Project

This project demonstrates a basic DutchAuction use case. It accepts hight bid, and transfer the NFT to bidder from owner.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
Version
=======
> solidity-coverage: v0.8.2

Instrumenting for coverage...
=============================

> dutchNFT.sol
> Lock.sol
> NFTDutchAuction.sol

Compilation:
============

Generating typings for: 15 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 42 typings!
Compiled 15 Solidity files successfully

Network Info
============
> HardhatEVM: v2.12.7
> network:    hardhat



  Lock
    Deployment
      ✔ Should set the right unlockTime (92ms)
      ✔ Should set the right owner
      ✔ Should receive and store the funds to lock
      ✔ Should fail if the unlockTime is not in the future
    Withdrawals
      Validations
        ✔ Should revert with the right error if called too soon
        ✔ Should revert with the right error if called from another account
        ✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
      Events
        ✔ Should emit an event on withdrawals
      Transfers
        ✔ Should transfer the funds to the owner

  NFTDutchAuction
    Deployment
      ✔ Should set the right owner (77ms)
      ✔ Should set the right erc721 address
      ✔ Should set the right erc721 token ID
      ✔ Should set the right reserve price
      ✔ Should set the right number of block auction open
      ✔ Should set the right offer price decrement
      ✔ check owner of token id 1
    Auction
      ✔ Is auction contract approved for transfering NFT
      ✔ Buyers will bid and bid will be refunded
      ✔ Buyer's bid will accepted and token transfered to buyer
      ✔ Buyers can not bid after auction ended
      ✔ Owner can not bid

  dutchNFT
    Deployment
      ✔ Should set the right name
      ✔ Should set the right symbol
    Minting
      ✔ Mint NFTs


  24 passing (371ms)

----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 contracts/           |      100 |    88.89 |      100 |      100 |                |
  Lock.sol            |      100 |      100 |      100 |      100 |                |
  NFTDutchAuction.sol |      100 |    83.33 |      100 |      100 |                |
  dutchNFT.sol        |      100 |      100 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|
All files             |      100 |    88.89 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
