// import React from 'react';
// import { useState } from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { forgotPassword } from '../../redux/slices/userSlice';
// import { toast } from 'react-toastify';

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [email, setEmail] = useState('');

//   const { loading } = useSelector((state) => state.user)

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // navigate('/otp-verification');

//         const res = await dispatch(forgotPassword({"email": email}))
//         console.log(res);
//         console.log(res.payload.status);
//         if(res.payload.status) {
//           navigate('/otp-verification', {state: {email}});
//          }
//          else {
//                    toast.error("Invalid email. Please try again.");
//                  }

//   };

//   return (
//     <div className="sign-sec pt-0">
//       <div className="container">
//         <div className="sign-sec-inr">

//           <div className="docpnl-sec-head" style={{padding:"0", margin:"0"}}>
//             <div className="back-btn" style={{padding:"0", margin:"0"}}>
//               <Link to="/login-password">
//                 <img src="./images/left-arrow.svg" alt="Back" />
//               </Link>
//             </div>
//           </div>

//           <div className="sign-inr-row row" style={{padding:"0", margin:"0"}}>
//             <div className="sign-left-wrp col-lg-7" style={{padding:"0", margin:"0"}}>
//               <div className="sign-left has-texture">
//                 <div className="texture">
//                   <img src="./images/doctor-symbol.png" alt="Doctor Symbol" />
//                 </div>
//                 <div className="sign-left-img">
//                   <img src="./images/forgot-pass-bnr.png" alt="Forgot Password Banner" style={{width:"80%"}}/>
//                 </div>
//               </div>
//             </div>
//             <div className="sign-right-wrp col-lg-5" style={{padding:"0", margin:"0"}}>
//               <div className="sign-right">
//                 <div className="logo-wrp">
//                   <div className="logo-inr-wrp">
//                     <span>
//                       <img src="./images/logo.png" alt="Logo" />
//                     </span>
//                   </div>
//                 </div>
//                 <div className="sign-inr-head">
//                   <h1>Forgot Password</h1>
//                   <p>Select which contact details should be used to reset your password</p>
//                 </div>
//                 <div className="sign-form">
//                   <form onSubmit={handleSubmit}>
//                     <div className="sign-form-steps-wrp">
//                       <div className="sign-form-step">
//                         <div className="formfield mb-0">
//                           <label>Enter Email Id</label>
//                           <input
//                             type="email"
//                             placeholder="Enter Your Email Id"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                           />
//                         </div>
//                         <input type="submit" value={loading ? "Loading..." : "Continue"} />
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter the email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }

    const res = await dispatch(forgotPassword({ email: email }));
    // console.log(res);
    // console.log(res.payload?.status);
    if (res.payload.status) {
      navigate("/otp-verification", { state: { sendEmail: email } });
    } else {
      toast.error("Email is not registered");
    }
  };

  return (
    <div className="sign-sec pt-0">
      <div className="container">
        <div className="sign-sec-inr">
          <div
            className="docpnl-sec-head"
            style={{ padding: "0", margin: "0" }}
          >
            <div className="back-btn" style={{ padding: "0", margin: "0" }}>
              <Link to="/">
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
                    src="./images/forgot-pass-bnr.png"
                    alt="Forgot Password Banner"
                    style={{ width: "80%" }}
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
                  <h1>Forgot Password</h1>
                  <p>
                    Select which contact details should be used to reset your
                    password
                  </p>
                </div>
                <div className="sign-form">
                  <form onSubmit={handleSubmit}>
                    <div className="sign-form-steps-wrp">
                      <div className="sign-form-step">
                        <div className="formfield mb-0">
                          <label>Enter Email Id</label>
                          <input
                            type="email"
                            placeholder="Enter Your Email Id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <input
                          type="submit"
                          value={loading ? "Loading..." : "Continue"}
                        />
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
  );
};

export default ForgotPassword;
