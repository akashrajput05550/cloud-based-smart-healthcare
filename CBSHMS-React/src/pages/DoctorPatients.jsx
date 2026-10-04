import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/DoctorPatients.css";

function DoctorPatients() {
  const doctorEmail = localStorage.getItem("loggedInEmail");

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPatients = async () => {
    if (!doctorEmail) {
      setErrorMessage("Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    /*
      Get appointments belonging to this doctor.
      We use patient_email to identify the patients.
    */
    const { data, error } = await supabase
      .from("APPOINTMENTS")
      .select("*")
      .eq("doctor_email", doctorEmail)
      .order("appointment_date", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setPatients([]);
      setLoading(false);
      return;
    }

    /*
      Remove duplicate patients.
    */
    const uniquePatients = [];

    (data || []).forEach((appointment) => {
      const email = appointment.patient_email;

      if (
        email &&
        !uniquePatients.some(
          (patient) => patient.email === email
        )
      ) {
        uniquePatients.push({
          email: email,
          lastAppointment: appointment.appointment_date,
          lastTime: appointment.appointment_time,
          status: appointment.status,
        });
      }
    });

    setPatients(uniquePatients);
    setLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
  };

  return (
    <div className="doctor-patients-page">

      {/* NAVBAR */}
      <nav className="patients-navbar">

        <div className="patients-logo">
          CBSHMS
        </div>

        <div className="patients-nav-right">

          <span>
            Doctor Dashboard
          </span>

          <Link
            to="/login"
            className="patients-logout"
            onClick={handleLogout}
          >
            Logout
          </Link>

        </div>

      </nav>


      {/* MAIN */}
      <main className="patients-container">

        {/* HEADER */}
        <div className="patients-header">

          <div>
            <h1>
              👥 Patients
            </h1>

            <p>
              View patients associated with your appointments.
            </p>
          </div>

          <Link
            to="/doctor-dashboard"
            className="patients-back"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ERROR */}
        {errorMessage && (
          <div className="patients-error">
            {errorMessage}
          </div>
        )}


        {/* LOADING */}
        {loading ? (

          <div className="patients-message">
            Loading patients...
          </div>

        ) : patients.length === 0 ? (

          <div className="patients-message">

            <div className="patients-empty-icon">
              👥
            </div>

            <h2>
              No Patients Found
            </h2>

            <p>
              You currently don't have any patients.
            </p>

          </div>

        ) : (

          <div className="patients-table-wrapper">

            <table className="patients-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Email</th>
                  <th>Last Appointment</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {patients.map((patient, index) => (

                  <tr key={patient.email}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {patient.email}
                      </strong>
                    </td>

                    <td>
                      {patient.lastAppointment || "N/A"}
                    </td>

                    <td>
                      {patient.lastTime || "N/A"}
                    </td>

                    <td>

                      <span
                        className={`patient-status patient-status-${patient.status}`}
                      >
                        {patient.status || "Unknown"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </main>

    </div>
  );
}

export default DoctorPatients;