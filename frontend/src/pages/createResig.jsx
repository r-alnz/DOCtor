import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateResig = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({
        employeeName: '',
        position: '',
        companyName: '',
        resignationDate: '',
        reason: '',
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
                        employeeName: data.doc.employeeName || '',
                        position: data.doc.position || '',
                        companyName: data.doc.companyName || '',
                        resignationDate: data.doc.resignationDate || '',
                        reason: data.doc.reason || '',
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
        if (!input) return;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('resignation_letter.pdf');
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-gray-100 min-h-screen">
                <div className="w-1/3 p-6 border-r border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Create Resignation Letter</h2>

                    <label className="block mb-2 font-semibold">Employee Name:</label>
                    <input
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Position:</label>
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

                    <label className="block mb-2 font-semibold">Resignation Date:</label>
                    <input
                        type="date"
                        name="resignationDate"
                        value={formData.resignationDate}
                        onChange={handleChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="block mb-2 font-semibold">Reason for Leaving:</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
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
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Resignation Letter</h2>
                            <p className="text-gray-800 mb-4">Date: {formData.resignationDate}</p>
                            <p className="text-gray-800 mb-4">To: {formData.companyName}</p>
                            <p className="text-gray-800 mb-4">Position: {formData.position}</p>

                            <p className="text-gray-800 mb-4">
                                Dear [Manager's Name],
                            </p>
                            <p className="text-gray-800 mb-4">
                                Please accept this letter as formal notice of my resignation from my position as{" "}
                                {formData.position} at {formData.companyName}. My last working day will be{" "}
                                {formData.resignationDate}.
                            </p>
                            <p className="text-gray-800 mb-4">
                                {formData.reason}
                            </p>
                            <p className="text-gray-800 mb-4">Sincerely,</p>
                            <div className="flex flex-col items-start">
                                {signature && (
                                    <img
                                        src={signature}
                                        alt="Signature"
                                        className="mb-0"
                                        style={{ maxWidth: '150px', maxHeight: '50px' }}
                                    />
                                )}
                                <p className="text-gray-800 text-sm leading-none mt-0">{formData.employeeName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateResig;