import { ethers } from "ethers"
import Head from "next/head"
import Image from "next/image"
// import Link from "next/Link"
import { useState, useEffect, useRef } from "react"
import { Lens } from "../helpers/lens"
import Publish from "../components/Publish"
import PublishModal from "../components/PublishModal"
import ConnectModal from "../components/ConnectModal"
import { LENS_API_URL, LENS_HUB_ADDR } from "../config/mumbai"
import Logo from "../components/Logo"
import { getMediaPosts } from "../helpers/subgraph"

export default function Home() {
    const LENS_HUB_ABI = require("../abi/lenshub.json")

    const [posts, setPosts] = useState([])
    const [publishModalIsOpen, setPublishModalIsOpen] = useState(false)
    const [connectModalIsOpen, setConnectModalIsOpen] = useState(false)
    const [isConnected, setIsConnect] = useState(false)
    const [connectedWallet, setConnectedWallet] = useState("")

    const closePublishModal = () => {
        setPublishModalIsOpen(false)
    }
    const closeConnectModal = () => {
        setConnectModalIsOpen(false)
    }

    const handlePhotoChange = () => {
        // do something
    }

    useEffect(() => {
        fetchPosts()
        const id = window.localStorage.getItem("semaphoreIdentity")
        console.log("id", id)
        if (id !== null) {
            setIsConnect(true)
            setConnectedWallet(id)
        }
    }, [])

    const fetchPosts = async () => {
        try {
            const posts = await getMediaPosts()
            console.log("POST DATA: ", posts)
            setPosts(posts)
        } catch (err) {
            console.log("Error fetching post data: ", err)
        }
    }

    async function connect() {
        setConnectModalIsOpen(true)
    }

    const publishPost = async () => {}

    return (
        <div className="">
            <Head>
                <title>Truth</title>
                <meta name="description" content="Truth App" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css?family=Poppins"
                    rel="stylesheet"
                />
            </Head>

            <main className="h-full min-h-screen relative overflow-hidden flex flex-col">
                <div className="flex justify-center">
                    {/* <Publish
                        publishModalIsOpen={publishModalIsOpen}
                        closePublishModal={closePublishModal}
                        handlePhotoChange={handlePhotoChange}
                        handleSubmitPublish={publishPost}
                    /> */}
                </div>
                <div className="flex flex-col r">
                    {/* <div className="bg-[url('/bg.jpg')] opacity-30 p-0 m-0 bg-cover bg-no-repeat bg-center bg-fixed h-[900px]"></div> */}

                    <div className="z-10 p-3 flex items-center justify-between bg-gray-100">
                        <div className="flex">
                            <span className="text-gray-500 font-medium">
                                Truth.
                            </span>{" "}
                            <Logo />
                        </div>
                        {isConnected ? (
                            <button
                                type="button"
                                className="border-2 rounded-xl p-3"
                            >
                                Connected
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="border-2 rounded-xl p-3"
                                onClick={connect}
                            >
                                Connect
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-center p-3">
                        <h2 className="flex  font-bold text-lg">Explore</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 mb-3">
                        {posts.map((post) => {
                            const obj = JSON.parse(post.dataUri)
                            return (
                                <div className="flex flex-col font-bold text-lg w-[400px] h-[480px] bg-gray-300 rounded-xl px-2">
                                    <div className="bg-gray-700 h-[70%] w-full relative">
                                        <img src={obj.photoUri} />
                                        <div className="bg-white opacity-50 absolute bottom-0 w-full h-auto flex flex-col items-center justify-center py-2">
                                            <div className="bg-gray-800 rounded-xl text-white px-2">
                                                Verified by Truth
                                            </div>
                                            <div className="flex justify-between w-full px-3">
                                                <div>
                                                    Location
                                                    <p className="text-xs">
                                                        Min Lat {obj.lat1}
                                                    </p>
                                                </div>
                                                <div>Date</div>
                                                <p className="text-xs">
                                                    Timestamp {obj.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[30%] flex items-center justify-between px-5">
                                        <div className="bg-gray-500 h-[70%] w-[30%] rounded-md">
                                            Extra 1
                                        </div>
                                        <div className="bg-gray-500 h-[70%] w-[30%] rounded-md">
                                            Extra 1
                                        </div>
                                        <div className="bg-gray-500 h-[70%] w-[30%] rounded-md">
                                            Extra 1
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <PublishModal
                    publishModalIsOpen={publishModalIsOpen}
                    closePublishModal={closePublishModal}
                    handlePhotoChange={handlePhotoChange}
                    handleSubmitPublish={publishPost}
                />
                <ConnectModal
                    connectModalIsOpen={connectModalIsOpen}
                    closeConnectModal={closeConnectModal}
                />

                {/* 
                <button
                    type="button"
                    className="border-2 p-4"
                    onClick={() => setPublishIsOpen(true)}
                >
                    Publish
                </button> */}
                {/* <h1>Truth</h1> */}
                <div className="flex flex-col items-center justify-center"></div>

                <div className="fixed bottom-0 h-[100px] flex items-center justify-between w-full bg-[#324E7B] flex px-3 ">
                    <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18 8.15033V15.9668C18 18.1943 16.2091 20 14 20H4C1.79086 20 0 18.1943 0 15.9668V8.15033C0 6.93937 0.539645 5.7925 1.46986 5.02652L6.46986 0.909348C7.9423 -0.303114 10.0577 -0.303117 11.5301 0.909345L16.5301 5.02652C17.4604 5.7925 18 6.93937 18 8.15033ZM12.25 15.25V17.5C12.25 18.0523 11.8023 18.5 11.25 18.5H6.75C6.19772 18.5 5.75 18.0523 5.75 17.5V15.25C5.75 13.4551 7.20507 12 9 12C10.7949 12 12.25 13.4551 12.25 15.25Z"
                            fill="white"
                        />
                    </svg>

                    <svg
                        width="21"
                        height="18"
                        viewBox="0 0 21 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.32309 0H9.46595C12.7013 0 15.4133 2.28735 16.1349 5.36434C16.2579 5.88907 16.3231 6.43677 16.3231 7C16.3231 10.866 13.253 14 9.46595 14H5.2847H2.6088C1.34644 14 0.32309 12.9553 0.32309 11.6667V8.16667C0.32309 3.65634 3.90481 0 8.32309 0ZM9.75166 16H6.38123C7.618 17.2372 9.31185 18 11.1802 18H15.3615H18.0374C19.2997 18 20.3231 16.9553 20.3231 15.6667V12.1667C20.3231 10.0939 19.5666 8.20142 18.3201 6.76135C18.3221 6.84065 18.3231 6.9202 18.3231 6.99999C18.3231 11.9706 14.4855 16 9.75166 16Z"
                            fill="white"
                        />
                    </svg>

                    <button
                        className="bg-white rounded-full w-[81px] h-[81px] flex items-center justify-center pb-2 text-5xl"
                        onClick={() => setPublishModalIsOpen(true)}
                    >
                        +
                    </button>
                    <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18 8.15033V15.9668C18 18.1943 16.2091 20 14 20H4C1.79086 20 0 18.1943 0 15.9668V8.15033C0 6.93937 0.539645 5.7925 1.46986 5.02652L6.46986 0.909348C7.9423 -0.303114 10.0577 -0.303117 11.5301 0.909345L16.5301 5.02652C17.4604 5.7925 18 6.93937 18 8.15033ZM12.25 15.25V17.5C12.25 18.0523 11.8023 18.5 11.25 18.5H6.75C6.19772 18.5 5.75 18.0523 5.75 17.5V15.25C5.75 13.4551 7.20507 12 9 12C10.7949 12 12.25 13.4551 12.25 15.25Z"
                            fill="white"
                        />
                    </svg>

                    <svg
                        width="21"
                        height="18"
                        viewBox="0 0 21 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.32309 0H9.46595C12.7013 0 15.4133 2.28735 16.1349 5.36434C16.2579 5.88907 16.3231 6.43677 16.3231 7C16.3231 10.866 13.253 14 9.46595 14H5.2847H2.6088C1.34644 14 0.32309 12.9553 0.32309 11.6667V8.16667C0.32309 3.65634 3.90481 0 8.32309 0ZM9.75166 16H6.38123C7.618 17.2372 9.31185 18 11.1802 18H15.3615H18.0374C19.2997 18 20.3231 16.9553 20.3231 15.6667V12.1667C20.3231 10.0939 19.5666 8.20142 18.3201 6.76135C18.3221 6.84065 18.3231 6.9202 18.3231 6.99999C18.3231 11.9706 14.4855 16 9.75166 16Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </main>

            <footer className="h-[70px]">Powered by Truth</footer>
        </div>
    )
}
