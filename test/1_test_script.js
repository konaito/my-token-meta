require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const myTokenArtifact = require('../build/contracts/MyToken.json'); // ABIを読み込む

const privateKey = process.env.PRIVATE_KEY;
// const infuraUrl = `https://optimism-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
const infuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

const provider = new HDWalletProvider(privateKey, infuraUrl);
const web3 = new Web3(provider);

const contractABI = myTokenArtifact.abi; // ABIを使用
const contractAddress = '0x0BBf4E89f52faE25c1C1e71631dE3A52D43C8ec6'; // コントラクトのアドレスを設定

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function sendToken() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const recipient = '0xC8fa881b898FA1177c0E7e615AabE61dbBc84508'; // 送金先アドレス
    const amount = web3.utils.toWei('100', 'ether'); // 送金額（Ether単位）

    console.log(`Sending ${amount} tokens from ${sender} to ${recipient}...`);

    const tx = contract.methods.sendToken(recipient, amount);
    const gas = await tx.estimateGas({from: sender});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(sender);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 11155111
        },
        privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction receipt:', receipt);
}

sendToken().then(() => {
    console.log('Token transfer completed.');
    process.exit(0);
}).catch((err) => {
    console.error('Token transfer failed:', err);
    process.exit(1);
});