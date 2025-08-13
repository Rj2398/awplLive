import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const LoginPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const location = useLocation();
  const { email, password } = location.state || {};

  const [password1, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted");

    // const passRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;

    if (!passRegex.test(password1)) {
      toast.error("Please enter a valid password");
      return;
    }
    const res = await dispatch(login({ email: email, password: password1 }));
    // console.log(res);
    // console.log(email);
    // console.log(password1);

    // setShowModal(true);
    if (res.payload && res.payload.status) {
      setShowModal(true); // Login successful
    }

    // Further form processing logic (like API call) can go here
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOkClick = () => {
    setShowModal(false);
    navigate("/doctor-home", { replace: true }); // This prevents back nav to current page
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
                        <div className="sign-form-step">
                          <div className="formfield">
                            <label>Enter Password</label>
                            <div className="input-pass-field">
                              <input
                                type={showPassword ? "text" : "password"} // 👈 Toggle type
                                id="password"
                                placeholder="Password"
                                required
                                value={password1}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              {/* <span className="eye-btn eye-open">
                                <img src="./images/eye-open.svg" alt="Eye Open" />
                              </span>
                              <span className="eye-btn eye-close">
                                <img src="./images/eye-close.svg" alt="Eye Close" />
                              </span> */}
                              {/* 👇 Eye icon toggle */}
                              <span
                                className="eye-btn"
                                onClick={togglePasswordVisibility}
                                style={{
                                  position: "absolute",
                                  right: 10,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                              >
                                <img
                                  src={
                                    showPassword
                                      ? "./images/eye-open.svg"
                                      : "./images/eye-close.svg"
                                  }
                                  alt={
                                    showPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                />
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Link to="/forgot-password" className="forgot-pass">
                              Forgot password?
                            </Link>
                          </div>
                          {/* <button type="submit" className="orange-btn loginBtn">
                            Login
                          </button> */}
                          <button type="submit" className="orange-btn">
                            {" "}
                            Login{" "}
                          </button>
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

      {/* Login Successful Modal */}
      {/* <div
        className="modal fade popup-wrp"
        id="loginSuccessful"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-icon">
              <img src="./images/check-icon.png" alt="Check Icon" />
            </div>
            <div className="modal-header">
              <h2 id="exampleModalLongTitle">Login Successful</h2>
              <p>Welcome to the world of health.</p>
            </div>
            <div className="modal-footer">
              <Link to="/doctor-home" className="orange-btn">
                Ok
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      <Modal
        show={showModal}
        onHide={() => {}}
        centered
        className="popup-wrp"
        id="congratulations"
        dialogClassName="custom-modal"
      >
        <style>{`
                      .custom-modal .modal-content{
                        padding:30px 0 50px 0;
                        margin:0;
                      }
            
                    `}</style>
        <div className="modal-icon text-center mt-4">
          <img src="/images/check-icon.png" alt="Icon" />
        </div>
        <Modal.Header className="border-0 flex-column text-center">
          <Modal.Title id="exampleModalLongTitle" className="w-100">
            <h2>Login Successful</h2>
          </Modal.Title>
          <p>Welcome to the world of health.</p>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center border-0">
          {/* <Link to="/doctor-home" className="orange-btn" onClick={() => setShowModal(false)}>Ok</Link> */}
          <button className="orange-btn" onClick={handleOkClick}>
            Ok
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginPassword;
