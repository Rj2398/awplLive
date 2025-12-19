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
