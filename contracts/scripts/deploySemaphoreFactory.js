// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { EntryPoint, EntryPoint__factory } = require('@account-abstraction/contracts')
const { HttpRpcClient } = require('@account-abstraction/sdk/dist/src/HttpRpcClient')
const { ERC4337EthersProvider } = require('@account-abstraction/sdk')
const { MyWalletApi } = require('../src')
const { SimpleWalletAPI } = require('@account-abstraction/sdk')

const GREETER_ADDR = '0x932C1dA6feD0Efa30AAA5358F34bEEB3f6281B3b'
const ENTRYPOINT_ADDR = '0x2167fA17BA3c80Adee05D98F0B55b666Be6829d6'

async function main() {
  const originalProvider = ethers.provider
  const orignalSigner = originalProvider.getSigner()
  const network = await originalProvider.getNetwork()

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    bundlerUrl: 'https://eip4337-bundler-goerli.protonapp.io/rpc',
    chainId: network.chainId,
  }

  console.log("chainid", network.chainId)

  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** THis is where we create our custom Wallet */

  const MyWalletDeployer__factory = await ethers.getContractFactory('SemaphoreWalletDeployer', orignalSigner)

  const MyWalletDeployer = await MyWalletDeployer__factory.deploy()


  // const MyWalletDeployer = await hre.ethers.getContractFactory("MyWalletDeployer");
  // const myWalletDeployer = await MyWalletDeployer.deploy();

  await MyWalletDeployer.deployed();
  // console.log("tx",gameItem )
  console.log(
    `Deployed to ${MyWalletDeployer.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

