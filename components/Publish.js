import { Dialog, Transition } from "@headlessui/react"
import { useState, Fragment } from "react"

const Publish = ({
    publishIsOpen,
    closePublishModal,
    handlePhotoChange,
    publishPost
}) => {
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
                                    <input
                                        type="file"
                                        onChange="handlePhotoChange"
                                    />
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
        </div>
    )
}

export default Publish
