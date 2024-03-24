require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = process.env.PRIVATE_KEY;
const infuraApiKey = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    optimismSepolia: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: `https://optimism-sepolia.infura.io/v3/${infuraApiKey}`
        }),
      network_id: 11155420,
      gas: 8000000,
      gasPrice: 1000000000,
      skipDryRun: true,
    },
  sepolia: {
    provider: () =>
      new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: `https://sepolia.infura.io/v3/${infuraApiKey}`
      }),
    network_id: 11155111,
    gas: 8000000,
    gasPrice: 1000000000,
    skipDryRun: true,
  },
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },
};

