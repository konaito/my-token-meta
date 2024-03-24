require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// ABIファイルのパス
const abiPath = path.join(__dirname, '../build/contracts/ERC20MetaTransactionWrapper.json');

app.get('/', (req, res) => {
    // ABIファイルの読み込み
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
    const from = process.env.TO;
    const to = process.env.FROM;
    const signature = process.env.SIGNATURE;

    // HTMLコンテンツに環境変数とABIを埋め込む
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>メタトランザクションデモ</title>
      <script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
    </head>
    <body>
      <p>from: ${from}</p>
      <p>to: ${to}</p>
      <p>signed: ${signature}</p>
      <button id="connectMetamask">Connect to Metamask</button>
      <button id="sendTransaction" style="display: none;">トランザクションを送信</button>
      <script>
        // ウェブ3インスタンスの初期化
        let web3;
        
        // コントラクトのABI
        const ERC20MetaTransactionWrapperABI = ${JSON.stringify(abi)};
        const from="${from}";
        const to="${to}";
        const signature="${signature}";
        
        // コントラクトのアドレス
        const contractAddress = '0x0D32829b8110739BEC3Db545c807f3Ac9863bD23';
        let contract;
        
        const connectMetamaskButton = document.getElementById("connectMetamask");
        const sendTransactionButton = document.getElementById("sendTransaction");
        
        connectMetamaskButton.addEventListener("click", async () => {
          try {
            // Metamaskプロバイダが利用可能かどうかを確認
            if (typeof window.ethereum !== 'undefined') {
              // Web3インスタンスを作成
              web3 = new Web3(window.ethereum);
              
              // Metamaskへのアクセスを要求
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              
              // 接続されたアカウントを取得
              const accounts = await web3.eth.getAccounts();
              console.log("Connected account:", accounts[0]);
              
              // コントラクトインスタンスを作成
              contract = new web3.eth.Contract(ERC20MetaTransactionWrapperABI, contractAddress);
              
              // Metamaskボタンを非表示にし、送信ボタンを表示
              connectMetamaskButton.style.display = "none";
              sendTransactionButton.style.display = "block";
            } else {
              console.error("Metamask not detected");
            }
          } catch (error) {
            console.error("Failed to connect to Metamask:", error);
          }
        });
        
        sendTransactionButton.addEventListener('click', async function() {
          try {
            // トランザクションの詳細
            const amount = web3.utils.toWei('1', 'ether'); // 転送するトークンの量
        
            // アクティブなアカウントの取得
            const accounts = await web3.eth.getAccounts();
            const senderAccount = accounts[0]; // トランザクションを送信するアカウント
        
            // メタトランザクションの送信
            const receipt = await contract.methods.transferWithMeta(from, to, amount, signature).send({
              from: senderAccount,
            });
        
            console.log('Transaction receipt: ', receipt);
          } catch (error) {
            console.error('Error sending transaction: ', error);
          }
        });
      </script>
    </body>
    </html>
    `;

    res.send(htmlContent);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});