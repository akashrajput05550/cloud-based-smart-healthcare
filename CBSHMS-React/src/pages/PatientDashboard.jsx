import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Patient");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("USERS")
        .select("name, email, role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Patient profile error:", error);

        // Use localStorage as fallback
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("loggedInEmail");

        if (storedName) {
          setUserName(storedName);
        }

        if (storedEmail) {
          setEmail(storedEmail);
        }

        return;
      }

      if (data) {
        setUserName(data.name || "Patient");
        setEmail(data.email || user.email || "");
      }
    } catch (error) {
      console.error("Error loading patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="patient-loading">
        <div className="patient-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="patient-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="patient-navbar">

        <div className="patient-logo">
          CBSHMS
        </div>

        <div className="patient-nav-right">

          <span className="patient-dashboard-title">
            Patient Dashboard
          </span>

          <button
            className="patient-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="patient-container">

        {/* =========================
            WELCOME CARD
        ========================= */}

        <section className="patient-welcome-card">

          <div className="patient-welcome-content">

            <h1>
              Welcome, {userName} 👨‍⚕️
            </h1>

            <p>
              {email}
            </p>

          </div>

          <div className="patient-role-badge">
            Patient
          </div>

        </section>


        {/* =========================
            DASHBOARD CARDS
        ========================= */}

        <section className="patient-card-grid">

          {/* APPOINTMENTS */}

          <div className="patient-feature-card">

            <div className="patient-card-icon">
              📅
            </div>

            <h2>
              My Appointments
            </h2>

            <p>
              View your upcoming and previous
              doctor appointments.
            </p>

            <button
              className="patient-card-button"
              onClick={() =>
                navigate("/patient-appointments")
              }
            >
              View Appointments
            </button>

          </div>


          {/* BOOK APPOINTMENT */}

          <div className="patient-feature-card">

            <div className="patient-card-icon">
              🩺
            </div>

            <h2>
              Book Appointment
            </h2>

            <p>
              Find a doctor and book a new
              medical appointment.
            </p>

            <button
              className="patient-card-button"
              onClick={() =>
                navigate("/patient-book-appointment")
              }
            >
              Book Appointment
            </button>

          </div>


          {/* DOCTORS */}

          <div className="patient-feature-card">

            <div className="patient-card-icon">
              👨‍⚕️
            </div>

            <h2>
              Find Doctors
            </h2>

            <p>
              View available doctors and their
              specializations.
            </p>

            <button
              className="patient-card-button"
              onClick={() =>
                navigate("/patient-doctors")
              }
            >
              View Doctors
            </button>

          </div>


          {/* PROFILE */}

          <div className="patient-feature-card">

            <div className="patient-card-icon">
              👤
            </div>

            <h2>
              My Profile
            </h2>

            <p>
              View and update your personal
              information.
            </p>

            <button
              className="patient-card-button"
              onClick={() =>
                navigate("/patient-profile")
              }
            >
              Edit Profile
            </button>

          </div>

        </section>


        {/* =========================
            INFORMATION SECTION
        ========================= */}

        <section className="patient-info-card">

          <h2>
            🏥 CBSHMS Patient Services
          </h2>

          <p>
            Manage your healthcare appointments,
            find doctors, and keep your personal
            information up to date.
          </p>

          <div className="patient-info-grid">

            <div>
              <strong>📅 Appointments</strong>
              <span>
                Manage your medical appointments.
              </span>
            </div>

            <div>
              <strong>👨‍⚕️ Doctors</strong>
              <span>
                Find doctors and specialists.
              </span>
            </div>

            <div>
              <strong>📋 Medical Care</strong>
              <span>
                Keep track of your healthcare.
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default PatientDashboard;