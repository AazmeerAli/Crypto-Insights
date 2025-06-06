import React from 'react'
import Navbar from '../Main/Navbar'
import Footer from '../Main/Footer'
import NotFoundContent from './NotFoundContent'

const NotFound = () => {
    return (
        <div className='w-full min-h-screen flex flex-col bg-gradient-to-b from-violet-950 via-indigo-950 to-cyan-950 px-6 xs:px-8 md:px-10 lg:px-14'>
            <Navbar />
            <NotFoundContent />
            <Footer />
        </div>
    )
}

export default NotFound
