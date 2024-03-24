require('dotenv').config(); // 環境変数を読み込むために追加
const Web3 = require('web3').default;
const infuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// 署名するアカウントのプライベートキー（安全に管理する必要があります）
const privateKey = process.env.FROM_PRIVATE_KEY;

// トランザクションの詳細
const from = process.env.FROM;
const to = process.env.TO;
const amount = web3.utils.toWei('1', 'ether'); // 1 EtherをWeiに変換

// メッセージハッシュを生成します（例として、from, to, amountを使います）
const messageHash = web3.utils.soliditySha3({t: 'address', v: from}, {t: 'address', v: to}, {t: 'uint256', v: amount});

// メッセージハッシュに対して署名を生成します
try {
  const signature = web3.eth.accounts.sign(messageHash, privateKey);
  console.log('Signature: ', signature.signature);
  // このsignature.signatureをトランザクションで使用します
} catch (error) {
  console.error('Error signing message: ', error);
}