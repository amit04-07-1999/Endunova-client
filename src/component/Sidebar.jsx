import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutGrid } from "react-icons/lu";

const Sidebar = () => {
    return (
        <div className="w-60 bg-card p-4 h-screen">
            <ul className="space-y-2">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center p-2 hover:bg-muted/20 rounded gap-2 ${isActive ? 'bg-purple-500 text-white font-bold text-lg' : 'font-semibold text-base'}`
                        }
                    >
                        <div className="bg-black text-white p-1 rounded-md">
                            <LuLayoutGrid className="size-5" />
                        </div>
                        <span className={isActive => isActive }>Overview</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/people-directory"
                        className={({ isActive }) =>
                            `flex items-center p-2 hover:bg-muted/20 rounded gap-2 ${isActive ? 'bg-purple-500 text-white font-bold text-lg' : 'font-semibold text-base'}`
                        }
                    >
                        <div className="bg-black text-white p-1 rounded-md">
                            <LuLayoutGrid className="size-5" />
                        </div>
                        <span className={isActive => isActive }>People Directory</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
