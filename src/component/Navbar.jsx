import React from 'react'
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";



const Navbar = () => {
    return (
        <nav className="bg-background flex px-5 justify-between items-center mb-5 border-b">
            <h1 className="text-3xl font-bold text-purple-700 p-3">
                PEOPLE.CO
            </h1>
            <div className="flex items-center space-x-4">
                <button className="p-3">
                    <IoNotificationsOutline className='size-5 text-slate-500'/>
                </button>
                <FaUserCircle className='size-7 text-slate-500'/>
                <span className="font-semibold">Jane Doe</span>
            </div>
        </nav>
    )
}

export default Navbar