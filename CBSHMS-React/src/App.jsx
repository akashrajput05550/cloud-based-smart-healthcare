import { Routes, Route } from "react-router-dom";

// ==================================================
// COMMON PAGES
// ==================================================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ==================================================
// DOCTOR PAGES
// ==================================================
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorStatistics from "./pages/DoctorStatistics";
import DoctorProfile from "./pages/DoctorProfile";

// ==================================================
// ADMIN PAGES
// ==================================================
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctors from "./pages/AdminDoctors";
import AdminPatients from "./pages/AdminPatients";
import AdminAppointments from "./pages/AdminAppointments";
import AdminUsers from "./pages/AdminUsers";

// ==================================================
// PATIENT PAGES
// ==================================================
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import BookAppointment from "./pages/BookAppointment";
import PatientDoctors from "./pages/PatientDoctors";
import PatientProfile from "./pages/PatientProfile";

// ==================================================
// PROTECTED ROUTE
// ==================================================
import AdminProtectedRoute from "./components/AdminProtectedRoute";


function App() {
  return (
    <Routes>

      {/* ==================================================
          COMMON ROUTES
      ================================================== */}

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================================================
          DOCTOR ROUTES
      ================================================== */}

      {/* Doctor Dashboard */}
      <Route
        path="/doctor-dashboard"
        element={<DoctorDashboard />}
      />

      {/* Doctor Appointments */}
      <Route
        path="/doctor-appointments"
        element={<DoctorAppointments />}
      />

      {/* Doctor Patients */}
      <Route
        path="/doctor-patients"
        element={<DoctorPatients />}
      />

      {/* Doctor Statistics */}
      <Route
        path="/doctor-statistics"
        element={<DoctorStatistics />}
      />

      {/* Doctor Profile */}
      <Route
        path="/doctor-profile"
        element={<DoctorProfile />}
      />


      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Manage Doctors */}
      <Route
        path="/admin-doctors"
        element={
          <AdminProtectedRoute>
            <AdminDoctors />
          </AdminProtectedRoute>
        }
      />

      {/* Manage Patients */}
      <Route
        path="/admin-patients"
        element={
          <AdminProtectedRoute>
            <AdminPatients />
          </AdminProtectedRoute>
        }
      />

      {/* Manage Appointments */}
      <Route
        path="/admin-appointments"
        element={
          <AdminProtectedRoute>
            <AdminAppointments />
          </AdminProtectedRoute>
        }
      />

      {/* Manage Users */}
      <Route
        path="/admin-users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />


      {/* ==================================================
          PATIENT ROUTES
      ================================================== */}

      {/* Patient Dashboard */}
      <Route
        path="/patient-dashboard"
        element={<PatientDashboard />}
      />

      {/* Patient Appointments */}
      <Route
        path="/patient-appointments"
        element={<PatientAppointments />}
      />

      {/* Book Appointment */}
      <Route
        path="/patient-book-appointment"
        element={<BookAppointment />}
      />

      {/* Find Doctors */}
      <Route
        path="/patient-doctors"
        element={<PatientDoctors />}
      />

      {/* Patient Profile */}
      <Route
        path="/patient-profile"
        element={<PatientProfile />}
      />

    </Routes>
  );
}

export default App;