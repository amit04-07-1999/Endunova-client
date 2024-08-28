import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdClose } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import { IoReload } from "react-icons/io5";



Modal.setAppElement('#root');

const schema = z.object({
    firstName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
});

const AddMemberModal = ({ isOpen, onClose, onSave, person, isEditMode }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: '',
            email: '',
            role: '',
        },
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (person) {
            setValue('firstName', person.firstName || '');
            setValue('email', person.email || '');
            setValue('role', person.role || '');
        } else {
            reset();
        }
    }, [person, setValue, reset]);

    const onSubmit = (data) => {
        onSave(data, person ? person._id : null);
        onClose();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
        }
    };

    const openFileManager = () => {
        fileInputRef.current.click();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={isEditMode ? "Edit Member" : "Add Member"}
            className="fixed inset-0 flex items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-card" style={{width:"50rem"}}>
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-foreground">{isEditMode ? 'Edit Profile' : 'Add New Member'}</h2>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <MdClose className="size-5"/>
                    </button>
                </div>
                <div className="flex justify-center mt-5">
                    <FaUserCircle className="size-40" />
                </div>
                <div className="flex items-center mt-4">
                    <div className="flex justify-evenly w-full">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className="bg-gray-300 text-xl px-7 py-3 rounded"
                            onClick={openFileManager}
                        >
                            ⟲ Change Photo
                        </button>
                        <button className="bg-red-200 text-xl px-7 py-3 rounded">🗑 Remove Photo</button>
                    </div>
                </div>
                <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-zinc-700 dark:text-muted-foreground">Name</label>
                        <input
                            type="text"
                            placeholder="Member's Name"
                            className="mt-1 block w-full border border-zinc-300 rounded p-2.5"
                            {...register('firstName')}
                        />
                        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-zinc-700 dark:text-muted-foreground">Email</label>
                        <input
                            type="email"
                            placeholder="Member's Email"
                            className="mt-1 block w-full border border-zinc-300 rounded p-2.5"
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-zinc-700 dark:text-muted-foreground">Role</label>
                        <select
                            className="mt-1 block w-full border border-zinc-300 rounded p-2.5"
                            {...register('role')}
                        >
                            <option value="">Select a role</option>
                            <option value="Product Designer">Product Designer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                        </select>
                        {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
                    </div>
                    <div className="flex justify-end mt-6 gap-6">
                        <button
                            type="button"
                            className="bg-zinc-300 text-zinc-800 hover:bg-zinc-400 px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-300 hover:bg-blue-400 px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddMemberModal;
