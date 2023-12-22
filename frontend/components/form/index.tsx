import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { UserForm } from '../type';
import { uploadData, getPresignedUrl } from './formapi';
import { useRouter } from 'next/router';
import { sendMultipleRequests } from './utils';

type resultType = {
    name: string,
    base64: string
}

const AddDataForm: React.FC<{

}> = ({

}) => {
        const [formData, setFormData] = useState<UserForm>({ image: [] })
        const [result, setResult] = useState<any[]>([])
        const [showLoading, setShowLoading] = useState<boolean>(false)
        const router = useRouter();

        let validationSchema = Yup.object().shape({
            image: Yup.mixed<File[]>().required('Image is required').test('fileSize', 'File size is too large', (value: any) => value && value[0].size <= 500000000),
        });

        const {
            register,
            handleSubmit,
            formState: { errors },
            reset
        } = useForm<UserForm>({
            resolver: yupResolver(validationSchema),

        });

        const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files) return;

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
            console.log(formData)
        };

        const removeItem = (indexToRemove: number) => {
            let updatedItems: File[]

            updatedItems = [...formData.image.slice(0, indexToRemove), ...formData.image.slice(indexToRemove + 1)];
            setFormData((prevListUpload) => ({
                ...prevListUpload,
                image: updatedItems,
            }))

        }

        const onSubmit = async (data: UserForm) => {
            setShowLoading(true)
            const sendFormData = [...data.image]
            setFormData({ image: [] })

            //const presignedUrl = await getPresignedUrl()
            const filenameList = await sendMultipleRequests(sendFormData)
            console.log(filenameList)
            const promises = filenameList?.map((item_name: string) => uploadData(item_name));
            if (promises) {
                const results = await Promise.all(promises);
                setShowLoading(false)
                console.log(sendFormData)
                console.log(results)

                const combinedArray = results.map((item) => {
                    const matchingFilename = Array.from(sendFormData).find(filename => item?.filename.includes(filename.name));
                    return {
                        text: item?.text,
                        file: matchingFilename
                    };
                })

                setResult(combinedArray)
            }
            //router.push('/result');
            //reset()
        };

        return (
            <>
                <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-lg">
                        <form onSubmit={handleSubmit(onSubmit)} className='mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8'>
                            <div className="mb-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" multiple className="hidden" {...register('image')} onChange={(e) => {
                                            handleInputChange(e);
                                            register('image').onChange(e); // This is necessary for react-hook-form to capture the changes
                                        }} />
                                    </label>
                                </div>
                                <p className="text-red-500 text-xs italic">{errors.image?.message}</p>
                            </div>

                            <div>

                                {formData.image.map((item, index) => (
                                    <div key={"divupload" + index} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                        <img
                                            src={URL.createObjectURL(formData.image[index])}
                                            alt={formData.image[index].name}
                                            className="max-w-xs max-h-48"
                                        />
                                        <p key={"pupload" + index} style={{ margin: "0px", marginLeft: "4px" }}>{formData.image[index].name}</p>
                                        <button key={"buttonupload" + index} onClick={() => removeItem(index)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {showLoading ? <p>Loading</p> : ""}

                            <div className="flex items-center justify-between">
                                <input className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" type="submit" />
                            </div>
                        </form>

                        {
                            result.length !== 0 &&
                            result.map((item) => (
                                <>
                                    <img
                                        src={URL.createObjectURL(item.file)}
                                        alt={item.file.name}
                                        className="max-w-xs max-h-48"
                                    />
                                    <p>{item.file.name}</p>
                                    <p style={{whiteSpace:"pre-line"}}>{item.text}</p>
                                </>)
                            )
                        }
                    </div>
                </div>
            </>
        );
    };



export default AddDataForm
