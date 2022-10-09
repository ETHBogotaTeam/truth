import { ethers } from "ethers"
import { useState } from "react"
import { EntryPoint, EntryPoint__factory } from "@account-abstraction/contracts"
import MyWalletDeployer from "../utils/MyWalletDeployer.json"
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient"
import { ERC4337EthersProvider } from "@account-abstraction/sdk"
import { ZKWalletApi } from "../utils/ZKWalletApi"
import { useRouter } from "next/router"


export default function ZkIdentityComponent({ finalUri }) {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter()

    const ENTRYPOINT_ADDR = "0x2167fA17BA3c80Adee05D98F0B55b666Be6829d6"
    const FACTORY_ADDRESS = "0xb2775d7413Af578927Af15dd1303C994465Efbdd"
    const MY_WALLET_ADDRESS = "0x5f2F7f1Afb223c39CB14f5987257B2e4a1BaCc73"
    //Create Random Private Key for the user
    const signer = ethers.Wallet.createRandom()
    const originalProvider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.g.alchemy.com/v2/WHpxlQrzQIGs_uJRT9LIlR6K1M9khXmX"
    )
    const originalSigner = signer.connect(originalProvider)
    const ownerAddress = originalSigner.getAddress()

    const walletDeployerAbi = MyWalletDeployer.abi

    const getAAProvider = async () => {
        const factoryAddress = FACTORY_ADDRESS
        const network = await originalProvider.getNetwork()
        console.log("network", network.chainId)

        const entryPointAddress = ENTRYPOINT_ADDR

        const providerConfig = {
            entryPointAddress,
            bundlerUrl: "https://eip4337-bundler-goerli.protonapp.io/rpc",
            chainId: network.chainId
        }

        const entryPoint = EntryPoint__factory.connect(
            providerConfig.entryPointAddress,
            originalProvider
        )
        console.log("entryPoint", entryPoint)

        // Get SmartContract Wallet Address
        const MyWalletDeployer = new ethers.Contract(
            factoryAddress,
            walletDeployerAbi,
            originalSigner
        )
        console.log("MyWalletDeployer", MyWalletDeployer)

        const SCWalletAddress = await MyWalletDeployer.getDeploymentAddress(
            entryPointAddress,
            ownerAddress,
            0
        )

        console.log("SCWalletAddress", SCWalletAddress)

        const smartWalletAPI = new ZKWalletApi({
            provider: originalProvider,
            entryPointAddress: entryPoint.address,
            walletAddress: MY_WALLET_ADDRESS,
            owner: originalSigner,
            factoryAddress
        })
        console.log(await smartWalletAPI.getNonce())

        console.log("SCWalletAddress", await smartWalletAPI.getWalletAddress())

        const httpRpcClient = new HttpRpcClient(
            providerConfig.bundlerUrl,
            providerConfig.entryPointAddress,
            network.chainId
        )
        const aaProvider = await new ERC4337EthersProvider(
            network.chainId,
            providerConfig,
            originalSigner,
            originalProvider,
            httpRpcClient,
            entryPoint,
            smartWalletAPI
        ).init()
        return aaProvider
    }

    const handleSendTransaction = async () => {
        setIsLoading(true)

        const aaProvider = await getAAProvider()

        const aaSigner = aaProvider.getSigner()

        const trustAddress = "0x8d51d3de7E38c364CB85d342ABb7b39b19Fa50C7"
        const trustAbi = [
            { inputs: [], stateMutability: "nonpayable", type: "constructor" },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "dataUri",
                        type: "string"
                    }
                ],
                name: "MediaPost",
                type: "event"
            },
            {
                inputs: [],
                name: "owner",
                outputs: [
                    { internalType: "address", name: "", type: "address" }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    { internalType: "string", name: "dataUri", type: "string" }
                ],
                name: "postMedia",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ]

        try {
            const trustContract = new ethers.Contract(
                trustAddress,
                trustAbi,
                aaSigner
            )

            const tx = await trustContract.postMedia(finalUri)
            console.log(tx)
            const receipt = await tx.wait()
            console.log(receipt)

            router.push(`/`)


            
        } catch (e) {
            console.log(e)
            // alert("Proof is Invalid")
        }
    }

    return (
        <button
            className="w-full mt-5 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={handleSendTransaction}
        >
            {isLoading ? "Waiting Transaction": "Send Transaction"}
        </button>
    )
}
