import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateDocs = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        picture: '',
        education: '',
        description: '',
        skills: '',
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
                        education: data.doc.education || '',
                        description: data.doc.description || '',
                        skills: data.doc.skills || '',
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
            pdf.save('document.pdf');
        });
    };

    // Decision tree function to determine formatting styles
    const getStyleForContent = (contentType) => {
        switch (contentType) {
            case 'name':
                return formData.name.length > 15 ? 'text-2xl' : 'text-3xl font-bold';
            case 'description':
                return formData.description.length > 100 ? 'text-sm' : 'text-base';
            case 'skills':
                return formData.skills.includes(',') ? 'list-disc list-inside' : '';
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
                    <h2 className="text-2xl font-semibold mb-6">Create Document</h2>

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

                    <label className="block mb-2 font-semibold">Education:</label>
                    <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Short Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Skills:</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
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
                            <h3 className="text-lg font-semibold text-gray-600">Education</h3>
                            <p className="text-gray-800">{formData.education}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Description</h3>
                            <p className={`${getStyleForContent('description')} text-gray-800`}>
                                {formData.description}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Skills</h3>
                            <p className={`${getStyleForContent('skills')} text-gray-800`}>
                                {formData.skills}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateDocs;
