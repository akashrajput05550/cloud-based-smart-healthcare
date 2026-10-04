import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const email =
    localStorage.getItem("loggedInEmail") || "Administrator";

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="admin-navbar">

        <div className="admin-logo">
          CBSHMS
        </div>

        <div className="admin-nav-right">

          <span className="admin-nav-title">
            Admin Dashboard
          </span>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-container">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="admin-welcome">

          <div>

            <h1>
              Welcome, Admin 👨‍💼
            </h1>

            <p>
              {email}
            </p>

          </div>

          <span className="admin-role">
            Administrator
          </span>

        </section>


        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="admin-heading">

          <h2>
            Admin Control Panel
          </h2>

          <p>
            Manage doctors, patients, appointments and users.
          </p>

        </div>


        {/* =================================================
            ADMIN CARDS
        ================================================= */}

        <section className="admin-grid">

          {/* ================= DOCTORS ================= */}

          <div className="admin-card">

            <div className="admin-card-icon">
              👨‍⚕️
            </div>

            <h3>
              Manage Doctors
            </h3>

            <p>
              View, add, edit and manage registered
              doctors and their account information.
            </p>

            <Link
              to="/admin-doctors"
              className="admin-card-button"
            >
              Manage Doctors
            </Link>

          </div>


          {/* ================= PATIENTS ================= */}

          <div className="admin-card">

            <div className="admin-card-icon">
              👥
            </div>

            <h3>
              Manage Patients
            </h3>

            <p>
              View and manage registered patients
              and their personal information.
            </p>

            <Link
              to="/admin-patients"
              className="admin-card-button"
            >
              Manage Patients
            </Link>

          </div>


          {/* ================= APPOINTMENTS ================= */}

          <div className="admin-card">

            <div className="admin-card-icon">
              📅
            </div>

            <h3>
              Manage Appointments
            </h3>

            <p>
              View and manage all appointments
              across the healthcare system.
            </p>

            <Link
              to="/admin-appointments"
              className="admin-card-button"
            >
              Manage Appointments
            </Link>

          </div>


          {/* ================= USERS ================= */}

          <div className="admin-card">

            <div className="admin-card-icon">
              👤
            </div>

            <h3>
              Manage Users
            </h3>

            <p>
              View all registered users and
              review their account information.
            </p>

            <Link
              to="/admin-users"
              className="admin-card-button"
            >
              Manage Users
            </Link>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="admin-quick-section">

          <h2>
            Quick Actions
          </h2>

          <div className="admin-quick-links">

            <Link
              to="/admin-doctors"
              className="admin-quick-button"
            >
              👨‍⚕️ Doctors
            </Link>

            <Link
              to="/admin-patients"
              className="admin-quick-button"
            >
              👥 Patients
            </Link>

            <Link
              to="/admin-appointments"
              className="admin-quick-button"
            >
              📅 Appointments
            </Link>

            <Link
              to="/admin-users"
              className="admin-quick-button"
            >
              👤 Users
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;