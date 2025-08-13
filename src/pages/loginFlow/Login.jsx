// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";
// import { emailCheck } from '../../redux/slices/userSlice';
// import { toast } from 'react-toastify';
// import { Modal, Button } from 'react-bootstrap';

// const Login = () => {
//   const [showUnrecognizedEmailModal, setShowUnrecognizedEmailModal] = useState(false);
//    const dispatch = useDispatch();
//    const { loading } = useSelector((state) => state.user)

//   const [email, setEmail] = useState('');
//   // const [password, setPassword] = useState('');
//   // const [confirmPassword, setConfirmPassword] = useState('');
//   // const [isFirstTime, setIsFirstTime] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("doctor-app")
//     if(isLoggedIn){
//       navigate("/doctor-home")
//     }
//   },[])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

//     if (!emailRegex.test(email)) {
//       toast.error("Please enter a valid email");
//       return
//     }

//     const res = await dispatch(emailCheck({"email": email}))
//     console.log(res)
//     if(res.payload.data?.verified == 1 && res.payload.data?.new_user == 1) {
//       navigate("/create-password", { state: { email} });    //doctor is login ist time

//     }
//     else if(res.payload.data?.verified == 1 && res.payload.data?.new_user == 0) {
//       navigate("/login-password", { state: { email } });    //doctor is login 2nd time

//     }
//     else{
//       // toast.error("Invalid email. Please try again.");
//       setShowUnrecognizedEmailModal(true);
//     }

//     // dispatch(emailCheck())

//     // Dummy user database
//     // const userDatabase = {
//     //   "test@example.com": { isFirstTime: false },
//     //   "newuser@example.com": { isFirstTime: true },
//     // };

//     // const user = userDatabase[email];

//     // if (user) {
//     //   setIsFirstTime(user.isFirstTime);
//     //   // Navigate to Set Password page for first-time users
//     //   if (user.isFirstTime) {
//     //     navigate("/create-password", { state: { email} });
//     //   } else {
//     //     // Navigate to Login Password page for returning users
//     //     navigate("/login-password", { state: { email } });
//     //   }
//     // } else {
//     //   const modal = new window.bootstrap.Modal(document.getElementById('unrecognizedEmail'));
//     //   modal.show();
//     // }
//   };

//   // const handlePasswordSubmit = (e) => {
//   //   e.preventDefault();
//   //   if (password === confirmPassword) {
//   //     // Submit and navigate to login-password if successful
//   //     navigate("/login-password", { state: { email, password } });
//   //   } else {
//   //     alert("Passwords do not match");
//   //   }
//   // };

//   return (
//     <>
//       <div className="sign-sec">
//         <div className="container">
//           <div className="sign-sec-inr">
//             <div className="sign-inr-row row">
//               <div className="sign-left-wrp col-lg-7">
//                 <div className="sign-left has-texture">
//                   <div className="texture">
//                     <img src="./images/doctor-symbol.png" alt="Doctor Symbol" />
//                   </div>
//                   <div className="sign-left-img">
//                     <img src="./images/login-left-img.png" alt="Login Left Image" />
//                   </div>
//                 </div>
//               </div>
//               <div className="sign-right-wrp col-lg-5">
//                 <div className="sign-right">
//                   <div className="logo-wrp">
//                     <div className="logo-inr-wrp">
//                       <span>
//                         <img src="./images/logo.png" alt="Logo" />
//                       </span>
//                     </div>
//                   </div>
//                   <div className="sign-inr-head">
//                     <h1>Login as Doctor</h1>
//                     <p>Use credentials to access your account</p>
//                   </div>
//                   <div className="sign-form">
//                     <form onSubmit={handleSubmit}>
//                       <div className="sign-form-steps-wrp">
//                         <div className="sign-form-step email-step">
//                           <div className="formfield">
//                             <label>Enter Email Id</label>
//                             <input
//                               type="email"
//                               placeholder="Enter Your Email Id"
//                               required
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                             />
//                           </div>
//                           <input type="submit" value="Next" />
//                         </div>
//                       </div>
//                     </form>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Unrecognized Email Modal */}
//       {/* <div
//         className="modal fade popup-wrp"
//         id="unrecognizedEmail"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="exampleModalCenterTitle"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content">
//             <div className="modal-icon">
//               <img src="./images/wrong-mail-icon.png" alt="Icon" />
//             </div>
//             <div className="modal-header">
//               <h2 id="exampleModalLongTitle">Unrecognized Email Id</h2>
//               <p>Your Email Id is not registered yet.</p>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="orange-btn"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 Ok
//               </button>
//             </div>
//           </div>
//         </div>
//       </div> */}

//             {/* Unrecognized Email Modal */}
//             <Modal
//         show={showUnrecognizedEmailModal}
//         onHide={() => setShowUnrecognizedEmailModal(false)}
//         centered
//         className="popup-wrp"
//       >
//         <Modal.Body className="text-center">
//           <div className="modal-icon">
//             <img src="/images/wrong-mail-icon.png" alt="Icon" />
//           </div>
//           <Modal.Header className="modal-header">
//             <h2>Unrecognized Email Id</h2>
//             <p>Your Email Id is not registered yet.</p>
//           </Modal.Header>
//           <Modal.Footer className="modal-footer">
//             <Button
//               className="orange-btn"
//               onClick={() => setShowUnrecognizedEmailModal(false)}
//             >
//               OK
//             </Button>
//           </Modal.Footer>
//         </Modal.Body>
//       </Modal>

//     </>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emailCheck } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const Login = () => {
  const [showUnrecognizedEmailModal, setShowUnrecognizedEmailModal] =
    useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctor-app");
    if (isLoggedIn) {
      navigate("/doctor-home");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    // const domain = email.split("@")[1];
    // const allowedDomains = [
    //   "gmail.com",
    //   "yahoo.com",
    //   "yopmail.com",
    //   "hotmail.com",
    //   "example.com",
    // ];

    // if (!allowedDomains.includes(domain)) {
    //   setEmailError("Please enter a valid and supported email address");
    //   return;
    // }
    setEmailError("");

    const res = await dispatch(emailCheck({ email: email }));
    // console.log(res);
    if (res.payload.data?.verified == 1 && res.payload.data?.new_user == 1) {
      navigate("/create-password", { state: { email } }); //doctor is login ist time
    } else if (
      res.payload.data?.verified == 1 &&
      res.payload.data?.new_user == 0
    ) {
      navigate("/login-password", { state: { email } }); //doctor is login 2nd time
    } else {
      // toast.error("Invalid email. Please try again.");
      setShowUnrecognizedEmailModal(true);
    }
  };

  return (
    <>
      <div className="sign-sec">
        <div className="container">
          <div className="sign-sec-inr">
            <div className="sign-inr-row row">
              <div className="sign-left-wrp col-lg-7">
                <div className="sign-left has-texture">
                  <div className="texture">
                    <img src="./images/doctor-symbol.png" alt="Doctor Symbol" />
                  </div>
                  <div className="sign-left-img">
                    <img
                      src="./images/login-left-img.png"
                      alt="Login Left Image"
                    />
                  </div>
                </div>
              </div>
              <div className="sign-right-wrp col-lg-5">
                <div className="sign-right">
                  <div className="logo-wrp">
                    <div className="logo-inr-wrp">
                      <span>
                        <img src="./images/logo.png" alt="Logo" />
                      </span>
                    </div>
                  </div>
                  <div className="sign-inr-head">
                    <h1>Login as Doctor</h1>
                    <p>Use credentials to access your account</p>
                  </div>
                  <div className="sign-form">
                    <form onSubmit={handleSubmit}>
                      <div className="sign-form-steps-wrp">
                        <div className="sign-form-step email-step">
                          <div className="formfield">
                            <label>Enter Email Id</label>
                            <input
                              type="email"
                              placeholder="Enter Your Email Id"
                              required
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError("");
                              }}
                            />
                            {emailError && (
                              <div
                                className="text-danger mt-1"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {emailError}
                              </div>
                            )}
                          </div>
                          <input type="submit" value="Next" />
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

      <Modal
        show={showUnrecognizedEmailModal}
        onHide={() => setShowUnrecognizedEmailModal(false)}
        centered
        className="popup-wrp"
      >
        <Modal.Body className="text-center">
          <div className="modal-icon">
            <img src="/images/wrong-mail-icon.png" alt="Icon" />
          </div>
          <Modal.Header className="modal-header">
            <h2>Unrecognized Email Id</h2>
            <p>Your Email Id is not registered yet.</p>
          </Modal.Header>
          <Modal.Footer className="modal-footer">
            <Button
              className="orange-btn"
              onClick={() => setShowUnrecognizedEmailModal(false)}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
