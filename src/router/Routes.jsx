import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import Login from "../pages/loginFlow/Login";
import LoginPassword from "../pages/loginFlow/LoginPassword";
import ForgotPassword from "../pages/loginFlow/ForgotPassword";
import OtpVerification from "../pages/loginFlow/OtpVerification";
import SetPassword from "../pages/loginFlow/SetPassword";

import DoctorHome from "../pages/DoctorHome";
import StartAppointment from "../pages/StartAppointment";
import PatientDetails from "../pages/PatientDetails";
import PatientFullDetails from "../pages/PatientFullDetails";
import ReferredPatientFullDetails from "../pages/ReferredPatientFullDetails";
import PatientProfile from "../pages/PatientProfile";
import PatientProfileFullDetails from "../pages/PatientProfileFullDetails";
import ReferredPatientProfile from "../pages/ReferredPatientProfile";
import MyAppointments from "../pages/MyAppointments";
import ScheduleAppointment from "../pages/ScheduleAppointment";
import CompletedAppointmentScreen from "../pages/CompletedAppointmentScreen";
import CompletedAppoinmentsProfile from "../pages/CompletedAppoinmentsProfile";

import VideoCall from "../component/doctorPanel/VideoCall";
import VideoCall2 from "../component/doctorPanel/VideoCall2";
import NotFoundRedirect from "../component/doctorPanel/NotFoundRedirect";
import PendingPrescription from "../component/doctorPanel/PendingPrescription";

// import PendingAssignedPrescriptionDetails from "../component/doctorPanel/Pendingassignedprescriptiondetails";
// import CompletedAssignedPrescription from "../component/doctorPanel/Completeassignedprescription";
import PendingFullAssigned from "../component/doctorPanel/PendingFullAssigned";
import CompletedAssignedPrescription from "../component/doctorPanel/CompleteAssignedPrescription";
import UserProfile from "../pages/UserProfile";
import PastPatient from "../pages/PastPatient";
import DoctorUnavailability from "../pages/DoctorUnavailability";
import Hod from "../doctorManagement/Hod";
// import StartAppointment from "../pages/StartAppointment";
// import PatientProfile from "../pages/PatientProfile";
// import PatientDetails from "../pages/Patientdetails";
// import ReferredPatientDetails from "../pages/ReferredPatientDetails";
// import ReferredPatientProfile from "../pages/ReferredPatientProfile";
import Notifications from "../pages/Notifications";
import CreatePassword from "../pages/loginFlow/CreatePassword";
// import MyAppointments from "../pages/MyAppointments";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import MyAppointmentsSearch from "../component/MyAppointmentsSearch ";
import GlobalReminderModal from "../component/doctorPanel/GlobalReminderModal";
import Layout from "../component/Layout";
import PrivateRoute from "./PrivateRoute";
import PendingAssignedPrescriptionDetails from "../component/doctorPanel/PendingAssignedPrescriptionDetails";

import PrescriptiveDoctor from "../pages/PrescriptiveDoctor";

function Routers() {
  return (
    <>
      <Routes>
        {/* //LoginFlow */}
        <Route path="/" element={<Login />} />
        <Route path="/login-password" element={<LoginPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/set-password" element={<SetPassword />} />
        {/* //LoginFlow */}

        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />

        {/* //Pages */}
        <Route
          path="/doctor-home"
          element={
            <PrivateRoute>
              <Layout>
                <DoctorHome />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route path="/start-appointment" element={<Layout><StartAppointment /></Layout>} /> */}
        <Route
          path="/patient-details"
          element={
            <PrivateRoute>
              <Layout>
                <PatientDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route path="/patient-full-details" element={<Layout><PatientFullDetails /></Layout>} /> */}
        {/* <Route path="/referred-patient-full-details" element={<Layout><ReferredPatientFullDetails /></Layout>} /> */}
        <Route
          path="/patient-profile"
          element={
            <PrivateRoute>
              <Layout>
                <PatientProfile />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route path="/patient-profile-full-details" element={<Layout><PatientProfileFullDetails /></Layout>} /> */}
        {/* <Route path="/referred-patient-profile" element={<Layout><ReferredPatientProfile /></Layout>} /> */}
        <Route
          path="/my-appointments"
          element={
            <PrivateRoute>
              <Layout>
                <MyAppointments />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/schedule-appointment"
          element={
            <PrivateRoute>
              <Layout>
                <ScheduleAppointment />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/completed-appointment-screen"
          element={
            <PrivateRoute>
              <Layout>
                <CompletedAppointmentScreen />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route path="/completed-appointments-profile" element={<Layout><CompletedAppoinmentsProfile /></Layout>} /> */}
        {/* //Pages */}

        {/* <Route path="/videocall2" element={<VideoCall2 />} /> */}
        <Route
          path="/videocall"
          element={
            <PrivateRoute>
              <Layout>
                <VideoCall />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/PrescriptiveDoctor"
          element={
            <PrivateRoute>
              <Layout>
                <PrescriptiveDoctor />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pendingprescription"
          element={
            <PrivateRoute>
              <Layout>
                <PendingPrescription />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/PendingAssignedPrescriptionDetails"
          element={
            <PrivateRoute>
              <Layout>
                <PendingAssignedPrescriptionDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/CompletedAssignedPrescription"
          element={
            <PrivateRoute>
              <Layout>
                <CompletedAssignedPrescription />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pendingfull"
          element={
            <PrivateRoute>
              <Layout>
                <PendingFullAssigned />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/UserProfile"
          element={
            <PrivateRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pastpatient"
          element={
            <PrivateRoute>
              <Layout>
                <PastPatient />
              </Layout>
            </PrivateRoute>
          }
        />
 
        <Route
          path="/doctorUnavailibility"
          element={
            <PrivateRoute>
              <Layout>
                <DoctorUnavailability />
              </Layout>
            </PrivateRoute>
          }
        /> 

        <Route
          path="/hod"
          element={
            <PrivateRoute>
              <Layout>
                <Hod />
              </Layout>
            </PrivateRoute>
          }
        /> 
        <Route path="/create-password" element={<CreatePassword />} />
        {/* <Route path="/startappointment" element={<StartAppointment />} /> */}
        {/* <Route path="/patientprofile" element={<PatientProfile />} /> */}
        {/* <Route path="/patientdetails" element={<PatientDetails />} /> */}
        {/* <Route path="/refer" element={<ReferredPatientDetails />} /> */}
        {/* <Route path="/referprofile" element={<ReferredPatientProfile />} /> */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Layout>
                <Notifications />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} /> */}
        <Route
          path="/myappointment"
          element={
            <PrivateRoute>
              <Layout>
                <MyAppointments />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </>
  );
}

export default Routers;
