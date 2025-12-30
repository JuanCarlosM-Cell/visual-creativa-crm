import React from 'react';

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-dark-700 border-t-red-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">{message}</p>
        </div>
    );
};

export default Loading;
