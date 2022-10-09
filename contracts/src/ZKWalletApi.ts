import { BigNumber, BigNumberish } from 'ethers'
import { SimpleWalletAPI } from '@account-abstraction/sdk';
import { arrayify, hexConcat } from 'ethers/lib/utils'
import { Signer } from '@ethersproject/abstract-signer'
import { MyWallet, MyWalletDeployer, MyWalletDeployer__factory, MyWallet__factory } from './types'
import { BaseApiParams, BaseWalletAPI } from '@account-abstraction/sdk/dist/src/BaseWalletAPI'
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
// import  Semaphore  from "./utils/Semaphore.json"
const { generateProof } =require("@semaphore-protocol/proof")
const { verifyProof } = require("@semaphore-protocol/proof")
const { packToSolidityProof } = require("@semaphore-protocol/proof");
const ethers = require('ethers')
const { defaultAbiCoder } = ethers.utils



/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the wallet owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if wallet already deployed)
 * @param index nonce value used when creating multiple wallets for the same owner
 */
export interface ZeroKnowledgeWalletApiParams extends BaseApiParams {
  owner: Signer
  factoryAddress?: string
  index?: number
}

/**
 * An implementation of the BaseWalletAPI using the MyWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
 export class ZKWalletApi extends SimpleWalletAPI {

  constructor (baseWalletParams: ZeroKnowledgeWalletApiParams,  readonly userIdentity?: string) {
    super(baseWalletParams)
  }
  
  async signUserOp (userOp: any): Promise<any> {
    const requestId = await this.getRequestId(userOp)


    //1. Connect Identity
    const identity = new Identity("identity")
    const identityCommitment = identity.generateCommitment()

    //2. CreateGroup and Connect with group
    const group = new Group(16)
    group.addMember(identityCommitment)

    //3. Generate Proof


    const externalNullifier = group.root
    const signal = "proposal_1"
    console.log("Identity", identity)

    const fullProof = await generateProof(identity, group, externalNullifier, signal, {
        zkeyFilePath: __dirname + "/utils/semaphore.zkey",
        wasmFilePath: __dirname + "/utils/semaphore.wasm"
    })

    console.log("fullProof",fullProof )
    const { nullifierHash } = fullProof.publicSignals
    const solidityProof = packToSolidityProof(fullProof.proof)
    const signalBytes32 = ethers.utils.formatBytes32String(signal);

    
    const inputs = [group.root,nullifierHash,signalBytes32, externalNullifier ]

    //4. Encode data

    const encodedProof = defaultAbiCoder.encode(['uint[8]', 'uint[4]'], [solidityProof,inputs])
    console.log("inputs",inputs)
    console.log("solidityProof",solidityProof)
    console.log("encodedProof",encodedProof )


    const signature = encodedProof



    return {
      ...userOp,
      signature
    }
  }
}

