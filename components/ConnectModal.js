import dynamic from "next/dynamic"
import { Dialog } from "@headlessui/react"

import { useState, useEffect } from "react"
// import QrReader from "react-qr-reader"
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false })

import { Blob } from 'buffer'



const ConnectModal = ({
    connectModalIsOpen,
    closeConnectModal,
}) => {

    const [isOpen,setIsOpen] = useState(false)
    const [isConnected,setIsConnect] = useState(false)

    const handleConnectSemaphore = () => {
        console.log(isOpen)
        setIsOpen(true)
    }


    const handleScan = async (scanData) => {
        // setLoadingScan(true)
        try {
            if (scanData && scanData !== "") {
                const scanDataCode = scanData.slice(-8)
                console.log(`loaded >>>`, scanDataCode)
                setData(scanDataCode)
                window.localStorage.setItem("identity", scanDataCode)
                setIsConnect(true)
                setIsOpen(false)
                closeConnectModal()
            }
        } catch {
            console.log("error")
        }
    }
    const handleError = (err) => {
        console.error(err)
    }

    useEffect(() =>{
       const id =  window.localStorage.getItem("identity")
       if(id !== ""){
         setIsConnect(true)
       }
    })

    return (
        <Dialog
            open={connectModalIsOpen}
            onClose={closeConnectModal}
            className="relative z-50 rounded-xl"
        >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
                {/* Container to center the panel */}
                <div className="flex min-h-full items-center justify-center p-4">
                    {/* The actual dialog panel  */}
                    <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
                        <Dialog.Title className="border-b-2 p-6 text-center font-semibold text-xl tracking-tighter bg-slate-100">
                            Connect
                        </Dialog.Title>
                        <div className="flex items-center justify-center flex-col mb-5">
                            {isOpen ?  <QrReader
                                    // facingMode={"environment"}
                                    // delay={1000}
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ width: "300px" }}
                                /> :                         <div className="p-8">
                         <button className="border-2 border-gray-700 rounded-md p-3" onClick={handleConnectSemaphore}>Semaphore Id</button>
                        </div> }
                              
                            </div>


                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}

export default ConnectModal
