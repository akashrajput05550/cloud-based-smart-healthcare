import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/PatientAppointments.css";

function PatientAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // -------------------------------------------------
      // GET LOGGED-IN USER
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

      const patientEmail = user.email;

      console.log(
        "Fetching appointments for:",
        patientEmail
      );

      // -------------------------------------------------
      // GET PATIENT APPOINTMENTS
      // -------------------------------------------------

      const { data, error } = await supabase
        .from("APPOINTMENTS")
        .select(
          "id, patient_email, doctor_email, appointment_date, appointment_time, status"
        )
        .eq("patient_email", patientEmail)
        .order("appointment_date", {
          ascending: true,
        })
        .order("appointment_time", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Appointments fetch error:",
          error
        );

        setErrorMessage(error.message);
        return;
      }

      console.log(
        "Patient appointments:",
        data
      );

      setAppointments(data || []);
    } catch (error) {
      console.error(
        "Unexpected appointments error:",
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
  // CANCEL APPOINTMENT
  // =====================================================

  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      const { error } = await supabase
        .from("APPOINTMENTS")
        .update({
          status: "cancelled",
        })
        .eq("id", appointmentId);

      if (error) {
        console.error(
          "Cancel appointment error:",
          error
        );

        alert(error.message);
        return;
      }

      // Update screen immediately
      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment
        )
      );

      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error(
        "Unexpected cancellation error:",
        error
      );

      alert(
        error?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancellingId(null);
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
  // RENDER
  // =====================================================

  return (
    <div className="patient-appointments-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="patient-header">

        <div className="patient-logo">
          CBSHMS
        </div>

        <div className="patient-header-right">

          <span>
            Patient Appointments
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="patient-appointments-container">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="page-title-row">

          <div>

            <h1>
              📅 My Appointments
            </h1>

            <p>
              View your upcoming and previous
              doctor appointments.
            </p>

          </div>

          <Link
            to="/patient-dashboard"
            className="dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="appointment-error">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="appointment-message">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading Appointments...
            </h3>

            <p>
              Please wait while we load your appointments.
            </p>

          </div>
        )}


        {/* =================================================
            NO APPOINTMENTS
        ================================================= */}

        {!loading &&
          !errorMessage &&
          appointments.length === 0 && (

            <div className="appointment-message">

              <div className="empty-icon">
                📅
              </div>

              <h3>
                No Appointments Found
              </h3>

              <p>
                You don't have any appointments yet.
              </p>

              <Link
                to="/patient-book-appointment"
                className="book-button"
              >
                Book an Appointment
              </Link>

            </div>
          )}


        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        {!loading &&
          !errorMessage &&
          appointments.length > 0 && (

            <div className="appointments-table-container">

              <table className="appointments-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Doctor
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


                          {/* DOCTOR */}

                          <td>

                            <div className="doctor-info">

                              <strong>
                                👨‍⚕️ Doctor
                              </strong>

                              <span>
                                {
                                  appointment.doctor_email
                                }
                              </span>

                            </div>

                          </td>


                          {/* DATE */}

                          <td>

                            <div className="appointment-date">

                              📅{" "}
                              {
                                appointment.appointment_date
                              }

                            </div>

                          </td>


                          {/* TIME */}

                          <td>

                            <div className="appointment-time">

                              🕐{" "}
                              {
                                appointment.appointment_time
                              }

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`appointment-status ${getStatusClass(
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

                              <button
                                className="cancel-appointment-button"
                                onClick={() =>
                                  handleCancelAppointment(
                                    appointment.id
                                  )
                                }
                                disabled={
                                  cancellingId ===
                                  appointment.id
                                }
                              >
                                {cancellingId ===
                                appointment.id
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>

                            )}

                            {cleanStatus ===
                              "approved" && (

                              <span className="appointment-approved-text">
                                ✓ Confirmed
                              </span>

                            )}

                            {cleanStatus ===
                              "rejected" && (

                              <span className="appointment-rejected-text">
                                ✕ Rejected
                              </span>

                            )}

                            {cleanStatus ===
                              "cancelled" && (

                              <span className="appointment-cancelled-text">
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


        {/* =================================================
            BOOK NEW APPOINTMENT
        ================================================= */}

        {!loading &&
          !errorMessage &&
          appointments.length > 0 && (

            <div className="new-appointment-section">

              <Link
                to="/patient-book-appointment"
                className="book-button"
              >
                + Book New Appointment
              </Link>

            </div>
          )}

      </main>

    </div>
  );
}

export default PatientAppointments;