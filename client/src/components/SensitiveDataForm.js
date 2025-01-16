import React, { useState } from "react";

const SensitiveDataForm = ({ sensitiveData, filePath, onMask }) => {
  const [selectedFields, setSelectedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (key, value) => {
    setSelectedFields((prev) => {
      const updated = { ...prev };
      if (!updated[key]) {
        updated[key] = [];
      }
      if (updated[key].includes(value)) {
        updated[key] = updated[key].filter((v) => v !== value);
      } else {
        updated[key].push(value);
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    const fieldsToMask = Object.values(selectedFields).flat();
    if (fieldsToMask.length === 0) {
      alert("Please select at least one field to mask.");
      return;
    }
    setIsSubmitting(true);
    onMask(fieldsToMask, filePath);
    setIsSubmitting(false);
  };

  return (
    <div>
      <h3 className="text-center my-2">Sensitive Data Found</h3>
      <hr/>
      <form>
        {Object.keys(sensitiveData).map((key) => (
          <div key={key}>
            <h5 className="m-2">{key}</h5>
            {Array.isArray(sensitiveData[key]) && sensitiveData[key].length > 0 ? (
              <>
                {sensitiveData[key].map((value, idx) => (
                  <div key={`${key}-${idx}`}>
                    <input
                    className="m-2"
                      type="checkbox"
                      id={`${key}-${value}`}
                      value={value}
                      onChange={() => handleCheckboxChange(key, value)}
                      checked={selectedFields[key]?.includes(value)}
                    />
                    <label htmlFor={`${key}-${value}`}>{value}</label>
                  </div>
                ))}
              </>
            ) : (
              <p>No sensitive data found in this category.</p>
            )}
          </div>
        ))}
        <div>
          <hr/>
          <button className="mt-2" type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Masking..." : "Mask Selected Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SensitiveDataForm;
