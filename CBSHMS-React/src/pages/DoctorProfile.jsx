import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/DoctorProfile.css";

function DoctorProfile() {
  const navigate = useNavigate();

  const email = localStorage.getItem("loggedInEmail");

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: localStorage.getItem("doctorName") || "Doctor",
    phone: localStorage.getItem("doctorPhone") || "",
    specialization:
      localStorage.getItem("doctorSpecialization") || "",
    qualification:
      localStorage.getItem("doctorQualification") || "",
    hospital:
      localStorage.getItem("doctorHospital") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("doctorName", profile.name);
    localStorage.setItem("doctorPhone", profile.phone);
    localStorage.setItem(
      "doctorSpecialization",
      profile.specialization
    );
    localStorage.setItem(
      "doctorQualification",
      profile.qualification
    );
    localStorage.setItem("doctorHospital", profile.hospital);

    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    navigate("/login");
  };

  return (
    <div className="doctor-profile-page">

      {/* NAVBAR */}
      <nav className="profile-navbar">

        <div className="profile-logo">
          CBSHMS
        </div>

        <div className="profile-nav-right">

          <span>
            Doctor Profile
          </span>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN */}
      <main className="profile-container">

        {/* HEADER */}
        <div className="profile-header">

          <div>
            <h1>
              👨‍⚕️ Doctor Profile
            </h1>

            <p>
              View and update your personal information.
            </p>
          </div>

          <Link
            to="/doctor-dashboard"
            className="profile-dashboard-btn"
          >
            ← Dashboard
          </Link>

        </div>


        {/* PROFILE CARD */}
        <section className="profile-card">

          {/* PROFILE TOP */}
          <div className="profile-card-header">

            <div className="profile-avatar">
              👨‍⚕️
            </div>

            <div>
              <h2>
                {profile.name || "Doctor"}
              </h2>

              <p>
                {email || "No email available"}
              </p>
            </div>

            <span className="profile-role">
              Doctor
            </span>

          </div>


          {/* FORM */}
          <div className="profile-form">

            {/* NAME */}
            <div className="profile-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />

            </div>


            {/* EMAIL */}
            <div className="profile-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email || ""}
                disabled
              />

            </div>


            {/* PHONE */}
            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />

            </div>


            {/* SPECIALIZATION */}
            <div className="profile-field">

              <label>
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Cardiologist"
              />

            </div>


            {/* QUALIFICATION */}
            <div className="profile-field">

              <label>
                Qualification
              </label>

              <input
                type="text"
                name="qualification"
                value={profile.qualification}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. MBBS, MD"
              />

            </div>


            {/* HOSPITAL */}
            <div className="profile-field profile-full">

              <label>
                Hospital / Clinic
              </label>

              <input
                type="text"
                name="hospital"
                value={profile.hospital}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter hospital or clinic name"
              />

            </div>

          </div>


          {/* BUTTONS */}
          <div className="profile-actions">

            {!isEditing ? (

              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>

            ) : (

              <>
                <button
                  type="button"
                  className="profile-save-btn"
                  onClick={handleSave}
                >
                  💾 Save Profile
                </button>

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>

            )}

          </div>

        </section>


        {/* QUICK LINKS */}
        <div className="profile-quick-links">

          <Link
            to="/doctor-appointments"
            className="profile-quick-btn"
          >
            📅 View Appointments
          </Link>

          <Link
            to="/doctor-patients"
            className="profile-quick-btn"
          >
            👥 View Patients
          </Link>

          <Link
            to="/doctor-statistics"
            className="profile-quick-btn"
          >
            📊 View Statistics
          </Link>

        </div>

      </main>

    </div>
  );
}

export default DoctorProfile;