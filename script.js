
const $ = id => document.getElementById(id);

const courses = [
  { name: "BCA", department: "Computer Applications", duration: "3 years", fee: 47600 },
  { name: "BBA", department: "Management", duration: "3 years", fee: 45000 },
  { name: "B.Sc.", department: "Science", duration: "3 years", fee: 42000 },
  { name: "B.Com.", department: "Commerce", duration: "3 years", fee: 38000 },
  { name: "BA", department: "Arts", duration: "3 years", fee: 32000 },
  { name: "MCA", department: "Computer Applications", duration: "2 years", fee: 65000 }
];

const firstNames = [
  "Aarav","Ananya","Vivaan","Diya","Arjun","Ishita","Rohan","Meera",
  "Aditya","Kavya","Krishna","Aditi","Reyansh","Saanvi","Kabir",
  "Nisha","Dev","Tanya","Rahul","Pooja","Yash","Khushi","Manav",
  "Riya","Kunal","Simran","Harsh","Ira","Mohit","Priya"
];
const lastNames = [
  "Sharma","Verma","Singh","Joshi","Mehta","Bhandari","Choudhary",
  "Patel","Gupta","Rathore","Agarwal","Khan","Soni","Pareek",
  "Jain","Yadav","Das","Kapoor","Bisht","Arora","Malhotra",
  "Goyal","Tanwar","Mishra","Kumari","Bansal","Purohit","Saxena",
  "Shekhawat","Vyas"
];

const departments = [
  "Computer Applications","Management","Science","Commerce","Arts",
  "Mathematics","English","Physics","Chemistry","Computer Science"
];
const facultyFirst = [
  "Amit","Sunita","Rajesh","Neha","Vikram","Kavita","Sanjay","Anjali",
  "Deepak","Poonam","Manoj","Ritu","Ashok","Nidhi","Prakash",
  "Seema","Rakesh","Meenakshi","Arvind","Swati"
];
const facultyLast = [
  "Sharma","Mehta","Joshi","Verma","Singh","Gupta","Bhandari","Rathore"
];

const makeInitialStudents = () => firstNames.map((first, i) => ({
  id: i + 1,
  name: `${first} ${lastNames[i]}`,
  roll: `LMC${String(1001 + i)}`,
  email: `${first.toLowerCase()}.${lastNames[i].toLowerCase()}${i + 1}@example.com`,
  course: ["BCA","BBA","B.Sc.","B.Com.","BA"][i % 5],
  semester: (i % 6) + 1,
  date: `202${i % 4}-07-${String((i % 27) + 1).padStart(2,"0")}`,
  fee: [47600,45000,42000,38000,32000][i % 5],
  feeStatus: i % 3 === 0 ? "Pending" : i % 7 === 0 ? "Partial" : "Paid",
  attendance: 65 + ((i * 7) % 35),
  marks: 55 + ((i * 11) % 44)
}));

const makeInitialFaculty = () => Array.from({length: 40}, (_, i) => ({
  id: i + 1,
  name: `${facultyFirst[i % 20]} ${facultyLast[(i * 3) % 8]}`,
  department: departments[i % departments.length],
  designation: ["Assistant Professor","Associate Professor","Professor","Lecturer"][i % 4],
  email: `faculty${String(i + 1).padStart(2,"0")}@example.com`
}));

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

let students = readSaved("lachooStudents", makeInitialStudents());
let faculty = readSaved("lachooFaculty", makeInitialFaculty());
let nextId = Math.max(0, ...students.map(s => Number(s.id) || 0)) + 1;
let role = "guest";
let currentPage = "dashboard";

function saveData() {
  localStorage.setItem("lachooStudents", JSON.stringify(students));
  localStorage.setItem("lachooFaculty", JSON.stringify(faculty));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.style.display = "none", 2800);
}

$("loginRole").addEventListener("change", () => {
  $("adminCredentials").classList.toggle(
    "hidden", $("loginRole").value !== "admin"
  );
});

function login() {
  const selectedRole = $("loginRole").value;
  if (selectedRole === "admin") {
    if ($("username").value !== "admin" ||
        $("password").value !== "Lachoo@123") {
      alert("Incorrect demo credentials. Please try again.");
      return;
    }
  }
  role = selectedRole;
  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("roleLabel").textContent = role === "admin"
    ? "Administrator access" : "Guest · View only";
  $("userBadge").textContent = role === "admin" ? "Admin" : "Guest";
  renderPage("dashboard");
}

function logout() {
  role = "guest";
  $("app").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("username").value = "";
  $("password").value = "";
  $("loginRole").value = "guest";
  $("adminCredentials").classList.add("hidden");
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => renderPage(button.dataset.page));
});

function renderPage(page) {
  currentPage = page;
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  const titles = {
    dashboard:"Dashboard", students:"Student Management",
    faculty:"Faculty Members", courses:"Courses",
    admissions:"Admissions", fees:"Fees Management",
    attendance:"Attendance", marks:"Marks & Results",
    about:"About the College"
  };
  $("pageTitle").textContent = titles[page] || "Dashboard";
  const pages = {
    dashboard:dashboardPage,
    students:studentsPage,
    faculty:facultyPage,
    courses:coursesPage,
    admissions:admissionsPage,
    fees:feesPage,
    attendance:attendancePage,
    marks:marksPage,
    about:aboutPage
  };
  $("pageContent").innerHTML = (pages[page] || dashboardPage)();
}

function statCard(label, value, note) {
  return `<div class="stat"><span>${label}</span><h2>${value}</h2><small>${note}</small></div>`;
}

function dashboardPage() {
  const paid = students.filter(s => s.feeStatus === "Paid").length;
  const pending = students.filter(s => s.feeStatus === "Pending").length;
  const feeCollected = students.reduce((sum, s) =>
    sum + (s.feeStatus === "Paid" ? Number(s.fee) :
      s.feeStatus === "Partial" ? Number(s.fee) / 2 : 0), 0);
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum,s) => sum + Number(s.attendance),0) / students.length)
    : 0;

  return `
    <div class="welcome">
      <h2>Welcome to Lachoo College Portal</h2>
      <p>Manage student records, faculty, admissions, fees and academic performance from one dashboard. All records are fictional demonstration data.</p>
    </div>
    <div class="stats">
      ${statCard("Total Students", students.length, "Student records")}
      ${statCard("Faculty Members", faculty.length, "Faculty directory")}
      ${statCard("Fees Paid", paid, "Students marked paid")}
      ${statCard("Fees Pending", pending, "Students marked pending")}
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="section-title"><h2>Academic Overview</h2></div>
        <div class="info-line"><span>Courses offered</span><strong>${courses.length}</strong></div>
        <div class="info-line"><span>Average attendance</span><strong>${averageAttendance}%</strong></div>
        <div class="info-line"><span>Fees recorded as collected</span><strong>${money(feeCollected)}</strong></div>
        <div class="info-line"><span>Students with partial fees</span><strong>${students.filter(s => s.feeStatus === "Partial").length}</strong></div>
      </div>
      <div class="panel">
        <div class="section-title"><h2>Quick Actions</h2></div>
        <p class="hint">Use these shortcuts to navigate the portal.</p>
        <div class="toolbar">
          <button class="primary" onclick="renderPage('students')">View Students</button>
          <button class="secondary" onclick="renderPage('faculty')">View Faculty</button>
          <button class="secondary" onclick="renderPage('fees')">Check Fees</button>
          <button class="secondary" onclick="renderPage('about')">College Profile</button>
        </div>
        <p class="hint">${role === "admin" ? "Administrator mode: you can manage student records." : "Guest mode: records are view-only. Log in as admin to edit student records."}</p>
      </div>
    </div>
    <div class="section-title"><h2>Recently Listed Students</h2><button class="secondary" onclick="renderPage('students')">View All</button></div>
    ${studentTable(students.slice(0,5), false)}
  `;
}

function studentTable(list, allowActions = true) {
  if (!list.length) return `<div class="panel empty">No student records found.</div>`;
  return `<div class="panel table-wrap"><table>
    <thead><tr>
      <th>Roll No.</th><th>Student Name</th><th>Course</th>
      <th>Semester</th><th>Fee Status</th><th>Marks</th>
      ${allowActions && role === "admin" ? "<th>Actions</th>" : ""}
    </tr></thead><tbody>
    ${list.map(s => `<tr>
      <td>${escapeHTML(s.roll)}</td>
      <td><strong>${escapeHTML(s.name)}</strong><br><span class="hint">${escapeHTML(s.email)}</span></td>
      <td>${escapeHTML(s.course)}</td><td>${escapeHTML(s.semester)}</td>
      <td><span class="pill ${s.feeStatus.toLowerCase()}">${escapeHTML(s.feeStatus)}</span></td>
      <td>${escapeHTML(s.marks)}%</td>
      ${allowActions && role === "admin" ? `<td><div class="actions">
        <button class="secondary" onclick="editStudent(${Number(s.id)})">Edit</button>
        <button class="danger" onclick="deleteStudent(${Number(s.id)})">Delete</button>
      </div></td>` : ""}
    </tr>`).join("")}
    </tbody></table></div>`;
}

function studentsPage() {
  return `
    <div class="section-title"><h2>Student Directory</h2>
    ${role === "admin" ? `<button class="primary" onclick="openStudentForm()">+ Add Student</button>` : ""}
    </div>
    <div class="panel">
      <div class="toolbar">
        <input id="studentSearch" placeholder="Search name, roll number or email..." oninput="filterStudents()">
        <select id="courseFilter" onchange="filterStudents()">
          <option value="">All courses</option>
          ${courses.map(c => `<option>${c.name}</option>`).join("")}
        </select>
        <select id="feeFilter" onchange="filterStudents()">
          <option value="">All fee statuses</option>
          <option>Paid</option><option>Pending</option><option>Partial</option>
        </select>
        <button class="secondary" onclick="exportStudents()">Export CSV</button>
      </div>
      <div id="studentResults">${studentTable(students)}</div>
      <p class="hint">Total records: <strong id="studentCount">${students.length}</strong>. Export downloads the current student dataset.</p>
    </div>`;
}

function filterStudents() {
  const search = ($("studentSearch")?.value || "").toLowerCase();
  const course = $("courseFilter")?.value || "";
  const fee = $("feeFilter")?.value || "";
  const filtered = students.filter(s =>
    [s.name,s.roll,s.email].some(v => String(v).toLowerCase().includes(search)) &&
    (!course || s.course === course) && (!fee || s.feeStatus === fee)
  );
  $("studentResults").innerHTML = studentTable(filtered);
  $("studentCount").textContent = filtered.length;
}

function openStudentForm(id = null) {
  if (role !== "admin") return toast("Admin access is required.");
  $("studentForm").reset();
  $("editId").value = "";
  $("modalTitle").textContent = "Add New Student";
  $("studentCourse").innerHTML = courses.map(c =>
    `<option value="${c.name}">${c.name}</option>`).join("");
  $("studentDate").value = new Date().toISOString().slice(0,10);
  $("studentFee").value = 47600;
  $("studentAttendance").value = 90;
  $("studentMarks").value = 75;
  if (id !== null) {
    const s = students.find(item => item.id === id);
    if (!s) return;
    $("modalTitle").textContent = "Edit Student";
    $("editId").value = s.id;
    $("studentName").value = s.name;
    $("studentRoll").value = s.roll;
    $("studentEmail").value = s.email;
    $("studentCourse").value = s.course;
    $("studentSemester").value = s.semester;
    $("studentDate").value = s.date;
    $("studentFee").value = s.fee;
    $("studentFeeStatus").value = s.feeStatus;
    $("studentAttendance").value = s.attendance;
    $("studentMarks").value = s.marks;
  }
  $("modal").classList.remove("hidden");
}
function editStudent(id) { openStudentForm(id); }
function closeModal() { $("modal").classList.add("hidden"); }

$("studentForm").addEventListener("submit", event => {
  event.preventDefault();
  if (role !== "admin") return toast("Admin access is required.");

  const id = $("editId").value;
  const roll = $("studentRoll").value.trim();
  const duplicate = students.some(s => s.roll.toLowerCase() === roll.toLowerCase() && String(s.id) !== id);
  if (duplicate) return alert("This roll number already exists.");

  const record = {
    id: id ? Number(id) : nextId++,
    name: $("studentName").value.trim(),
    roll,
    email: $("studentEmail").value.trim(),
    course: $("studentCourse").value,
    semester: Number($("studentSemester").value),
    date: $("studentDate").value,
    fee: Number($("studentFee").value),
    feeStatus: $("studentFeeStatus").value,
    attendance: Number($("studentAttendance").value),
    marks: Number($("studentMarks").value)
  };
  if (!record.name || !record.roll || !record.date ||
      record.fee < 0 || record.attendance < 0 || record.attendance > 100 ||
      record.marks < 0 || record.marks > 100) {
    return alert("Please check all fields and numeric ranges.");
  }

  if (id) students = students.map(s => s.id === Number(id) ? record : s);
  else students.push(record);

  saveData();
  closeModal();
  renderPage("students");
  toast(id ? "Student record updated." : "Student added successfully.");
});

function deleteStudent(id) {
  if (role !== "admin") return toast("Admin access is required.");
  const student = students.find(s => s.id === id);
  if (!student) return;
  if (!confirm(`Delete the record for ${student.name}?`)) return;
  students = students.filter(s => s.id !== id);
  saveData();
  renderPage("students");
  toast("Student record deleted.");
}

function exportStudents() {
  const headers = ["Roll No","Name","Email","Course","Semester","Fee","Fee Status","Attendance","Marks"];
  const rows = students.map(s => [s.roll,s.name,s.email,s.course,s.semester,s.fee,s.feeStatus,s.attendance,s.marks]);
  const csv = [headers,...rows].map(row =>
    row.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")
  ).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lachoo-students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function facultyPage() {
  return `
    <div class="section-title"><h2>Faculty Directory</h2><span class="pill partial">${faculty.length} Members</span></div>
    <div class="panel">
      <div class="toolbar"><input id="facultySearch" placeholder="Search faculty or department..." oninput="filterFaculty()"></div>
      <div id="facultyResults">${facultyTable(faculty)}</div>
    </div>`;
}

function facultyTable(list) {
  if (!list.length) return `<div class="empty">No faculty found.</div>`;
  return `<div class="table-wrap"><table><thead><tr>
    <th>ID</th><th>Faculty Name</th><th>Department</th><th>Designation</th><th>Email</th>
    </tr></thead><tbody>${list.map(f => `<tr>
      <td>F${String(f.id).padStart(3,"0")}</td><td>${escapeHTML(f.name)}</td>
      <td>${escapeHTML(f.department)}</td><td>${escapeHTML(f.designation)}</td>
      <td>${escapeHTML(f.email)}</td></tr>`).join("")}</tbody></table></div>`;
}
function filterFaculty() {
  const q = $("facultySearch").value.toLowerCase();
  $("facultyResults").innerHTML = facultyTable(faculty.filter(f =>
    `${f.name} ${f.department} ${f.designation}`.toLowerCase().includes(q)
  ));
}

function coursesPage() {
  return `<div class="section-title"><h2>Academic Courses</h2></div>
    <div class="grid-3">${courses.map(c => `<div class="info-card">
      <h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.department)}</p>
      <div class="info-line"><span>Duration</span><strong>${c.duration}</strong></div>
      <div class="info-line"><span>Illustrative annual fee</span><strong>${money(c.fee)}</strong></div>
      <div class="info-line"><span>Enrolled students</span><strong>${students.filter(s => s.course === c.name).length}</strong></div>
    </div>`).join("")}</div>
    <p class="hint">Courses and fee amounts are sample data and are not an official fee schedule.</p>`;
}

function admissionsPage() {
  return `<div class="section-title"><h2>Admission Records</h2></div>
    <div class="panel">
      <div class="toolbar"><input id="admissionSearch" placeholder="Search student or course..." oninput="filterAdmissions()"></div>
      <div id="admissionResults">${admissionTable(students)}</div>
    </div>`;
}
function admissionTable(list) {
  if (!list.length) return `<div class="empty">No admissions found.</div>`;
  return `<div class="table-wrap"><table><thead><tr>
    <th>Roll Number</th><th>Student</th><th>Course</th><th>Semester</th><th>Admission Date</th>
    </tr></thead><tbody>${list.map(s => `<tr>
    <td>${escapeHTML(s.roll)}</td><td>${escapeHTML(s.name)}</td>
    <td>${escapeHTML(s.course)}</td><td>${escapeHTML(s.semester)}</td>
    <td>${escapeHTML(s.date)}</td></tr>`).join("")}</tbody></table></div>`;
}
function filterAdmissions() {
  const q = $("admissionSearch").value.toLowerCase();
  $("admissionResults").innerHTML = admissionTable(students.filter(s =>
    `${s.name} ${s.roll} ${s.course}`.toLowerCase().includes(q)
  ));
}

function feesPage() {
  const paid = students.filter(s => s.feeStatus === "Paid");
  const pending = students.filter(s => s.feeStatus === "Pending");
  const partial = students.filter(s => s.feeStatus === "Partial");
  const collected = students.reduce((sum,s) => sum +
    (s.feeStatus === "Paid" ? s.fee : s.feeStatus === "Partial" ? s.fee/2 : 0), 0);
  return `<div class="stats">
    ${statCard("Paid",paid.length,"Students marked paid")}
    ${statCard("Pending",pending.length,"Students marked pending")}
    ${statCard("Partial",partial.length,"Students with partial fees")}
    ${statCard("Recorded Collection",money(collected),"Estimated from demo statuses")}
    </div>
    <div class="section-title"><h2>Student Fee Register</h2></div>
    <div class="panel"><div class="toolbar">
    <input id="feeSearch" placeholder="Search name or roll number..." oninput="filterFees()">
    <select id="feeStatusFilter" onchange="filterFees()"><option value="">All statuses</option><option>Paid</option><option>Pending</option><option>Partial</option></select>
    </div><div id="feeResults">${feeTable(students)}</div></div>
    <p class="hint">Collection is a demonstration estimate: partial fees are counted as half of the annual fee. Actual payments require a real payment system.</p>`;
}
function feeTable(list) {
  if (!list.length) return `<div class="empty">No fee records found.</div>`;
  return `<div class="table-wrap"><table><thead><tr>
    <th>Roll No.</th><th>Student</th><th>Course</th><th>Annual Fee</th><th>Status</th>
    </tr></thead><tbody>${list.map(s => `<tr>
    <td>${escapeHTML(s.roll)}</td><td>${escapeHTML(s.name)}</td>
    <td>${escapeHTML(s.course)}</td><td>${money(s.fee)}</td>
    <td><span class="pill ${s.feeStatus.toLowerCase()}">${escapeHTML(s.feeStatus)}</span></td>
    </tr>`).join("")}</tbody></table></div>`;
}
function filterFees() {
  const q = $("feeSearch").value.toLowerCase();
  const status = $("feeStatusFilter").value;
  $("feeResults").innerHTML = feeTable(students.filter(s =>
    `${s.name} ${s.roll}`.toLowerCase().includes(q) &&
    (!status || s.feeStatus === status)
  ));
}

function attendancePage() {
  const average = students.length
    ? Math.round(students.reduce((sum,s) => sum + Number(s.attendance),0) / students.length) : 0;
  return `<div class="stats">
    ${statCard("Average Attendance",average+"%","Across demo records")}
    ${statCard("Above 75%",students.filter(s => s.attendance >= 75).length,"Students")}
    ${statCard("Below 75%",students.filter(s => s.attendance < 75).length,"Students")}
    ${statCard("Total Records",students.length,"Student attendance entries")}
    </div><div class="section-title"><h2>Attendance Register</h2></div>
    <div class="panel"><div class="toolbar"><input id="attendanceSearch" placeholder="Search student..." oninput="filterAttendance()"></div>
    <div id="attendanceResults">${attendanceTable(students)}</div></div>
    <p class="hint">Attendance percentages are fictional. This demonstration does not record individual daily attendance.</p>`;
}
function attendanceTable(list) {
  if (!list.length) return `<div class="empty">No records found.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Roll No.</th><th>Student</th><th>Course</th><th>Attendance</th><th>Progress</th></tr></thead>
  <tbody>${list.map(s => `<tr><td>${escapeHTML(s.roll)}</td><td>${escapeHTML(s.name)}</td>
  <td>${escapeHTML(s.course)}</td><td>${s.attendance}%</td>
  <td><div class="progress"><div style="width:${Math.max(0,Math.min(100,Number(s.attendance)))}%"></div></div></td>
  </tr>`).join("")}</tbody></table></div>`;
}
function filterAttendance() {
  const q = $("attendanceSearch").value.toLowerCase();
  $("attendanceResults").innerHTML = attendanceTable(students.filter(s =>
    `${s.name} ${s.roll}`.toLowerCase().includes(q)
  ));
}

function marksPage() {
  const avg = students.length ? Math.round(students.reduce((sum,s) => sum + Number(s.marks),0) / students.length) : 0;
  return `<div class="stats">
    ${statCard("Average Marks",avg+"%","Across demo records")}
    ${statCard("90% and Above",students.filter(s => s.marks >= 90).length,"Students")}
    ${statCard("Below 40%",students.filter(s => s.marks < 40).length,"Students")}
    ${statCard("Results Listed",students.length,"Student records")}
    </div><div class="section-title"><h2>Marks & Results Register</h2></div>
    <div class="panel"><div class="toolbar"><input id="marksSearch" placeholder="Search student..." oninput="filterMarks()"></div>
    <div id="marksResults">${marksTable(students)}</div></div>
    <p class="hint">Marks are illustrative percentages, not official examination results.</p>`;
}
function marksTable(list) {
  if (!list.length) return `<div class="empty">No marks found.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Roll No.</th><th>Student</th><th>Course</th><th>Marks</th><th>Illustrative result</th></tr></thead>
  <tbody>${list.map(s => `<tr><td>${escapeHTML(s.roll)}</td><td>${escapeHTML(s.name)}</td>
  <td>${escapeHTML(s.course)}</td><td>${s.marks}%</td>
  <td><span class="pill ${s.marks >= 40 ? "paid" : "pending"}">${s.marks >= 40 ? "Pass" : "Needs Review"}</span></td>
  </tr>`).join("")}</tbody></table></div>`;
}
function filterMarks() {
  const q = $("marksSearch").value.toLowerCase();
  $("marksResults").innerHTML = marksTable(students.filter(s =>
    `${s.name} ${s.roll}`.toLowerCase().includes(q)
  ));
}

function aboutPage() {
  const demoFaculty = [
    ["Principal","Dr. Meera Sharma"],
    ["Vice Principal","Dr. Rajesh Bhandari"],
    ["Academic Coordinator","Dr. Kavita Joshi"]
  ];
  return `<div class="welcome">
    <h2>Lachoo Memorial College of Science and Technology</h2>
    <p>Autonomous college · Jodhpur, Rajasthan, India</p>
  </div>
  <div class="grid-2">
    <div class="info-card"><h3>About the Institution</h3>
      <p>This portal is a student-developed demonstration of an academic administration system inspired by the college name supplied for the project.</p>
      <div class="info-line"><span>Location</span><strong>Jodhpur, Rajasthan</strong></div>
      <div class="info-line"><span>Establishment year</span><strong>1965 (sample profile)</strong></div>
      <div class="info-line"><span>Institution type</span><strong>Autonomous college (project profile)</strong></div>
      <div class="info-line"><span>Website data</span><strong>Fictional demonstration</strong></div>
    </div>
    <div class="info-card"><h3>College Administration</h3>
      ${demoFaculty.map(item => `<div class="info-line"><span>${item[0]}</span><strong>${item[1]}</strong></div>`).join("")}
      <p>These names are placeholders for this software project and are not claims about current officeholders.</p>
    </div>
  </div>
  <div class="section-title"><h2>Faculty Departments</h2></div>
  <div class="grid-3">${departments.map((d,i) => `<div class="info-card">
    <h3>${escapeHTML(d)}</h3><p>${faculty.filter(f => f.department === d).length} sample faculty members</p>
  </div>`).join("")}</div>
  <div class="section-title"><h2>Project Statistics</h2></div>
  <div class="stats">
    ${statCard("Student Records",students.length,"Fictional names")}
    ${statCard("Faculty Records",faculty.length,"Fictional names")}
    ${statCard("Courses",courses.length,"Illustrative catalogue")}
    ${statCard("Departments",departments.length,"Sample departments")}
  </div>
  <p class="hint">Verify establishment history, official courses, fee schedules and current officeholders using college-approved sources before using this page for any official purpose.</p>`;
}

renderPage("dashboard");
