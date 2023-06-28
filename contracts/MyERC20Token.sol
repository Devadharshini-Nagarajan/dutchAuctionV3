pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20 {
    constructor() ERC20("MyERC20Token", "BTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}