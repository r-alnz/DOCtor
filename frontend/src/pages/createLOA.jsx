import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateLOA = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        reason: '',
        startDate: '',
        endDate: '',
        contactInfo: '',
    });
    const [error, setError] = useState('');

    // Function to get document content from the server
    const getContent = () => {
        fetch(api_base_url + "/getDoc", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                docId: docsId,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === false) {
                    setError(data.message);
                } else {
                    // Assuming data.doc has the fields needed to prefill form
                    setFormData({
                        name: data.doc.name || '',
                        department: data.doc.department || '',
                        reason: data.doc.reason || '',
                        startDate: data.doc.startDate || '',
                        endDate: data.doc.endDate || '',
                        contactInfo: data.doc.contactInfo || '',
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching document:", error);
                setError("An error occurred while fetching the document.");
            });
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to export the document to PDF
    const exportToPDF = () => {
        const input = previewRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // Width of A4 in mm
            const pageHeight = 297; // Height of A4 in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('leave_of_absence.pdf');
        });
    };

    // Decision tree function to determine formatting styles
    const getStyleForContent = (contentType) => {
        switch (contentType) {
            case 'name':
                return formData.name.length > 20 ? 'text-3xl font-bold' : 'text-4xl font-extrabold';
            case 'reason':
                return formData.reason.length > 150 ? 'text-sm' : 'text-base';
            case 'dates':
                return 'text-base';
            default:
                return '';
        }
    };

    // Fetch document content when component mounts
    useEffect(() => {
        getContent();
    }, [docsId]);

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-gray-100 min-h-screen">
                {/* Left side: Form for inputs */}
                <div className="w-1/3 p-6 border-r border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Create Leave of Absence Letter</h2>

                    <label className="block mb-2 font-semibold">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Reason for Leave:</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Contact Information:</label>
                    <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <button
                        onClick={exportToPDF}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                    >
                        Export to PDF
                    </button>
                </div>

                {/* Right side: Document Preview */}
                <div className="w-2/3 p-6 flex justify-center items-center">
                    <div ref={previewRef} className="bg-white w-[8.5in] h-[11in] shadow-lg p-8 rounded-lg">
                        <div className="text-center">
                            <h2 className={`${getStyleForContent('name')} text-gray-700`}>
                                {formData.name}
                            </h2>
                            <p className="text-gray-500">{formData.department}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Reason for Leave</h3>
                            <p className={`${getStyleForContent('reason')} text-gray-800`}>
                                {formData.reason}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Leave Dates</h3>
                            <p className={`${getStyleForContent('dates')} text-gray-800`}>
                                {formData.startDate} to {formData.endDate}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Contact Information</h3>
                            <p className="text-gray-800">{formData.contactInfo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateLOA;
