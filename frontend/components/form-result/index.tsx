import { ReactNode } from 'react';
import { ResultViewType } from '../type';

const FormResult: React.FC<{
    imgSrc: string
    fileName: string
    text?: string
    children?: ReactNode
    date?:string
}> = ({
    imgSrc, fileName, text, children, date
}) => {
        return (
            <>
                <div className='px-1 py-4 sm:px-2 lg:px-2'>
                    <div className="w-[22rem] rounded-lg shadow transition hover:shadow-lg flex flex-col">
                        <div className="w-full h-52 overflow-hidden">
                            <img
                                src={imgSrc}
                                alt={fileName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="bg-white p-1 sm:p-3 h-auto">
                            <div className='pl-2'>
                                <h3 className="font-bold line-clamp-1 text-lg text-gray-900">
                                    {fileName}
                                </h3>
                                {
                                    date && <p className='pb-2'><i>{date}</i></p>
                                }
                                

                                {text &&
                                    <div className='overflow-auto'>
                                        <p className="pb-1 pt-1 h-72 text-gray-500 whitespace-pre-wrap">
                                            {text}
                                        </p>
                                    </div>
                                }

                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </>
        );
    };



export default FormResult
