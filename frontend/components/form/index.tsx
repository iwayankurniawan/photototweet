import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface UserForm {
    image: FileList;
}

const AddDataForm: React.FC<{

}> = ({

}) => {
        const [formData, setFormData] = useState<UserForm>()

        let validationSchema = Yup.object().shape({
            image: Yup.mixed<FileList>().required('Image is required').test('fileSize', 'File size is too large', (value: any) => value && value[0].size <= 500000000),
        });

        const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<UserForm>({
            resolver: yupResolver(validationSchema),
            
        });

        const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
            // You can perform additional actions on input change if needed
            console.log(e.target)
            console.log('Input changed:', e.target.files);
            setFormData((previous_element) =>({
                ...previous_element, {"image": e.target.files} 
            }))
        };

        const onSubmit = (data: UserForm) => {
            console.log(data)
            setFormData(data)
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

                            </div>

                            <div className="flex items-center justify-between">
                                <input className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    };



export default AddDataForm