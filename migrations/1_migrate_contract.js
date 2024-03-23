const MyToken = artifacts.require("MyToken");

module.exports = function (deployer) {
  deployer.deploy(MyToken, 10000); // 初期供給量を1,000,000トークンとしています。
};
