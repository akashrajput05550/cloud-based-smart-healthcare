// ==========================
// 🔐 PROTECT DASHBOARD
// ==========================
function protectDashboard(requiredRole) {

    const email = localStorage.getItem("loggedInEmail");

    if (!email) {
        window.location.href = "../login.html";
        return;
    }

    supabaseClient
        .from("USERS")
        .select("role")
        .eq("email", email)
        .single()
        .then(({ data, error }) => {

            if (error || !data || data.role !== requiredRole) {
                alert("Access Denied");
                window.location.href = "../login.html";
            }

        });
}


// ==========================
// REGISTER
// ==========================
async function register() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    const { error } = await supabaseClient
        .from("USERS")
        .insert([{ name, email, password, role }]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Registration Successful!");
        window.location.href = "login.html";
    }
}


// ==========================
// LOGIN
// ==========================
async function login() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const { data, error } = await supabaseClient
        .from("USERS")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

    if (error || !data) {
        alert("Invalid Credentials");
        return;
    }

    localStorage.setItem("loggedInEmail", email);

    if (data.role === "patient") {
        window.location.href = "dashboard/patient-dashboard.html";
    } 
    else if (data.role === "doctor") {
        window.location.href = "dashboard/doctor-dashboard.html";
    } 
    else if (data.role === "admin") {
        window.location.href = "dashboard/admin-dashboard.html";
    }
}


// ==========================
// LOGOUT
// ==========================
function logout() {
    localStorage.removeItem("loggedInEmail");
    window.location.href = "../login.html";
}


// ==========================
// BOOK APPOINTMENT
// ==========================
async function bookAppointment() {

    const patientEmail = localStorage.getItem("loggedInEmail");

    const doctorEmail = document.getElementById("doctorEmail").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;

    if (!patientEmail) {
        alert("Please login again");
        return;
    }

    const { error } = await supabaseClient
        .from("APPOINTMENTS")
        .insert([{
            patient_email: patientEmail,
            doctor_email: doctorEmail,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            status: "pending"
        }]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Appointment Booked Successfully!");
    }
}


// ==========================
// LOAD DOCTOR APPOINTMENTS
// ==========================
async function loadAppointments() {

    const doctorEmail = localStorage.getItem("loggedInEmail");
    if (!doctorEmail) return;

    const { data, error } = await supabaseClient
        .from("APPOINTMENTS")
        .select("*")
        .eq("doctor_email", doctorEmail);

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("appointmentTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(app => {
        table.innerHTML += `
            <tr>
                <td class="border p-2">${app.patient_email}</td>
                <td class="border p-2">${app.appointment_date}</td>
                <td class="border p-2">${app.appointment_time}</td>
                <td class="border p-2 font-semibold">${app.status}</td>
                <td class="border p-2">
                    ${app.status === "pending" ? `
                        <button onclick="updateStatus('${app.id}','approved')" 
                            class="bg-green-600 text-white px-2 py-1 rounded">
                            Approve
                        </button>
                        <button onclick="updateStatus('${app.id}','rejected')" 
                            class="bg-red-600 text-white px-2 py-1 rounded">
                            Reject
                        </button>
                    ` : `
                        <span class="text-gray-600 font-semibold">No Action</span>
                    `}
                </td>
            </tr>
        `;
    });
}

// ==========================
// DOCTOR STATISTICS
// ==========================
async function loadDoctorStats() {

    const doctorEmail = localStorage.getItem("loggedInEmail");
    if (!doctorEmail) return;

    const { data } = await supabaseClient
        .from("APPOINTMENTS")
        .select("*")
        .eq("doctor_email", doctorEmail);

    if (!data) return;

    const total = data.length;
    const approved = data.filter(a => a.status === "approved").length;
    const pending = data.filter(a => a.status === "pending").length;

    document.getElementById("totalAppointments").innerText = total;
    document.getElementById("approvedAppointments").innerText = approved;
    document.getElementById("pendingAppointments").innerText = pending;
}
// ==========================
// UPDATE APPOINTMENT STATUS
// ==========================
async function updateStatus(id, newStatus) {

    const { error } = await supabaseClient
        .from("APPOINTMENTS")
        .update({ status: newStatus })
        .eq("id", id);

    if (error) {
        alert(error.message);
    } else {
        alert("Status Updated");
        loadAppointments();
        loadAllAppointments();
    }
}


// ==========================
// LOAD PATIENT APPOINTMENTS
// ==========================
async function loadPatientAppointments() {

    const patientEmail = localStorage.getItem("loggedInEmail");
    if (!patientEmail) return;

    const { data, error } = await supabaseClient
        .from("APPOINTMENTS")
        .select("*")
        .eq("patient_email", patientEmail);

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("patientAppointmentTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(app => {

        let statusColor = "text-yellow-600";

        if (app.status === "approved") statusColor = "text-green-600";
        else if (app.status === "rejected") statusColor = "text-red-600";

        table.innerHTML += `
            <tr>
                <td class="border p-2">${app.doctor_email}</td>
                <td class="border p-2">${app.appointment_date}</td>
                <td class="border p-2">${app.appointment_time}</td>
                <td class="border p-2 font-semibold ${statusColor}">
                    ${app.status}
                </td>
            </tr>
        `;
    });
}


// ==========================
// LOAD ALL USERS (ADMIN)
// ==========================
async function loadAllUsers() {

    const { data, error } = await supabaseClient
        .from("USERS")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("userTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(user => {
        table.innerHTML += `
            <tr>
                <td class="border p-2">${user.name}</td>
                <td class="border p-2">${user.email}</td>
                <td class="border p-2">${user.role}</td>
                <td class="border p-2">
                    <button onclick="deleteUser('${user.id}')" 
                        class="bg-red-600 text-white px-2 py-1 rounded">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ==========================
// DELETE USER (ADMIN)
// ==========================
async function deleteUser(id) {

    const loggedEmail = localStorage.getItem("loggedInEmail");

    const { data } = await supabaseClient
        .from("USERS")
        .select("email")
        .eq("id", id)
        .single();

    if (data.email === loggedEmail) {
        alert("You cannot delete yourself!");
        return;
    }

    const { error } = await supabaseClient
        .from("USERS")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
    } else {
        alert("User Deleted");
        loadAllUsers();
    }
}


// ==========================
// LOAD ALL APPOINTMENTS (ADMIN)
// ==========================
async function loadAllAppointments() {

    const { data, error } = await supabaseClient
        .from("APPOINTMENTS")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("adminAppointmentTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(app => {
        table.innerHTML += `
            <tr>
                <td class="border p-2">${app.patient_email}</td>
                <td class="border p-2">${app.doctor_email}</td>
                <td class="border p-2">${app.appointment_date}</td>
                <td class="border p-2">${app.appointment_time}</td>
                <td class="border p-2">${app.status}</td>
                <td class="border p-2">
                    ${
                        app.status === "pending"
                        ? `
                        <button onclick="updateStatus('${app.id}','approved')" 
                            class="bg-green-600 text-white px-2 py-1 rounded">
                            Approve
                        </button>
                        <button onclick="updateStatus('${app.id}','rejected')" 
                            class="bg-yellow-600 text-white px-2 py-1 rounded">
                            Reject
                        </button>
                        `
                        : "No Action"
                    }
                </td>
            </tr>
        `;
    });
}



// ==========================
// LOAD PROFILE
// ==========================
async function loadProfile() {

    const email = localStorage.getItem("loggedInEmail");
    if (!email) return;

    const { data, error } = await supabaseClient
        .from("USERS")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) return;

    document.getElementById("profileName").innerText = data.name;
    document.getElementById("profileEmail").innerText = data.email;
    document.getElementById("profileRole").innerText = data.role;
}


// ==========================
// ENABLE EDIT MODE
// ==========================
function enableEdit() {

    const name = document.getElementById("profileName").innerText;

    document.getElementById("profileName").innerHTML = `
        <input id="editName" value="${name}" 
        class="border p-2 rounded w-64">
    `;

    document.querySelector("button[onclick='enableEdit()']").innerText = "Save";
    document.querySelector("button[onclick='enableEdit()']").setAttribute("onclick", "saveProfile()");
}


// ==========================
// SAVE PROFILE
// ==========================
async function saveProfile() {

    const newName = document.getElementById("editName").value;
    const email = localStorage.getItem("loggedInEmail");

    const { error } = await supabaseClient
        .from("USERS")
        .update({ name: newName })
        .eq("email", email);

    if (error) {
        alert(error.message);
    } else {
        alert("Profile Updated Successfully");
        loadProfile();
    }
}



// ==========================
// 🔗 BLOCKCHAIN HASH FUNCTION
// ==========================
async function generateHash(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


// ==========================
// 🔗 ADD BLOCK TO BLOCKCHAIN
// ==========================
async function addBlock(data) {

    const { data: lastBlock } = await supabaseClient
        .from("BLOCKCHAIN_LOGS")
        .select("*")
        .order("index", { ascending: false })
        .limit(1);

    let index = 1;
    let previousHash = "0";

    if (lastBlock && lastBlock.length > 0) {
        index = lastBlock[0].index + 1;
        previousHash = lastBlock[0].hash;
    }

    const timestamp = new Date().toISOString();

    const blockData = index + timestamp + data + previousHash;
    const hash = await generateHash(blockData);

    await supabaseClient.from("BLOCKCHAIN_LOGS").insert([{
        index: index,
        timestamp: timestamp,
        data: data,
        previous_hash: previousHash,
        hash: hash
    }]);
}