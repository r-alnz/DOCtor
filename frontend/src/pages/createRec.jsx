import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateRec = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({
        studentName: '',
        position: '',
        companyName: '',
        supervisorName: '',
        recommendationDate: '',
        skills: '',
        strengths: '',
        comments: '',
    });
    const [error, setError] = useState('');
    const [signatureType, setSignatureType] = useState('draw');
    const [signature, setSignature] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (docsId) {
            getContent();
        }
    }, [docsId]);

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
                    setFormData({
                        studentName: data.doc.studentName || '',
                        position: data.doc.position || '',
                        companyName: data.doc.companyName || '',
                        supervisorName: data.doc.supervisorName || '',
                        recommendationDate: data.doc.recommendationDate || '',
                        skills: data.doc.skills || '',
                        strengths: data.doc.strengths || '',
                        comments: data.doc.comments || '',
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching document:", error);
                setError("An error occurred while fetching the document.");
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignatureTypeChange = (e) => {
        setSignatureType(e.target.value);
        setSignature(null);
    };

    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setSignature(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setSignature(canvasRef.current.toDataURL());
    };

    const clearSignature = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setSignature(null);
    };

    const exportToPDF = () => {
        const input = previewRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

            pdf.save('recommendation_letter.pdf');
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-gray-100 min-h-screen">
                <div className="w-1/3 p-6 border-r border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Create Recommendation Letter</h2>

                    <label className="block mb-2 font-semibold">Student Name:</label>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Position/Role:</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Company Name:</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Supervisor Name:</label>
                    <input
                        type="text"
                        name="supervisorName"
                        value={formData.supervisorName}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Recommendation Date:</label>
                    <input
                        type="date"
                        name="recommendationDate"
                        value={formData.recommendationDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Skills Demonstrated:</label>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Strengths:</label>
                    <textarea
                        name="strengths"
                        value={formData.strengths}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Additional Comments:</label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Signature Type:</label>
                        <select
                            value={signatureType}
                            onChange={handleSignatureTypeChange}
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="draw">Draw Signature</option>
                            <option value="upload">Upload Signature</option>
                        </select>
                    </div>

                    {signatureType === 'draw' ? (
                        <div>
                            <canvas
                                ref={canvasRef}
                                width={300}
                                height={150}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseOut={stopDrawing}
                                className="border border-gray-300 mb-2"
                            />
                            <button onClick={clearSignature} className="px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 mr-2">
                                Clear Signature
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="mb-4 p-2 border border-gray-300 rounded w-full"
                        />
                    )}

                    <button
                        onClick={exportToPDF}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                    >
                        Export to PDF
                    </button>
                </div>

                <div className="w-2/3 p-6 flex justify-center items-center">
                    <div ref={previewRef} className="bg-white w-[8.5in] h-[11in] shadow-lg p-8 rounded-lg">
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Recommendation Letter</h2>
                            <p className="text-gray-800 mb-4">Date: {formData.recommendationDate}</p>
                            <p className="text-gray-800 mb-4">To: {formData.companyName}</p>
                            <p className="text-gray-800 mb-4">Position: {formData.position}</p>

                            <p className="text-gray-800 mb-4">
                                Dear {formData.supervisorName},
                            </p>
                            <p className="text-gray-800 mb-4">
                                I am writing to highly recommend {formData.studentName} for any future opportunities at your organization.
                                During their time at our company, they have demonstrated excellent skills and a strong work ethic.
                            </p>
                            <p className="text-gray-800 mb-4">
                                Skills demonstrated: {formData.skills}
                            </p>
                            <p className="text-gray-800 mb-4">
                                Strengths: {formData.strengths}
                            </p>
                            <p className="text-gray-800 mb-4">
                                Additional comments: {formData.comments}
                            </p>
                            <p className="text-gray-800 mb-4">
                                I am confident that {formData.studentName} will be a valuable asset to any organization, and I highly
                                recommend them for any future opportunities.
                            </p>
                            <p className="text-gray-800 mb-4">Sincerely,</p>
                            <div className="flex flex-col items-start">
                                {signature && (
                                    <img
                                        src={signature}
                                        alt="Signature"
                                        className="mb-0"
                                        style={{ maxWidth: '150px', maxHeight: '60px' }}
                                    />
                                )}
                                <p className="text-gray-800 text-sm leading-none mt-0">{formData.supervisorName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateRec;