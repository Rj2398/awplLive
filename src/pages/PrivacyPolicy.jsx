import React from "react";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />

            <div className="container py-4">
              <h1 className="mb-4">Privacy Policy</h1>
              <p>Last updated: April 25, 2025</p>

              <section className="mt-4">
                <h4>1. Introduction</h4>
                <p>
                  We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect and how we use it.
                </p>
              </section>

              <section className="mt-4">
                <h4>2. Information We Collect</h4>
                <p>
                  We may collect personal details such as your name, email, phone number, and any other information you provide through our services.
                </p>
              </section>

              <section className="mt-4">
                <h4>3. How We Use Your Information</h4>
                <p>
                  We use your information to operate, maintain, and improve our services, and to communicate with you about updates or support.
                </p>
              </section>

              <section className="mt-4">
                <h4>4. Sharing Your Information</h4>
                <p>
                  We do not sell or share your personal information with third parties except as required by law or to provide our services.
                </p>
              </section>

              <section className="mt-4">
                <h4>5. Data Security</h4>
                <p>
                  We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mt-4">
                <h4>6. Your Rights</h4>
                <p>
                  You have the right to access, correct, or delete your personal information. You may contact us to exercise these rights.
                </p>
              </section>

              <section className="mt-4">
                <h4>7. Contact Us</h4>
                <p>
                  If you have any questions or concerns about our Privacy Policy, please contact us at support@example.com.
                </p>
              </section>
            </div>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
