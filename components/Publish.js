import { Dialog, Transition } from "@headlessui/react"
import { useState, Fragment, useEffect, useRef } from "react"
const { Web3Storage, File } = require("web3.storage")
const { Blob } = require("@web-std/blob")
// require("dotenv").config()

const Publish = ({
    publishIsOpen,
    closePublishModal,
    handlePhotoChange,
    publishPost,
    setPublishIsOpen
}) => {
    // const videoRef = useRef(null)
    // const photoRef = useRef(null)
    // const [hasPhoto, setHasPhoto] = useState(false)
    // const getVideo = () => {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: { width: 1920, height: 1080 } })
    //         .then((stream) => {
    //             let video = videoRef.current
    //             video.srcObject = stream
    //             video.play()
    //         })
    //         .catch((err) => console.error(err))
    // }
    // const successCallback = (position) => {
    //     console.log(position)
    // }
    // const errorCallback = (error) => {
    //     console.log(error)
    // }
    // const takePhoto = () => {
    //     const width = 414
    //     const height = width / (16 / 9)

    //     let video = videoRef.current
    //     let photo = photoRef.current

    //     photo.width = width
    //     photo.height = height
    //     let ctx = photo.getContext("2d")
    //     ctx.drawImage(video, 0, 0, width, height)
    //     setHasPhoto(true)
    //     var location = navigator.geolocation.getCurrentPosition(
    //         successCallback,
    //         errorCallback
    //     )

    //     var dataURL = photo
    //         .toDataURL("image/jpg")
    //         .replace("image/jpg", "image/camera-react")

    //     return dataURL
    // }
    // useEffect(() => {
    //     getVideo()
    // }, [publishIsOpen, videoRef])

    const onPhotoChange = (event) => {
        const web3StorageApiToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRjMmZGNUI1OTk4MTkwMDc4NTVkMWRGRkQ4MDI5YTExMDk5Q2JBOTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI0NTYyNTkwNjgsIm5hbWUiOiJUQVoifQ.QAR-mcLPEPtmDU4Mod8olwCV_2_T4O5PQU-r-KkRe0A" // process.env.WEB3_STORAGE_API_TOKEN
        const files = event.target.files
        const web3StorageClient = new Web3Storage({
            token: web3StorageApiToken,
            endpoint: new URL("https://api.web3.storage")
        })
        web3StorageClient
            .put(files, { wrapWithDirectory: false })
            .then((dataCid) => {
                const imagelUri = "https://" + dataCid + ".ipfs.dweb.link"
                alert("Uri for serving image: ", imagelUri)
            })
    }

    return (
        <div>
            <Transition appear show={publishIsOpen} as={Fragment}>
                <Dialog as="div" onClose={closePublishModal}>
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
                                    </Dialog.Title>
                                    {/* <div>
                                        <video
                                            poster
                                            ref={videoRef}
                                        ></video>
                                        <button onClick={takePhoto}>
                                            SNAP!
                                        </button>
                                    </div>
                                    <div
                                        className={
                                            "map" + (hasPhoto ? "hasPhoto" : "")
                                        }
                                    >
                                        <canvas ref={photoRef}></canvas>
                                    </div>
                                    <button
                                        onClick={publishPost}
                                        className="flex border-2 p-4"
                                    >
                                        Submit
                                    </button> */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="capture"
                                        onChange={onPhotoChange}
                                    ></input>
                                    <button
                                        type="button"
                                        className="flex border-2 p-4"
                                        onChange={closePublishModal}
                                    >
                                        Cancel
                                    </button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Publish
