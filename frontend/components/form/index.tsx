import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { UserForm, ResultViewType } from '../type';
import { uploadData } from './formapi';
import { useRouter } from 'next/router';
import { sendMultipleRequests } from './utils';
import FormResult from '../form-result';
import { v4 as uuidv4 } from 'uuid';
import FormImageInput from '../form-image-input';
import LoadingSpinner from '../loading-spinner';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import FailedNotifications from '../fail-notifications';

const AddDataForm: React.FC<{
    
}> = ({
    
}) => {
        const [formData, setFormData] = useState<UserForm>({ image: [] })
        const [showLoading, setShowLoading] = useState<boolean>(false)
        const [fail, setFail] = useState<boolean>(false)
        const fileInputRef = useRef<HTMLInputElement>(null);
        const { data: session } = useSession()
        const router = useRouter();
        let timeoutDuration = 7000
        
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

        useEffect(() => {
            let timeout: NodeJS.Timeout;
    
            if (fail) {
                timeout = setTimeout(() => {
                    setFail(false);
                }, timeoutDuration);
            }
    
            return () => {
                clearTimeout(timeout);
            };
        }, [fail]);

        const onSubmit = async (data: UserForm) => {
            if ((session as any).credits <  data.image.length){
                setFail(true)
            }else{
                setShowLoading(true)
                const sendFormData = [...data.image]
                setFormData({ image: [] })

                const filenameList = await sendMultipleRequests(sendFormData)
                
                await uploadData(filenameList as string[])
                setShowLoading(false)
            
                router.push('/result');
                //reset()
            }
            
        };

        return (
            <>
                {fail && <FailedNotifications firstMessage={"Error"} secondMessage={`Number of Credits is not enough, you only have ${(session as any).credits} credits left, but you want to upload ${formData.image.length} images`} timeoutDuration={timeoutDuration} />}
                <div className="mx-auto">
                    <div className='bg-gray-200 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8'>
                        {showLoading ?
                            <LoadingSpinner />
                            :
                            <>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                    {
                                        formData.image.map((item, index) => (
                                            <FormResult imgSrc={URL.createObjectURL(item as File)} fileName={item.name} key={uuidv4()}>
                                                <div key={uuidv4()} className='flex justify-end'>
                                                    <button key={uuidv4()} onClick={() => removeItem(index)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                                        Delete
                                                    </button>
                                                </div>
                                            </FormResult>)
                                        )
                                    }
                                </div>
                                <FormImageInput setFormData={setFormData} formData={formData} fileInputRef={fileInputRef} />

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
                    
                </div>
            </>
        );
    };

export default AddDataForm
