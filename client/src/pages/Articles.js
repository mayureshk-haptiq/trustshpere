import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/articles/");
        setArticles(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        // setTimeout(() => {
        setLoading(false);
        // }, 2000);
      }
    };

    fetchArticles();
  }, []);

  const handleAnalysis = async (articleLink) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/articles/analyze",
        {
          articleLink,
        }
      );
      console.log("response", response);
      navigate("/crimeAnalysis", {
        state: {
          analysisData: response.data.classification,
          heading: response.data.heading,
          description: response.data.description,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center spinnerContainer auth">
        <div className="spinner-border text-white" role="status"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
    <div className="container-md analysis">
      <h2 className="py-5 text-center text">Cyber Crime Articles</h2>
      <div className="mainContent">
        {articles.length === 0 ? (
          <div className="text-center">No articles found.</div>
        ) : (
          <div className="row">
            {articles.map((article, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={article.image}
                    className="card-img-top p-3 articleImg"
                    alt={article.title}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300")
                    }
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="mb-3">
                      <h5 className="card-title ">{article.title}</h5>
                      <p className="card-text">
                        <strong>Date:</strong> {article.date}
                      </p>
                    </div>
                    <div className="row">
                      <div className="col">
                        <button
                          onClick={() => window.open(article.link, "_blank")}
                          className="btn btn-primary"
                        >
                          Read More
                        </button>
                      </div>
                      <div className="col">
                        <button
                          onClick={() => handleAnalysis(article.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success"
                        >
                          Analyse
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
