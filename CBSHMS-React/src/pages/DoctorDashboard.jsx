import { Link, useNavigate } from "react-router-dom";
import "../style/DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  // Get logged-in doctor's email
  const email = localStorage.getItem("loggedInEmail");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    navigate("/login");
  };

  return (
    <div className="doctor-dashboard">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="doctor-navbar">

        <div className="doctor-logo">
          CBSHMS
        </div>

        <div className="doctor-nav-right">

          <span className="doctor-nav-title">
            Doctor Dashboard
          </span>

          <button
            type="button"
            className="doctor-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="doctor-container">

        {/* =========================
            WELCOME SECTION
        ========================= */}
        <section className="doctor-welcome">

          <div>
            <h2>
              Welcome, Doctor 👨‍⚕️
            </h2>

            <p>
              {email || "Doctor"}
            </p>
          </div>

          <span className="doctor-role">
            Doctor
          </span>

        </section>


        {/* =========================
            DASHBOARD CARDS
        ========================= */}
        <section className="doctor-grid">

          {/* =========================
              APPOINTMENTS
          ========================= */}
          <div className="doctor-card">

            <h3>
              📅 Appointments
            </h3>

            <p>
              Manage your patient appointments
              and review upcoming bookings.
            </p>

            <Link
              to="/doctor-appointments"
              className="doctor-card-button"
            >
              View Appointments
            </Link>

          </div>


          {/* =========================
              PATIENTS
          ========================= */}
          <div className="doctor-card">

            <h3>
              👥 Patients
            </h3>

            <p>
              View and manage information about
              your patients.
            </p>

            <Link
              to="/doctor-patients"
              className="doctor-card-button"
            >
              View Patients
            </Link>

          </div>


          {/* =========================
              STATISTICS
          ========================= */}
          <div className="doctor-card">

            <h3>
              📊 Statistics
            </h3>

            <p>
              View appointment statistics,
              approved bookings and pending requests.
            </p>

            <Link
              to="/doctor-statistics"
              className="doctor-card-button"
            >
              View Statistics
            </Link>

          </div>


          {/* =========================
              PROFILE
          ========================= */}
          <div className="doctor-card">

            <h3>
              👤 My Profile
            </h3>

            <p>
              View and update your doctor profile
              and personal information.
            </p>

            <Link
              to="/doctor-profile"
              className="doctor-card-button"
            >
              Edit Profile
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DoctorDashboard;