// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyDutchNFT is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private tokenCounter;

    constructor() ERC721("MyDutchNFT", "DNFT") {}

    function safeMint(address to) public {
        tokenCounter.increment();
        uint256 tokenId = tokenCounter.current();
        _safeMint(to, tokenId);
    }
}
