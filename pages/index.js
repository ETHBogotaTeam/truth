import { ethers } from "ethers"
import Head from "next/head"
import Image from "next/image"
import Link from "next/Link"
import { useState, useEffect, Fragment } from "react"
import { Lens } from "../helpers/lens"
import { LENS_API_URL, LENS_HUB_ADDR } from "../config/mumbai"
import { Dialog, Transition } from "@headlessui/react"

export default function Home() {
    const LENS_HUB_ABI = require("../abi/lenshub.json")

    const [posts, setPosts] = useState([])
    const [publishIsOpen, setPublishIsOpen] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        const lens = new Lens(LENS_API_URL)

        try {
            const posts = await lens.getPosts()
            console.log("POST DATA: ", posts)
            setPosts(posts)
        } catch (err) {
            console.log("Error fetching post data: ", err)
        }
    }

    async function connect() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
    }

    async function publishPost() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(
            LENS_HUB_ADDR,
            LENS_HUB_ABI,
            signer
        )

        try {
            // 13329,
            // "https://lens.infura-ipfs.io/ipfs/QmY9dUwYu67puaWBMxRKW98LPbXCznPwHUbhX5NeWnCJbX",
            // "0x23b9467334bEb345aAa6fd1545538F3d54436e96",
            // "0x0000000000000000000000000000000000000000000000000000000000000001",
            // "0x0000000000000000000000000000000000000000",
            // "0x00"

            // const postData = {
            //     profileId: 1,
            //     contentURI:
            //         "https://lens.infura-ipfs.io/ipfs/QmY9dUwYu67puaWBMxRKW98LPbXCznPwHUbhX5NeWnCJbX",
            //     collectModule: "0x23b9467334bEb345aAa6fd1545538F3d54436e96",
            //     collectModuleInitData: ethers.utils.defaultAbiCoder.encode(
            //         ["bool"],
            //         [true]
            //     ),
            //     referenceModule: "0x0000000000000000000000000000000000000000",
            //     referenceModuleInitData: []
            // }
            // const postData = {
            //     profileId: 1,
            //     imageURI: "https://abc123"
            // }

            const postData = {
                profileId: 2,
                contentURI:
                    "https://lens.infura-ipfs.io/ipfs/QmY9dUwYu67puaWBMxRKW98LPbXCznPwHUbhX5NeWnCJbX",
                collectModule: "0x23b9467334bEb345aAa6fd1545538F3d54436e96",
                collectModuleInitData: ethers.utils.defaultAbiCoder.encode(
                    ["bool"],
                    [true]
                ),
                referenceModule: "0x0000000000000000000000000000000000000000",
                referenceModuleInitData: []
            }

            console.log("POSTING", postData)

            // const tx = await contract.setProfileImageURI(1, "https://abc123")
            const tx = await contract.post(postData)
            //  const tx = await contract.getHandle(1)
            // const tx = await contract.follow([1], [0x0])
            await tx.wait()
        } catch (err) {
            console.log("Error publishing post:", err)
        }
    }

    return (
        <div>
            <Transition appear show={publishIsOpen} as={Fragment}>
                <Dialog as="div" onClose={() => setPublishIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 flex items-center justify-center p-4" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-10/12 max-w-md transform overflow-hidden rounded-lg border-blue-500 border-2 bg-white shadow-xl transition-all">
                                    <Dialog.Title as="div">
                                        Publish Photo
                                        <button
                                            type="button"
                                            className="flex border-2 p-4"
                                            onClick={() =>
                                                setPublishIsOpen(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </Dialog.Title>
                                    <p>Publish a photo</p>
                                    <textarea cols="40" className="border-2" />
                                    <button
                                        onClick={publishPost}
                                        className="flex border-2 p-4"
                                    >
                                        Submit
                                    </button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Head>
                <title>Truth</title>
                <meta name="description" content="Truth App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <button
                    type="button"
                    className="border-2 p-4"
                    onClick={connect}
                >
                    Connect
                </button>
                <button
                    type="button"
                    className="border-2 p-4"
                    onClick={() => setPublishIsOpen(true)}
                >
                    Publish
                </button>
                <h1>Truth</h1>
                {posts.map((post, index) => (
                    <Link
                        href={`/profile/${
                            post.profile.id || post.profile.profileId
                        }`}
                        key={index}
                    >
                        <a>
                            <div>
                                {/* <p>{typeMap[post.__typename]}</p> */}
                                <div>
                                    {post.profile.picture &&
                                    post.profile.picture.original ? (
                                        <img
                                            src={
                                                post.profile.picture.original
                                                    .url
                                            }
                                        />
                                    ) : (
                                        <div />
                                    )}

                                    <div>
                                        <h3>{post.profile.name}</h3>
                                        <p>{post.profile.handle}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{post.metadata.content}</p>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </main>

            <footer>Powered by Truth</footer>
        </div>
    )
}