import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { firstLogin } from "../../redux/slices/userSlice";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const email = localStorage.getItem("email")

  const dispatch = useDispatch();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        firstLogin({
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        })
      );
      // console.log(email);
      // console.log(password);
      // console.log(confirmPassword);
      if (res.payload?.status) {
        setShowModal(true);
      } else {
        toast.error(res.payload?.message || "Password creation failed");
      }
    } catch (error) {
      // console.log("Password creation error:", error);
      toast.error("An error occurred during password creation");
    }
    // if (password === confirmPassword && password !== '') {

    //     setShowModal(true);
    // }
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

                <div className="sign-form">
                  <form onSubmit={handleSubmit}>
                    <div className="sign-form-steps-wrp">
                      <div className="sign-form-step">
                        <div className="formfield">
                          <label>Create Password</label>
                          <div className="input-pass-field">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              required
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                // if (e.target.value.length === 0) {
                                //     setShowPassword(false);
                                // }
                              }}
                            />
                            {/* <span className="eye-btn eye-open">
                                                            <img src="/images/eye-open.svg" alt="Icon" />
                                                        </span>
                                                        <span className="eye-btn eye-close">
                                                            <img src="/images/eye-close.svg" alt="Icon" />
                                                        </span> */}
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

                        <div className="formfield mb-0">
                          <label>Confirm Password</label>
                          <div className="input-pass-field">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Password"
                              required
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                            {/* <span className="eye-btn eye-open">
                                                            <img src="/images/eye-open.svg" alt="Icon" />
                                                        </span>
                                                        <span className="eye-btn eye-close">
                                                            <img src="/images/eye-close.svg" alt="Icon" />
                                                        </span> */}
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

                        <Button type="submit" className="orange-btn">
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="popup-wrp"
        id="congratulations"
        dialogClassName="custom-modal"
      >
        <style>{`
                    .custom-modal .modal-content {
                        padding: 30px 0 50px 0;
                        margin: 0;
                    }
                `}</style>
        <div className="modal-icon text-center mt-4">
          <img src="/images/check-icon.png" alt="Icon" />
        </div>
        <Modal.Header
          closeButton={false}
          className="border-0 flex-column text-center"
        >
          <Modal.Title className="w-100">
            <h2>Congratulations</h2>
          </Modal.Title>
          <p>Your account is ready to use.</p>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center border-0">
          <Link
            to="/doctor-home"
            className="orange-btn"
            onClick={() => setShowModal(false)}
          >
            Go to Dashboard
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreatePassword;
