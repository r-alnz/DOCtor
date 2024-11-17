import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateMAR = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        course: '',
        subject: '',
        reason: '',
        missedDate: '',
        requestDate: '',
        professorName: '',
    });
    const [error, setError] = useState('');

    // Fetch content for prefilled data
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
                    // Prefill formData
                    setFormData({
                        studentName: data.doc.studentName || '',
                        studentId: data.doc.studentId || '',
                        course: data.doc.course || '',
                        subject: data.doc.subject || '',
                        reason: data.doc.reason || '',
                        missedDate: data.doc.missedDate || '',
                        requestDate: data.doc.requestDate || '',
                        professorName: data.doc.professorName || '',
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching document:", error);
                setError("An error occurred while fetching the document.");
            });
    };

    useEffect(() => {
        getContent();
    }, [docsId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Export MAR to PDF
    const exportToPDF = () => {
        const input = previewRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('missed_assessment_request.pdf');
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-gray-100 min-h-screen">
                {/* Left side: Form inputs */}
                <div className="w-1/3 p-6 border-r border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Missed Assessment Request</h2>

                    <label className="block mb-2 font-semibold">Student Name:</label>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Student ID:</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Course:</label>
                    <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Reason for Missing Assessment:</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Missed Date:</label>
                    <input
                        type="date"
                        name="missedDate"
                        value={formData.missedDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Request Date:</label>
                    <input
                        type="date"
                        name="requestDate"
                        value={formData.requestDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Professor's Name:</label>
                    <input
                        type="text"
                        name="professorName"
                        value={formData.professorName}
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

                {/* Right side: MAR Preview */}
                <div className="w-2/3 p-6 flex justify-center items-center">
                    <div ref={previewRef} className="bg-white w-[8.5in] h-[11in] shadow-lg p-8 rounded-lg">
                        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Missed Assessment Request</h2>

                        <p className="mb-4"><strong>Student Name:</strong> {formData.studentName}</p>
                        <p className="mb-4"><strong>Student ID:</strong> {formData.studentId}</p>
                        <p className="mb-4"><strong>Course:</strong> {formData.course}</p>
                        <p className="mb-4"><strong>Subject:</strong> {formData.subject}</p>
                        <p className="mb-4"><strong>Reason:</strong> {formData.reason}</p>
                        <p className="mb-4"><strong>Missed Date:</strong> {formData.missedDate}</p>
                        <p className="mb-4"><strong>Request Date:</strong> {formData.requestDate}</p>
                        <p className="mb-4"><strong>Professor's Name:</strong> {formData.professorName}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateMAR;
