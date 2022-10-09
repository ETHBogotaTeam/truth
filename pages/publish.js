import { Dialog, Transition } from "@headlessui/react"
import { useState, Fragment, useEffect, useRef } from "react"
const { Web3Storage, File } = require("web3.storage")
const { Blob } = require("@web-std/blob")

export default function Publish() {
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
                alert("Uri for serving image: " + imagelUri)
            })
    }

    return (
        <div className="flex justify-center">
            <input
                type="file"
                accept="image/*"
                capture="capture"
                onChange={onPhotoChange}
            ></input>
            <button
                type="button"
                className="flex border-2 px-6 py-2 rounded-lg bg-[#324E7B]"
                onChange=""
            >
                Next
            </button>
        </div>
    )
}
