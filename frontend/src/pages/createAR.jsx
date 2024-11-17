import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateAR = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        picture: '',
        tasksCompleted: '',
        challenges: '',
        feedback: '',
        goals: '',
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
                        picture: data.doc.picture || '',
                        tasksCompleted: data.doc.tasksCompleted || '',
                        challenges: data.doc.challenges || '',
                        feedback: data.doc.feedback || '',
                        goals: data.doc.goals || '',
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

    // Function to handle file upload (for profile picture)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                picture: reader.result,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
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
            pdf.save('accomplishment_report.pdf');
        });
    };

    // Decision tree function to determine formatting styles
    const getStyleForContent = (contentType) => {
        switch (contentType) {
            case 'name':
                return formData.name.length > 15 ? 'text-2xl' : 'text-3xl font-bold';
            case 'tasksCompleted':
                return formData.tasksCompleted.length > 100 ? 'text-sm' : 'text-base';
            case 'challenges':
                return formData.challenges.length > 100 ? 'text-sm' : 'text-base';
            case 'feedback':
                return formData.feedback.length > 100 ? 'text-sm' : 'text-base';
            case 'goals':
                return formData.goals.length > 100 ? 'text-sm' : 'text-base';
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
                    <h2 className="text-2xl font-semibold mb-6">Create Accomplishment Report</h2>

                    <label className="block mb-2 font-semibold">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} className="mb-4" />

                    <label className="block mb-2 font-semibold">Tasks Completed:</label>
                    <textarea
                        name="tasksCompleted"
                        value={formData.tasksCompleted}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Challenges Faced:</label>
                    <textarea
                        name="challenges"
                        value={formData.challenges}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Feedback:</label>
                    <textarea
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Goals for the Next Period:</label>
                    <textarea
                        name="goals"
                        value={formData.goals}
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
                            {formData.picture && (
                                <img
                                    src={formData.picture}
                                    alt="Profile"
                                    className="mb-4 w-24 h-24 object-cover rounded-full mx-auto border border-gray-300"
                                />
                            )}
                            <h2 className={`${getStyleForContent('name')} text-gray-700`}>
                                {formData.name}
                            </h2>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Tasks Completed</h3>
                            <p className={`${getStyleForContent('tasksCompleted')} text-gray-800`}>
                                {formData.tasksCompleted}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Challenges Faced</h3>
                            <p className={`${getStyleForContent('challenges')} text-gray-800`}>
                                {formData.challenges}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Feedback</h3>
                            <p className={`${getStyleForContent('feedback')} text-gray-800`}>
                                {formData.feedback}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Goals for Next Period</h3>
                            <p className={`${getStyleForContent('goals')} text-gray-800`}>
                                {formData.goals}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAR;
