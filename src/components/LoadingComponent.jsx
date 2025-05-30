import React from 'react'

const LoadingComponent = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 mx-auto">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default LoadingComponent
