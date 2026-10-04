import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/PatientProfile.css";

function PatientProfile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Patient");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPatientProfile();
  }, []);

  // =========================
  // LOAD PATIENT PROFILE
  // =========================

  const loadPatientProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile loading error:", error);

        // localStorage fallback
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("loggedInEmail");
        const storedRole = localStorage.getItem("userRole");

        setName(storedName || "Patient");
        setEmail(storedEmail || user.email || "");
        setRole(storedRole || "Patient");

        return;
      }

      if (data) {
        setName(data.name || "Patient");
        setEmail(data.email || user.email || "");
        setRole(data.role || "Patient");
      } else {
        setName("Patient");
      }

    } catch (error) {
      console.error("Unexpected profile error:", error);

      setErrorMessage(
        error?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("USERS")
        .update({
          name: name.trim(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Profile update error:", error);
        setErrorMessage(error.message);
        return;
      }

      // Update localStorage
      localStorage.setItem("userName", name.trim());

      setMessage("Profile updated successfully.");

    } catch (error) {
      console.error("Unexpected update error:", error);

      setErrorMessage(
        error?.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="patient-profile-loading">

        <div className="patient-profile-spinner"></div>

        <p>
          Loading profile...
        </p>

      </div>
    );
  }


  return (
    <div className="patient-profile-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="patient-profile-navbar">

        <div className="patient-profile-logo">
          CBSHMS
        </div>

        <div className="patient-profile-nav-right">

          <span className="patient-profile-title">
            Patient Profile
          </span>

          <button
            className="patient-profile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="patient-profile-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="patient-profile-header">

          <div>

            <h1>
              👤 My Profile
            </h1>

            <p>
              View and update your personal information.
            </p>

          </div>

          <button
            className="patient-profile-dashboard-button"
            onClick={() => navigate("/patient-dashboard")}
          >
            ← Dashboard
          </button>

        </div>


        {/* =========================
            PROFILE CARD
        ========================= */}

        <section className="patient-profile-card">

          {/* PROFILE TOP */}

          <div className="patient-profile-top">

            <div className="patient-profile-avatar">
              👤
            </div>

            <div className="patient-profile-user-info">

              <h2>
                {name || "Patient"}
              </h2>

              <p>
                {email}
              </p>

            </div>

            <div className="patient-profile-role">
              {role || "Patient"}
            </div>

          </div>


          {/* =========================
              PROFILE FORM
          ========================= */}

          <form
            className="patient-profile-form"
            onSubmit={handleUpdateProfile}
          >

            {/* FULL NAME */}

            <div className="patient-profile-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />

            </div>


            {/* EMAIL */}

            <div className="patient-profile-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                readOnly
              />

              <small>
                Email is connected to your login account.
              </small>

            </div>


            {/* ROLE */}

            <div className="patient-profile-field">

              <label>
                Account Type
              </label>

              <input
                type="text"
                value="Patient"
                readOnly
              />

            </div>


            {/* SUCCESS MESSAGE */}

            {message && (
              <div className="patient-profile-success">
                {message}
              </div>
            )}


            {/* ERROR MESSAGE */}

            {errorMessage && (
              <div className="patient-profile-error">
                {errorMessage}
              </div>
            )}


            {/* BUTTONS */}

            <div className="patient-profile-actions">

              <button
                type="submit"
                className="patient-profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

              <button
                type="button"
                className="patient-profile-back-button"
                onClick={() =>
                  navigate("/patient-dashboard")
                }
              >
                Cancel
              </button>

            </div>

          </form>

        </section>


        {/* =========================
            QUICK LINKS
        ========================= */}

        <section className="patient-profile-links">

          <h2>
            Patient Services
          </h2>

          <div className="patient-profile-link-grid">

            <button
              onClick={() =>
                navigate("/patient-appointments")
              }
            >
              📅
              <span>
                My Appointments
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/patient-book-appointment")
              }
            >
              🩺
              <span>
                Book Appointment
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/patient-doctors")
              }
            >
              👨‍⚕️
              <span>
                Find Doctors
              </span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default PatientProfile;