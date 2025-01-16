import React, { useState, useEffect } from "react";

const ArticleForm = ({ onSubmit, hasAnalyzedData,  heading, description }) => {
  const [formData, setFormData] = useState({
    heading: heading || "",
    description: description || "",
  });

  useEffect(() => {
    // If heading and description are passed, set them to formData
    setFormData({
      heading: heading || "",
      description: description || "",
    });
  }, [heading, description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div>
        <label htmlFor="heading">Heading :</label>
        {heading ? (
          <p id="heading" className="form-control">{formData.heading}</p> // Display as label
        ) : (
          <input
            type="text"
            id="heading"
            name="heading"
            placeholder="Enter Heading..."
            value={formData.heading}
            onChange={handleChange}
            required
          />
        )}
      </div>
      <div>
        <label htmlFor="description">Description :</label>
        {description ? (
          <p id="description" className="form-control">{formData.description}</p> // Display as label
        ) : (
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter Description..."
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3" // Default minimum rows
          ></textarea>
        )}
      </div>
      <div>
        { hasAnalyzedData ? (
          ""
        ) : (
          <button type="submit">Analyze</button>
        )
        }
      </div>
    </form>
  );
};

export default ArticleForm;
