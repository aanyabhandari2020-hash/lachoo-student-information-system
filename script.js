
"use strict";

/* =====================================================
   LACHOO MEMORIAL COLLEGE - DEMONSTRATION ERP
   All student, parent and faculty data is fictional.
   ===================================================== */

const $ = (id) => document.getElementById(id);

const pageNames = {
  dashboard: "Dashboard",
  academics: "Academics",
  students: "Students",
  attendance: "Attendance",
  performance: "Performance",
  courses: "Courses",
  exams: "Exams",
  fees: "Fees Management",
  parents: "Parents Portal",
  programs: "Academic Programs",
  faculty: "Faculty Directory",
  profile: "My Profile"
};

const courses = [
  { name: "BCA", full: "Bachelor of Computer Applications", duration: "3 Years" },
  { name: "BBA", full: "Bachelor of Business Administration", duration: "3 Years" },
  { name: "B.Com", full: "Bachelor of Commerce", duration: "3 Years" },
  { name: "B.Sc", full: "Bachelor of Science", duration: "3 Years" },
  { name: "BA", full: "Bachelor of Arts", duration: "3 Years" },
  { name: "MCA", full: "Master of Computer Applications", duration: "2 Years" }
];

const initialStudents = [
  ["ST001", "Aarav Sharma", "Rakesh Sharma", "BCA", 92, 88, 45000],
  ["ST002", "Ananya Verma", "Suresh Verma", "BCA", 95, 94, 45000],
  ["ST003", "Rohan Mehta", "Rajesh Mehta", "BBA", 81, 76, 42000],
  ["ST004", "Priya Singh", "Mahesh Singh", "B.Com", 89, 91, 38000],
  ["ST005", "Arjun Gupta", "Manoj Gupta", "B.Sc", 74, 68, 40000],
  ["ST006", "Kavya Joshi", "Deepak Joshi", "BA", 96, 93, 35000],
  ["ST007", "Vivaan Patel", "Nitin Patel", "BCA", 78, 82, 45000],
  ["ST008", "Isha Agarwal", "Pankaj Agarwal", "BBA", 88, 85, 42000],
  ["ST009", "Aditya Jain", "Vikas Jain", "B.Com", 68, 72, 38000],
  ["ST010", "Meera Rathore", "Ajay Rathore", "B.Sc", 93, 90, 40000],
  ["ST011", "Kabir Khan", "Imran Khan", "BA", 85, 79, 35000],
  ["ST012", "Saanvi Das", "Amit Das", "BCA", 97, 96, 45000],
  ["ST013", "Reyansh Yadav", "Sunil Yadav", "BBA", 72, 70, 42000],
  ["ST014", "Aditi Choudhary", "Ramesh Choudhary", "B.Com", 91, 87, 38000],
  ["ST015", "Dhruv Malhotra", "Sanjay Malhotra", "B.Sc", 83, 81, 40000],
  ["ST016", "Tanya Bansal", "Karan Bansal", "BA", 90, 92, 35000],
  ["ST017", "Ishaan Kapoor", "Amit Kapoor", "BCA", 76, 74, 45000],
  ["ST018", "Nisha Soni", "Pradeep Soni", "BBA", 94, 89, 42000],
  ["ST019", "Devansh Purohit", "Hemant Purohit", "B.Com", 80, 84, 38000],
  ["ST020", "Riya Bhandari", "Mohan Bhandari", "MCA", 98, 95, 50000]
];

let students = initialStudents.map((s, i) => ({
  id: s[0],
  name: s[1],
  parent: s[2],
  course: s[3],
  attendance: s[4],
  marks: s[5],
  totalFee: s[6],
  paidFee: Math.round(s[6] * ([0.8, 1, 0.6, 0.9, 0.7][i % 5]))
}));

const facultyNames = [
  "Dr. Neelam Sharma", "Prof. Rajiv Mehta", "Dr. Pooja Verma",
  "Prof. Amit Joshi", "Dr. Kavita Singh", "Prof. Suresh Gupta",
  "Dr. Ritu Agarwal", "Prof. Manish Jain", "Dr. Sunita Rathore",
  "Prof. Vikram Patel", "Dr. Anjali Kapoor", "Prof. Deepak Yadav",
  "Dr. Meena Choudhary", "Prof. Kunal Bansal", "Dr. Rakesh Soni",
  "Prof. Priyanka Das", "Dr. Nitin Malhotra", "Prof. Swati Khan",
  "Dr. Ajay Purohit", "Prof. Shalini Arora", "Dr. Varun Sharma",
  "Prof. Nisha Mehta", "Dr. Gaurav Verma", "Prof. Seema Joshi",
  "Dr. Rahul Singh", "Prof. Preeti Gupta", "Dr. Mohit Agarwal",
  "Prof. Rekha Jain", "Dr. Sanjay Patel", "Prof. Alka Kapoor"
];

const departments = [
  "Computer Applications", "Management", "Commerce",
  "Science", "Arts", "Mathematics"
];

const faculty = facultyNames.map((name, i) => ({
  id: "FAC" + String(i + 1).padStart(3, "0"),
  name,
  department: departments[i % departments.length],
  designation: i % 4 === 0 ? "Professor" :
               i % 3 === 0 ? "Associate Professor" : "Assistant Professor",
  email: "faculty" + (i + 1) + "@example.com",
  experience: 2 + ((i * 3) % 19)
}));

const exams = [
  { name: "Internal Assessment I", date: "2026-08-10", type: "Internal" },
  { name: "Internal Assessment II", date: "2026-09-15", type: "Internal" },
  { name: "Practical Examination", date: "2026-10-20", type: "Practical" },
  { name: "Semester Examination", date: "2026-11-10", type: "Semester" }
];

let currentUser = { name: "Guest", role: "Guest" };
let currentPage = "dashboard";
let studentSearch = "";
let facultySearch = "";
let feeFilter = "all";

/* ----- Basic helpers ----- */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function average(list, property) {
  if (!list.length) return 0;
  return Math.round(
    list.reduce((sum, item) => sum + item[property], 0) / list.length
  );
}

function grade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  return "Needs Improvement";
}

function badge(text, kind = "") {
  return `<span class="badge ${kind}">${escapeHTML(text)}</span>`;
}

function attendanceBadge(value) {
  return badge(value + "%", value < 75 ? "danger" : value < 85 ? "warning" : "");
}

function progressLine(label, value) {
  return `
    <div class="progress-line">
      <span>${escapeHTML(label)}</span>
      <div class="progress-track">
        <div class="progress-fill" style="width:${Math.max(0, Math.min(100, value))}%"></div>
      </div>
      <strong>${value}%</strong>
    </div>`;
}

function heading(title, description, button = "") {
  return `
    <div class="section-heading">
      <div><h2>${title}</h2><p>${description}</p></div>
      ${button}
    </div>`;
}

function panel(title, content) {
  return `<div class="panel"><h3>${title}</h3>${content}</div>`;
}

function statCard(label, value, icon, note) {
  return `
    <div class="stat-card">
      <div class="stat-top">
        <span class="stat-label">${label}</span>
        <span class="stat-icon">${icon}</span>
      </div>
      <div class="stat-value">${value}</div>
      <div class="stat-note">${note}</div>
    </div>`;
}

function table(headers, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.length ? rows.join("") :
          `<tr><td colspan="${headers.length}" class="empty-state">No records found.</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function studentRows(list, actions = false) {
  return list.map(s => `
    <tr>
      <td><strong>${escapeHTML(s.id)}</strong></td>
      <td>${escapeHTML(s.name)}</td>
      <td>${escapeHTML(s.parent)}</td>
      <td>${escapeHTML(s.course)}</td>
      <td>${attendanceBadge(s.attendance)}</td>
      <td>${s.marks}%</td>
      ${actions ? `<td>
        <button class="action-btn" data-edit="${escapeHTML(s.id)}">Edit</button>
        <button class="action-btn delete" data-delete="${escapeHTML(s.id)}">Delete</button>
      </td>` : ""}
    </tr>`).join("");
}

function getBalance(s) {
  return Math.max(0, s.totalFee - s.paidFee);
}

function studentCountByCourse() {
  return courses.map(c => ({
    ...c,
    count: students.filter(s => s.course === c.name).length
  }));
}

function isAdmin() {
  return currentUser.role === "Admin";
}

function adminButton() {
  return isAdmin()
    ? `<button class="primary-btn" id="addStudentBtn">+ Add Student</button>`
    : "";
}

function setContent(html) {
  $("pageContent").innerHTML = html;
}

/* ----- Login and logout ----- */

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("loginName").value.trim();
  if (!name) return;

  currentUser = {
    name,
    role: $("loginRole").value
  };

  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("userName").textContent = currentUser.name;
  $("userRole").textContent = currentUser.role;
  $("userAvatar").textContent = currentUser.name.charAt(0).toUpperCase();

  renderPage("dashboard");
});

$("logoutBtn").addEventListener("click", () => {
  $("app").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("loginName").value = "";
  $("loginRole").value = "Guest";
  currentUser = { name: "Guest", role: "Guest" };
});

$("menuToggle").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});

/* ----- Sidebar navigation ----- */

$("navigation").addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button) return;
  renderPage(button.dataset.page);
});

document.querySelector(".sidebar nav:last-of-type").addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (button) renderPage(button.dataset.page);
});

/* ----- Page rendering ----- */

function renderPage(page) {
  if (!pageNames[page]) page = "dashboard";
  currentPage = page;

  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  $("pageHeading").textContent = pageNames[page];
  $("pageSubheading").textContent = page === "dashboard"
    ? "Student management at a glance"
    : "College ERP · " + pageNames[page];

  $("sidebar").classList.remove("open");

  const renderers = {
    dashboard: renderDashboard,
    academics: renderAcademics,
    students: renderStudents,
    attendance: renderAttendance,
    performance: renderPerformance,
    courses: renderCourses,
    exams: renderExams,
    fees: renderFees,
    parents: renderParents,
    programs: renderPrograms,
    faculty: renderFaculty,
    profile: renderProfile
  };

  renderers[page]();
}

function renderDashboard() {
  const avgAttendance = average(students, "attendance");
  const avgMarks = average(students, "marks");
  const pending = students.reduce((sum, s) => sum + getBalance(s), 0);

  setContent(`
    ${heading("Dashboard Overview", "A quick summary of the college demonstration records.")}

    <div class="stats-grid">
      ${statCard("Total Students", students.length, "♙", "All registered demo students")}
      ${statCard("Faculty Members", faculty.length, "♟", "Across six departments")}
      ${statCard("Average Attendance", avgAttendance + "%", "◷", "Across student records")}
      ${statCard("Average Performance", avgMarks + "%", "▥", "Illustrative academic scores")}
    </div>

    <div class="panel-grid">
      ${panel("Course-wise Students", `
        ${studentCountByCourse().map(c => progressLine(c.name, students.length
          ? Math.round(c.count / students.length * 100) : 0)).join("")}
      `)}
      ${panel("Fee Summary", `
        <div class="list-item"><span>Total Fees</span><strong>${money(students.reduce((a,s) => a+s.totalFee, 0))}</strong></div>
        <div class="list-item"><span>Fees Collected</span><strong>${money(students.reduce((a,s) => a+s.paidFee, 0))}</strong></div>
        <div class="list-item"><span>Outstanding Balance</span><strong>${money(pending)}</strong></div>
        <div class="notice">These amounts are fictional and are for demonstrating the dashboard only.</div>
      `)}
    </div>

    ${heading("Recently Listed Students", "Latest entries in the sample student register.",
      `<button class="action-btn" data-go="students">View All Students →</button>`)}
    ${panel("Student Register", table(
      ["Roll Number", "Student Name", "Parent/Guardian", "Course", "Attendance", "Performance"],
      studentRows(students.slice(-5).reverse())
    ))}
  `);
}

function renderStudents() {
  const visible = students.filter(s => {
    const query = studentSearch.toLowerCase();
    return [s.name, s.id, s.parent, s.course].some(v =>
      String(v).toLowerCase().includes(query));
  });

  setContent(`
    ${heading("Student Management", "Search and manage the fictional student register.", adminButton())}
    <div class="panel">
      <div class="section-heading">
        <div><h2>All Student Records</h2><p id="studentCount">${visible.length} of ${students.length} records</p></div>
        <input class="search-bar" id="studentSearch" type="search"
          placeholder="Search by name, roll number, parent or course..."
          value="${escapeHTML(studentSearch)}">
      </div>
      <div id="studentTable">
        ${table(
          ["Roll Number", "Student Name", "Parent/Guardian", "Course", "Attendance", "Performance", ...(isAdmin() ? ["Actions"] : [])],
          studentRows(visible, isAdmin())
        )}
      </div>
    </div>
    <div class="notice">Sample records only. Admin mode enables local demonstration edits; it does not provide secure authentication.</div>
  `);
}

function renderAttendance() {
  const rows = students.map(s => `
    <tr>
      <td>${escapeHTML(s.id)}</td>
      <td>${escapeHTML(s.name)}</td>
      <td>${escapeHTML(s.course)}</td>
      <td>${attendanceBadge(s.attendance)}</td>
      <td>${s.attendance >= 75 ? badge("Satisfactory") : badge("Below 75%", "danger")}</td>
    </tr>`);

  setContent(`
    ${heading("Attendance Management", "Illustrative attendance percentages for all students.")}
    <div class="stats-grid">
      ${statCard("Average Attendance", average(students, "attendance") + "%", "◷", "All sample records")}
      ${statCard("Above 75%", students.filter(s => s.attendance >= 75).length, "✓", "Students meeting the sample threshold")}
      ${statCard("Below 75%", students.filter(s => s.attendance < 75).length, "!", "Records needing attention")}
      ${statCard("Total Students", students.length, "♙", "Current register")}
    </div>
    ${panel("Attendance Register", table(["Roll Number", "Student Name", "Course", "Attendance", "Status"], rows))}
    <div class="notice">Attendance percentages are invented examples, not official attendance records.</div>
  `);
}

function renderPerformance() {
  const sorted = [...students].sort((a,b) => b.marks - a.marks);
  const rows = sorted.map((s, i) => `
    <tr><td>${i + 1}</td><td>${escapeHTML(s.name)}</td>
    <td>${escapeHTML(s.course)}</td><td>${s.marks}%</td>
    <td>${badge(grade(s.marks), s.marks < 60 ? "danger" : "")}</td></tr>`);

  setContent(`
    ${heading("Academic Performance", "Illustrative marks and grade categories.")}
    <div class="stats-grid">
      ${statCard("Average Score", average(students, "marks") + "%", "▥", "Sample marks")}
      ${statCard("Above 90%", students.filter(s => s.marks >= 90).length, "★", "High-scoring sample records")}
      ${statCard("Above 75%", students.filter(s => s.marks >= 75).length, "✓", "Students scoring 75% or more")}
      ${statCard("Below 60%", students.filter(s => s.marks < 60).length, "!", "Sample records below 60%")}
    </div>
    ${panel("Performance Ranking", table(["Rank", "Student Name", "Course", "Score", "Grade"], rows))}
  `);
}

function renderCourses() {
  const items = studentCountByCourse();
  setContent(`
    ${heading("Courses", "Course catalogue and student enrolment summary.")}
    <div class="module-grid">
      ${items.map(c => `
        <div class="module-card">
          <div class="stat-icon">▣</div>
          <h3>${escapeHTML(c.name)}</h3>
          <p>${escapeHTML(c.full)}</p>
          <p><strong>Duration:</strong> ${c.duration}</p>
          <p><strong>Sample enrolment:</strong> ${c.count} students</p>
        </div>`).join("")}
    </div>
  `);
}

function renderAcademics() {
  setContent(`
    ${heading("Academics", "Academic information and learning overview.")}
    <div class="stats-grid">
      ${statCard("Programs", courses.length, "▦", "Sample program catalogue")}
      ${statCard("Departments", departments.length, "▤", "Demonstration departments")}
      ${statCard("Faculty", faculty.length, "♙", "Fictional directory")}
      ${statCard("Students", students.length, "♧", "Fictional register")}
    </div>
    ${panel("Academic Departments", table(
      ["Department", "Faculty Listed", "Status"],
      departments.map(d => `<tr><td>${escapeHTML(d)}</td><td>${faculty.filter(f => f.department === d).length}</td><td>${badge("Demo Data")}</td></tr>`)
    ))}
  `);
}

function renderExams() {
  setContent(`
    ${heading("Examinations", "Illustrative examination schedule.")}
    ${panel("Examination Calendar", table(
      ["Examination", "Date", "Type", "Status"],
      exams.map(e => `<tr><td>${escapeHTML(e.name)}</td><td>${e.date}</td><td>${escapeHTML(e.type)}</td><td>${badge("Sample Schedule", "warning")}</td></tr>`)
    ))}
    <div class="notice">The examination dates above are fictional project examples and are not an official college timetable.</div>
  `);
}

function renderFees() {
  const filtered = students.filter(s => {
    if (feeFilter === "pending") return getBalance(s) > 0;
    if (feeFilter === "paid") return getBalance(s) === 0;
    return true;
  });

  setContent(`
    ${heading("Fees Management", "Demonstration fee records for fictional students.")}
    <div class="stats-grid">
      ${statCard("Total Fee Amount", money(students.reduce((a,s) => a+s.totalFee, 0)), "₹", "All listed students")}
      ${statCard("Amount Collected", money(students.reduce((a,s) => a+s.paidFee, 0)), "✓", "Sample paid amounts")}
      ${statCard("Outstanding Fees", money(students.reduce((a,s) => a+getBalance(s), 0)), "!", "Sample pending amounts")}
      ${statCard("Students with Balance", students.filter(s => getBalance(s) > 0).length, "♙", "Illustrative accounts")}
    </div>
    <div class="panel">
      <div class="section-heading">
        <div><h2>Student Fee Register</h2><p>Fee values are for demonstration purposes only.</p></div>
        <select id="feeFilter" class="search-bar">
          <option value="all" ${feeFilter === "all" ? "selected" : ""}>All Records</option>
          <option value="pending" ${feeFilter === "pending" ? "selected" : ""}>Pending Fees</option>
          <option value="paid" ${feeFilter === "paid" ? "selected" : ""}>Fully Paid</option>
        </select>
      </div>
      ${table(["Roll Number", "Student", "Course", "Total Fee", "Paid", "Balance", "Status"],
        filtered.map(s => `<tr>
          <td>${escapeHTML(s.id)}</td><td>${escapeHTML(s.name)}</td><td>${escapeHTML(s.course)}</td>
          <td>${money(s.totalFee)}</td><td>${money(s.paidFee)}</td><td>${money(getBalance(s))}</td>
          <td>${getBalance(s) === 0 ? badge("Paid") : badge("Pending", "warning")}</td>
        </tr>`))}
    </div>
  `);
}

function renderParents() {
  setContent(`
    ${heading("Parents Portal", "Sample guardian details linked to student records.")}
    ${panel("Parent/Guardian Directory", table(
      ["Student Roll No.", "Student Name", "Parent/Guardian", "Course", "Attendance", "Performance"],
      studentRows(students)
    ))}
    <div class="notice">This is a demonstration directory, not a secure parent login or messaging portal.</div>
  `);
}

function renderPrograms() {
  setContent(`
    ${heading("Academic Programs", "Available programs in the sample catalogue.")}
    ${panel("Program List", table(
      ["Program", "Full Name", "Duration", "Sample Students"],
      studentCountByCourse().map(c => `<tr>
        <td><strong>${escapeHTML(c.name)}</strong></td>
        <td>${escapeHTML(c.full)}</td><td>${c.duration}</td><td>${c.count}</td>
      </tr>`)
    ))}
  `);
}

function renderFaculty() {
  const visible = faculty.filter(f =>
    [f.name, f.id, f.department, f.designation].some(v =>
      String(v).toLowerCase().includes(facultySearch.toLowerCase()))
  );

  setContent(`
    ${heading("Faculty Directory", "30 fictional faculty profiles across six departments.")}
    <div class="stats-grid">
      ${statCard("Faculty Members", faculty.length, "♙", "Fictional sample directory")}
      ${statCard("Departments", departments.length, "▤", "Academic departments")}
      ${statCard("Professors", faculty.filter(f => f.designation === "Professor").length, "★", "Sample designations")}
      ${statCard("Other Faculty", faculty.filter(f => f.designation !== "Professor").length, "✓", "Sample designations")}
    </div>
    <div class="panel">
      <div class="section-heading">
        <div><h2>Faculty Members</h2><p id="facultyCount">${visible.length} of ${faculty.length} members</p></div>
        <input class="search-bar" id="facultySearch" type="search"
          placeholder="Search faculty or department..." value="${escapeHTML(facultySearch)}">
      </div>
      <div id="facultyTable">${facultyTable(visible)}</div>
    </div>
    <div class="notice">All names, email addresses and designations are invented for this student project.</div>
  `);
}

function facultyTable(list) {
  return table(
    ["Faculty ID", "Faculty Name", "Department", "Designation", "Experience", "Email"],
    list.map(f => `<tr>
      <td>${escapeHTML(f.id)}</td><td>${escapeHTML(f.name)}</td>
      <td>${escapeHTML(f.department)}</td><td>${escapeHTML(f.designation)}</td>
      <td>${f.experience} years</td><td>${escapeHTML(f.email)}</td>
    </tr>`)
  );
}

function renderProfile() {
  setContent(`
    ${heading("My Profile", "Your current demonstration login details.")}
    <div class="profile-layout">
      <div class="panel profile-card">
        <div class="avatar profile-big-avatar">${escapeHTML(currentUser.name.charAt(0).toUpperCase())}</div>
        <h2>${escapeHTML(currentUser.name)}</h2>
        ${badge(currentUser.role)}
        <p class="muted">Lachoo Memorial College ERP</p>
      </div>
      <div class="panel">
        <h3>Account Information</h3>
        <div class="profile-details">
          <div><span>Display Name</span><strong>${escapeHTML(currentUser.name)}</strong></div>
          <div><span>Login Role</span><strong>${escapeHTML(currentUser.role)}</strong></div>
          <div><span>Portal</span><strong>Student Information Page</strong></div>
          <div><span>Account Type</span><strong>Demo Session</strong></div>
          <div><span>Student Records</span><strong>${students.length}</strong></div>
          <div><span>Faculty Records</span><strong>${faculty.length}</strong></div>
        </div>
        <div class="notice">This login is not connected to a real user account or college authentication system.</div>
        <button class="primary-btn" id="profileLogout">Logout</button>
      </div>
    </div>
  `);
}

/* ----- Student search and faculty search ----- */

$("pageContent").addEventListener("input", (event) => {
  if (event.target.id === "studentSearch") {
    studentSearch = event.target.value;
    const visible = students.filter(s =>
      [s.name, s.id, s.parent, s.course].some(v =>
        String(v).toLowerCase().includes(studentSearch.toLowerCase()))
    );

    const count = $("studentCount");
    if (count) count.textContent = `${visible.length} of ${students.length} records`;

    const tableArea = $("studentTable");
    if (tableArea) {
      tableArea.innerHTML = table(
        ["Roll Number", "Student Name", "Parent/Guardian", "Course", "Attendance", "Performance", ...(isAdmin() ? ["Actions"] : [])],
        studentRows(visible, isAdmin())
      );
    }
  }

  if (event.target.id === "facultySearch") {
    facultySearch = event.target.value;
    const visible = faculty.filter(f =>
      [f.name, f.id, f.department, f.designation].some(v =>
        String(v).toLowerCase().includes(facultySearch.toLowerCase()))
    );
    const count = $("facultyCount");
    if (count) count.textContent = `${visible.length} of ${faculty.length} members`;
    const area = $("facultyTable");
    if (area) area.innerHTML = facultyTable(visible);
  }
});

$("pageContent").addEventListener("change", (event) => {
  if (event.target.id === "feeFilter") {
    feeFilter = event.target.value;
    renderFees();
  }
});

/* ----- Student add/edit/delete ----- */

function openStudentModal(student = null) {
  if (!isAdmin()) {
    alert("Please select Admin at the demo login screen to edit student records.");
    return;
  }

  $("studentForm").reset();
  $("editStudentId").value = student ? student.id : "";
  $("modalTitle").textContent = student ? "Edit Student" : "Add Student";

  if (student) {
    $("studentName").value = student.name;
    $("studentCourse").value = student.course;
    $("studentParent").value = student.parent;
    $("studentAttendance").value = student.attendance;
    $("studentMarks").value = student.marks;
    $("studentFee").value = student.totalFee;
  }

  $("studentModal").classList.remove("hidden");
}

function closeStudentModal() {
  $("studentModal").classList.add("hidden");
}

$("closeModal").addEventListener("click", closeStudentModal);

$("studentModal").addEventListener("click", (event) => {
  if (event.target === $("studentModal")) closeStudentModal();
});

$("pageContent").addEventListener("click", (event) => {
  const add = event.target.closest("#addStudentBtn");
  if (add) {
    openStudentModal();
    return;
  }

  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const student = students.find(s => s.id === edit.dataset.edit);
    if (student) openStudentModal(student);
    return;
  }

  const del = event.target.closest("[data-delete]");
  if (del) {
    if (!isAdmin()) return;
    const student = students.find(s => s.id === del.dataset.delete);
    if (!student) return;

    if (confirm(`Delete the demo record for ${student.name}?`)) {
      students = students.filter(s => s.id !== student.id);
      renderPage(currentPage);
    }
    return;
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    renderPage(go.dataset.go);
    return;
  }

  if (event.target.closest("#profileLogout")) {
    $("logoutBtn").click();
  }
});

$("studentForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    alert("Only the Admin demo role can edit records.");
    return;
  }

  const name = $("studentName").value.trim();
  const parent = $("studentParent").value.trim();
  const course = $("studentCourse").value;
  const attendance = Number($("studentAttendance").value);
  const marks = Number($("studentMarks").value);
  const totalFee = Number($("studentFee").value);
  const editId = $("editStudentId").value;

  if (!name || !parent) {
    alert("Please enter the student name and parent/guardian name.");
    return;
  }

  if (![attendance, marks, totalFee].every(Number.isFinite) ||
      attendance < 0 || attendance > 100 ||
      marks < 0 || marks > 100 || totalFee < 0) {
    alert("Enter valid attendance, marks and fee values.");
    return;
  }

  if (editId) {
    const existing = students.find(s => s.id === editId);
    if (!existing) return;

    existing.name = name;
    existing.parent = parent;
    existing.course = course;
    existing.attendance = attendance;
    existing.marks = marks;
    existing.totalFee = totalFee;
    existing.paidFee = Math.min(existing.paidFee, totalFee);
  } else {
    const nextNumber = Math.max(0, ...students.map(s =>
      Number(s.id.replace("ST", "")) || 0)) + 1;

    students.push({
      id: "ST" + String(nextNumber).padStart(3, "0"),
      name,
      parent,
      course,
      attendance,
      marks,
      totalFee,
      paidFee: 0
    });
  }

  closeStudentModal();
  studentSearch = "";
  renderPage(currentPage);
});

/* ----- Initial state ----- */

renderPage("dashboard");
