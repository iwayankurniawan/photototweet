import React, { useState, useEffect } from 'react';

const FailedNotifications: React.FC<{
    firstMessage: string
    secondMessage?: string
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
                    <div role="alert" className="fixed top-0 left-0 right-0 border border-gray-100 bg-red-50 p-4 bg-red-100">
                        <div className="flex items-start gap-4">
                            <span className="text-red-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="red"
                                    className="h-6 w-6"
                                >
                                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 8l8 8M8 16l8-8"
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

export default FailedNotifications;


