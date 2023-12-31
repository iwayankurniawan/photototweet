import React, { useState, useEffect } from 'react';

const SuccessNotifications: React.FC<{
    firstMessage: string
    secondMessage? : string
    timeoutDuration: number
}> = ({
    firstMessage, secondMessage, timeoutDuration
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, timeoutDuration);

        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return (
        <>
            {isVisible && (
                <div role="alert" className="fixed top-0 left-0 right-0 border border-gray-100 bg-white p-4 bg-green-100">
                    <div className="flex items-start gap-4">
                        <span className="text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </span>

                        <div className="flex-1">
                            <strong className="block font-medium text-gray-900"> {firstMessage} </strong>

                            <p className="mt-1 text-sm text-gray-700">{secondMessage}</p>
                        </div>


                    </div>
                </div>)
            }
        </>
    );
};

export default SuccessNotifications;


