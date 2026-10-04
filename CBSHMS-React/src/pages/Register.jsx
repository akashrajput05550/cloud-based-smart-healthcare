import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =====================================================
  // HANDLE REGISTRATION
  // =====================================================

  const handleRegister = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const role = formData.role;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!fullName || !email || !password || !role) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (role !== "patient" && role !== "doctor") {
      setErrorMessage("Please select a valid role.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // 1. CREATE ACCOUNT USING SUPABASE AUTH
      // =====================================================

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: email,
          password: password,

          // Store profile information in Auth metadata too.
          options: {
            data: {
              name: fullName,
              role: role,
            },
          },
        });

      if (authError) {
        console.error(
          "Supabase registration error:",
          authError
        );

        setErrorMessage(authError.message);
        return;
      }

      if (!authData?.user) {
        setErrorMessage(
          "Account could not be created. Please try again."
        );
        return;
      }

      const authUser = authData.user;

      console.log("AUTH USER CREATED:", authUser);

      // =====================================================
      // 2. SAVE USER PROFILE IN USERS TABLE
      //
      // Your actual table columns are:
      // id
      // name
      // email
      // password
      // role
      //
      // We DO NOT store the password here.
      // Supabase Auth handles the password.
      // =====================================================

      const { error: profileError } = await supabase
        .from("USERS")
        .insert([
          {
            id: authUser.id,
            name: fullName,
            email: email,
            role: role,
          },
        ]);

      if (profileError) {
        console.error(
          "USERS table error:",
          profileError
        );

        /*
         * The Auth account has already been created.
         * Therefore, we tell the user exactly what failed.
         */
        setErrorMessage(
          `Account was created, but profile could not be saved: ${profileError.message}`
        );

        return;
      }

      // =====================================================
      // 3. REGISTRATION SUCCESS
      // =====================================================

      console.log(
        "USER PROFILE CREATED SUCCESSFULLY"
      );

      setSuccessMessage(
        "Registration successful! Redirecting to login..."
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
      });

      // =====================================================
      // 4. REDIRECT TO LOGIN
      // =====================================================

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="register-page">

      <div className="register-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="register-header">

          <h1>
            Create Account
          </h1>

          <p>
            Register for your CBSHMS account
          </p>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {errorMessage && (
          <div className="register-error">
            {errorMessage}
          </div>
        )}


        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {successMessage && (
          <div className="register-success">
            {successMessage}
          </div>
        )}


        {/* =========================
            REGISTRATION FORM
        ========================= */}

        <form onSubmit={handleRegister}>

          {/* FULL NAME */}

          <div className="register-field">

            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
            />

          </div>


          {/* EMAIL */}

          <div className="register-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="register-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              disabled={loading}
            />

          </div>


          {/* ROLE */}

          <div className="register-field">

            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="">
                Select your role
              </option>

              <option value="patient">
                Patient
              </option>

              <option value="doctor">
                Doctor
              </option>

            </select>

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>


        {/* =========================
            LOGIN LINK
        ========================= */}

        <div className="register-login">

          <span>
            Already have an account?
          </span>{" "}

          <Link to="/login">
            Login
          </Link>

        </div>


        {/* =========================
            HOME LINK
        ========================= */}

        <div className="register-home">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;