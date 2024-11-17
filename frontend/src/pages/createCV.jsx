import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateCV = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        profilePicture: '',
        contact: '',
        address: '',
        education: '',
        experience: '',
        skills: '',
        certifications: '',
        references: '',
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
                        name: data.doc.name || '',
                        profilePicture: data.doc.profilePicture || '',
                        contact: data.doc.contact || '',
                        address: data.doc.address || '',
                        education: data.doc.education || '',
                        experience: data.doc.experience || '',
                        skills: data.doc.skills || '',
                        certifications: data.doc.certifications || '',
                        references: data.doc.references || '',
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

    // Handle file upload for profile picture
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                profilePicture: reader.result,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Export CV to PDF
    const exportToPDF = () => {
        const input = previewRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('curriculum_vitae.pdf');
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-gray-100 min-h-screen">
                {/* Left side: Form inputs */}
                <div className="w-1/3 p-6 border-r border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Create Curriculum Vitae</h2>

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

                    <label className="block mb-2 font-semibold">Contact:</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Education:</label>
                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Experience:</label>
                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Skills:</label>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Certifications:</label>
                    <textarea
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">References:</label>
                    <textarea
                        name="references"
                        value={formData.references}
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

                {/* Right side: CV Preview */}
                <div className="w-2/3 p-6 flex justify-center items-center">
                    <div ref={previewRef} className="bg-white w-[8.5in] h-[11in] shadow-lg p-8 rounded-lg">
                        <div className="text-center">
                            {formData.profilePicture && (
                                <img
                                    src={formData.profilePicture}
                                    alt="Profile"
                                    className="mb-4 w-24 h-24 object-cover rounded-full mx-auto border border-gray-300"
                                />
                            )}
                            <h2 className="text-3xl font-bold text-gray-700">{formData.name}</h2>
                            <p className="text-gray-600">{formData.contact}</p>
                            <p className="text-gray-600">{formData.address}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Education</h3>
                            <p className="text-gray-800">{formData.education}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Experience</h3>
                            <p className="text-gray-800">{formData.experience}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Skills</h3>
                            <p className="text-gray-800">{formData.skills}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Certifications</h3>
                            <p className="text-gray-800">{formData.certifications}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">References</h3>
                            <p className="text-gray-800">{formData.references}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCV;
