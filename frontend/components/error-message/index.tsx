import React, { useState, useEffect } from 'react';

const ErrorMessage: React.FC<{

}> = ({

}) => {
        return (
            <>
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="text-center">
                        <h1 className="text-9xl font-black text-gray-200">404</h1>

                        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

                        <p className="mt-4 text-gray-500">You Do Not Have Permission to This Page</p>

                    </div>
                </div>
            </>
        );
    };

export default ErrorMessage;
