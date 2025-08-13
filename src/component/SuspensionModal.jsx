import React from "react";

const SuccessModal = ({ visible, onClose }) => {
  if (!visible) {
    return null; // Don't render anything if not visible
  }

  // Define inline styles as JavaScript objects
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    padding: "40px 30px", // Adjusted padding for better visual
    borderRadius: "10px", // Slightly more rounded corners
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // Stronger shadow
    maxWidth: "400px", // A bit narrower for the success message
    width: "90%",
    textAlign: "center",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px", // Space between elements
  };

  const iconContainerStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "4px solid #199fd9", // Blue border
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px", // Space below the icon
  };

  const checkmarkStyle = {
    color: "#199fd9", // Blue color for the checkmark
    fontSize: "50px", // Large size for the checkmark
    fontWeight: "bold", // Make it stand out
    lineHeight: "1", // Adjust line height for perfect vertical centering
  };

  const mainTitleStyle = {
    color: "#333", // Dark text color
    fontSize: "1.8em", // Large font size for main title
    fontWeight: "600", // Semi-bold
    margin: "0", // Remove default margins
  };

  const subTitleStyle = {
    color: "#777", // Lighter grey for subtitle
    fontSize: "1em", // Standard font size for subtitle
    margin: "0", // Remove default margins
    marginBottom: "20px", // Space above the button
  };

  const buttonStyle = {
    backgroundColor: "#ff7f00", // Orange color for the "Ok" button
    color: "white",
    border: "none",
    padding: "12px 30px", // Larger padding for the button
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    width: "60%",
  };

  // Add hover effect if you want (requires separate CSS or JS for inline)
  // For demonstration, we'll just show the base style.

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={iconContainerStyle}>
          {/* Using a simple checkmark character. For a more robust icon, use an SVG or an icon library. */}
          <span style={checkmarkStyle}>&#10003;</span> {/* Unicode checkmark */}
        </div>
        <h2 style={mainTitleStyle}>Access Suspended</h2>
        <p style={subTitleStyle}>
          Your access has been suspended by the admin. For support, please
          contact our admin team at
          <span style={{ color: "#199FD9" }}>
            awplconnect@asclepiuswellness.co.in
          </span>
        </p>
        <button onClick={onClose} style={buttonStyle}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
