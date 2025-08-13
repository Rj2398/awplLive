

// import React from 'react';

// const CustomModal = ({
//   visible,
//   title,
//   subtitle,
//   onCancel,
//   onConfirm,
//   inputField = false,
//   inputValue = '',
//   onInputChange = () => { },
//   actionType = 'cancel', // 'cancel', 'info', 'success'
// }) => {
//   if (!visible) return null;

//   const getIcon = () => {
//     switch (actionType) {
//       case 'cancel':
//         return '/images/cancel-icon.png';
//       case 'success':
//         return '/images/check-icon.png';
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="modal fade show d-block popup-wrp dash-pop" tabIndex="-1" role="dialog">
//       <div className="modal-dialog modal-dialog-centered" role="document">
//         <div className={`modal-content ${actionType === 'info' ? 'large-pop' : 'small-pop'}`}>
//           {actionType !== 'info' && (
//             <div
//               className="modal-icon"
//               style={{ cursor: actionType === 'cancel' ? 'pointer' : 'default' }}
//               onClick={actionType === 'cancel' ? onCancel : null}
//             >
//               <img src={getIcon()} alt="Icon" />
//             </div>
//           )}
//           <div className="modal-header">
//             <h2>{title}</h2>
//             {actionType !== 'info' && <p>{subtitle}</p>}
//           </div>
//           {inputField && (
//             <div className="modal-body">
//               <form>
//                 <div className="input-grp">
//                   <label>Reason for cancellation.</label>
//                   <textarea
//                     placeholder="Give the reason."
//                     required
//                     value={inputValue}
//                     onChange={(e) => onInputChange(e.target.value)}
//                   />
//                 </div>
//               </form>
//             </div>
//           )}
//           <div className="modal-footer btn-wrp">
//             {actionType === 'cancel' ? (
//               <>
//                 <button className="cmn-btn white-input" onClick={onCancel}>No</button>
//                 <button className="orange-btn" onClick={onConfirm}>Yes</button>
//               </>
//             ) : actionType === 'info' ? (
//               <button className="orange-btn" onClick={onConfirm}>Submit</button>
//             ) : (
//               <button className="orange-btn" onClick={onConfirm}>Ok</button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomModal;








import React, { useState } from 'react';

const CustomModal = ({
  visible,
  title,
  subtitle,
  onCancel,
  onConfirm,
  inputField = false,
  inputValue = '',
  onInputChange = () => {},
  actionType = 'cancel', // 'cancel', 'info', 'success'
}) => {
  if (!visible) return null;


  const getIcon = () => {
    switch (actionType) {
      case 'cancel':
        return '/images/cancel-icon.png';
      case 'success':
        return '/images/check-icon.png';
      default:
        return null;
    }
  };


  return (
    <div className="modal fade show d-block popup-wrp dash-pop" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        
        <div className={`modal-content ${actionType === 'info' ? 'large-pop' : 'small-pop'}`}>
          {/* {actionType !== 'info' && (
            <div className="modal-icon">
              <img src={getIcon()} alt="Icon" />
            </div>
          )} */}
          {actionType !== 'info' && (
            <div
              className="modal-icon"
              style={{ cursor: actionType === 'cancel' ? 'pointer' : 'default' }}
              onClick={actionType === 'cancel' ? onCancel : null}
            >
              <img src={getIcon()} alt="Icon" />
            </div>
          )}
          {actionType!=='success'&& ( <button
                type="button"
                className="close"
                onClick={onCancel}
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="/images/cross-blue.png" alt="Close" />
                </span>
              </button>)}
          <div className="modal-header">
            <h2>{title}</h2>
            {actionType !== 'info' && <p>{subtitle}</p>}
          </div>
          {inputField && (
            <div className="modal-body">
              <form>
                <div className="input-grp">
                  <label>Reason for cancellation.</label>
                  <textarea
                    placeholder="Give the reason."
                    required
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                  />
                </div>
              </form>
            </div>
          )}
          <div className="modal-footer btn-wrp">
            {actionType === 'cancel' ? (
              <>
                <button className="cmn-btn white-input" onClick={onCancel}>No</button>
                <button className="orange-btn" onClick={onConfirm}>Yes</button>
              </>
            ) : actionType === 'info' ? (
              <button className="orange-btn" onClick={onConfirm}>Submit</button>
            ) : (
              <button className="orange-btn" onClick={onConfirm}>Ok</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
