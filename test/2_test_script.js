require('dotenv').config();
const Web3 = require('web3');
const ERC20MetaTransactionWrapper = require('../build/contracts/ERC20MetaTransactionWrapper.json');

// OP SepoliaネットワークのPublic RPC URLを使用
const web3 = new Web3(`https://optimism-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const contractAddress = '0xC6939f31b198f795792C189Ba355211bf7DFADfF'; // コントラクトアドレスを更新してください
const contract = new web3.eth.Contract(ERC20MetaTransactionWrapper.abi, contractAddress);

const privateKey1 = process.env.PRIVATE_KEY_1; // 送信者のプライベートキー
const privateKey2 = process.env.PRIVATE_KEY_2; // 署名者のプライベートキー（今回は使わない）

async function signTransaction(privateKey, to, amount) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const messageHash = web3.utils.soliditySha3(
    { t: 'address', v: account.address },
    { t: 'address', v: to },
    { t: 'uint256', v: amount }
  );

  const signature = await web3.eth.accounts.sign(messageHash, privateKey);
  return { signer: account.address, signature: signature.signature };
}

async function transferWithMeta(from, to, amount, signature) {
  const tx = contract.methods.transferWithMeta(from, to, amount, signature);
  const gas = await tx.estimateGas({ from });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(from);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: 11155420, // OP SepoliaのChain ID
    },
    privateKey1
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

(async () => {
  const to = '0xC8fa881b898FA1177c0E7e615AabE61dbBc84508'; // 受取人アドレス
  const amount = web3.utils.toWei('1', 'ether'); // 送金額

  const { signer, signature } = await signTransaction(privateKey1, to, amount);

  // 署名配列を作成
  const signatures = web3.eth.abi.encodeParameters(['bytes'], [signature]);

  await transferWithMeta(signer, to, amount, signatures);
})();
