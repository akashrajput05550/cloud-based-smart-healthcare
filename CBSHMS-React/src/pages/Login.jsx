import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // 1. LOGIN WITH SUPABASE AUTH
      // =====================================================

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError) {
        console.error("Supabase login error:", authError);

        const message =
          authError.message?.toLowerCase() || "";

        if (message.includes("email not confirmed")) {
          setErrorMessage(
            "Please verify your email before logging in."
          );
        } else if (
          message.includes("invalid login credentials")
        ) {
          setErrorMessage(
            "Invalid email or password."
          );
        } else {
          setErrorMessage(authError.message);
        }

        return;
      }

      // =====================================================
      // 2. CHECK AUTH USER
      // =====================================================

      if (!authData?.user) {
        setErrorMessage(
          "Login failed. Please try again."
        );
        return;
      }

      const authUser = authData.user;

      console.log(
        "AUTHENTICATED USER:",
        authUser
      );

      // =====================================================
      // 3. FIND USER PROFILE BY AUTH ID
      // =====================================================

      let userProfile = null;
      let profileError = null;

      const {
        data: profileById,
        error: idError,
      } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (idError) {
        console.error(
          "Profile lookup by ID error:",
          idError
        );

        profileError = idError;
      } else if (profileById) {
        userProfile = profileById;

        console.log(
          "PROFILE FOUND BY AUTH ID:",
          profileById
        );
      }

      // =====================================================
      // 4. IF NOT FOUND BY ID, FIND BY EMAIL
      // =====================================================

      if (!userProfile) {
        console.log(
          "Profile not found by Auth ID."
        );

        console.log(
          "Searching USERS table by email..."
        );

        const {
          data: profileByEmail,
          error: emailError,
        } = await supabase
          .from("USERS")
          .select("id, name, email, role")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (emailError) {
          console.error(
            "Profile lookup by email error:",
            emailError
          );

          profileError = emailError;
        } else if (profileByEmail) {
          userProfile = profileByEmail;

          console.log(
            "PROFILE FOUND BY EMAIL:",
            profileByEmail
          );
        }
      }

      // =====================================================
      // 5. PROFILE NOT FOUND
      // =====================================================

      if (!userProfile) {
        console.error(
          "USER PROFILE NOT FOUND:",
          profileError
        );

        await supabase.auth.signOut();

        if (profileError) {
          setErrorMessage(
            `Login successful, but user profile could not be loaded: ${profileError.message}`
          );
        } else {
          setErrorMessage(
            "Login successful, but no profile was found in the USERS table for this email."
          );
        }

        return;
      }

      // =====================================================
      // 6. GET USER ROLE
      // =====================================================

      const role =
        userProfile.role?.trim().toLowerCase();

      console.log("USER ROLE:", role);

      // =====================================================
      // 7. CHECK ROLE
      // =====================================================

      if (!role) {
        await supabase.auth.signOut();

        setErrorMessage(
          "Your account does not have a valid role."
        );

        return;
      }

      // =====================================================
      // 8. ALLOWED ROLES
      // =====================================================

      if (
        role !== "patient" &&
        role !== "doctor" &&
        role !== "admin"
      ) {
        await supabase.auth.signOut();

        setErrorMessage(
          `Invalid role "${userProfile.role}".`
        );

        return;
      }

      // =====================================================
      // 9. CLEAR OLD LOGIN DATA
      // =====================================================

      localStorage.removeItem("loggedInEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");

      // =====================================================
      // 10. SAVE CURRENT USER INFORMATION
      // =====================================================

      localStorage.setItem(
        "loggedInEmail",
        userProfile.email || cleanEmail
      );

      localStorage.setItem(
        "userRole",
        role
      );

      localStorage.setItem(
        "userId",
        authUser.id
      );

      if (userProfile.name) {
        localStorage.setItem(
          "userName",
          userProfile.name
        );
      }

      console.log(
        "LOGIN INFORMATION SAVED:",
        {
          email:
            userProfile.email || cleanEmail,
          role: role,
          userId: authUser.id,
          name: userProfile.name,
        }
      );

      // =====================================================
      // 11. SUCCESS MESSAGE
      // =====================================================

      setSuccessMessage(
        "Login successful! Redirecting..."
      );

      // =====================================================
      // 12. REDIRECT BASED ON ROLE
      // =====================================================

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "doctor") {
          navigate("/doctor-dashboard");
        } else if (role === "patient") {
          navigate("/patient-dashboard");
        }
      }, 700);

    } catch (error) {
      console.error(
        "Unexpected login error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your CBSHMS account
          </p>

        </div>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {errorMessage && (
          <div className="login-error">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div className="login-success">
            {successMessage}
          </div>
        )}


        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =================================================
            REGISTER
        ================================================= */}

        <div className="login-register">

          <span>
            Don't have an account?
          </span>{" "}

          <Link to="/register">
            Register
          </Link>

        </div>


        {/* =================================================
            HOME
        ================================================= */}

        <div className="login-home">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;