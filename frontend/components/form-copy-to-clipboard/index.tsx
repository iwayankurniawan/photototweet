import React, { useState, useEffect } from 'react';
import SuccessNotifications from '../alert-notifications';
interface CopyToClipboardButtonProps {
    textToCopy: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);
    let timeoutDuration = 2000

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
            setIsCopied(false);
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isCopied) {
            timeout = setTimeout(() => {
                setIsCopied(false);
            }, timeoutDuration);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isCopied]);

    return (
        <div className="flex items-center">
            <button
                className="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCopyClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
            </button>
            {isCopied && <SuccessNotifications firstMessage={"Text Copied"} secondMessage={"Text copied to the clipboard"} timeoutDuration={timeoutDuration} />}
        </div>
    );
};

export default CopyToClipboardButton;
