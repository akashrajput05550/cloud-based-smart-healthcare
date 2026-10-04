import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/DoctorStatistics.css";

function DoctorStatistics() {
  const doctorEmail = localStorage.getItem("loggedInEmail");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // LOAD DOCTOR APPOINTMENTS
  // ==========================================
  const loadAppointments = async () => {
    if (!doctorEmail) {
      setErrorMessage("Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("APPOINTMENTS")
      .select("*")
      .eq("doctor_email", doctorEmail);

    if (error) {
      console.error("Statistics error:", error);
      setErrorMessage(error.message);
      setAppointments([]);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  };

  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    loadAppointments();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAppointments = appointments.length;

  const approvedAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "approved"
  ).length;

  const rejectedAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "rejected"
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status?.toLowerCase() === "pending"
  ).length;

  // ==========================================
  // PERCENTAGE
  // ==========================================

  const getPercentage = (value) => {
    if (totalAppointments === 0) {
      return 0;
    }

    return Math.round(
      (value / totalAppointments) * 100
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
  };

  return (
    <div className="statistics-page">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="statistics-navbar">

        <div className="statistics-logo">
          CBSHMS
        </div>

        <div className="statistics-nav-right">

          <span>
            Doctor Statistics
          </span>

          <Link
            to="/login"
            className="statistics-logout"
            onClick={handleLogout}
          >
            Logout
          </Link>

        </div>

      </nav>


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="statistics-container">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="statistics-header">

          <div>

            <h1>
              📊 Statistics
            </h1>

            <p>
              View your appointment statistics and booking summary.
            </p>

          </div>

          <Link
            to="/doctor-dashboard"
            className="statistics-dashboard-btn"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ==========================================
            DOCTOR INFORMATION
        ========================================== */}

        <div className="statistics-doctor-card">

          <div>

            <h2>
              Doctor Statistics
            </h2>

            <p>
              {doctorEmail || "Doctor"}
            </p>

          </div>

          <span>
            Doctor
          </span>

        </div>


        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {errorMessage && (
          <div className="statistics-error">
            {errorMessage}
          </div>
        )}


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (

          <div className="statistics-loading">
            Loading statistics...
          </div>

        ) : (

          <>


            {/* ==========================================
                STATISTICS CARDS
            ========================================== */}

            <div className="statistics-grid">


              {/* TOTAL */}

              <div className="stat-card total">

                <div className="stat-icon">
                  📅
                </div>

                <div>

                  <h3>
                    {totalAppointments}
                  </h3>

                  <p>
                    Total Appointments
                  </p>

                </div>

              </div>


              {/* APPROVED */}

              <div className="stat-card approved">

                <div className="stat-icon">
                  ✅
                </div>

                <div>

                  <h3>
                    {approvedAppointments}
                  </h3>

                  <p>
                    Approved
                  </p>

                </div>

              </div>


              {/* REJECTED */}

              <div className="stat-card rejected">

                <div className="stat-icon">
                  ❌
                </div>

                <div>

                  <h3>
                    {rejectedAppointments}
                  </h3>

                  <p>
                    Rejected
                  </p>

                </div>

              </div>


              {/* PENDING */}

              <div className="stat-card pending">

                <div className="stat-icon">
                  ⏳
                </div>

                <div>

                  <h3>
                    {pendingAppointments}
                  </h3>

                  <p>
                    Pending
                  </p>

                </div>

              </div>

            </div>


            {/* ==========================================
                APPOINTMENT OVERVIEW
            ========================================== */}

            <section className="overview-card">

              <h2>
                Appointment Overview
              </h2>

              <p className="overview-subtitle">
                Current distribution of your appointments.
              </p>


              {/* ======================================
                  APPROVED
              ====================================== */}

              <div className="progress-row">

                <div className="progress-info">

                  <span>
                    Approved
                  </span>

                  <strong>
                    {approvedAppointments}
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress approved-progress"
                    style={{
                      width: `${getPercentage(
                        approvedAppointments
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* ======================================
                  REJECTED
              ====================================== */}

              <div className="progress-row">

                <div className="progress-info">

                  <span>
                    Rejected
                  </span>

                  <strong>
                    {rejectedAppointments}
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress rejected-progress"
                    style={{
                      width: `${getPercentage(
                        rejectedAppointments
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* ======================================
                  PENDING
              ====================================== */}

              <div className="progress-row">

                <div className="progress-info">

                  <span>
                    Pending
                  </span>

                  <strong>
                    {pendingAppointments}
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress pending-progress"
                    style={{
                      width: `${getPercentage(
                        pendingAppointments
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            </section>


            {/* ==========================================
                QUICK ACTIONS
            ========================================== */}

            <div className="statistics-actions">

              <Link
                to="/doctor-appointments"
                className="statistics-action-btn"
              >
                📅 View Appointments
              </Link>

              <Link
                to="/doctor-patients"
                className="statistics-action-btn"
              >
                👥 View Patients
              </Link>

              <Link
                to="/doctor-dashboard"
                className="statistics-action-btn"
              >
                🏠 Dashboard
              </Link>

            </div>


          </>

        )}

      </main>

    </div>
  );
}

export default DoctorStatistics;