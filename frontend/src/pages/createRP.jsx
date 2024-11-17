import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateRP = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        summary: '',
        reaction: '',
        keyTakeaways: '',
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
                        title: data.doc.title || '',
                        author: data.doc.author || '',
                        summary: data.doc.summary || '',
                        reaction: data.doc.reaction || '',
                        keyTakeaways: data.doc.keyTakeaways || '',
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
            pdf.save('reaction_paper.pdf');
        });
    };

    // Decision tree function to determine formatting styles
    const getStyleForContent = (contentType) => {
        switch (contentType) {
            case 'title':
                return formData.title.length > 20 ? 'text-3xl font-bold' : 'text-4xl font-extrabold';
            case 'summary':
                return formData.summary.length > 150 ? 'text-sm' : 'text-base';
            case 'reaction':
                return formData.reaction.length > 150 ? 'text-sm' : 'text-base';
            case 'keyTakeaways':
                return formData.keyTakeaways.length > 100 ? 'text-sm' : 'text-base';
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
                    <h2 className="text-2xl font-semibold mb-6">Create Reaction Paper</h2>

                    <label className="block mb-2 font-semibold">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title2}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Author:</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Summary:</label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Personal Reaction:</label>
                    <textarea
                        name="reaction"
                        value={formData.reaction}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Key Takeaways:</label>
                    <textarea
                        name="keyTakeaways"
                        value={formData.keyTakeaways}
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
                            <h2 className={`${getStyleForContent('title')} text-gray-700`}>
                                {formData.title}
                            </h2>
                            <p className="text-gray-500">{formData.author}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Summary</h3>
                            <p className={`${getStyleForContent('summary')} text-gray-800`}>
                                {formData.summary}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Personal Reaction</h3>
                            <p className={`${getStyleForContent('reaction')} text-gray-800`}>
                                {formData.reaction}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-600">Key Takeaways</h3>
                            <p className={`${getStyleForContent('keyTakeaways')} text-gray-800`}>
                                {formData.keyTakeaways}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateRP;
