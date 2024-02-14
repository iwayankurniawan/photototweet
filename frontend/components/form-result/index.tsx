import { ReactNode, useState } from 'react';
import { ResultViewType } from '../type';

const FormResult: React.FC<{
    imgSrc: string
    fileName: string
    text?: string
    children?: ReactNode
    date?: string
}> = ({
    imgSrc, fileName, text, children, date
}) => {
    const [showMore, setShowMore] = useState<boolean>(false)
        return (
            <>
                <div className="rounded-lg shadow transition hover:shadow-lg flex flex-col">
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
                                    <p className={`line-clamp-${showMore ? "none":"5"} sm:line-clamp-none sm:h-72 pb-1 pt-1  text-gray-500 whitespace-pre-wrap`}>
                                        {text}
                                    </p>
                                    <button onClick={()=>setShowMore(!showMore)} className='flex sm:hidden underline underline-offset-4'>{showMore ? "Show Less":"Show More"}</button>
                                </div>
                            }

                        </div>
                        {children}
                    </div>
                </div>

            </>
        );
    };



export default FormResult
