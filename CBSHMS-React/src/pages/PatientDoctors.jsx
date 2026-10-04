import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/PatientDoctors.css";

function PatientDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("role", "doctor")
        .order("name", { ascending: true });

      if (error) {
        console.error("Doctors loading error:", error);
        setErrorMessage(error.message);
        return;
      }

      setDoctors(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);

      setErrorMessage(
        error?.message || "Unable to load doctors."
      );
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

  return (
    <div className="patient-doctors-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="patient-doctors-navbar">

        <div className="patient-doctors-logo">
          CBSHMS
        </div>

        <div className="patient-doctors-nav-right">

          <span className="patient-doctors-title">
            Find Doctors
          </span>

          <button
            className="patient-doctors-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="patient-doctors-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="patient-doctors-header">

          <div>

            <h1>
              👨‍⚕️ Find Doctors
            </h1>

            <p>
              View available doctors and their
              contact information.
            </p>

          </div>

          <button
            className="patient-doctors-dashboard-button"
            onClick={() => navigate("/patient-dashboard")}
          >
            ← Dashboard
          </button>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {errorMessage && (
          <div className="patient-doctors-error">
            {errorMessage}
          </div>
        )}


        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="patient-doctors-loading">

            <div className="patient-doctors-spinner"></div>

            <p>
              Loading doctors...
            </p>

          </div>

        ) : doctors.length === 0 ? (

          /* =========================
              NO DOCTORS
          ========================= */

          <div className="patient-doctors-empty">

            <div className="patient-doctors-empty-icon">
              👨‍⚕️
            </div>

            <h2>
              No Doctors Found
            </h2>

            <p>
              There are currently no doctors
              available in the system.
            </p>

          </div>

        ) : (

          /* =========================
              DOCTOR GRID
          ========================= */

          <section className="patient-doctors-grid">

            {doctors.map((doctor) => (

              <div
                className="patient-doctor-card"
                key={doctor.id}
              >

                {/* DOCTOR ICON */}

                <div className="patient-doctor-icon">
                  👨‍⚕️
                </div>


                {/* DOCTOR INFORMATION */}

                <div className="patient-doctor-content">

                  <h2>
                    {doctor.name || "Doctor"}
                  </h2>

                  <p className="patient-doctor-specialization">
                    Medical Doctor
                  </p>


                  {/* EMAIL */}

                  <div className="patient-doctor-detail">

                    <strong>
                      Email:
                    </strong>

                    <span>
                      {doctor.email}
                    </span>

                  </div>


                  {/* ROLE */}

                  <div className="patient-doctor-detail">

                    <strong>
                      Role:
                    </strong>

                    <span>
                      Doctor
                    </span>

                  </div>


                  {/* BOOK APPOINTMENT */}

                  <button
                    className="patient-doctor-book-button"
                    onClick={() =>
                      navigate("/patient-book-appointment")
                    }
                  >
                    Book Appointment
                  </button>

                </div>

              </div>

            ))}

          </section>

        )}

      </main>

    </div>
  );
}

export default PatientDoctors;