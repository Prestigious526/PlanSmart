import React, { useState } from 'react';
import './GlossaryPage.css';

const GlossaryPage = () => {
  // State for video embedding
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle video submission
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (getVideoId(videoUrl)) {
      setShowVideoModal(true);
    }
  };

  // Glossary data
  const glossarySections = [
    {
      title: "Investment Terms",
      terms: [
        {
          term: "Compound Interest",
          definition: "Interest calculated on the initial principal and also on the accumulated interest of previous periods.",
          videoLink: "https://www.youtube.com/watch?v=wf91rEGw88Q"
        },
        {
          term: "Diversification",
          definition: "The practice of spreading investments among different financial instruments to reduce risk.",
          videoLink: "https://www.youtube.com/watch?v=CLO3JQPW1l0"
        },
        {
          term: "ETF (Exchange-Traded Fund)",
          definition: "A type of investment fund that holds multiple assets and trades on stock exchanges.",
          videoLink: "https://www.youtube.com/watch?v=7U0d3WyZqMA"
        },
        {
          term: "ROI (Return on Investment)",
          definition: "A performance measure used to evaluate the efficiency of an investment.",
          videoLink: "https://www.youtube.com/watch?v=7uXqz6Wgpe8"
        }
      ]
    },
    {
      title: "Personal Finance",
      terms: [
        {
          term: "Credit Score",
          definition: "A numerical expression representing an individual's creditworthiness.",
          videoLink: "https://www.youtube.com/watch?v=58-6xq6lJQ4"
        },
        {
          term: "Emergency Fund",
          definition: "A reserve of money set aside to cover unexpected expenses or financial emergencies.",
          videoLink: "https://www.youtube.com/watch?v=4L4YqDy5dZ0"
        },
        {
          term: "Net Worth",
          definition: "The value of all assets minus the total of all liabilities.",
          videoLink: "https://www.youtube.com/watch?v=Gg8aY8l_8Sw"
        }
      ]
    },
    {
      title: "Business Acumen",
      terms: [
        {
          term: "Cash Flow",
          definition: "The net amount of cash moving in and out of a business.",
          videoLink: "https://www.youtube.com/watch?v=WX242v5G6oE"
        },
        {
          term: "EBITDA",
          definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization - a measure of company profitability.",
          videoLink: "https://www.youtube.com/watch?v=r2g5Yjq3G5I"
        },
        {
          term: "Market Capitalization",
          definition: "The total market value of a company's outstanding shares.",
          videoLink: "https://www.youtube.com/watch?v=7aYz4wdU5h0"
        }
      ]
    },
    {
      title: "Cryptocurrency",
      terms: [
        {
          term: "Blockchain",
          definition: "A decentralized digital ledger that records transactions across many computers.",
          videoLink: "https://www.youtube.com/watch?v=yubzJw0uiE4"
        },
        {
          term: "DeFi (Decentralized Finance)",
          definition: "Financial services without central intermediaries, using smart contracts on blockchains.",
          videoLink: "https://www.youtube.com/watch?v=17QRFlml4pA"
        },
        {
          term: "NFT (Non-Fungible Token)",
          definition: "A unique digital asset that represents ownership of a specific item or content.",
          videoLink: "https://www.youtube.com/watch?v=Oz9zw7-_vhM"
        }
      ]
    }
  ];

  return (
    <div className="glossary-page">
      <header className="glossary-header">
        <h1>Financial Glossary</h1>
        <p>Your comprehensive guide to financial terminology</p>
      </header>

      {/* Video Embed Section */}
      <div className="video-embed-section">
        <h2>Add Educational Video</h2>
        <form onSubmit={handleAddVideo} className="video-form">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            required
          />
          <button type="submit">Preview Video</button>
        </form>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowVideoModal(false)}
            >
              &times;
            </button>
            <h3>Video Preview</h3>
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-actions">
              <button 
                className="confirm-button"
                onClick={() => {
                  // Here you would typically save the video to your database
                  alert('Video saved successfully!');
                  setShowVideoModal(false);
                  setVideoUrl('');
                }}
              >
                Save Video to Glossary
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowVideoModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Glossary Sections */}
      <div className="glossary-sections">
        {glossarySections.map((section, index) => (
          <section key={index} className="glossary-section">
            <h2>{section.title}</h2>
            <div className="terms-grid">
              {section.terms.map((term, termIndex) => (
                <div key={termIndex} className="term-card">
                  <h3>{term.term}</h3>
                  <p>{term.definition}</p>
                  {term.videoLink && (
                    <div className="video-preview">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${getVideoId(term.videoLink)}`}
                        title={`Video explaining ${term.term}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default GlossaryPage;