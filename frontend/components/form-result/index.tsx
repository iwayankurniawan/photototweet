import { ReactNode } from 'react';
import { ResultViewType } from '../type';

const FormResult: React.FC<{
    item: ResultViewType,
    children?: ReactNode
}> = ({
    item, children
}) => {
        return (
            <>
                <div className='px-1 py-4 sm:px-2 lg:px-2'>
                    <div className="w-[22rem] rounded-lg shadow transition hover:shadow-lg flex flex-col">
                        <div className="w-full h-52 overflow-hidden">
                            <img
                                src={URL.createObjectURL(item.file)}
                                alt={item.file.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="bg-white p-1 sm:p-3 h-auto">
                            <div className='pl-2'>
                                <h3 className="font-bold pb-2 line-clamp-2 text-lg text-gray-900">
                                    {item.file.name}
                                </h3>

                                {item.text &&
                                    <div className='overflow-auto'>
                                        <p className="pb-1 pt-1 h-72 text-gray-500 whitespace-pre-wrap">
                                            {item.text}
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
