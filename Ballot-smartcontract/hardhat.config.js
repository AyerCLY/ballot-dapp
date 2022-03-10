require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
  defaultNetwork: 'ganache',
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ],
  },
  networks: {
    // hardhat: {
    //   gas: 9000000000,
    //   blockGasLimit: 9000000000,
    //   allowUnlimitedContractSize: true,
    // },
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    //   gas: 150000000,
    //   blockGasLimit: 150000000,
    //   allowUnlimitedContractSize: true,
    //   throwOnTransactionFailures: true,
    //   throwOnCallFailures: true,
    //   accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"]
    // },
    ganache: {
      url: "http://127.0.0.1:7545",
      gas: 20000000000,
      // blockGasLimit: 6721975,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      accounts: ["119d17d02e7846ec8066fcbf2d2daaae4e774c892f4bfd5a58dc5288a93dce46"]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: ["a182030a6b1e20a5213b26c10d24cf1c9dcbb877b2a1dacb0e336161a0c9cd7c"]
    }

  },
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './artifacts'
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 1,
    enabled: false
  },
};
