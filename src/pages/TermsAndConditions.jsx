import React from "react";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />

            <div className="container py-4">
              <h1 className="mb-4">Terms and Conditions</h1>
              <p>Last updated: April 25, 2025</p>

              <section className="mt-4">
                <h4>1. Acceptance of Terms</h4>
                <p>
                  By accessing and using our services, you accept and agree to be bound
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mt-4">
                <h4>2. Modifications to Terms</h4>
                <p>
                  We reserve the right to update the Terms and Conditions at any time.
                  You should review this page periodically.
                </p>
              </section>

              <section className="mt-4">
                <h4>3. User Responsibilities</h4>
                <p>
                  Users must not misuse the service. You agree not to use the service
                  for any unlawful or prohibited activities.
                </p>
              </section>

              <section className="mt-4">
                <h4>4. Intellectual Property</h4>
                <p>
                  All content, design, and graphics are the property of our platform and
                  may not be reused without permission.
                </p>
              </section>

              <section className="mt-4">
                <h4>5. Contact Us</h4>
                <p>
                  If you have any questions about these Terms, please contact us at
                  support@example.com.
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

export default TermsAndConditions;
