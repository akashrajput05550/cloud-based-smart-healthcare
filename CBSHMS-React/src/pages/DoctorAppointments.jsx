import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/DoctorAppointments.css";

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // FETCH DOCTOR APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // -------------------------------------------------
      // GET LOGGED-IN DOCTOR
      // -------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);
        setErrorMessage(userError.message);
        return;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      const doctorEmail = user.email;

      console.log(
        "Fetching appointments for:",
        doctorEmail
      );

      // -------------------------------------------------
      // FETCH APPOINTMENTS
      // -------------------------------------------------

      const { data, error } = await supabase
        .from("APPOINTMENTS")
        .select(
          "id, patient_email, doctor_email, appointment_date, appointment_time, status"
        )
        .eq("doctor_email", doctorEmail)
        .order("appointment_date", {
          ascending: true,
        })
        .order("appointment_time", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Appointments error:",
          error
        );

        setErrorMessage(error.message);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error(
        "Unexpected error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  const updateStatus = async (
    appointmentId,
    newStatus
  ) => {
    try {
      setUpdatingId(appointmentId);

      const { error } = await supabase
        .from("APPOINTMENTS")
        .update({
          status: newStatus,
        })
        .eq("id", appointmentId);

      if (error) {
        console.error(
          "Status update error:",
          error
        );

        alert(error.message);
        return;
      }

      // Update UI immediately
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: newStatus,
              }
            : appointment
        )
      );

      if (newStatus === "approved") {
        alert(
          "Appointment approved successfully."
        );
      }

      if (newStatus === "rejected") {
        alert(
          "Appointment rejected successfully."
        );
      }
    } catch (error) {
      console.error(
        "Unexpected status error:",
        error
      );

      alert(
        error?.message ||
          "Unable to update appointment."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const cleanStatus =
      status?.trim().toLowerCase();

    if (cleanStatus === "approved") {
      return "status-approved";
    }

    if (cleanStatus === "rejected") {
      return "status-rejected";
    }

    if (cleanStatus === "cancelled") {
      return "status-cancelled";
    }

    return "status-pending";
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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="doctor-appointments-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="doctor-header">

        <div className="doctor-logo">
          CBSHMS
        </div>

        <div className="doctor-header-right">

          <span>
            Doctor Appointments
          </span>

          <button
            className="doctor-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="doctor-appointments-container">

        {/* PAGE HEADER */}

        <div className="doctor-page-title-row">

          <div>

            <h1>
              📅 My Appointments
            </h1>

            <p>
              Manage patient appointments and
              appointment requests.
            </p>

          </div>

          <Link
            to="/doctor-dashboard"
            className="doctor-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="doctor-appointment-error">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="doctor-appointment-message">

            <div className="doctor-empty-icon">
              ⏳
            </div>

            <h3>
              Loading Appointments...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* =================================================
            NO APPOINTMENTS
        ================================================= */}

        {!loading &&
          !errorMessage &&
          appointments.length === 0 && (

            <div className="doctor-appointment-message">

              <div className="doctor-empty-icon">
                📅
              </div>

              <h3>
                No Appointments Found
              </h3>

              <p>
                You don't have any patient
                appointments yet.
              </p>

            </div>

          )}


        {/* =================================================
            APPOINTMENTS TABLE
        ================================================= */}

        {!loading &&
          !errorMessage &&
          appointments.length > 0 && (

            <div className="doctor-appointments-table-container">

              <table className="doctor-appointments-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Patient Email
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
                    (appointment, index) => {

                      const status =
                        appointment.status ||
                        "pending";

                      const cleanStatus =
                        status
                          .trim()
                          .toLowerCase();

                      return (

                        <tr
                          key={
                            appointment.id ||
                            index
                          }
                        >

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>


                          {/* PATIENT */}

                          <td>

                            <div className="doctor-patient-info">

                              <strong>
                                👤 Patient
                              </strong>

                              <span>
                                {
                                  appointment.patient_email
                                }
                              </span>

                            </div>

                          </td>


                          {/* DATE */}

                          <td>

                            📅{" "}
                            {
                              appointment.appointment_date
                            }

                          </td>


                          {/* TIME */}

                          <td>

                            🕐{" "}
                            {
                              appointment.appointment_time
                            }

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`doctor-appointment-status ${getStatusClass(
                                status
                              )}`}
                            >
                              {formatStatus(
                                status
                              )}
                            </span>

                          </td>


                          {/* ACTION */}

                          <td>

                            {cleanStatus ===
                              "pending" && (

                              <div className="doctor-action-buttons">

                                <button
                                  className="approve-button"
                                  disabled={
                                    updatingId ===
                                    appointment.id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      appointment.id,
                                      "approved"
                                    )
                                  }
                                >
                                  {updatingId ===
                                  appointment.id
                                    ? "Updating..."
                                    : "✓ Approve"}
                                </button>

                                <button
                                  className="reject-button"
                                  disabled={
                                    updatingId ===
                                    appointment.id
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      appointment.id,
                                      "rejected"
                                    )
                                  }
                                >
                                  ✕ Reject
                                </button>

                              </div>

                            )}


                            {cleanStatus ===
                              "approved" && (

                              <span className="approved-text">
                                ✓ Approved
                              </span>

                            )}


                            {cleanStatus ===
                              "rejected" && (

                              <span className="rejected-text">
                                ✕ Rejected
                              </span>

                            )}


                            {cleanStatus ===
                              "cancelled" && (

                              <span className="cancelled-text">
                                Cancelled
                              </span>

                            )}

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

      </main>

    </div>
  );
}

export default DoctorAppointments;