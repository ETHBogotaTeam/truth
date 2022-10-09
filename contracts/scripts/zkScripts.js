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
const { ZKWalletApi } = require('../src/ZKWalletApi')
const GreeterArtifact =require('./utils/Greeter.json');


const GREETER_ADDR = '0x932C1dA6feD0Efa30AAA5358F34bEEB3f6281B3b'
const ENTRYPOINT_ADDR = '0x2167fA17BA3c80Adee05D98F0B55b666Be6829d6'

async function main() {
  const originalProvider = ethers.provider
  const orignalSigner = originalProvider.getSigner()
  const network = await originalProvider.getNetwork()

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    bundlerUrl: 'https://eip4337-bundler-goerli.protonapp.io/rp',
    chainId: network.chainId,
  }

  console.log("chainid", network.chainId)

  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** THis is where we create our custom Wallet */
  

  const MyWalletDeployer__factory = await ethers.getContractFactory('SemaphoreWalletDeployer2', orignalSigner)

  const MyWalletDeployer = await MyWalletDeployer__factory.deploy()
  await MyWalletDeployer.deployed();
  // console.log("tx",gameItem )
  console.log(
    `Deployed to ${MyWalletDeployer.address}`
  );
  const factoryAddress = MyWalletDeployer.address

  // const factoryAddress = "0xc01A03F4BA95D7a2C78bdb15DaC1318bCb99DeEC"


  const ownerAddress = await orignalSigner.getAddress()
  console.log("ownerAddress",ownerAddress)
  const walletAddress = await MyWalletDeployer.getDeploymentAddress(entryPointAddress, ownerAddress, 0)
  console.log("SCWAddress",walletAddress)

  await orignalSigner.sendTransaction({
    to: walletAddress,
    value: ethers.utils.parseEther('0.015')
  })

  // const walletAddress="0x3339e423A4A6E334BC50492dE52923bE441D6a28"

  const userIdentity = "test"

  const smartWalletAPI = new SimpleWalletAPI({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    // walletAddress,
    owner: orignalSigner,
    factoryAddress,
  })

  console.log("4")

  /** This marks the end of creation of our custom wallet api */

  const httpRpcClient = new HttpRpcClient(providerConfig.bundlerUrl, providerConfig.entryPointAddress, 5)
  console.log("5")

  const aaProvider = await new ERC4337EthersProvider(
    5,
    providerConfig,
    orignalSigner,
    originalProvider,
    httpRpcClient,
    entryPoint,
    smartWalletAPI
  ).init()

  const aaSigner = aaProvider.getSigner()

  // const greeter = new ethers.Contract(
  //   GREETER_ADDR,
  //   GreeterArtifact.abi,
  //   aaSigner
  // );

  // const tx = await greeter.addGreet({
  //   value: ethers.utils.parseEther('0'),
  // });
  // console.log(tx);
  // const receipt = await tx.wait();
  // console.log(receipt);

  // console.log("aaSigner", aaSigner)


  const MySCWWallet = await ethers.getContractFactory('SemaphoreWallet2', orignalSigner)
  // console.log("MySCWWallet",MySCWWallet)

  // const tx = await MySCWWallet.addGreet({
  
  // });
  // console.log(tx);
  // const receipt = await tx.wait();
  // console.log(receipt);


  // const MyWalletDeployer = await hre.ethers.getContractFactory("MyWalletDeployer");
  // const myWalletDeployer = await MyWalletDeployer.deploy();


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

