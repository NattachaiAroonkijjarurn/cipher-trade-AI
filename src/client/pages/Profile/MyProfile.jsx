// React
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';

// Icon
import { FaEdit } from "react-icons/fa";
import { useStaticRangePicker } from "@mui/x-date-pickers-pro/internals/hooks/useStaticRangePicker";

export default function MyProfile() {

    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 1200px)" });

    // Fetch user data
    const [userData, setUserData] = useState({});

    useEffect(() => {
        // Fetch data when the component mounts
        // Replace this with your actual data fetching logic
        const fetchData = async () => {
            // Example: Fetch data from an API endpoint
            const response = await fetch("http://localhost:3000/Data/data.json");
            const data = await response.json();
            
            // Set the fetched data to the state
            setUserData(data[0]);
            setEditedFname(data[0].fname)
            setEditedLname(data[0].lname)
        };

        fetchData();
    }, []);

// ================================================================ Edit ================================================================
    // Fname and Lname
    const [isEditing, setIsEditing] = useState(false);
    const [editedFname, setEditedFname] = useState(userData.fname);
    const [editedLname, setEditedLname] = useState(userData.lname);

    const handleFnameChange = (e) => {
        setEditedFname(e.target.value)
  
    }

    const handleLnameChange = (e) => {
        setEditedLname(e.target.value)
    }

    // Profile Image
    const [profileImage, setProfileImage] = useState(null);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setIsEditing(true)
        setProfileImage(selectedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const droppedFile = event.dataTransfer.files[0];
        setProfileImage(droppedFile);
    };

    // Handle All Changes
    const [isDataChanged, setIsDataChanged] = useState(false);
    useEffect(() => {
        if (editedFname === userData.fname 
            && editedLname === userData.lname
            && profileImage === null) {
            setIsDataChanged(false)
        }
        else {
            setIsDataChanged(true)
        }
    },[editedFname, editedLname, profileImage])

    const removeImage = () => {
        setProfileImage(null);
        setIsDataChanged(false);
        // Clear the input value to allow selecting the same file again
        const fileInput = document.getElementById('imageUpload');
        if (fileInput) {
            fileInput.value = null;
        }
    };

    const handleCancle = () => {
        removeImage();
        setEditedFname(userData.fname)
        setEditedLname(userData.lname)
        setIsEditing(false)
        setIsDataChanged(false)
    }

    const saveChanges = () => {
        // Implement your logic for saving changes
        // For example, you can make an API call to update user data
        // and reset the isDataChanged state
        removeImage()
        setIsDataChanged(false);
    };

    return (
        <div className={isTabletMid ? "profile-content w-full flex flex-col px-5" : "profile-content w-full flex flex-col my-10 ml-10 mr-5"}>
            <h1>My Profile</h1>
            <div className="personal-board w-full h-full border-[2px] py-10 px-10 mt-8 border-slate-500 rounded-2xl">
                <div className="title-edit grid grid-cols-2 justify-start items-center">
                    <h2 className="text-xl text-[#2C7AFE] font-bold">Personal Information</h2>
                    <button 
                        className="edit-button justify-self-end border-[2px] border-slate-500 px-5 py-2 rounded-lg text-lg"
                        onClick={() => isEditing ? handleCancle() : setIsEditing(!isEditing)}>
                        <FaEdit/>
                    </button>
                </div>
                <div className={isTabletMid ? "name grid grid-rows-2 gap-5 mt-10" : "name grid grid-cols-2 gap-20 mt-10"}>
                    {isEditing 
                        ?   <>
                            <div className="fname flex flex-col gap-2">
                                <h3 className="text-slate-500">First Name</h3>
                                <input
                                    className="fname-form px-5 py-2 rounded-md text-[#000000]"
                                    type="text"
                                    value={editedFname}
                                    onChange={handleFnameChange}
                                />
                            </div>
                            <div className="lname flex flex-col gap-2">
                                <h3 className="text-slate-500">Last Name</h3>
                                <input
                                    className="lname-form px-5 py-2 rounded-md text-[#000000]"
                                    type="text"
                                    value={editedLname}
                                    onChange={handleLnameChange}
                                />
                            </div>
                            </>
                        :   <>
                            <div className="fname flex flex-col gap-2">
                                <h3 className="text-slate-500">First Name</h3>
                                <h3>{userData.fname}</h3>
                            </div>
                            <div className="lname flex flex-col gap-2">
                                <h3 className="text-slate-500">Last Name</h3>
                                <h3>{userData.lname}</h3>
                            </div>
                            </>
                    }
                </div>
                <div
                    className={`profile-image mt-8 border-dashed border-2 border-gray-400 p-6 rounded-lg text-center cursor-pointer ${profileImage ? 'relative h-auto' : 'h-[50vh]'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {!profileImage && (
                        <label htmlFor="imageUpload" className="text-slate-500 cursor-pointer flex flex-col justify-center items-center h-full">
                            Drag and drop or click to upload profile image
                        </label>
                    )}
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    {profileImage && (
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(profileImage)}
                                alt="Profile"
                                className="mt-3 rounded-full w-full object-cover mx-auto"
                            />
                            <button
                                className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer"
                                onClick={removeImage}
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-6 gap-5">
                    <button
                        className={`bg-gray-500 text-white px-4 py-2 rounded-md ${isEditing ? '' : 'hidden'}`}
                        onClick={handleCancle}
                    >
                        Cancel
                    </button>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isDataChanged ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={saveChanges}
                        disabled={!isDataChanged}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}