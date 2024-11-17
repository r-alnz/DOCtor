import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { BsPlusLg } from "react-icons/bs";
import Docs from '../components/Docs';
import { MdOutlineTitle } from "react-icons/md";
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false); // Modal visibility state
  const [title, setTitle] = useState(""); // Title state for new document
  const [error, setError] = useState(""); // Error message state
  const [data, setData] = useState(null); // State to store fetched documents
  const [docType, setDocType] = useState(""); // Document type state
  const [pageSize, setPageSize] = useState(""); // Page size state
  const navigate = useNavigate(); // Navigation hook

  // Create a ref for the title input field
  const titleRef = useRef(null);

  // Function to create a new document
  const createDoc = () => {
    if (title === "") {
      setError("Please enter title");
    } else if (!docType || !pageSize) {
      setError("Please select both document type and page size");
    } else {
      fetch(api_base_url + "/createDoc", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName: title,     // Document title
          docType: docType,   // Document type
          pageSize: pageSize, // Page size
          userId: localStorage.getItem("userId"), // User ID from local storage
        })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsCreateModelShow(false);
          // Navigate based on the document type
          if (docType === "Resume") {
            navigate(`/createDocs/${data.docId}`);
          } else if (docType === "Resignation Letter") {
            navigate(`/createResig/${data.docId}`);
          } else if (docType === "Bio Data") {
            navigate(`/createBio/${data.docId}`);
          } else if (docType === "Application Letter") {
            navigate(`/createAppl/${data.docId}`);
          } else if (docType === "Recommendation Letter") {
            navigate(`/createRec/${data.docId}`);
          } else if (docType === "Curriculum Vitae") {
            navigate(`/createCV/${data.docId}`);
          } else if (docType === "Missed Assessment Request") {
            navigate(`/createMAR/${data.docId}`);
          } else if (docType === "Accomplishment Report") {
            navigate(`/createAR/${data.docId}`);
          } else if (docType === "Reaction Paper") {
            navigate(`/createRP/${data.docId}`);
          } else if (docType === "Letter for LOA") {
            navigate(`/createLOA/${data.docId}`);
          }
        } else {
          setError(data.message);
        }
      });
    }
  };

  // Function to fetch all documents for the user
  const getData = () => {
    fetch(api_base_url + "/getAllDocs", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId") // User ID from local storage
      })
    }).then(res => res.json()).then(data => {
      setData(data.docs); // Set fetched documents in state
    });
  };

  // Fetch documents on component mount
  useEffect(() => {
    getData();
  }, []);

  // Focus title input when modal is shown
  useEffect(() => {
    if (isCreateModelShow) {
      titleRef.current?.focus();
    }
  }, [isCreateModelShow]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between px-[100px]">
        <h3 className='mt-7 mb-3 text-3xl'>All Documents</h3>
        <button className="btnBlue" onClick={() => setIsCreateModelShow(true)}><i><BsPlusLg /></i> Create New Document</button>
      </div>

      <div className='allDocs px-[100px] mt-4 pb-10'>
        {/* Display each document using Docs component */}
        {data ? data.map((el, index) => (
          <Docs key={index} docs={el} docID={`doc-${index + 1}`} />
        )) : ""}
      </div>

      {/* Create Document Modal */}
      {isCreateModelShow && (
        <div className="createDocsModelCon fixed top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
          <div className="createDocsModel p-[15px] bg-[#fff] rounded-lg w-[30vw] h-[50vh]">
            <h3 className='text-[20px]'>Create New Document</h3>

            {/* Title Input Field */}
            <div className='inputCon mt-3'>
              <p className=' text-[14px] text-[#808080]'>Title</p>
              <div className="inputBox w-[100%]">
                <i><MdOutlineTitle /></i>
                <input ref={titleRef} onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Title' id='title' name='title' required />
              </div>
            </div>

            {/* Document Type Dropdown */}
            <div className='inputCon mt-3'>
              <p className=' text-[14px] text-[#808080]'>Document Type</p>
              <select onChange={(e) => setDocType(e.target.value)} value={docType} className="inputBox w-[100%] p-2 border rounded">
                <option value="">Select Type</option>
                <option value="Resume">Resume</option>
                <option value="Resignation Letter">Resignation Letter</option>
                <option value="Bio Data">Bio Data</option>
                <option value="Application Letter">Application Letter</option>
                <option value="Recommendation Letter">Recommendation Letter</option>
                <option value="Curriculum Vitae">Curriculum Vitae</option>
                <option value="Missed Assessment Request">Missed Assessment Request</option>
                <option value="Accomplishment Report">Accomplishment Report</option>
                <option value="Reaction Paper">Reaction Paper</option>
                <option value="Letter for LOA">Letter for LOA</option>
                {/* Additional options as needed */}
              </select>
            </div>

            {/* Page Size Dropdown */}
            <div className='inputCon mt-3'>
              <p className=' text-[14px] text-[#808080]'>Page Size</p>
              <select onChange={(e) => setPageSize(e.target.value)} value={pageSize} className="inputBox w-[100%] p-2 border rounded">
                <option value="">Select Size</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Legal">Legal</option>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
                {/* Additional options as needed */}
              </select>
            </div>

            <p className='text-red-500 text-[14px] my-2'>{error}</p>

            {/* Modal Action Buttons */}
            <div className="flex -mt-2 items-center gap-2 justify-between w-full">
              <button onClick={createDoc} className='btnBlue !min-w-[49%]'>Create New Document</button>
              <button onClick={() => setIsCreateModelShow(false)} className='p-[10px] bg-[#D1D5DB] text-black rounded-lg border-0 cursor-pointer min-w-[49%]'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
