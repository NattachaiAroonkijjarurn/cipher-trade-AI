// React
import { useMediaQuery } from "react-responsive";
import { useEffect, useState, useRef } from "react";
import AvatarEditor from 'react-avatar-editor';

// React Icons
import { FaEdit } from "react-icons/fa";
import axios from "axios";

export default function MyProfile({ data, onProfileUpdate }) {

  // For Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 1200px)" });

// ========================================= Handle Username Editing =========================================

  const [userData, setUserData] = useState({});
  const [editedUserName, setEditedUserName] = useState();

  useEffect(() => {
    setUserData(data);
    if (data) {
      setEditedUserName(data.username);
    }
  }, [data]);

  const handleUserNameChange = (e) => {
    setEditedUserName(e.target.value);
  };

// ========================================== Handle Image Uploading =========================================

  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setIsEditing(true);
    setProfileImage(selectedFile);
    showEditor()
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setProfileImage(droppedFile);
  };

  const removeImage = () => {
    setProfileImage(null);
    setIsDataChanged(false);
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.value = null;
    }
  };

// ===================================== Handle Editing Uploaded Image =======================================

  const [scale, setScale] = useState(1);
  const [editorVisible, setEditorVisible] = useState(false);

  const editorRef = useRef(null);

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const showEditor = () => {
    setEditorVisible(true);
  };

  const hideEditor = () => {
    setEditorVisible(false);
  };

  const saveAvatar = () => {
    const canvas = editorRef.current.getImage();
    const editedImage = canvas.toDataURL();
    setProfileImage(editedImage);
    hideEditor();
  };

// ======================================= Handle When Data Editting =========================================

  const [isEditing, setIsEditing] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  useEffect(() => {
    if (editedUserName === userData.username && profileImage === null) {
      setIsDataChanged(false);
    } else {
      setIsDataChanged(true);
    }
  }, [editedUserName, profileImage]);

// ========================================== Save or Cancle Change ==========================================

  const formData = new FormData();
  formData.append('editedUserName', editedUserName);
  formData.append('profileImage', profileImage);

  const handleCancle = () => {
    removeImage();
    setEditedUserName(userData.username);
    setIsEditing(false);
    setIsDataChanged(false);
  };

  const saveChanges = async () => {
    // Function for POST
    const uploadProfile = async () => {
      try {
        console.log(profileImage)
        const profileRes = await axios.post(
          "http://localhost:5000/api/update-profile",
          formData,
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            }
          }
        );

        removeImage();
        setIsEditing(false);
        setIsDataChanged(false);

        // Handle the response from the backend
        if (profileRes.data.success) {
          setModalMessage('Profile updated successfully');
        } else {
          setModalMessage(profileRes.data.error || 'Failed to update profile');
        }

        setModalVisible(true);

        // Notify the parent component (Profile) about the profile update
        if (onProfileUpdate && profileRes.data.success) {
          await onProfileUpdate(profileRes.data.user); // Assuming that the updated data is returned from the server
        }

      } catch (err) {
        console.log(err);
        setModalMessage('An error occurred while updating the profile');
        setModalVisible(true);
      }
    };

    uploadProfile();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Modal Component
  const Modal = ({ message, onClose }) => {
    const [showCheckmark, setShowCheckmark] = useState(false);

    useEffect(() => {
      
      // Trigger the checkmark animation when the modal is shown
      setShowCheckmark(true);

    }, []); // Run this effect only once when the component mounts

    const handleModalClose = () => {
      setModalVisible(false);

      // Call the onClose function after a delay to allow the modal to close
      setTimeout(() => {
        setShowCheckmark(false)
        onClose();
      }, 400); // Adjust the delay as needed
    };

    return (
      <div className="modal-profile">
        <div className="modal-profile-content gap-10">
          <p>{message}</p>
          <div className={`checkmark ${showCheckmark ? 'visible justify-self-center' : 'hidden justify-self-center'}`}></div>
          <button onClick={handleModalClose}>Close</button>
        </div>
      </div>
    );
  };
  
// ===========================================================================================================

  return (
    <div className={isTabletMid ? "profile-content w-full flex flex-col px-5" : "profile-content w-full flex flex-col my-10 ml-10 mr-5"}>
      <h1>My Profile</h1>
      <div className="personal-board w-full h-full border-[2px] py-10 px-10 mt-8 border-slate-500 rounded-2xl">
        <div className="title-edit grid grid-cols-2 justify-start items-center">
          <h2 className="text-xl text-[#2C7AFE] font-bold">Personal Information</h2>
          <button
            className="edit-button justify-self-end border-[2px] border-slate-500 px-5 py-2 rounded-lg text-lg"
            onClick={() => (isEditing ? handleCancle() : setIsEditing(!isEditing))}
          >
            <FaEdit />
          </button>
        </div>
        <div className={isTabletMid ? "name grid grid-rows-1 gap-5 mt-10" : "name grid grid-cols-2 gap-20 mt-10"}>
          {isEditing ? (
            <>
              <div className="username flex flex-col gap-2">
                <h3 className="text-slate-500">Username</h3>
                <input
                  className="username-form px-5 py-2 rounded-md text-[#000000]"
                  type="text"
                  value={editedUserName}
                  onChange={handleUserNameChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="fname flex flex-col gap-2">
                <h3 className="text-slate-500">Username</h3>
                <h3>{userData ? userData.username : "-"}</h3>
              </div>
            </>
          )}
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
                src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage}
                alt="Profile"
                className="mt-3 rounded-full w-full object-cover mx-auto"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer"
                onClick={removeImage}
              >
                X
              </button>
              {editorVisible && (
                <div className="avatar-editor-modal">
                  <div className="avatar-editor-container">
                    <AvatarEditor
                      ref={editorRef}
                      image={URL.createObjectURL(profileImage)}
                      width={200}
                      height={200}
                      border={50}
                      scale={scale}
                      borderRadius={100}
                    />
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.01"
                      value={scale}
                      onChange={handleScaleChange}
                      className="mt-3"
                    />
                    <div className="flex gap-5 w-8/12">
                      <button className="bg-blue-500 w-6/12 py-2 rounded-md" onClick={saveAvatar}>Save</button>
                      <button className="bg-gray-500 w-6/12 py-2 rounded-md" onClick={hideEditor}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Display Modal */}
          {modalVisible && (
            <Modal message={modalMessage} onClose={() => setModalVisible(false)} />
          )}

        </div>
      </div>
    </div>
  );
}
