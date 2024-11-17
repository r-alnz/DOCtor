import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api_base_url } from '../Helper';

const CreateBio = () => {
    let { docsId } = useParams();
    const previewRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        maritalStatus: '',
        contactNumber: '',
        emailAddress: '',
        permanentAddress: '',
        currentAddress: '',
        highestLevelOfEducation: '',
        institutionName: '',
        degreeObtained: '',
        fieldOfStudy: '',
        yearOfGraduation: '',
        additionalCertifications: '',
        currentEmploymentStatus: '',
        currentEmployer: '',
        jobTitle: '',
        jobResponsibilities: '',
        previousEmploymentHistory: '',
        skillsAndCompetencies: '',
        languagesSpoken: '',
        hobbiesAndInterests: '',
        professionalAffiliations: '',
        volunteerExperience: '',
        awardsAndRecognitions: '',
        reference1: { refname: '', relationship: '', contactInfo: '' },
        reference2: { refname: '', relationship: '', contactInfo: '' },

    });
    const [error, setError] = useState('');

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
                    setFormData(data.doc);
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

    const handleReferenceChange = (referenceNumber, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [`reference${referenceNumber}`]: {
                ...prevData[`reference${referenceNumber}`],
                [field]: value,
            },
        }));
    };

    const exportToPDF = () => {
        const input = previewRef.current;
        if (!input) {
            console.error("Preview element not found");
            return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('biodata.pdf');
        }).catch(err => {
            console.error("Error generating PDF:", err);
        });
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col lg:flex-row p-8 bg-gray-100 min-h-screen">
                <div className="w-full lg:w-1/3 p-6 bg-white rounded-lg shadow-md mb-8 lg:mb-0 lg:mr-8 overflow-y-auto max-h-screen">
                    <h2 className="text-3xl font-bold mb-6 text-primary">Create Bio-data</h2>

                    <form className="space-y-6">
                        <section>
                            <h3 className="text-2xl font-semibold mb-4 text-primary">Personal Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth:</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
                                        <input
                                            type="text"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality:</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status:</label>
                                    <input
                                        type="text"
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number:</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        value={formData.emailAddress}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address:</label>
                                    <textarea
                                        name="permanentAddress"
                                        value={formData.permanentAddress}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address:</label>
                                    <textarea
                                        name="currentAddress"
                                        value={formData.currentAddress}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold mb-4 text-primary">Educational Background</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Level of Education:</label>
                                    <input
                                        type="text"
                                        name="highestLevelOfEducation"
                                        value={formData.highestLevelOfEducation}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name:</label>
                                    <input
                                        type="text"
                                        name="institutionName"
                                        value={formData.institutionName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Obtained:</label>
                                    <input
                                        type="text"
                                        name="degreeObtained"
                                        value={formData.degreeObtained}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study:</label>
                                    <input
                                        type="text"
                                        name="fieldOfStudy"
                                        value={formData.fieldOfStudy}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Graduation:</label>
                                    <input
                                        type="text"
                                        name="yearOfGraduation"
                                        value={formData.yearOfGraduation}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Certifications:</label>
                                    <textarea
                                        name="additionalCertifications"
                                        value={formData.additionalCertifications}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold mb-4 text-primary">Professional Experience</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Employment Status:</label>
                                    <input
                                        type="text"
                                        name="currentEmploymentStatus"
                                        value={formData.currentEmploymentStatus}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Employer:</label>
                                    <input
                                        type="text"
                                        name="currentEmployer"
                                        value={formData.currentEmployer}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title:</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Responsibilities:</label>
                                    <textarea
                                        name="jobResponsibilities"
                                        value={formData.jobResponsibilities}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Employment History:</label>
                                    <textarea
                                        name="previousEmploymentHistory"
                                        value={formData.previousEmploymentHistory}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills and Competencies:</label>
                                    <textarea
                                        name="skillsAndCompetencies"
                                        value={formData.skillsAndCompetencies}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold mb-4 text-primary">Personal Attributes</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken:</label>
                                    <textarea
                                        name="languagesSpoken"
                                        value={formData.languagesSpoken}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies and Interests:</label>
                                    <textarea
                                        name="hobbiesAndInterests"
                                        value={formData.hobbiesAndInterests}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Affiliations:</label>
                                    <textarea
                                        name="professionalAffiliations"
                                        value={formData.professionalAffiliations}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Volunteer Experience:</label>
                                    <textarea
                                        name="volunteerExperience"
                                        value={formData.volunteerExperience}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Awards and Recognitions:</label>
                                    <textarea
                                        name="awardsAndRecognitions"
                                        value={formData.awardsAndRecognitions}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold mb-4 text-primary">References</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 1 Name:</label>
                                    <input
                                        type="text"
                                        value={formData.reference1?.refname || ''}
                                        onChange={(e) => handleReferenceChange(1, 'refname', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 1 Relationship:</label>
                                    <input
                                        type="text"
                                        value={formData.reference1?.relationship || ''}
                                        onChange={(e) => handleReferenceChange(1, 'relationship', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 1 Contact Info:</label>
                                    <input
                                        type="text"
                                        value={formData.reference1?.contactInfo || ''}
                                        onChange={(e) => handleReferenceChange(1, 'contactInfo', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 2 Name:</label>
                                    <input
                                        type="text"
                                        value={formData.reference2?.refname || ''}
                                        onChange={(e) => handleReferenceChange(2, 'refname', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 2 Relationship:</label>
                                    <input
                                        type="text"
                                        value={formData.reference2?.relationship || ''}
                                        onChange={(e) => handleReferenceChange(2, 'relationship', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference 2 Contact Info:</label>
                                    <input
                                        type="text"
                                        value={formData.reference2?.contactInfo || ''}
                                        onChange={(e) => handleReferenceChange(2, 'contactInfo', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                <div className="w-full lg:w-2/3 p-6 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-primary">Preview</h2>
                        <button
                            onClick={exportToPDF}
                            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                        >
                            Export to PDF
                        </button>
                    </div>
                    <div
                        ref={previewRef}
                        className="border p-6 bg-white rounded-lg shadow-inner"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-primary">Bio-data</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-primary">Personal Information</h3>
                                <p><strong>Full Name:</strong> {formData.fullName}</p>
                                <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                                <p><strong>Gender:</strong> {formData.gender}</p>
                                <p><strong>Nationality:</strong> {formData.nationality}</p>
                                <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>
                                <p><strong>Contact Number:</strong> {formData.contactNumber}</p>
                                <p><strong>Email Address:</strong> {formData.emailAddress}</p>
                                <p><strong>Permanent Address:</strong> {formData.permanentAddress}</p>
                                <p><strong>Current Address:</strong> {formData.currentAddress}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-primary">Educational Background</h3>
                                <p><strong>Highest Level of Education:</strong> {formData.highestLevelOfEducation}</p>
                                <p><strong>Institution:</strong> {formData.institutionName}</p>
                                <p><strong>Degree Obtained:</strong> {formData.degreeObtained}</p>
                                <p><strong>Field of Study:</strong> {formData.fieldOfStudy}</p>
                                <p><strong>Year of Graduation:</strong> {formData.yearOfGraduation}</p>
                                <p><strong>Additional Certifications:</strong> {formData.additionalCertifications}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-primary">Professional Experience</h3>
                                <p><strong>Current Employment Status:</strong> {formData.currentEmploymentStatus}</p>
                                <p><strong>Current Employer:</strong> {formData.currentEmployer}</p>
                                <p><strong>Job Title:</strong> {formData.jobTitle}</p>
                                <p><strong>Job Responsibilities:</strong> {formData.jobResponsibilities}</p>
                                <p><strong>Previous Employment:</strong> {formData.previousEmploymentHistory}</p>
                                <p><strong>Skills and Competencies:</strong> {formData.skillsAndCompetencies}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-primary">Personal Attributes</h3>
                                <p><strong>Languages Spoken:</strong> {formData.languagesSpoken}</p>
                                <p><strong>Hobbies and Interests:</strong> {formData.hobbiesAndInterests}</p>
                                <p><strong>Professional Affiliations:</strong> {formData.professionalAffiliations}</p>
                                <p><strong>Volunteer Experience:</strong> {formData.volunteerExperience}</p>
                                <p><strong>Awards and Recognitions:</strong> {formData.awardsAndRecognitions}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-primary">References</h3>
                                <p><strong>Reference 1:</strong> {formData.reference1?.name || ''}</p>
                                <p><strong>Relationship:</strong> {formData.reference1?.relationship || ''}</p>
                                <p><strong>Contact Info:</strong> {formData.reference1?.contactInfo || ''}</p>
                                <p><strong>Reference 2:</strong> {formData.reference2?.name || ''}</p>
                                <p><strong>Relationship:</strong> {formData.reference2?.relationship || ''}</p>
                                <p><strong>Contact Info:</strong> {formData.reference2?.contactInfo || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateBio;