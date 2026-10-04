import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/BookAppointment.css";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);

  const [doctorEmail, setDoctorEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const patientEmail =
    localStorage.getItem("loggedInEmail") || "";

  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("role", "doctor")
        .order("name", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Doctor fetch error:",
          error
        );

        setErrorMessage(
          `Unable to load doctors: ${error.message}`
        );

        return;
      }

      console.log(
        "Available doctors:",
        data
      );

      setDoctors(data || []);
    } catch (error) {
      console.error(
        "Unexpected doctor fetch error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to load doctors."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // HANDLE BOOKING
  // =====================================================

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // -----------------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------------

    if (!patientEmail) {
      setErrorMessage(
        "Patient information not found. Please login again."
      );

      return;
    }

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!doctorEmail) {
      setErrorMessage(
        "Please select a doctor."
      );

      return;
    }

    if (!appointmentDate) {
      setErrorMessage(
        "Please select an appointment date."
      );

      return;
    }

    if (!appointmentTime) {
      setErrorMessage(
        "Please select an appointment time."
      );

      return;
    }

    // -----------------------------------------------------
    // CHECK DATE
    // -----------------------------------------------------

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate =
      new Date(appointmentDate + "T00:00:00");

    if (selectedDate < today) {
      setErrorMessage(
        "Please select today or a future date."
      );

      return;
    }

    setBooking(true);

    try {
      // ===================================================
      // CHECK IF SAME SLOT ALREADY EXISTS
      // ===================================================

      const { data: existingAppointment, error: checkError } =
        await supabase
          .from("APPOINTMENTS")
          .select("id, status")
          .eq("doctor_email", doctorEmail)
          .eq(
            "appointment_date",
            appointmentDate
          )
          .eq(
            "appointment_time",
            appointmentTime
          )
          .maybeSingle();

      if (checkError) {
        console.error(
          "Appointment check error:",
          checkError
        );

        setErrorMessage(
          checkError.message
        );

        return;
      }

      if (existingAppointment) {
        setErrorMessage(
          "This appointment slot is already booked. Please select another time."
        );

        return;
      }

      // ===================================================
      // CREATE APPOINTMENT
      // ===================================================

      const { data, error } = await supabase
        .from("APPOINTMENTS")
        .insert([
          {
            patient_email: patientEmail,
            doctor_email: doctorEmail,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(
          "Appointment booking error:",
          error
        );

        setErrorMessage(
          `Unable to book appointment: ${error.message}`
        );

        return;
      }

      console.log(
        "Appointment created:",
        data
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccessMessage(
        "Appointment booked successfully!"
      );

      // Clear form

      setDoctorEmail("");
      setAppointmentDate("");
      setAppointmentTime("");

      // Redirect after 1.5 seconds

      setTimeout(() => {
        navigate("/patient-appointments");
      }, 1500);

    } catch (error) {
      console.error(
        "Unexpected booking error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Something went wrong while booking the appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem(
      "loggedInEmail"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "userName"
    );

    navigate("/login");
  };

  // =====================================================
  // GET MINIMUM DATE
  // =====================================================

  const getTodayDate = () => {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="book-appointment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="patient-header">

        <div className="patient-logo">
          CBSHMS
        </div>

        <div className="patient-header-right">

          <span>
            Book Appointment
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
          MAIN CONTENT
      ================================================= */}

      <main className="book-appointment-container">

        {/* TITLE */}

        <div className="book-title-row">

          <div>

            <h1>
              🩺 Book Appointment
            </h1>

            <p>
              Find a doctor and schedule your
              medical appointment.
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
            BOOKING CARD
        ================================================= */}

        <div className="booking-card">

          {/* CARD HEADER */}

          <div className="booking-card-header">

            <div className="booking-icon">
              🩺
            </div>

            <div>

              <h2>
                Appointment Details
              </h2>

              <p>
                Please select a doctor,
                date and time.
              </p>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {errorMessage && (
            <div className="booking-error">
              {errorMessage}
            </div>
          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {successMessage && (
            <div className="booking-success">
              {successMessage}
            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleBookAppointment
            }
          >

            {/* DOCTOR */}

            <div className="booking-field">

              <label htmlFor="doctor">
                Select Doctor
              </label>

              {loadingDoctors ? (

                <div className="loading-doctors">
                  Loading doctors...
                </div>

              ) : doctors.length === 0 ? (

                <div className="no-doctors">
                  No doctors are available.
                </div>

              ) : (

                <select
                  id="doctor"
                  value={doctorEmail}
                  onChange={(event) => {
                    setDoctorEmail(
                      event.target.value
                    );

                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  disabled={booking}
                >

                  <option value="">
                    Select a doctor
                  </option>

                  {doctors.map(
                    (doctor) => (

                      <option
                        key={doctor.id}
                        value={doctor.email}
                      >
                        {doctor.name
                          ? `${doctor.name} - ${doctor.email}`
                          : doctor.email}
                      </option>

                    )
                  )}

                </select>

              )}

            </div>


            {/* DATE */}

            <div className="booking-field">

              <label htmlFor="appointmentDate">
                Appointment Date
              </label>

              <input
                id="appointmentDate"
                type="date"
                value={appointmentDate}
                min={getTodayDate()}
                onChange={(event) => {
                  setAppointmentDate(
                    event.target.value
                  );

                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                disabled={booking}
              />

            </div>


            {/* TIME */}

            <div className="booking-field">

              <label htmlFor="appointmentTime">
                Appointment Time
              </label>

              <input
                id="appointmentTime"
                type="time"
                value={appointmentTime}
                onChange={(event) => {
                  setAppointmentTime(
                    event.target.value
                  );

                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                disabled={booking}
              />

            </div>


            {/* PATIENT EMAIL */}

            <div className="booking-field">

              <label>
                Patient Email
              </label>

              <input
                type="email"
                value={patientEmail}
                readOnly
              />

              <small>
                This appointment will be booked
                for your logged-in account.
              </small>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="book-appointment-button"
              disabled={
                booking ||
                loadingDoctors ||
                doctors.length === 0
              }
            >
              {booking
                ? "Booking Appointment..."
                : "Book Appointment"}
            </button>

          </form>

        </div>


        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="booking-info">

          <h3>
            📋 Appointment Information
          </h3>

          <div className="info-items">

            <div>
              <strong>
                Doctor
              </strong>

              <span>
                Select from available doctors
              </span>
            </div>

            <div>
              <strong>
                Date
              </strong>

              <span>
                Choose today or a future date
              </span>
            </div>

            <div>
              <strong>
                Status
              </strong>

              <span>
                Your appointment will initially
                be Pending
              </span>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default BookAppointment;