import { useState, useEffect, ChangeEvent, SetStateAction, RefObject } from 'react';
import { UserForm } from '../type';

const FormImageInput: React.FC<{
    formData: UserForm
    setFormData: React.Dispatch<SetStateAction<UserForm>>
    fileInputRef: RefObject<HTMLInputElement>
}> = ({
    formData, setFormData, fileInputRef
}) => {
        const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files) return;
            const isFileSizeValid = Array.from(event.target.files).every(file => file.size <= 5 * 1024 * 1024);

            if (!isFileSizeValid) {
                alert('Please upload files with a size of up to 5 MB.');
            } else {
                if (event.target.files.length + formData.image.length > 5) {
                    alert('You can upload only up to 5 images.');
                } else {
                    const chosenFiles = Array.prototype.slice.call(event.target.files)
                    const uploaded = formData.image

                    chosenFiles.some((file) => {
                        if (uploaded.findIndex((f: File) => f.name === file.name) === -1) {
                            uploaded.push(file)
                        }
                    })

                    setFormData((prevListUpload: UserForm) => ({
                        ...prevListUpload,
                        image: Array.from(uploaded),
                    }))
                }
            }
        };

        return (
            <>
                <div className="flex items-center justify-center w-full mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">PNG or JPG Format (MAX. 5 Images and each Images MAX 5 MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={(e) => {
                            console.log(e)
                            handleInputChange(e);
                        }} />
                    </label>
                </div>
            </>
        );
    };



export default FormImageInput
