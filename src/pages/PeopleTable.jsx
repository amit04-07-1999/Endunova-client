import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMemberModal from '../component/AddMemberModal';
import { CiFilter } from 'react-icons/ci';
import { IoSearchOutline } from 'react-icons/io5';
import { MdClose, MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { FaUserCircle } from "react-icons/fa";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';

// FilterDropdown Component
const FilterDropdown = ({ isOpen, toggle, onSelect, selectedRoles, onRoleChange }) => (
    <div className={`absolute right-0 mt-60 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 ${!isOpen ? 'hidden' : ''}`}>
        <div className="flex justify-between items-center px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-700">Roles</h3>
            <button
                className="text-gray-500 hover:text-gray-700"
                onClick={toggle}
            >
                <MdClose />
            </button>
        </div>
        <div className="px-4 py-2">
            {['Product Designer', 'Product Manager', 'Frontend Developer', 'Backend Developer'].map((role) => (
                <label key={role} className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => onRoleChange(role)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{role}</span>
                </label>
            ))}
        </div>
        <button className="bg-purple-600 text-white rounded hover:bg-purple-700 px-4 py-2 ml-3 mb-3" onClick={onSelect}>
            SELECT
        </button>
    </div>
);

//Off-Canvas Component
const OffCanvas = ({ isOpen, onClose, person }) => (
    <div className={`fixed inset-0 z-30 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="absolute right-0 bg-white mt-16 rounded border border-solid " style={{ width: "45rem" }}>

            {person && (
                <div className="">
                    <div className="flex justify-between items-center mb-4 bg-cyan-600 text-white p-5 rounded-md">
                        <div className="flex gap-6">
                            <FaUserCircle className="size-24 rounded-full mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{person.firstName}</h2>
                                <p className="text-muted-foreground">@olivia</p>
                                <p className="text-muted-foreground">{person.role}r</p>
                                <p className="text-muted-foreground">User ID: Role</p>
                            </div>
                        </div>
                        <button className="text-right" onClick={onClose} style={{ marginTop: "-5rem" }}>
                            <MdClose className="text-2xl" />
                        </button>
                    </div>
                    <div className=''>
                        <h3 className="text-lg font-semibold bg-sky-100 px-5 mb-2">Personal Information</h3>
                        <div className='px-5'>
                            <table className="w-full">
                                <tbody>
                                    <tr className=''>
                                        <td className="">
                                            <span className="">Date of Birth</span>
                                        </td>
                                        <td className="text-gray-500">29-04-2005</td>
                                    </tr>
                                    <tr>
                                        <td className="">
                                            <span className="">Gender</span>
                                        </td>
                                        <td className="text-gray-500">Male</td>
                                    </tr>
                                    <tr>
                                        <td className="">
                                            <span className="">Nationality</span>
                                        </td>
                                        <td className="text-gray-500">Indian</td>
                                    </tr>
                                    <tr>
                                        <td className="">
                                            <span className="">Contact no.</span>
                                        </td>
                                        <td className="text-gray-500">1234567890</td>
                                    </tr>
                                    <tr>
                                        <td className="">
                                            <span className="">E-mail Address</span>
                                        </td>
                                        <td className="text-gray-500">{person.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="">
                                            <span className="">Work email Address</span>
                                        </td>
                                        <td className="text-gray-500">{person.email}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <h3 className="text-lg font-semibold bg-sky-100 px-5 mt-4 mb-3">Research & Publication</h3>
                        <div className=" px-5">
                            <p className="font-bold mb-2">AI and User Experience: The Future of Design</p>
                            <p className=" text-gray-700 mb-2">Published in the Journal of Modern Design • 2022</p>
                            <p className="">AI, IoT based real time condition monitoring of Electrical Machines using Python<br /> language Abstract: Maintaining induction motors in good working order before they <br />fail benefits small<span className="text-orange-500"> See More...</span>
                            </p>
                            <button className="text-orange-500 p-5">↗ See Publication</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const PeopleTable = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPerson, setCurrentPerson] = useState("");
    const [people, setPeople] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [personToDelete, setPersonToDelete] = useState("");
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/personDetails`);
            setPeople(response.data);
        } catch (error) {
            console.error('Error fetching people:', error);
        }
    };

    const handleSearch = async (query) => {
        try {
            const newUrl = `${window.location.origin}/people?query=${encodeURIComponent(query)}`;
            window.history.pushState({ path: newUrl }, '', newUrl);

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/search`, {
                params: {
                    name: query,
                    role: query,
                    email: query,
                },
            });
            setPeople(response.data);
        } catch (error) {
            console.error('Error searching people:', error);
        }
    };


    const handleSavePerson = async (person, id) => {
        try {
            if (id) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/api/personDetails/${id}`, person);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/api/personDetails`, person);
            }
            fetchPeople();
            window.location.reload();
        } catch (error) {
            console.error('Error saving person:', error);
        }
    };

    const confirmDelete = (id) => {
        setPersonToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!personToDelete) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/personDetails/${personToDelete}`);
            fetchPeople();
            setIsDeleteModalOpen(false); 
            setPersonToDelete(null);
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };


    const handleEdit = (person) => {
        setCurrentPerson(person);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleRowClick = (person) => {
        const newUrl = `${window.location.origin}/people?query=${encodeURIComponent(person.firstName)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        setCurrentPerson(person);
        setIsOffCanvasOpen(true);
    };

    const handleRoleChange = (role) => {
        setSelectedRoles(prevSelectedRoles =>
            prevSelectedRoles.includes(role)
                ? prevSelectedRoles.filter(r => r !== role)
                : [...prevSelectedRoles, role]
        );
    };

    const handleSelectFilters = () => {
        if (selectedRoles.length === 0) {
            fetchPeople();
        } else {
            const filteredPeople = people.filter(person => selectedRoles.includes(person.role));
            setPeople(filteredPeople);
        }
        setIsFilterOpen(false);
    };


    const columns = [
        { accessorKey: 'firstName', header: 'Name' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'role', header: 'Role' },
        { accessorKey: 'email', header: 'Email' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <button
                        onClick={() => confirmDelete(row.original._id)}
                        className="mr-2 text-red-600 hover:text-red-800"
                    >
                        <MdDelete className="size-5" />
                    </button>
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <FaEdit className="size-4" />
                    </button>
                </div>
            ),
        }

    ];

    const table = useReactTable({
        data: people,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="border-2 border-gray-200 rounded-md max-w-full">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold">Team Members</h2>
                    <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{people.length}</span>
                </div>
                <div className="flex items-center space-x-2 relative">
                    <div className="flex items-center space-x-2 shadow border border-gray-300 px-4 py-1.5">
                        <input
                            type="text"
                            placeholder="Search Member Name"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="focus:outline-none"
                        />
                        <IoSearchOutline />
                    </div>
                    <button
                        className="bg-secondary text-secondary-foreground p-2 rounded-lg"
                        onClick={() => setIsFilterOpen(prev => !prev)}
                    >
                        <CiFilter className="size-6" />
                    </button>
                    <FilterDropdown
                        isOpen={isFilterOpen}
                        toggle={() => setIsFilterOpen(prev => !prev)}
                        onSelect={handleSelectFilters}
                        selectedRoles={selectedRoles}
                        onRoleChange={handleRoleChange}
                    />
                    <button
                        className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                        onClick={() => {
                            setCurrentPerson(null);
                            setIsEditMode(false);
                            setIsModalOpen(true);
                        }}
                    >
                        + ADD MEMBER
                    </button>
                </div>
            </div>

            <div className="flex justify-center">
                <table className="border-collapse border border-gray-200 w-full">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className="border-b text-gray-800 uppercase"
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 font-medium text-left"
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b cursor-pointer">
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-2"
                                        onClick={cell.column.id === 'firstName' ? () => handleRowClick(row.original) : undefined}
                                    >
                                        {cell.column.id === 'firstName' && (
                                            <>
                                                <FaUserCircle className="inline-block mr-2 text-slate-500 size-7" />
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </>
                                        )}
                                        {cell.column.id === 'status' && (
                                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-0.5 rounded-full">● Active</span>

                                        )}
                                        {cell.column.id !== 'firstName' && cell.column.id !== 'status' && (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            {/* OffCanvas Component */}
            <OffCanvas
                isOpen={isOffCanvasOpen}
                onClose={() => setIsOffCanvasOpen(false)}
                person={currentPerson}
            />

            {/* Delete Component */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Delete Member Details</h2>
                            <button
                                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                onClick={() => setIsDeleteModalOpen(false)} // Close modal on close button click
                            >
                                <MdClose className="size-6" />
                            </button>
                        </div>
                        <p className="mt-4 text-gray-500">Are you sure you want to delete this member's details? This action cannot be <br /> undone.</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-purple-600 text-white px-5 py-2 rounded"
                                onClick={handleDelete}
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add or edit Component */}
            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePerson}
                person={currentPerson}
                isEditMode={isEditMode}
            />
        </div>
    );
};

export default PeopleTable;
