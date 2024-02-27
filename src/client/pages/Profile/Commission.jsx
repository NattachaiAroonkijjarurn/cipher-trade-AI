import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip';

// Axios
import axios from "axios";

// Modal
import Modal from "../../layouts/Modal/Modal";
import { getTime } from "date-fns";

export default function Commission() {
    let isTabletMid = useMediaQuery({ query: "(max-width: 1200px)" });

// =================================================== Fectch Comission =====================================================
    const [commission, setCommission] = useState(0)

    useEffect(() => {

        const fetchCommission = async() => {
            try {
                const comsRes = await axios.get(`http://localhost:5000/api/fetch-commission`, {
                    withCredentials: true
                });

                if(comsRes.data.success) {
                    setCommission(comsRes.data.totalCommission)
                }

            } catch(err) {
                console.log(err)
            }
        }

        fetchCommission()

    },[])

// ============================================ Handle Image and Uploading Image ============================================
    const [transImage, setTransImage] = useState(null);

    const [isDataChanged, setIsDataChanged] = useState(false);
    useEffect(() => {
        if (transImage === null) {
        setIsDataChanged(false);
        } else {
        setIsDataChanged(true);
        }
    }, [transImage]);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
      
        const reader = new FileReader();
      
        reader.onloadend = () => {
          const dataURL = reader.result;
          setTransImage(dataURL);
        };
      
        if (selectedFile) {
          reader.readAsDataURL(selectedFile);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setTransImage(droppedFile);
    };

    const removeImage = () => {
        document.getElementById('imageUpload').value = '';
        setTransImage(null);
        setIsDataChanged(false);
    };

    const handleCancle = () => {
        removeImage();
        setIsDataChanged(false);
    };

    const formData = new FormData();

    const sendTrans = async() => {
        // Function for POST
        const uploadTrans = async () => {
            try {

                const paidDate = new Date();
                const paidDateTimeStamp = getTime(paidDate)
                formData.append('paidDate', paidDateTimeStamp)
                formData.append('transImage', transImage);

                const transRes = await axios.post(
                    "http://localhost:5000/api/upload-payment",
                        formData,
                    {
                        withCredentials: true, 
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(transImage)
                removeImage();
                setIsDataChanged(false);

                // Handle the response from the backend
                if (transRes.data.success) {
                    setModalMessage('Image upload successfully, Wait for Checking');
                } else {
                    setModalMessage(transRes.data.error || 'Failed to upload image');
                }

                setModalVisible(true);

            } catch (err) {
                console.log(err);
                setModalMessage('An error occurred while uploading the image');
                setModalVisible(true);
            }
        };

        uploadTrans();
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Modal Component
    const SuccessModal = ({ message, onClose }) => {
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

    const [viewModalVisible, setViewModalVisible] = useState(false)

    const ViewModal = ({ imageUrl, onClose }) => {

        const handleClick = (event) => {
            // Close the modal only if the click is on the overlay
            if (event.target.classList.contains('view-modal-overlay')) {
                setViewModalVisible(false)
            }
        };

        return (
            <>
                {/* Overlay */}
                <div className="view-modal-overlay" onClick={handleClick}></div>
    
                {/* ViewModal */}
                <div className={`view-modal ${viewModalVisible ? 'visible' : 'hide'}`}>
                    <div className="view-modal-content">
                        <img
                            src={imageUrl}
                            alt="Full Image"
                            className="w-full max-h-[80vh] object-cover"
                        />
                        <button className="close-view-button" onClick={onClose}>
                            X
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const [isQROpen, setIsQROpen] = useState(false)

  return (
    <div className={isTabletMid ? "profile-content flex flex-col mx-5 gap-5" : "profile-content flex flex-col my-10 ml-10 mr-5 w-full gap-5"}>
      <h1>Commission</h1>
      <div className="commission-content flex flex-col w-full h-[20vh] gap-2 rounded-lg items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 z-99">
        <p>Commission that need to pay</p>
        <p>฿{commission}</p>
      </div>
      <div className="payment-content flex flex-col gap-5 bg-[#31363b] mx-5 z-100 relative top-[-30px] rounded-t-lg">
        <h2 className="p-5 font-bold">Make a Payment</h2>
        <div className="payment-getQR grid grid-cols-2 h-[10vh] gap-5 mx-10 items-center whitespace-nowrap">
          <p>Payment :</p>
          <button className="qr-button bg-blue-700 rounded py-4 px-5 overflow-hidden text-ellipsis whitespace-nowrap hover:bg-blue-600" onClick={() => {setIsQROpen(!isQROpen)}}>
            <span>
              QR Code
            </span>
          </button>
            <Modal 
                showModal={isQROpen} 
                onClose={() => setIsQROpen(!isQROpen)} 
                modalType={"qrCode"}
            />
            <Tooltip
                id="CPN-tooltip" 
                anchorSelect=".qr-button" 
                place="top"
                variant="info" 
                content="QR Code"
                className={`${isTabletMid ? "" : "hidden"}`}
            />
        </div>
        <div className="upload-payment flex flex-col mx-10">
          <p>Upload Transcript Image :</p>
          <div>
          <div
            className={`trans-image mt-8 border-dashed border-2 border-gray-400 p-6 rounded-lg text-center cursor-pointer ${transImage ? 'relative h-auto' : 'h-[50vh]'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            >
            {!transImage && (
                <label htmlFor="imageUpload" className="text-slate-500 cursor-pointer flex flex-col justify-center items-center h-full">
                Drag and drop or click to upload transcript image
                </label>
            )}
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />
            {transImage && (
                <div className="relative">
                <img
                    src={transImage instanceof File ? URL.createObjectURL(transImage) : transImage}
                    alt="Transcript"
                    className="mt-3 rounded-full w-full max-h-[80vh] object-cover mx-auto"
                    onClick={() => setViewModalVisible(true)}
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

            <div className="flex justify-end mt-6 mb-8 gap-5">
                <button
                    className={`bg-gray-500 text-white px-4 py-2 rounded-md ${isDataChanged ? '' : 'hidden'}`}
                    onClick={handleCancle}
                >
                    Cancel
                </button>
                <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isDataChanged ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onClick={sendTrans}
                    disabled={!isDataChanged}
                >
                    Send
                </button>
            </div>

            {/* ViewModal for Viewing Full Image */}
            {viewModalVisible && (
                <ViewModal
                    imageUrl={transImage instanceof File ? URL.createObjectURL(transImage) : transImage}
                    onClose={() => setViewModalVisible(false)}
                />
            )}

            {/* Display Modal */}
            {modalVisible && (
                <SuccessModal message={modalMessage} onClose={() => setModalVisible(false)} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
