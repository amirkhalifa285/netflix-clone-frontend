import React, { useEffect } from 'react';
import '../../styles/Profile.css';

const ErrorPopup = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="error-popup">
      {message}
    </div>
  );
};

export default ErrorPopup;