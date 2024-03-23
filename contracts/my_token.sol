// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply*1000000000000000000);
    }

    function sendToken(address recipient, uint256 amount) public {
        _transfer(msg.sender, recipient, amount);
    }
}
