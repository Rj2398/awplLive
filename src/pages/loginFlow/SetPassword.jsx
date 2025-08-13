// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import {useLocation} from 'react-router-dom';
// import { resetPassword } from '../../redux/slices/userSlice';
// import { toast } from 'react-toastify';

// const SetPassword = () => {
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [showModal, setShowModal] = useState(false);

//     const dispatch = useDispatch();
//     const location = useLocation();
//     const {email} = location.state || {};

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//     // 1. Validate password strength
//     const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
//     if (!passRegex.test(password)) {
//         toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number or special character.");
//         return;
//     }

//     // 2. Check if passwords match
//     if (password !== confirmPassword) {
//         toast.error("Passwords do not match");
//         return;
//     }

//     try{
//         const res = await dispatch(resetPassword({"email": email, "password": password}));
//         console.log(email);
//         console.log(password);
//         if (res.payload?.status){
//             setShowModal(true);
//         }
//         else{
//             toast.error(res.payload?.message || "Password reset failed");
//         }

//     }
//     catch (error){
//         console.log("Password reset error:", error);
//         toast.error("An error occurred during password reset");
//     }

//     //     const passwordsMatch = password === confirmPassword && password.length >= 6;

//     //     const [showSuccess, setShowSuccess] = useState(false);

//     //     const onSubmit = async (data) => {
//     //       if (passwordsMatch) {
//     //         try {
//     //           await reset_password({
//     //             user_id: user?.user_id,
//     //             password: data.password,
//     //             password_confirmation: data.confirmPassword,
//     //           });
//     //           handleClose();
//     //           setShowSuccess(true);
//     //         } catch (error) {
//     //           console.error("Password reset failed:", error);
//     //         }
//     //       }
//     //     };

//     //         const res = await dispatch(resetPassword({"email": email, "password": password}))
//     //                 console.log(email);
//     //                 console.log(password);
//     //                 console.log(res);
//     //                 if(res.payload.status) {
//     //                   navigate("/set-password", {state: {email}});

//     //                 }
//     //     if (password === confirmPassword && password !== '') {
//     //         setShowModal(true);
//     //     }
//     //     console.log("btn clicked");
//     // };

// }

//     return (
//         <div className="sign-sec set-pass pt-0">
//             <div className="container">
//                 <div className="sign-sec-inr">

//                     <div className="docpnl-sec-head">
//                         <div className="back-btn">
//                             <Link to="/login-password">
//                                 <img src="/images/left-arrow.svg" alt="Icon" />
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="sign-inr-row row">
//                         <div className="sign-left-wrp col-lg-7">
//                             <div className="sign-left has-texture">
//                                 <div className="texture">
//                                     <img src="/images/doctor-symbol.png" alt="Doctor Symbol" />
//                                 </div>
//                                 <div className="sign-left-img">
//                                     <img src="/images/new-pass-bnr.png" alt="Login Left Image" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="sign-right-wrp col-lg-5">
//                             <div className="sign-right">
//                                 <div className="logo-wrp">
//                                     <div className="logo-inr-wrp">
//                                         <span>
//                                             <img src="/images/logo.png" alt="Logo" />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="sign-inr-head">
//                                     <h1>Enter New Password</h1>
//                                     <p>Please enter your new password</p>
//                                 </div>
//                                 <div className="sign-form">
//                                     <form onSubmit={handleSubmit}>
//                                         <div className="sign-form-steps-wrp">
//                                             <div className="sign-form-step">

//                                                 {/* New Password */}
//                                                 <div className="formfield">
//                                                     <label>Enter New Password</label>
//                                                     <div className="input-pass-field position-relative">
//                                                         <input
//                                                             type={showPassword ? 'text' : 'password'}
//                                                             placeholder="Password"
//                                                             required
//                                                             value={password}
//                                                             onChange={(e) => {
//                                                                 setPassword(e.target.value);
//                                                                 if (e.target.value.length === 0) {
//                                                                     setShowPassword(false);
//                                                                 }
//                                                             }}
//                                                         />
//                                                         <span
//                                                             className="eye-btn"
//                                                             onClick={() => {
//                                                                 if (password.length > 0) {
//                                                                     setShowPassword(!showPassword);
//                                                                 }
//                                                             }}
//                                                             style={{
//                                                                 cursor: password.length > 0 ? 'pointer' : 'not-allowed',
//                                                                 position: 'absolute',
//                                                                 right: '10px',
//                                                                 top: '50%',
//                                                                 transform: 'translateY(-50%)'
//                                                             }}
//                                                         >
//                                                             <img
//                                                                 src={
//                                                                     password.length > 0
//                                                                         ? (showPassword ? '/images/eye-open.svg' : '/images/eye-close.svg')
//                                                                         : '/images/eye-close.svg'
//                                                                 }
//                                                                 alt={showPassword ? 'Hide Password' : 'Show Password'}
//                                                             />
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 {/* Confirm Password */}
//                                                 <div className="formfield mb-0">
//                                                     <label>Confirm New Password</label>
//                                                     <div className="input-pass-field position-relative">
//                                                         <input
//                                                             type={showConfirmPassword ? 'text' : 'password'}
//                                                             placeholder="Password"
//                                                             required
//                                                             value={confirmPassword}
//                                                             onChange={(e) => {
//                                                                 setConfirmPassword(e.target.value);
//                                                                 if (e.target.value.length === 0) {
//                                                                     setShowConfirmPassword(false);
//                                                                 }
//                                                             }}
//                                                         />
//                                                         <span
//                                                             className="eye-btn"
//                                                             onClick={() => {
//                                                                 if (confirmPassword.length > 0) {
//                                                                     setShowConfirmPassword(!showConfirmPassword);
//                                                                 }
//                                                             }}
//                                                             style={{
//                                                                 cursor: confirmPassword.length > 0 ? 'pointer' : 'not-allowed',
//                                                                 position: 'absolute',
//                                                                 right: '10px',
//                                                                 top: '50%',
//                                                                 transform: 'translateY(-50%)'
//                                                             }}
//                                                         >
//                                                             <img
//                                                                 src={
//                                                                     confirmPassword.length > 0
//                                                                         ? (showConfirmPassword ? '/images/eye-open.svg' : '/images/eye-close.svg')
//                                                                         : '/images/eye-close.svg'
//                                                                 }
//                                                                 alt={showConfirmPassword ? 'Hide Password' : 'Show Password'}
//                                                             />
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 <Button type="submit" className="orange-btn mt-3">Continue</Button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>

//             {/* Modal */}
//             <Modal
//                 show={showModal}
//                 onHide={() => setShowModal(false)}
//                 centered
//                 className="popup-wrp"
//                 dialogClassName="custom-modal"
//             >
//                 <style>{`
//                     .custom-modal .modal-content {
//                         padding: 30px 0 50px 0;
//                         margin: 0;
//                     }
//                 `}</style>
//                 <div className="modal-icon text-center mt-4">
//                     <img src="/images/check-icon.png" alt="Success" />
//                 </div>
//                 <Modal.Header className="border-0 flex-column text-center">
//                     <Modal.Title className="w-100">
//                         <h2>Congratulations</h2>
//                     </Modal.Title>
//                     <p>Your account is ready to use.</p>
//                 </Modal.Header>
//                 <Modal.Footer className="d-flex justify-content-center border-0">
//                     <Link to="/doctor-home" className="orange-btn" onClick={() => setShowModal(false)}>Go to Dashboard</Link>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default SetPassword;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { email } = location.state || {};
  // console.log(email, "email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter the password");
    }
    if (!confirmPassword.trim()) {
      toast.error("Please confirm your password");
      return;
    }

    // 1. Validate password strength
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
    if (!passRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number or special character."
      );
      return;
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await dispatch(
        resetPassword({ email: email, password: password })
      );
      // console.log(email);
      // console.log(password);
      if (res.payload?.status) {
        setShowModal(true);
      } else {
        toast.error(res.payload?.message || "Password reset failed");
      }
    } catch (error) {
      // console.log("Password reset error:", error);
      toast.error("An error occurred during password reset");
    }
  };

  return (
    <div className="sign-sec set-pass pt-0">
      <div className="container">
        <div className="sign-sec-inr">
          <div className="docpnl-sec-head">
            <div className="back-btn">
              <Link to="/login-password">
                <img src="/images/left-arrow.svg" alt="Icon" />
              </Link>
            </div>
          </div>

          <div className="sign-inr-row row">
            <div className="sign-left-wrp col-lg-7">
              <div className="sign-left has-texture">
                <div className="texture">
                  <img src="/images/doctor-symbol.png" alt="Doctor Symbol" />
                </div>
                <div className="sign-left-img">
                  <img src="/images/new-pass-bnr.png" alt="Login Left Image" />
                </div>
              </div>
            </div>
            <div className="sign-right-wrp col-lg-5">
              <div className="sign-right">
                <div className="logo-wrp">
                  <div className="logo-inr-wrp">
                    <span>
                      <img src="/images/logo.png" alt="Logo" />
                    </span>
                  </div>
                </div>
                <div className="sign-inr-head">
                  <h1>Enter New Password</h1>
                  <p>Please enter your new password</p>
                </div>
                <div className="sign-form">
                  <form onSubmit={handleSubmit}>
                    <div className="sign-form-steps-wrp">
                      <div className="sign-form-step">
                        {/* New Password */}
                        <div className="formfield">
                          <label>Enter New Password</label>
                          <div className="input-pass-field position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                // if (e.target.value.length === 0) {
                                //     setShowPassword(false);
                                // }
                              }}
                            />
                            <span
                              className="eye-btn"
                              onClick={() => {
                                // if (password.length > 0) {
                                setShowPassword(!showPassword);
                                // }
                              }}
                              style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            >
                              <img
                                src={
                                  showPassword
                                    ? "/images/eye-open.svg"
                                    : "/images/eye-close.svg"
                                }
                                alt={
                                  showPassword
                                    ? "Hide Password"
                                    : "Show Password"
                                }
                              />
                            </span>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="formfield mb-0">
                          <label>Confirm New Password</label>
                          <div className="input-pass-field position-relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                // if (e.target.value.length === 0) {
                                //     setShowConfirmPassword(false);
                                // }
                              }}
                            />
                            <span
                              className="eye-btn"
                              onClick={() => {
                                // if (confirmPassword.length > 0) {
                                setShowConfirmPassword(!showConfirmPassword);
                                // }
                              }}
                              style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            >
                              <img
                                src={
                                  showConfirmPassword
                                    ? "/images/eye-open.svg"
                                    : "/images/eye-close.svg"
                                }
                                alt={
                                  showConfirmPassword
                                    ? "Hide Password"
                                    : "Show Password"
                                }
                              />
                            </span>
                          </div>
                        </div>

                        <Button type="submit" className="orange-btn mt-3">
                          Continue
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="popup-wrp"
        dialogClassName="custom-modal"
      >
        <style>{`
    .custom-modal .modal-content {
      padding: 30px 0 50px 0;
      margin: 0;
      position: relative; /* needed for absolute close icon */
    }
  `}</style>

        <div className="modal-icon text-center mt-4">
          <img src="/images/check-icon.png" alt="Success" />
        </div>

        {/* Cross icon to close modal */}
        <span
          aria-hidden="true"
          onClick={() => {
            setShowModal(false), navigate("/login-password");
          }}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            cursor: "pointer",
            zIndex: 1051,
          }}
        >
          <img src="/images/cross-blue.png" alt="Close" />
        </span>

        <Modal.Header className="border-0 flex-column text-center">
          <Modal.Title className="w-100">
            <h2>Congratulations</h2>
          </Modal.Title>
          <p>Your account is ready to use.</p>
        </Modal.Header>

        <Modal.Footer className="d-flex justify-content-center border-0">
          <Link
            to="/"
            className="orange-btn"
            onClick={() => setShowModal(false)}
          >
            Continue
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SetPassword;
