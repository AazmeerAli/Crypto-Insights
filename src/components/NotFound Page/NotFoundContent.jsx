import React, { useContext } from 'react'
import { CoinContext } from '../../context/CoinContext'
import { FaExclamationCircle, FaHome } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { Link } from 'react-router-dom';

const NotFoundContent = () => {

    const { footerHeight, headerHeight } = useContext(CoinContext)

    return (
        <div
            className='w-full md:w-[90%] lg:w-[70%] max-w-[1000px] flex flex-col items-center justify-center h-full py-14 xs:py-16 sm:py-18 mx-auto'
            style={{ minHeight: `calc(100vh - ${footerHeight + headerHeight + 16}px)` }}
        >
            <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="mb-4">
                  <MdErrorOutline className="text-violet-400 text-8xl xs:text-9xl" />
                  {/* <div className="absolute left-1/2 top-[90px] -translate-x-1/2 text-[48px] font-extrabold text-violet-700 select-none pointer-events-none" style={{letterSpacing:2}}>404</div> */}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {/* <FaExclamationCircle className="h-8 w-8 text-violet-400" /> */}
                  <div className="text-3xl md:text-4xl font-bold text-white mt-2">Oops<span className='text-violet-400'>!</span> Page Not Found</div>
                </div>
                <div className="text-base md:text-lg text-gray-300 mb-8 max-w-[500px] flex flex-col items-center gap-2">
                  <span className="flex items-center gap-1">The page you are looking for might have been removed or had its name changed.</span>
                </div>
                <Link to="/" className="px-4 py-1.5 xs:px-5 rounded bg-violet-400 text-violet-950 font-semibold shadow hover:bg-violet-300 transition flex items-center gap-2">
                  <FaHome className="h-5 w-5" />
                  Back to Home
                </Link>
            </div>
        </div>
    )
}

export default NotFoundContent
