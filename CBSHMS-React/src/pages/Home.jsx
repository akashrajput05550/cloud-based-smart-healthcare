import { useEffect, useState } from "react";
import "../App.css";

function Counter({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / 100;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="stat-item">
      <h2>{count}+</h2>
      <p>{label}</p>
    </div>
  );
}

function App() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">CBSHMS</h1>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="/login">Login</a>

          <a href="/register" className="register-btn">
            Register
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-content">
            <h1>
              Cloud Based Smart{" "}
              <span>Healthcare System</span>
            </h1>

            <p>
              A secure, scalable and real-time healthcare management
              solution for Admins, Doctors and Patients.
            </p>

            <div className="hero-buttons">
              <a href="/register" className="primary-btn">
                Get Started
              </a>

              <a href="/login" className="secondary-btn">
                Login
              </a>
            </div>
          </div>

          <div className="hero-image-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
              alt="Healthcare Illustration"
              className="hero-image"
            />
          </div>

        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section">
        <div className="stats-container">

          <Counter
            target={100}
            label="Registered Patients"
          />

          <Counter
            target={25}
            label="Expert Doctors"
          />

          <Counter
            target={300}
            label="Appointments Managed"
          />

        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">

        <h2 className="section-title">
          Powerful Features
        </h2>

        <div className="features-container">

          <div className="feature-card">
            <div className="feature-icon">🔐</div>

            <h3>Secure Role Access</h3>

            <p>
              Admin, Doctor and Patient dashboards with
              role-based protection.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>

            <h3>Real-Time Booking</h3>

            <p>
              Smart appointment booking with instant
              approval system.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">☁️</div>

            <h3>Cloud Database</h3>

            <p>
              Powered by Supabase for secure and scalable
              cloud storage.
            </p>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">

        <div className="about-container">

          <h2>About CBSHMS</h2>

          <p>
            CBSHMS is a Cloud Based Smart Healthcare Management
            System designed to simplify healthcare operations
            for administrators, doctors and patients.
          </p>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 CBSHMS | Cloud Based Smart Healthcare Management System
      </footer>

    </div>
  );
}

export default App;