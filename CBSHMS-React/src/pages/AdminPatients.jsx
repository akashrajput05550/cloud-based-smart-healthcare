import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/AdminPatients.css";

function AdminPatients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("role", "patient")
        .order("name", { ascending: true });

      if (error) {
        console.error("Patients fetch error:", error);
        setErrorMessage(error.message);
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);

      setErrorMessage(
        error?.message || "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE PATIENT
  // =====================================================

  const handleDeletePatient = async (patientId, patientName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        patientName || "this patient"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("USERS")
        .delete()
        .eq("id", patientId);

      if (error) {
        console.error("Patient delete error:", error);
        setErrorMessage(error.message);
        return;
      }

      setPatients((previousPatients) =>
        previousPatients.filter(
          (patient) => patient.id !== patientId
        )
      );
    } catch (error) {
      console.error("Unexpected delete error:", error);

      setErrorMessage(
        error?.message || "Unable to delete patient."
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-patients-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="admin-patients-navbar">

        <div className="admin-patients-logo">
          CBSHMS
        </div>

        <div className="admin-patients-nav-right">

          <span className="admin-patients-nav-title">
            Manage Patients
          </span>

          <button
            type="button"
            className="admin-patients-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-patients-container">

        {/* PAGE HEADER */}

        <div className="admin-patients-heading">

          <div>

            <h1>
              👥 Manage Patients
            </h1>

            <p>
              View and manage all registered patients.
            </p>

          </div>

          <Link
            to="/admin-dashboard"
            className="admin-patients-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ERROR */}

        {errorMessage && (
          <div className="admin-patients-error">
            {errorMessage}
          </div>
        )}


        {/* LOADING */}

        {loading ? (

          <div className="admin-patients-message">

            <div className="admin-patients-spinner"></div>

            <p>
              Loading patients...
            </p>

          </div>

        ) : patients.length === 0 ? (

          /* NO PATIENTS */

          <div className="admin-patients-message">

            <div className="admin-patients-empty-icon">
              👥
            </div>

            <h2>
              No Patients Found
            </h2>

            <p>
              There are currently no patients
              registered in the system.
            </p>

          </div>

        ) : (

          /* PATIENTS TABLE */

          <section className="admin-patients-card">

            <div className="admin-patients-card-header">

              <div>

                <h2>
                  Registered Patients
                </h2>

                <p>
                  Total Patients: {patients.length}
                </p>

              </div>

            </div>


            <div className="admin-patients-table-wrapper">

              <table className="admin-patients-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Patient Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {patients.map((patient, index) => (

                    <tr key={patient.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>

                        <div className="admin-patient-name">

                          <div className="admin-patient-icon">
                            👤
                          </div>

                          <strong>
                            {patient.name || "Patient"}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {patient.email}
                      </td>

                      <td>

                        <span className="admin-patient-role">
                          {patient.role}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-patient-delete"
                          onClick={() =>
                            handleDeletePatient(
                              patient.id,
                              patient.name
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminPatients;