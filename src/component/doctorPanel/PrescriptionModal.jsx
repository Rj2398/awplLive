// import React from "react";
// import { useNavigate } from 'react-router-dom';

// const PrescriptionModal = () => {
//   const navigate = useNavigate();
//   const modalContentStyle = {
//     width: "100%",
//     maxWidth: "420px",
//     padding: "30px 20px",
//     borderRadius: "15px",
//     textAlign: "center",
//     margin: "auto",
//   };

//   const iconStyle = {
//     marginBottom: "20px",
//   };

//   const titleStyle = {
//     fontSize: "22px",
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: "8px",
//   };

//   const subtitleStyle = {
//     fontSize: "16px",
//     color: "#888",
//     marginBottom: "25px",
//   };

//   const buttonStyle = {
//     backgroundColor: "#f37021",
//     color: "white",
//     border: "none",
//     padding: "12px 30px",
//     fontSize: "16px",
//     borderRadius: "8px",
//     width: "100%",
//     maxWidth: "200px",
//     cursor: "pointer",
//   };

//   return (
//     <div
//       className="modal fade"
//       id="prescriptionCompletion"
//       tabIndex="-1"
//       aria-labelledby="prescriptionCompletionLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content" style={modalContentStyle}>
//           <div className="modal-body text-center">
//             <div style={iconStyle}>
//               <img src=".\images\check-icon.png" />
//             </div>
//             <h4 style={titleStyle}>Successfully Submitted</h4>
//             <p style={subtitleStyle}>Prescription successfully submitted</p>
//             <button
//               type="button"
//               style={buttonStyle}
//               data-bs-dismiss="modal"
//               aria-label="Close"
//               onClick={() => navigate('/pendingprescription')}
//             >
//               Ok
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrescriptionModal;





import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const PrescriptionModal = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    handleClose(); // Close the modal first
    navigate('/pendingprescription');
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
      <style>
        {`
            .custom-modal .modal-content {
              border-radius: 15px !important;
              // border: 12px solid red;
                max-width: 400px; 
  margin: auto;
            }
          `}
      </style>
      <Modal.Body className="text-center p-4">
        <div style={{ marginBottom: '20px' }}>
          <img src="/images/check-icon.png" alt="Success" />
        </div>
        <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
          Successfully Submitted
        </h4>
        <p style={{ fontSize: '16px', color: '#888', marginBottom: '25px' }}>
          Prescription successfully submitted
        </p>
        <Button
          variant="primary"
          onClick={handleOkClick}
          style={{
            backgroundColor: '#f37021',
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '200px',
          }}
        >
          Ok
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default PrescriptionModal;
