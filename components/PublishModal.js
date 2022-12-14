import { Dialog } from "@headlessui/react"
import { useState, Fragment, useEffect, useRef } from "react"
// import Map from "./Map.js"
import Map2 from "./map2.js"

const { Web3Storage, File } = require("web3.storage")
const { Blob } = require("@web-std/blob")

const PublishModal = ({
    publishModalIsOpen,
    closePublishModal,
    handlePhotoChange,
    publishPost,
    setPublishIsOpen
}) => {
    const [screen, setScreen] = useState(1)
    const [photoUri, setPhotoUri] = useState("")

    const onPhotoChange = (event) => {
        const web3StorageApiToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRjMmZGNUI1OTk4MTkwMDc4NTVkMWRGRkQ4MDI5YTExMDk5Q2JBOTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI0NTYyNTkwNjgsIm5hbWUiOiJUQVoifQ.QAR-mcLPEPtmDU4Mod8olwCV_2_T4O5PQU-r-KkRe0A" // process.env.WEB3_STORAGE_API_TOKEN
        const file = event.target.files[0]
        const web3StorageClient = new Web3Storage({
            token: web3StorageApiToken,
            endpoint: new URL("https://api.web3.storage")
        })
        web3StorageClient
            .put([file], { wrapWithDirectory: false })
            .then((dataCid) => {
                const imagelUri = "https://" + dataCid + ".ipfs.dweb.link"
                setPhotoUri(imagelUri)
            })
    }

    return (
        <Dialog
            open={publishModalIsOpen}
            onClose={closePublishModal}
            className="relative z-50"
        >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
                {/* Container to center the panel */}
                <div className="flex min-h-full items-center justify-center p-4">
                    {/* The actual dialog panel  */}
                    <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
                        {
                            {
                                1: (
                                    <div>
                                        <Dialog.Title className="border-b-2 p-6 text-center font-semibold text-xl tracking-tighter bg-slate-100">
                                            Publish a Photo
                                        </Dialog.Title>

                                        <div className="p-8">
                                            <div className="mb-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="capture"
                                                    onChange={onPhotoChange}
                                                    className="border-2 p-4"
                                                ></input>
                                            </div>
                                            {photoUri && (
                                                <div className="mb-4 border-2 p-4 text-ellipsis truncate">
                                                    {photoUri}
                                                </div>
                                            )}
                                            <div className="flex justify-end">
                                            {photoUri ?   <button
                                                    type="button"
                                                    className="flex border-2 px-6 py-2 rounded-lg bg-[#324E7B] text-white"
                                                    onClick={() => {
                                                        setScreen(2)
                                                    }}
                                                >
                                                    Next
                                                </button> : null}
                                            </div>
                                        </div>
                                    </div>
                                ),
                                2: (
                                    <div>
                                        <Dialog.Title className="border-b-2 p-6 text-center font-semibold text-xl tracking-tighter bg-slate-100">
                                            Select Your Location
                                        </Dialog.Title>
                                        <div>
                                            <Map2 photoUri={photoUri} />
                                        </div>
                                    </div>
                                )
                            }[screen]
                        }
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}

export default PublishModal
