import { ethers } from "ethers"
import Head from "next/head"
import Image from "next/image"
// import Link from "next/Link"
import { useState, useEffect, useRef } from "react"
import { Lens } from "../helpers/lens"
import Publish from "../components/Publish"
import { LENS_API_URL, LENS_HUB_ADDR } from "../config/mumbai"
import Logo from "../components/Logo"

export default function Home() {
    const LENS_HUB_ABI = require("../abi/lenshub.json")

    const [posts, setPosts] = useState([])
    const [publishIsOpen, setPublishIsOpen] = useState(false)

    const videoRef = useRef(null)
    const photoRef = useRef(null)

    const [hasPhoto, setHasPhoto] = useState(false)
    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 1920, height: 1080 } })
            .then((stream) => {
                let video = videoRef.current
                video.srcObject = stream
                video.play()
            })
            .catch((err) => console.error(err))
    }

    const successCallback = (position) => {
        console.log(position)
    }

    const errorCallback = (error) => {
        console.log(error)
    }

    const takePhoto = () => {
        const width = 414
        const height = width / (16 / 9)

        let video = videoRef.current
        let photo = photoRef.current

        photo.width = width
        photo.height = height
        let ctx = photo.getContext("2d")
        ctx.drawImage(video, 0, 0, width, height)
        setHasPhoto(true)
        var location = navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback
        )

        var dataURL = photo
            .toDataURL("image/jpg")
            .replace("image/jpg", "image/camera-react")

        return dataURL
    }

    const closePublishModal = () => {
        setPublishIsOpen(false)
    }

    const handlePhotoChange = () => {
        // do something
    }

    useEffect(() => {
        getVideo()
    }, [videoRef])

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

            const postData = {
                profileId: 13329,
                contentURI:
                    "https://lens.infura-ipfs.io/ipfs/https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz",
                collectModule: "0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c",
                collectModuleInitData:
                    "0x0000000000000000000000000000000000000000000000000000000000000001",
                referenceModule: "0x0000000000000000000000000000000000000000",
                referenceModuleInitData: "0x00"
            }

            console.log("POSTING", postData)

            // const tx = await contract.setProfileImageURI(1, "https://abc123")
            //, { gasLimit: 500000 }
            const tx = await contract.post(postData, { gasLimit: 500000 })
            //  const tx = await contract.getHandle(1)
            // const tx = await contract.follow([1], [0x0])
            await tx.wait()
        } catch (err) {
            console.log("Error publishing post:", err)
        }
    }

    return (
        <div className="">
            {window ?             <Publish
                publishIsOpen={publishIsOpen}
                closePublishModal={closePublishModal}
                handlePhotoChange={handlePhotoChange}
                handleSubmitPublish={publishPost}
            /> : null}


            <Head>
                <title>Truth</title>
                <meta name="description" content="Truth App" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css?family=Poppins"
                    rel="stylesheet"
                />
            </Head>

            <main>  
            <div className="flex flex-col r">
            {/* <div className="bg-[url('/bg.jpg')] opacity-30 p-0 m-0 bg-cover bg-no-repeat bg-center bg-fixed h-[900px]"></div> */}

                <div className="z-10 p-3 flex items-center justify-between bg-gray-100">
                
                    <div className="flex">
                        <span className="text-gray-500 font-medium">Truth.</span>{" "}
                        <Logo />
                    </div>

                    <button
                    type="button"
                    className="border-2 rounded-md p-4"
                    onClick={connect}
                >
                    Connect
                </button>

                </div>
                <div className="flex items-center justify-center p-3">
                    <h2 className="flex  font-bold text-lg">
                        Explore
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center p-3 mb-3">
                    <div className="flex flex-col font-bold text-lg w-[400px] h-[480px] bg-gray-300 rounded-xl px-2">
                        <image className="bg-gray-700 h-[70%] w-full relative">Image 1
                            <div className="bg-white opacity-50 absolute bottom-0 w-full h-auto flex flex-col items-center justify-center py-2">
                                <div className="bg-gray-800 rounded-xl text-white px-2">Verified by Truth</div>
                                <div className="flex justify-between w-full px-3">
                                    <div>Location</div>
                                    <div>Date</div>
                                </div>

                            </div>  
                        </image>
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

                    <div className="flex flex-col font-bold text-lg w-[400px] h-[380px] bg-gray-300 rounded-xl px-2">
                        <image className="bg-gray-700 h-[70%] w-full relative">Image 1
                            <div className="bg-white opacity-50 absolute bottom-0 w-full h-[50px] flex items-center justify-center">
                                <div className="bg-white rounded-xl">Verified by Truth</div>
                            </div>  
                        </image>
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


                    <div className="flex flex-col font-bold text-lg w-[400px] h-[380px] bg-gray-300 rounded-xl px-2">
                        <image className="bg-gray-700 h-[70%] w-full relative">Image 1
                            <div className="bg-white opacity-50 absolute bottom-0 w-full h-[50px] flex items-center justify-center">
                                <div className="bg-white rounded-xl">Verified by Truth</div>
                            </div>  
                        </image>
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

   
                </div>

                </div>
{/* 
                <button
                    type="button"
                    className="border-2 p-4"
                    onClick={() => setPublishIsOpen(true)}
                >
                    Publish
                </button> */}
                {/* <h1>Truth</h1> */}
                <div className="flex flex-col items-center justify-center">


                </div>

                <div className="fixed bottom-0 h-[100px] flex items-center justify-between w-full bg-[#324E7B] flex px-3 ">
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 8.15033V15.9668C18 18.1943 16.2091 20 14 20H4C1.79086 20 0 18.1943 0 15.9668V8.15033C0 6.93937 0.539645 5.7925 1.46986 5.02652L6.46986 0.909348C7.9423 -0.303114 10.0577 -0.303117 11.5301 0.909345L16.5301 5.02652C17.4604 5.7925 18 6.93937 18 8.15033ZM12.25 15.25V17.5C12.25 18.0523 11.8023 18.5 11.25 18.5H6.75C6.19772 18.5 5.75 18.0523 5.75 17.5V15.25C5.75 13.4551 7.20507 12 9 12C10.7949 12 12.25 13.4551 12.25 15.25Z" fill="white"/>
                    </svg>

                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.32309 0H9.46595C12.7013 0 15.4133 2.28735 16.1349 5.36434C16.2579 5.88907 16.3231 6.43677 16.3231 7C16.3231 10.866 13.253 14 9.46595 14H5.2847H2.6088C1.34644 14 0.32309 12.9553 0.32309 11.6667V8.16667C0.32309 3.65634 3.90481 0 8.32309 0ZM9.75166 16H6.38123C7.618 17.2372 9.31185 18 11.1802 18H15.3615H18.0374C19.2997 18 20.3231 16.9553 20.3231 15.6667V12.1667C20.3231 10.0939 19.5666 8.20142 18.3201 6.76135C18.3221 6.84065 18.3231 6.9202 18.3231 6.99999C18.3231 11.9706 14.4855 16 9.75166 16Z" fill="white"/>
                    </svg>


                    <p className="bg-white rounded-full w-[81px] h-[81px] flex items-center justify-center">+</p>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 8.15033V15.9668C18 18.1943 16.2091 20 14 20H4C1.79086 20 0 18.1943 0 15.9668V8.15033C0 6.93937 0.539645 5.7925 1.46986 5.02652L6.46986 0.909348C7.9423 -0.303114 10.0577 -0.303117 11.5301 0.909345L16.5301 5.02652C17.4604 5.7925 18 6.93937 18 8.15033ZM12.25 15.25V17.5C12.25 18.0523 11.8023 18.5 11.25 18.5H6.75C6.19772 18.5 5.75 18.0523 5.75 17.5V15.25C5.75 13.4551 7.20507 12 9 12C10.7949 12 12.25 13.4551 12.25 15.25Z" fill="white"/>
                    </svg>

                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.32309 0H9.46595C12.7013 0 15.4133 2.28735 16.1349 5.36434C16.2579 5.88907 16.3231 6.43677 16.3231 7C16.3231 10.866 13.253 14 9.46595 14H5.2847H2.6088C1.34644 14 0.32309 12.9553 0.32309 11.6667V8.16667C0.32309 3.65634 3.90481 0 8.32309 0ZM9.75166 16H6.38123C7.618 17.2372 9.31185 18 11.1802 18H15.3615H18.0374C19.2997 18 20.3231 16.9553 20.3231 15.6667V12.1667C20.3231 10.0939 19.5666 8.20142 18.3201 6.76135C18.3221 6.84065 18.3231 6.9202 18.3231 6.99999C18.3231 11.9706 14.4855 16 9.75166 16Z" fill="white"/>
                    </svg>
                    
                </div>
            </main>

            <footer className="h-[70px]">Powered by Truth</footer>
        </div>
    )
}
