// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20MetaTransactionWrapper {
    using ECDSA for bytes32;

    IERC20 public immutable token;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function transferWithMeta(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) public {
        // メッセージハッシュの生成
        bytes32 messageHash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            keccak256(abi.encodePacked(from, to, amount))
        ));

        // 署名の検証
        require(messageHash.recover(signature) == from, "Invalid signature");

        // トークンの転送
        require(token.transferFrom(from, to, amount), "Transfer failed");
    }
}
