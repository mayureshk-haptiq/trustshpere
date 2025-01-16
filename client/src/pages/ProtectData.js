import React, { useState } from "react";
import axios from "axios";
import SensitiveDataForm from "../components/SensitiveDataForm";

const ProtectData = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/protectData/analyzeDocument",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponse(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handleBackSubmit = () => {
    setResponse(false);
  };

  const handleMask = async (fieldsToMask, filePath) => {
    // Send fieldsToMask to the backend for processing
    try {
      const response = await axios.post(
        "http://localhost:5000/api/protectData/mask",
        {
          fieldsToMask,
          filePath,
        },
        { responseType: "blob" }
      ); // Important for handling binary data

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "masked_output.pdf";
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error masking document:", error);
    }
  };

  return (
    <div className="container-md analysis">
      <h2 className="py-5 text-center text">Document Analysis</h2>
      <div className="mainContent align-items-center">
        <div className="col-md-6 articleSections">
          {isLoading ? (
            <div className="text-center spinnerContainer">
              <div className="spinner-border text-primary p-2" role="status"></div>
              <p>Analyzing your file...</p>
            </div>
          ) : response ? (
            <>
              <SensitiveDataForm
                sensitiveData={response.sensitiveData}
                filePath={response.filePath}
                onMask={handleMask}
              />
              <div className="mt-3">
                <button type="submit" onClick={handleBackSubmit}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div>
                <label htmlFor="heading">File Upload :</label>
                <input
                className="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  name="file"
                />
                <p className="p-1 m-0 mt-2">Note : Only PDF type*</p>
              </div>
              <div>
                <button type="submit">Upload</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectData;
