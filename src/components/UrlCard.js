import React from 'react';

const UrlCard = ({ originalUrl, shortUrl }) => {
  return (
    <div className="url-card">
      <h3>Shortened URL</h3>
      <p><strong>Original:</strong> <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a></p>
      <p><strong>Short:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
    </div>
  );
};

export default UrlCard;
