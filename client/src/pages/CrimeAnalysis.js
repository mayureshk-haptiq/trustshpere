// src/pages/CrimeAnalysis.js
import React, { useState } from "react";
import axios from "axios";
import ArticleForm from "../components/ArticleForm";
import { useLocation, useNavigate } from "react-router-dom";

const CrimeAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisData, heading, description } = location.state || {};

  const [error, setError] = useState("");
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async (formData) => {
    try {
      setIsLoading(true);
      setError("");
      const { heading, description } = formData;
      const response = await axios.post(
        "http://localhost:5000/api/analysis/classify",
        {
          heading,
          description,
        }
      );

      if (response.data.categories.length < 1) {
        response.data = 1;
        console.log(response.data);
      }
      setAnalyzedData(response.data);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const renderSection = (title, data) => {
    if (
      data &&
      (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
    ) {
      return (
        <div className="mb-4" key={title}>
          <h5 className="text-primary">{title}</h5>
          {Array.isArray(data) ? (
            <ul className="list-group">
              {data.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item}
                </li>
              ))}
            </ul>
          ) : typeof data === "object" ? (
            <div className="card card-body">
              {Object.entries(data).map(([key, value], index) => (
                <div key={index}>
                  <strong>{key}: </strong>
                  {Array.isArray(value) ? (
                    <ul className="list-group">
                      {value.map((val, idx) => (
                        <li key={idx} className="list-group-item">
                          {val}
                        </li>
                      ))}
                    </ul>
                  ) : typeof value === "object" ? (
                    <pre>{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{data}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderDataSections = (data) => {
    const sections = [];
    for (const [key, value] of Object.entries(data)) {
      const title = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      sections.push(renderSection(title, value));
    }
    return sections;
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container-md analysis">
      <h2 className="py-5 text-center text">Cyber Crime Analysis</h2>
      <div className="mainContent">
        {/* Bootstrap Accordion for Article Form */}
        <div className="accordion" id="articleAnalysisAccordion">
          <div className="accordion-item">
            <h1 className="accordion-header" id="headingOne">
              <button
                className="accordion-button bg-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                ARTICLE
              </button>
            </h1>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#articleAnalysisAccordion"
            >
              <div className="accordion-body">
                {error && <p className="alert alert-danger">{error}</p>}
                <ArticleForm
                  onSubmit={handleAnalysis}
                  buttonText={isLoading ? "Loading..." : "Analyze"}
                  type="login"
                  hasAnalyzedData={analysisData ? true : false}
                  heading={heading} // Pre-fill with heading if available
                  description={description} // Pre-fill with description if available
                  editable={!heading && !description} // Make the fields non-editable if values are available
                />

                {/* Add a button to go back if heading and description are provided */}
                {heading && description && (
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={handleGoBack}
                  >
                    Go Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md articleSections">
            <div className="analyzedData">
              <h4 className="mb-2 mt-2 text-center">Article Insights</h4>
              <hr className="mb-4" />

              {isLoading ? (
                <div className="text-center spinnerContainer">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <p>Analyzing your article...</p>
                </div>
              ) : analyzedData ? (
                analyzedData === 1 ? (
                  <p className="text-danger spinnerContainer">
                    <b>
                      Please enter article related to cyber crime incidents.
                    </b>
                  </p>
                ) : (
                  renderDataSections(analyzedData)
                )
              ) : analysisData ? (
                renderDataSections(analysisData)
              ) : (
                <p className="text-success spinnerContainer">
                  Enter details to get the analysis.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeAnalysis;
