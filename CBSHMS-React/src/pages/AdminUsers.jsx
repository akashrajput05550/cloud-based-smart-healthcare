import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../style/AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // FETCH ALL USERS
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("USERS")
        .select("id, name, email, role")
        .order("name", {
          ascending: true,
        });

      if (error) {
        console.error("Users fetch error:", error);
        setErrorMessage(error.message);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Unexpected users error:", error);

      setErrorMessage(
        error?.message || "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE USER PROFILE
  // =====================================================

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("USERS")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete user error:", error);
        alert(error.message);
        return;
      }

      setUsers((previous) =>
        previous.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error("Unexpected delete error:", error);
      alert("Unable to delete user.");
    }
  };

  // =====================================================
  // ROLE CLASS
  // =====================================================

  const getRoleClass = (role) => {
    if (role?.toLowerCase() === "doctor") {
      return "admin-user-role-doctor";
    }

    if (role?.toLowerCase() === "admin") {
      return "admin-user-role-admin";
    }

    return "admin-user-role-patient";
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
    <div className="admin-users-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="admin-users-navbar">

        <div className="admin-users-logo">
          CBSHMS
        </div>

        <div className="admin-users-nav-right">

          <span>
            Manage Users
          </span>

          <button
            className="admin-users-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-users-container">

        {/* PAGE HEADER */}

        <div className="admin-users-header">

          <div>

            <h1>
              👤 Manage Users
            </h1>

            <p>
              View and manage all registered users.
            </p>

          </div>

          <Link
            to="/admin-dashboard"
            className="admin-users-dashboard-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ERROR */}

        {errorMessage && (
          <div className="admin-users-error">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        {loading ? (

          <div className="admin-users-message">

            <div className="admin-users-spinner"></div>

            <p>
              Loading users...
            </p>

          </div>

        ) : users.length === 0 ? (

          <div className="admin-users-message">

            <div className="admin-users-empty-icon">
              👤
            </div>

            <h2>
              No Users Found
            </h2>

            <p>
              There are currently no registered users.
            </p>

          </div>

        ) : (

          <section className="admin-users-card">

            {/* CARD HEADER */}

            <div className="admin-users-card-header">

              <h2>
                Registered Users
              </h2>

              <p>
                Total Users:{" "}
                <strong>
                  {users.length}
                </strong>
              </p>

            </div>


            {/* TABLE */}

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      User Name
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

                  {users.map(
                    (user, index) => (

                      <tr
                        key={
                          user.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>

                          <div className="admin-user-name">

                            <div className="admin-user-icon">
                              {user.role?.toLowerCase() ===
                              "doctor"
                                ? "👨‍⚕️"
                                : "👤"}
                            </div>

                            <strong>
                              {user.name ||
                                "Unnamed User"}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>

                          <span
                            className={`admin-user-role ${getRoleClass(
                              user.role
                            )}`}
                          >
                            {user.role
                              ? user.role
                                  .charAt(0)
                                  .toUpperCase() +
                                user.role
                                  .slice(1)
                                  .toLowerCase()
                              : "User"}
                          </span>

                        </td>

                        <td>

                          <button
                            className="admin-users-delete"
                            onClick={() =>
                              deleteUser(user.id)
                            }
                          >
                            Delete
                          </button>

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

export default AdminUsers;