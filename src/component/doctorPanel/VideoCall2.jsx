import React, { useEffect } from "react";

// Importing styles from public via index.html, so no need to import CSS here

const VideoCall2 = () => {
  useEffect(() => {
    // Load external JS libraries only once when component mounts
    const loadScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");
    loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js");
    loadScript("https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js");
    loadScript("/js/common.js");
  }, []);

  return (
    <main className="doctor-panel video-call-pg">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          {/* Panel Header */}
          <div className="doc-panel-header">
            <div className="logo">
              <a href="/doctor-home">
                <img src="/images/logo.png" alt="Logo" />
              </a>
            </div>
          </div>

          {/* Video Call Screen */}
          <div className="video-call-screen">
            <div className="vdo-call-scrn-row row">
              <div className="vdo-call-scrn-left-wrp col-lg-6">
                <div className="vdoclscrn-left">
                  <div className="vdo-screen">
                    <div className="vdo-screen-controls">
                      <div className="vdoscrn-controls-head">
                        <h1>Nicholas Strattenberg</h1>
                        <div className="vdoscrn-status-time-wrp">
                          <span className="vdoscrn-status live">LIVE</span>
                          <span className="vdoscrnduration-time">03:15</span>
                        </div>
                      </div>
                      <div className="vdoscrn-controls-body">
                        <div className="vdoscrn-volume-con">
                          <img src="/images/speaker-icon.svg" alt="Icon" />
                          <input type="range" />
                        </div>
                      </div>
                      <div className="vdoscrn-controls-ftr">
                        <div className="vdoscrn-action-controls">
                          <button className="vdo-toggle-btn">
                            <img src="/images/video-cam-icon.svg" alt="Icon" />
                          </button>
                          <button className="vdo-call-end-btn">
                            <img src="/images/call-icon.svg" alt="Icon" />
                          </button>
                          <button className="vdo-mute-toggle-btn">
                            <img src="/images/mic-icon.svg" alt="Icon" />
                          </button>
                        </div>

                        <div className="doc-vdo-scrn">
                          <img
                            src="/images/doc-vdo-thumb.png"
                            alt="Doctor Video Thumbnail"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="patient-vdo-screen">
                      <img
                        src="/images/patient-video-thumb.png"
                        alt="Patient Video Thumbnail"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="vdoclscrn-patient-details-wrp col-lg-6">
                <form>
                  <div className="vdoclscrn-patient-details-wrp-inr">
                    <div className="vdoclscrn-patient-details">
                      <div className="vdoclscrnpd-wrp">
                        <h2>Patient Details:</h2>
                        <div className="vdoclscrnpd">
                          {[
                            ["Patient Name", "Patient Name"],
                            ["Age", "16"],
                            ["Gender", "Male"],
                            ["Height", "Height"],
                            ["Weight", "Weight"],
                            ["Contact No.", "+91-9836541265"],
                          ].map(([label, value], idx) => (
                            <div className="vdoclscrnpd-grp" key={idx}>
                              <span className="vdoclscrnpd-label">{label}</span>
                              <span className="vdoclscrnpd-val">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="vdoclscrnpd-wrp">
                        <h2>Report:</h2>
                        {[1, 2].map((_, i) => (
                          <div className="medicine-wrp-single" key={i}>
                            <div className="vdoclscrnpd">
                              <div className="formfield search-bar">
                                <label>
                                  Medicine Name<span>*</span>
                                </label>
                                <div className="search-input">
                                  <input type="text" placeholder="Ibupro" />
                                  <input type="submit" value="search" />
                                </div>
                              </div>
                              <div className="formfield">
                                <label>
                                  Dosage<span>*</span>
                                </label>
                                <input type="text" placeholder="Dosage" />
                              </div>
                              <div className="formfield">
                                <label>
                                  Frequency<span>*</span>
                                </label>
                                <input type="text" placeholder="16" />
                              </div>
                              <div className="formfield">
                                <label>
                                  Duration<span>*</span>
                                </label>
                                <input type="text" placeholder="Duration" />
                              </div>
                            </div>
                            {i === 1 && (
                              <button type="submit" className="orange-btn">
                                <img
                                  src="/images/plus-icon-circle.svg"
                                  alt="Icon"
                                />{" "}
                                Add More
                              </button>
                            )}
                          </div>
                        ))}

                        <div className="add-notes-wrp vdoclscrnpd">
                          <div className="formfield">
                            <label>Notes:</label>
                            <input type="text" placeholder="Notes:" />
                          </div>
                        </div>

                        <div className="add-notes-wrp vdoclscrnpd">
                          <div className="formfield">
                            <label>
                              Diagnosis <span>*</span>
                            </label>
                            <input type="text" placeholder="Diagnosis" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="orange-btn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoCall2;
