import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/AdminAppointments.css";

function AdminAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // FETCH ALL APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("APPOINTMENTS")
        .select(
          "id, patient_email, doctor_email, appointment_date, appointment_time, status, created_at"
        )
        .order("appointment_date", {
          ascending: false,
        });

      if (error) {
        console.error("Appointments fetch error:", error);
        setErrorMessage(error.message);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);

      setErrorMessage(
        error?.message || "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("APPOINTMENTS")
        .update({
          status: newStatus,
        })
        .eq("id", id);

      if (error) {
        console.error("Status update error:", error);
        alert(error.message);
        return;
      }

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: newStatus,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Unexpected status error:", error);
      alert("Unable to update appointment status.");
    }
  };

  // =====================================================
  // DELETE APPOINTMENT
  // =====================================================

  const deleteAppointment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("APPOINTMENTS")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete appointment error:", error);
        alert(error.message);
        return;
      }

      setAppointments((previous) =>
        previous.filter(
          (appointment) => appointment.id !== id
        )
      );
    } catch (error) {
      console.error("Unexpected delete error:", error);
      alert("Unable to delete appointment.");
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const cleanStatus =
      status?.trim().toLowerCase();

    if (cleanStatus === "approved") {
      return "admin-status-approved";
    }

    if (cleanStatus === "rejected") {
      return "admin-status-rejected";
    }

    return "admin-status-pending";
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
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

  return (
    <div className="admin-appointments-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="admin-appointments-navbar">

        <div className="admin-appointments-logo">
          CBSHMS
        </div>

        <div className="admin-appointments-nav-right">

          <span>
            Manage Appointments
          </span>

          <button
            className="admin-appointments-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-appointments-container">

        {/* PAGE HEADER */}

        <div className="admin-appointments-header">

          <div>

            <h1>
              📅 Manage Appointments
            </h1>

            <p>
              View and manage all patient appointments.
            </p>

          </div>

          <Link
            to="/admin-dashboard"
            className="admin-appointments-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ERROR */}

        {errorMessage && (
          <div className="admin-appointments-error">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        {loading ? (

          <div className="admin-appointments-message">
            <div className="admin-appointments-spinner"></div>

            <p>
              Loading appointments...
            </p>
          </div>

        ) : appointments.length === 0 ? (

          <div className="admin-appointments-message">

            <div className="admin-appointments-empty-icon">
              📅
            </div>

            <h2>
              No Appointments Found
            </h2>

            <p>
              There are currently no appointments
              in the system.
            </p>

          </div>

        ) : (

          <section className="admin-appointments-card">

            {/* CARD HEADER */}

            <div className="admin-appointments-card-header">

              <h2>
                All Appointments
              </h2>

              <p>
                Total Appointments:{" "}
                <strong>
                  {appointments.length}
                </strong>
              </p>

            </div>


            {/* TABLE */}

            <div className="admin-appointments-table-wrapper">

              <table className="admin-appointments-table">

                <thead>

                  <tr>

                    <th>#</th>

                    <th>
                      Patient Email
                    </th>

                    <th>
                      Doctor Email
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {appointments.map(
                    (appointment, index) => (

                      <tr
                        key={
                          appointment.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          👤{" "}
                          {appointment.patient_email}
                        </td>

                        <td>
                          👨‍⚕️{" "}
                          {appointment.doctor_email}
                        </td>

                        <td>
                          📅{" "}
                          {appointment.appointment_date}
                        </td>

                        <td>
                          🕐{" "}
                          {appointment.appointment_time}
                        </td>

                        <td>

                          <span
                            className={`admin-appointment-status ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {formatStatus(
                              appointment.status
                            )}
                          </span>

                        </td>

                        <td>

                          <div className="admin-appointment-actions">

                            {/* APPROVE */}

                            <button
                              className="admin-approve-button"
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  "approved"
                                )
                              }
                            >
                              ✓ Approve
                            </button>


                            {/* REJECT */}

                            <button
                              className="admin-reject-button"
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  "rejected"
                                )
                              }
                            >
                              ✕ Reject
                            </button>


                            {/* DELETE */}

                            <button
                              className="admin-delete-button"
                              onClick={() =>
                                deleteAppointment(
                                  appointment.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminAppointments;