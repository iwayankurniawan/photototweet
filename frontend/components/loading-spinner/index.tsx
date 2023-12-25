const LoadingSpinner: React.FC<{
    
}> = ({
    
}) => {
        return (
            <>
                <div className="flex justify-center items-center mt-4">
                    <div className="loader ease-linear rounded-full border-t-4 border-gray-500 border-solid h-12 w-12 animate-spin"></div>
                </div>
            </>
        );
    };


export default LoadingSpinner
