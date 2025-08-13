// import React from 'react';
// import { useRef, useState } from 'react';
// import { Form, Button} from "react-bootstrap";
// import { Link, useNavigate} from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { otpVerification, resendOtp } from '../../redux/slices/userSlice';
// import { toast } from 'react-toastify';

// const OtpVerification = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const {email} = location.state || {};

//     const [otp, setOtp] = useState(["", "", "", "", ""]);

//     // const handleSubmit = (e) => {
//     //     e.preventDefault();
//     //     navigate('/set-password');
//     // };

//         const inputRefs = useRef([]);

//         const handleChange = (index, value) => {
//             if (value.length > 1) return;   // Prevent pasting multiple characters

//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);

//             // Auto focus to next input
//             if (value && index <4){
//                 inputRefs.current[index + 1].focus();
//             }
//         }

//         const handleKeyDown = (index, e) => {
//             // Handle backspace
//             if (e.key === 'Backspace' && !otp[index] && index >0){
//                 inputRefs.current[index - 1].focus();
//             }
//         }

//         const handlePaste = (e) => {
//             e.preventDefault();
//             const pasteData = e.clipboardData.getData('text/plain').slice(0, 5);
//             const newOtp = [...otp];

//             pasteData.split('').forEach((char, i) => {
//                 if (i < 5) {
//                     newOtp[i] = char;
//                     if (i < 4) {
//                         inputRefs.current[i + 1].focus();
//                     }
//                 }
//             });

//             setOtp(newOtp);
//         };

//     const handleSubmit = async (e)=> {
//             e.preventDefault();

//             const res = await dispatch(otpVerification({"email": email, "otp": otp.join('')}))
//             console.log(email);
//             console.log(otp);
//             console.log(res);
//             if(res.payload.status) {
//               navigate("/set-password", {state: {email}});

//             }
//             else {
//                 toast.error("Invalid OTP.");
//               }
//             // else{
//             //   navigate("/login-password", { state: { email } });
//             // }

//         // e.preventDefault();
//         // const enteredOtp = otp.join('');
//         // if(enteredOtp === '12345'){
//         //     navigate('/set-password');
//         // }
//     }

//     const handleResend = async (e)=> {
//         e.preventDefault();

//         const res = await dispatch(resendOtp({"email": email, "otp": otp.join('')}))
//         console.log(email);
//         console.log(otp);
//         console.log(res);
//         // if(res.payload.status) {
//         //   navigate("/set-password", {state: {email}});

//         // }
//         // else {
//         //     toast.error("Invalid OTP.");
//         //   }
// }

//     return (
//         <div className="sign-sec pt-0">
//             <div className="container">
//                 <div className="sign-sec-inr">

//                     <div className="docpnl-sec-head" style={{ padding: "0", margin: "0" }}>
//                         <div className="back-btn" style={{ padding: "0", margin: "0" }}>
//                             <Link to="/forgot-password">
//                                 <img src="./images/left-arrow.svg" alt="Back" />
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="sign-inr-row row" style={{ padding: "0", margin: "0" }}>
//                         <div className="sign-left-wrp col-lg-7" style={{ padding: "0", margin: "0" }}>
//                             <div className="sign-left has-texture">
//                                 <div className="texture">
//                                     <img src="./images/doctor-symbol.png" alt="Doctor Symbol" />
//                                 </div>
//                                 <div className="sign-left-img">
//                                     <img src="./images/otp-bnr.png" alt="OTP Banner" style={{ width: "63%" }} />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="sign-right-wrp col-lg-5" style={{ padding: "0", margin: "0" }}>
//                             <div className="sign-right">
//                                 <div className="logo-wrp">
//                                     <div className="logo-inr-wrp">
//                                         <span>
//                                             <img src="./images/logo.png" alt="Logo" />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="sign-inr-head">
//                                     <h1>Enter Verification Code</h1>
//                                     <p>We have sent the code verification to your registered email id or phone number</p>
//                                 </div>
//                                 <div className="sign-form">
//                                     {/* <form onSubmit={handleSubmit}>
//                     <div className="sign-form-steps-wrp">
//                       <div className="sign-form-step">
//                         <div className="formfield">
//                           <div className="otp-container">
//                             <input type="number" required pattern="\d" maxLength={1} />
//                             <input type="number" required pattern="\d" maxLength={1} />
//                             <input type="number" required pattern="\d" maxLength={1} />
//                             <input type="number" required pattern="\d" maxLength={1} />
//                             <input type="number" required pattern="\d" maxLength={1} />
//                           </div>
//                         </div>
//                         <div className="resend-code">
//                           <p>Didn’t get a Code? <input type="submit" value="Resend" /></p>
//                         </div>
//                         <input type="submit" value="Continue" />
//                       </div>
//                     </div>
//                   </form> */}

//                                     <form onSubmit={handleSubmit}>
//                     <div className="sign-form-steps-wrp">
//                       <div className="sign-form-step">
//                         <div className="formfield">
//                           <div className="otp-container" style={{
//                                 display: "flex",
//                                 gap: "10px",
//                                 justifyContent: "center",
//                                 marginBottom: "10px",
//                             }}>
//                           {[0, 1, 2, 3, 4]?.map((index) => (
//                                                 <input
//                                                     key={index}
//                                                     id={`otp-${index}`}
//                                                     ref={(el) => (inputRefs.current[index] = el)}
//                                                     type="number"
//                                                     maxLength={1}
//                                                     value={otp[index]}
//                                                     className="otp-verification-code-in"
//                                                     onChange={(e) => handleChange(index, e.target.value)}
//                                                     onKeyDown={(e) => handleKeyDown(index, e)}
//                                                     onPaste={handlePaste}
//                                                     // style={{height:"40px",
//                                                     //     width:"40px"
//                                                     // }}

//                                                 />
//                                             ))}
//                           </div>
//                         </div>
//                         {/* <div className="resend-code" style={{paddingRight:"18px"}}>
//                           <p>Didn’t get a Code? <Link>Resend</Link></p>
//                         </div> */}
//                         <div className="resend-code" style={{ paddingRight: "18px" }}>
//                                                     <p>Didn’t get a Code?
//                                                         <Link to="#" onClick={handleResend}  style={{ color: '#199FD9',marginLeft:5 }}>Resend</Link>
//                                                     </p>
//                                                 </div>
//                         <input type="submit" value="Continue" />
//                       </div>
//                     </div>
//                   </form>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OtpVerification;

import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { otpVerification, resendOtp } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(0);
  const { sendEmail } = location.state || {};
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const email = sendEmail;
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const inputRefs = useRef([]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent pasting multiple characters
    // if (!/^\d?$/.text(value))
    //     return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 5);
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (i < 5) {
        newOtp[i] = char;
        if (i < 4) {
          inputRefs.current[i + 1].focus();
        }
      }
    });

    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      return toast.error("Please enter the OTP");
    }

    const res = await dispatch(
      otpVerification({ email: sendEmail, otp: otp.join("") })
    );
    // console.log(sendEmail);
    // console.log(otp);
    // console.log(res);
    if (res.payload.status) {
      // setShowNewPasswordModal(true);
      navigate("/set-password", { state: { email } });
    } else {
      toast.error("Please enter the correct OTP.");
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;

    const res = await dispatch(resendOtp({ email: email, otp: otp.join("") }));

    if (res.payload.status) {
      toast.success("OTP resent successfully.");
      setCountdown(120);
    } else {
      toast.error("Failed to resend OTP.");
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <div className="sign-sec pt-0">
        <div className="container">
          <div className="sign-sec-inr">
            <div
              className="docpnl-sec-head"
              style={{ padding: "0", margin: "0" }}
            >
              <div className="back-btn" style={{ padding: "0", margin: "0" }}>
                <Link to="/forgot-password">
                  <img src="./images/left-arrow.svg" alt="Back" />
                </Link>
              </div>
            </div>

            <div
              className="sign-inr-row row"
              style={{ padding: "0", margin: "0" }}
            >
              <div
                className="sign-left-wrp col-lg-7"
                style={{ padding: "0", margin: "0" }}
              >
                <div className="sign-left has-texture">
                  <div className="texture">
                    <img src="./images/doctor-symbol.png" alt="Doctor Symbol" />
                  </div>
                  <div className="sign-left-img">
                    <img
                      src="./images/otp-bnr.png"
                      alt="OTP Banner"
                      style={{ width: "63%" }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="sign-right-wrp col-lg-5"
                style={{ padding: "0", margin: "0" }}
              >
                <div className="sign-right">
                  <div className="logo-wrp">
                    <div className="logo-inr-wrp">
                      <span>
                        <img src="./images/logo.png" alt="Logo" />
                      </span>
                    </div>
                  </div>
                  <div className="sign-inr-head">
                    <h1>Enter Verification Code</h1>
                    <p>
                      We have sent the code verification to your registered
                      email id
                    </p>
                  </div>
                  <div className="sign-form">
                    <form onSubmit={handleSubmit}>
                      <div className="sign-form-steps-wrp">
                        <div className="sign-form-step">
                          <div className="formfield">
                            <div
                              className="otp-container"
                              style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                                marginBottom: "10px",
                              }}
                            >
                              {[0, 1, 2, 3, 4]?.map((index) => (
                                <input
                                  key={index}
                                  id={`otp-${index}`}
                                  ref={(el) => (inputRefs.current[index] = el)}
                                  type="number"
                                  maxLength={1}
                                  value={otp[index]}
                                  className="otp-verification-code-in"
                                  onChange={(e) =>
                                    handleChange(index, e.target.value)
                                  }
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  onPaste={handlePaste}
                                />
                              ))}
                            </div>
                          </div>

                          <div
                            className="resend-code"
                            style={{ paddingRight: "18px" }}
                          >
                            <p>
                              Didn’t get a Code?
                              {countdown > 0 ? (
                                <span style={{ color: "#888", marginLeft: 5 }}>
                                  Resend in{" "}
                                  <span style={{ color: "#199FD9" }}>
                                    {formatTime(countdown)}sec
                                  </span>
                                </span>
                              ) : (
                                <Link
                                  to="#"
                                  onClick={handleResend}
                                  style={{ color: "#199FD9", marginLeft: 5 }}
                                >
                                  Resend
                                </Link>
                              )}
                            </p>
                          </div>
                          <input type="submit" value="Continue" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal show={showNewPasswordModal} onHide={() => setShowNewPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Enter New Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>OTP verified successfully. Please proceed to enter your new password.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setShowNewPasswordModal(false);
                        navigate("/set-password", { state: { email } }); // Navigate when OK is clicked
                    }}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal> */}

      {/* <Modal
  show={showNewPasswordModal}
  onHide={() => setShowNewPasswordModal(false)}
  centered
  className="popup-wrp"
  dialogClassName="custom-modal"
>
  <style>{`
    .custom-modal .modal-content {
      padding: 30px 20px;
      position: relative; 
    }
  `}</style>

  <div className="modal-icon text-center mt-4">
    <img src="/images/not-found.svg" alt="Info Icon" />
  </div>

  <span
    aria-hidden="true"
    onClick={() => setShowNewPasswordModal(false)}
    style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer' }}
  >
    <img src="/images/cross-blue.png" alt="Close" />
  </span>

  <Modal.Header className="border-0 flex-column text-center">
    <Modal.Title className="w-100">
      <h2>Enter New Password</h2>
    </Modal.Title>
    <p>You will be redirected to reset your password.</p>
  </Modal.Header>

  <Modal.Footer className="d-flex justify-content-center border-0">
    <Link
      to="/set-password"
      state={{ email: sendEmail }}
      className="orange-btn"
      onClick={() => setShowNewPasswordModal(false)}
    >
      Ok
    </Link>
  </Modal.Footer>
</Modal> */}
    </>
  );
};

export default OtpVerification;
