import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { UserForm, ResultViewType } from '../type';
import { uploadData, getPresignedUrl } from './formapi';
import { useRouter } from 'next/router';
import { sendMultipleRequests } from './utils';
import FormResult from '../form-result';
import { v4 as uuidv4 } from 'uuid';
import FormImageInput from '../form-image-input';
import LoadingSpinner from '../loading-spinner';
import SectionTitle from "../home/sectionTitle";
import CopyToClipboardButton from '../form-copy-to-clipboard';

const AddDataForm: React.FC<{

}> = ({

}) => {
        const [formData, setFormData] = useState<UserForm>({ image: [] })
        const [result, setResult] = useState<ResultViewType[]>([])
        const [showLoading, setShowLoading] = useState<boolean>(false)
        const fileInputRef = useRef<HTMLInputElement>(null);
        const router = useRouter();


        const removeItem = (indexToRemove: number) => {
            setFormData((prevListUpload: UserForm) => {
                const updatedItems = [...prevListUpload.image.slice(0, indexToRemove), ...prevListUpload.image.slice(indexToRemove + 1)];
                return {
                    ...prevListUpload,
                    image: updatedItems
                };
            });
            // Reset the file input using the ref
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }

        const onSubmit = async (data: UserForm) => {
            setShowLoading(true)
            const sendFormData = [...data.image]
            setFormData({ image: [] })
        
            //const presignedUrl = await getPresignedUrl()
            const filenameList = await sendMultipleRequests(sendFormData)
            
            const promises = filenameList?.map((item_name: string) => uploadData(item_name));
            if (promises) {
                const results = await Promise.all(promises);
                setShowLoading(false)

                const combinedArray: ResultViewType[] = results.map((item) => {
                    const matchingFilename = Array.from(sendFormData).find(filename => item?.filename.includes(filename.name));
                    return {
                        text: item?.text as string,
                        file: matchingFilename as File
                    };
                })

                setResult(combinedArray)
            }
            //router.push('/result');
            //reset()
        };

        return (
            <>
                <div className="mx-auto">
                    <div className='bg-gray-200 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8'>
                        {showLoading ?
                            <LoadingSpinner />
                            :
                            <>
                                <FormImageInput setFormData={setFormData} formData={formData} fileInputRef={fileInputRef} />
                                <div className='flex overflow-x-auto w-full'>
                                    {
                                        formData.image.map((item, index) => (
                                            <FormResult item={{ "file": item }} key={uuidv4()}>
                                                <div key={uuidv4()} className='flex justify-end'>
                                                    <button key={uuidv4()} onClick={() => removeItem(index)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                                        Delete
                                                    </button>
                                                </div>
                                            </FormResult>)
                                        )
                                    }
                                </div>

                                <div className="flex justify-end">
                                    <button disabled={formData.image.length === 0} className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${formData.image.length !== 0 ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={() => onSubmit(formData as UserForm)}>
                                        Submit
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>



                <div className='flex flex-col'>
                    {
                        result.length !== 0 &&
                        <>
                            <SectionTitle pretitle="Step 2" title="Result">
                                Explore the outcome of your image through our advanced content generation process displayed below.
                            </SectionTitle>
                            <div className='flex overflow-x-auto w-full'>
                                {
                                    result.map((item) => 
                                        <FormResult item={item} key={uuidv4()} >
                                            <div key={uuidv4()} className='flex justify-end mt-2'>
                                                <CopyToClipboardButton textToCopy={item.text as string} key={uuidv4()} />
                                            </div>
                                        </FormResult>
                                    )
                                }
                            </div>
                        </>
                    }
                </div>
            </>
        );
    };

export default AddDataForm
