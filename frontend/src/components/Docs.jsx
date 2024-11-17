import React, { useState } from 'react';
import docsIcon from "../images/docsIcon.png";
import { MdDelete } from "react-icons/md";
import deleteImg from "../images/delete.png";
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

// Component that displays each document item
const Docs = ({ docs }) => {
    // State to manage error messages
    const [error, setError] = useState("");
    // State to control visibility of delete confirmation modal
    const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);

    // Generate a unique HTML ID for each document item to ensure proper deletion of each DOM element
    const docID = `doc-${docs._id}`;

    // Hook for programmatic navigation to other routes
    const navigate = useNavigate();

    // Function to handle deletion of a document
    const deleteDoc = (id, docID) => {
        // Select the document element to remove it from the DOM upon successful deletion
        let doc = document.getElementById(docID);
        fetch(api_base_url + "/deleteDoc", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Include document ID and user ID in the request body for authentication/authorization purposes
            body: JSON.stringify({
                docId: id,
                userId: localStorage.getItem("userId")
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    // Show error message if deletion fails
                    setError(data.message);
                } else {
                    // Close the delete modal and show a success alert after deletion
                    setIsDeleteModelShow(false);
                    setTimeout(() => {
                        alert(data.message);
                    }, 100);
                    // Remove the document item from the DOM
                    doc.remove();
                }
            })
            .catch(error => {
                console.error("Error deleting document:", error);
                // Show error if any network or other error occurs
                setError("An error occurred while deleting the document.");
            });
    };


    return (
        <>
            {/* Document item with title and date information */}
            <div id={docID} className='docs cursor-pointer rounded-lg flex items-center mt-2 justify-between p-[10px] bg-[#F0F0F0] transition-all hover:bg-[#DCDCDC]'>
                <div
                    onClick={() => {
                        if (docs.docType?.trim().toLowerCase() === "resignation letter") {
                            alert("Navigating to createResig " + docs.docType);
                            navigate(`/createResig/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "bio data") {
                            alert("Navigating to createBio " + docs.docType);
                            navigate(`/createBio/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "application letter") {
                            alert("Navigating to createAppl " + docs.docType);
                            navigate(`/createAppl/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "recommendation letter") {
                            alert("Navigating to createRec " + docs.docType);
                            navigate(`/createRec/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "curriculum vitae") {
                            alert("Navigating to createCV " + docs.docType);
                            navigate(`/createCV/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "missed assessment request") {
                            alert("Navigating to createMAR " + docs.docType);
                            navigate(`/createMAR/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "accomplishment report") {
                            alert("Navigating to createAR " + docs.docType);
                            navigate(`/createAR/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "reaction paper") {
                            alert("Navigating to createRP " + docs.docType);
                            navigate(`/createRP/${docs._id}`);
                        } else if (docs.docType?.trim().toLowerCase() === "letter for loa") {
                            alert("Navigating to createRP " + docs.docType);
                            navigate(`/createLOA/${docs._id}`);
                        } else {
                            alert("Navigating to createDocs " + docs.docType);
                            navigate(`/createDocs/${docs._id}`);
                        }
                    }}
                    className="left flex items-center gap-2"
                >
                    <img src={docsIcon} alt="" />
                    <div>
                        {/* Display document title and creation/update dates */}
                        <h3 className='text-[20px]'>{docs.title}</h3>
                        <p className='text-[14px] text-[#808080]'>
                            Created In : {new Date(docs.date).toDateString()} | Last Updated : {new Date(docs.lastUpdate).toDateString()}
                        </p>
                    </div>
                </div>
                <div className="docsRight">
                    {/* Delete icon to open the delete confirmation modal */}
                    <i onClick={() => { setIsDeleteModelShow(true) }} className="delete text-[30px] text-red-500 cursor-pointer transition-all hover:text-red-600">
                        <MdDelete />
                    </i>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModelShow && (
                <div className="deleteDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
                    <div className="deleteModel flex flex-col justify-center p-[15px] bg-[#fff] rounded-lg w-[30vw] h-[29vh]">
                        <h3 className='text-[20px]'>Delete Document</h3>
                        <div className="flex items-center gap-3">
                            <img src={deleteImg} alt="" />
                            <div>
                                <h3 className='text-[20px]'>Do You Want to Delete This Document?</h3>
                                <p className='text-[14px] text-[#808080]'>Delete / Cancel</p>
                            </div>
                        </div>
                        <div className="flex mt-2 items-center gap-2 justify-between w-full">
                            {/* Confirm delete button */}
                            <button onClick={() => { deleteDoc(docs._id, docID) }} className='p-[10px] bg-red-500 transition-all hover:bg-red-600 text-white rounded-lg border-0 cursor-pointer min-w-[49%]'>
                                Delete
                            </button>
                            {/* Cancel button to close the delete confirmation modal */}
                            <button onClick={() => { setIsDeleteModelShow(false) }} className='p-[10px] bg-[#D1D5DB] text-black rounded-lg border-0 cursor-pointer min-w-[49%]'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Docs;
