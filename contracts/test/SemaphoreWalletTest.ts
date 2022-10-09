import { expect } from 'chai'
import { EntryPoint, EntryPoint__factory } from '@account-abstraction/contracts'
import { ethers } from 'hardhat'
import { HttpRpcClient } from '@account-abstraction/sdk/dist/src/HttpRpcClient'
import { ERC4337EthersProvider } from '@account-abstraction/sdk'
import { MyWalletApi } from '../src'
import { SimpleWalletAPI } from '@account-abstraction/sdk'
import { ZKWalletApi } from '../src/ZKWalletApi'
import GreeterArtifact from './utils/Greeter.json';

const hre = require("hardhat");


/** Contracts deployed on goerli network */
// const GREETER_ADDR = '0x932C1dA6feD0Efa30AAA5358F34bEEB3f6281B3b'
const ENTRYPOINT_ADDR = '0x1b98F08dB8F12392EAE339674e568fe29929bC47'

describe('SemaphoreWalletTest', async function () {
  console.log("1")
  const originalProvider = new ethers.providers.JsonRpcProvider(
    'https://eth-goerli.g.alchemy.com/v2/WHpxlQrzQIGs_uJRT9LIlR6K1M9khXmX'
  );
  console.log(hre.config)
  console.log(hre.network.provider)
  // const originalProvider = ethers.provider
  console.log("2")
  const orignalSigner = originalProvider.getSigner()
  console.log("orignalSigner", orignalSigner)
  // console.log("originalProvider", originalProvider)
  // const network = await originalProvider.getNetwork()
  // console.log("network", network)

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    bundlerUrl: 'https://goerli.eip4337.com/rpc',
    chainId: 5,
  }

  console.log("chainid", 5 )

  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** THis is where we create our custom Wallet */
  console.log("3")
  const MyWalletDeployer__factory = await ethers.getContractFactory('SemaphoreWalletDeployer2', orignalSigner)

  const MyWalletDeployer = await MyWalletDeployer__factory.deploy()
  const factoryAddress = MyWalletDeployer.address
  console.log(MyWalletDeployer.address)

  const ownerAddress = await orignalSigner.getAddress()

  const walletAddress = await MyWalletDeployer.getDeploymentAddress(entryPointAddress, ownerAddress, 0)
  const userIdentity = "test"
  const smartWalletAPI = new ZKWalletApi({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    walletAddress,
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

  // console.log("aaSigner", aaSigner)

  // Connect to Contract and 

  


})
