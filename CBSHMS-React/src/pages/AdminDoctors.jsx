import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/AdminDoctors.css";

function AdminDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("role", "doctor")
        .order("name", { ascending: true });

      if (error) {
        console.error("Doctors fetch error:", error);
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

  // =====================================================
  // DELETE DOCTOR
  // =====================================================

  const handleDeleteDoctor = async (doctorId, doctorName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctorName || "this doctor"}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("USERS")
        .delete()
        .eq("id", doctorId);

      if (error) {
        console.error("Doctor delete error:", error);
        setErrorMessage(error.message);
        return;
      }

      setDoctors((previousDoctors) =>
        previousDoctors.filter(
          (doctor) => doctor.id !== doctorId
        )
      );

    } catch (error) {
      console.error("Unexpected delete error:", error);

      setErrorMessage(
        error?.message || "Unable to delete doctor."
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
    <div className="admin-doctors-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="admin-doctors-navbar">

        <div className="admin-doctors-logo">
          CBSHMS
        </div>

        <div className="admin-doctors-nav-right">

          <span className="admin-doctors-nav-title">
            Manage Doctors
          </span>

          <button
            type="button"
            className="admin-doctors-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-doctors-container">

        {/* PAGE HEADER */}

        <div className="admin-doctors-heading">

          <div>

            <h1>
              👨‍⚕️ Manage Doctors
            </h1>

            <p>
              View and manage all registered doctors.
            </p>

          </div>

          <Link
            to="/admin-dashboard"
            className="admin-doctors-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ERROR */}

        {errorMessage && (
          <div className="admin-doctors-error">
            {errorMessage}
          </div>
        )}


        {/* LOADING */}

        {loading ? (

          <div className="admin-doctors-message">
            <div className="admin-doctors-spinner"></div>

            <p>
              Loading doctors...
            </p>
          </div>

        ) : doctors.length === 0 ? (

          /* NO DOCTORS */

          <div className="admin-doctors-message">

            <div className="admin-doctors-empty-icon">
              👨‍⚕️
            </div>

            <h2>
              No Doctors Found
            </h2>

            <p>
              There are currently no doctors
              registered in the system.
            </p>

          </div>

        ) : (

          /* DOCTORS TABLE */

          <section className="admin-doctors-card">

            <div className="admin-doctors-card-header">

              <div>

                <h2>
                  Registered Doctors
                </h2>

                <p>
                  Total Doctors: {doctors.length}
                </p>

              </div>

            </div>


            <div className="admin-doctors-table-wrapper">

              <table className="admin-doctors-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Doctor Name
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

                  {doctors.map((doctor, index) => (

                    <tr key={doctor.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>

                        <div className="admin-doctor-name">

                          <div className="admin-doctor-icon">
                            👨‍⚕️
                          </div>

                          <strong>
                            {doctor.name || "Doctor"}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {doctor.email}
                      </td>

                      <td>

                        <span className="admin-doctor-role">
                          {doctor.role}
                        </span>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-doctor-delete"
                          onClick={() =>
                            handleDeleteDoctor(
                              doctor.id,
                              doctor.name
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

export default AdminDoctors;