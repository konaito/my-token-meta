const MyToken = artifacts.require("ERC20MetaTransactionWrapper");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "0x0BBf4E89f52faE25c1C1e71631dE3A52D43C8ec6"); // 初期供給量を1,000,000トークンとしています。
};
