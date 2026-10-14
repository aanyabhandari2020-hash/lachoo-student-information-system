
"use strict";

/* ==========================================
   LACHOO STUDENT INFORMATION SYSTEM
   Front-end demonstration with browser storage
========================================== */

const STORAGE_KEY = "lachoo_erp_students_v2";

const sampleStudents = [
  { id: "s1", roll: "BCA24001", name: "Aarav Sharma", course: "BCA", year: "3rd Year", parent: "Rajesh Sharma", phone: "9000000001", attendance: 92, marks: 86, fees: "Paid" },
  { id: "s2", roll: "BCA24002", name: "Aditi Verma", course: "BCA", year: "3rd Year", parent: "Sunita Verma", phone: "9000000002", attendance: 88, marks: 91, fees: "Paid" },
  { id: "s3", roll: "BBA25001", name: "Rohan Mehta", course: "BBA", year: "2nd Year", parent: "Suresh Mehta", phone: "9000000003", attendance: 78, marks: 74, fees: "Pending" },
  { id: "s4", roll: "BCOM25001", name: "Priya Joshi", course: "BCOM", year: "2nd Year", parent: "Manoj Joshi", phone: "9000000004", attendance: 95, marks: 89, fees: "Paid" },
  { id: "s5", roll: "BA26001", name: "Karan Singh", course: "BA", year: "1st Year", parent: "Vikram Singh", phone: "9000000005", attendance: 81, marks: 72, fees: "Partial" },
  { id: "s6", roll: "BSC24001", name: "Neha Gupta", course: "BSC", year: "3rd Year", parent: "Anil Gupta", phone: "9000000006", attendance: 90, marks: 93, fees: "Paid" },
  { id: "s7", roll: "BCA25003", name: "Ishita Patel", course: "BCA", year: "2nd Year", parent: "Deepak Patel", phone: "9000000007", attendance: 85, marks: 82, fees: "Pending" },
  { id: "s8", roll: "BBA26002", name: "Arjun Kapoor", course: "BBA", year: "1st Year", parent: "Pooja Kapoor", phone: "9000000008", attendance: 87, marks: 79, fees: "Paid" },
  { id: "s9", roll: "MCA26001", name: "Meera Shah", course: "MCA", year: "1st Year", parent: "Nitin Shah", phone: "9000000009", attendance: 94, marks: 90, fees: "Paid" },
  { id: "s10", roll: "BCOM24002", name: "Kabir Jain", course: "BCOM", year: "3rd Year", parent: "Amit Jain", phone: "9000000010", attendance: 76, marks: 68, fees: "Partial" }
];

const courseInfo = [
  { name: "BCA", title: "Bachelor of Computer Applications", icon: "💻", description: "Computer applications, programming, databases and web development." },
  { name: "BBA", title: "Bachelor of Business Administration", icon: "📊", description: "Business management, marketing, finance and organisational studies." },
  { name: "BCOM", title: "Bachelor of Commerce", icon: "📈", description: "Commerce, accounting, economics and business studies." },
  { name: "BA", title: "Bachelor of Arts", icon: "📚", description: "Humanities, languages and social sciences." },
  { name: "BSC", title: "Bachelor of Science", icon: "🔬", description: "Scientific subjects and practical learning." },
  { name: "MCA", title: "Master of Computer Applications", icon: "🖥️", description: "Advanced computing and software development." },
  { name: "MBA", title: "Master of Business Administration", icon: "💼", description: "Advanced management and business strategy." },
  { name: "MSC", title: "Master of Science", icon: "🧪", description: "Advanced study in scientific disciplines." }
];

const faculty = [
  { id: "F001", name: "Dr. Rahul Sharma", department: "Computer Applications" },
  { id: "F002", name: "Prof. Priya Mehta", department: "Commerce" },
  { id: "F003", name: "Dr. Neha Kapoor", department: "Science" },
  { id: "F004", name: "Prof. Arjun Verma", department: "Management" },
  { id: "F005", name: "Dr. Anjali Singh", department: "Humanities" }
];

let students = loadStudents();
let toastTimer;

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Could not read saved student records.", error);
  }

  return sampleStudents.map(student => ({ ...student }));
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error("Could not save student records.", error);
    showToast("Could not save data. Check browser storage settings.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function initials(name) {
  return String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function formatAttendance(value) {
  return `${Number(value) || 0}%`;
}

function feeBadge(status) {
  const safeStatus = ["Paid", "Pending", "Partial"].includes(status)
    ? status
    : "Pending";

  return `<span class="status ${safeStatus.toLowerCase()}">${safeStatus}</span>`;
}

function studentDetailsCell(student) {
  return `
    <div class="student-cell">
      <div class="avatar">${escapeHTML(initials(student.name))}</div>
      <div>
        <strong>${escapeHTML(student.name)}</strong>
        <small>${escapeHTML(student.phone || "No phone provided")}</small>
      </div>
    </div>`;
}

function emptyRow(columns, message = "No records found.") {
  return `<tr><td class="empty-row" colspan="${columns}">${escapeHTML(message)}</td></tr>`;
}

/* -------------------------------
   Navigation
-------------------------------- */

function showPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target || !target.classList.contains("page")) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  const activeButton = document.querySelector(
    `.nav-link[data-page="${pageId}"]`
  );

  document.getElementById("pageTitle").textContent =
    activeButton ? activeButton.textContent.trim().replace(/^[^\w]+/, "") :
    pageId.charAt(0).toUpperCase() + pageId.slice(1);

  document.getElementById("sidebar").classList.remove("open");

  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  showToast("This demo has no secure login session to end.");
});

/* -------------------------------
   Student modal
-------------------------------- */

const modal = document.getElementById("studentModal");
const studentForm = document.getElementById("studentForm");

function openStudentModal(student = null) {
  studentForm.reset();
  document.getElementById("formError").textContent = "";
  document.getElementById("editId").value = student ? student.id : "";
  document.getElementById("modalTitle").textContent =
    student ? "Edit Student" : "Add Student";
  document.getElementById("saveStudentBtn").textContent =
    student ? "Update Student" : "Save Student";

  if (student) {
    document.getElementById("studentName").value = student.name || "";
    document.getElementById("rollNumber").value = student.roll || "";
    document.getElementById("studentCourse").value = student.course || "";
    document.getElementById("studentYear").value = student.year || "";
    document.getElementById("parentName").value = student.parent || "";
    document.getElementById("studentPhone").value = student.phone || "";
    document.getElementById("studentAttendance").value = student.attendance ?? 0;
    document.getElementById("studentMarks").value = student.marks ?? 0;
    document.getElementById("studentFees").value = student.fees || "Pending";

    // Keep a previously saved course available if it is not in the preset list.
    const courseSelect = document.getElementById("studentCourse");
    if (![...courseSelect.options].some(option => option.value === student.course)) {
      const option = document.createElement("option");
      option.value = student.course;
      option.textContent = student.course;
      courseSelect.add(option);
      courseSelect.value = student.course;
    }
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("studentName").focus();
}

function closeStudentModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  studentForm.reset();
  document.getElementById("formError").textContent = "";
}

document.getElementById("addStudentBtn").addEventListener("click", () => {
  openStudentModal();
});

document.getElementById("closeModal").addEventListener("click", closeStudentModal);
document.getElementById("cancelModal").addEventListener("click", closeStudentModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeStudentModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeStudentModal();
});

/* -------------------------------
   Add and edit student records
-------------------------------- */

studentForm.addEventListener("submit", event => {
  event.preventDefault();

  const errorBox = document.getElementById("formError");
  errorBox.textContent = "";

  const editId = document.getElementById("editId").value;
  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const course = document.getElementById("studentCourse").value;
  const year = document.getElementById("studentYear").value;
  const parent = document.getElementById("parentName").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();
  const attendance = Number(document.getElementById("studentAttendance").value);
  const marks = Number(document.getElementById("studentMarks").value);
  const fees = document.getElementById("studentFees").value;

  if (!name || !roll || !course || !year) {
    errorBox.textContent = "Please complete all required fields.";
    return;
  }

  if (!Number.isFinite(attendance) || attendance < 0 || attendance > 100) {
    errorBox.textContent = "Attendance must be between 0 and 100.";
    return;
  }

  if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
    errorBox.textContent = "Marks must be between 0 and 100.";
    return;
  }

  const duplicateRoll = students.some(student =>
    student.roll.toLowerCase() === roll.toLowerCase() &&
    student.id !== editId
  );

  if (duplicateRoll) {
    errorBox.textContent = "That roll number already exists. Please use a unique roll number.";
    return;
  }

  const studentData = {
    id: editId || (
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `student-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    ),
    name,
    roll,
    course,
    year,
    parent,
    phone,
    attendance,
    marks,
    fees
  };

  const previousStudents = students.map(student => ({ ...student }));

  if (editId) {
    const index = students.findIndex(student => student.id === editId);
    if (index === -1) {
      errorBox.textContent = "This student record could not be found.";
      return;
    }
    students[index] = studentData;
  } else {
    students.unshift(studentData);
  }

  if (!saveStudents()) {
    students = previousStudents;
    renderAll();
    errorBox.textContent = "The record could not be saved in browser storage.";
    return;
  }

  closeStudentModal();
  renderAll();
  showPage("students");
  showToast(editId ? "Student updated successfully." : "Student added successfully.");
});

/* -------------------------------
   Search and course filter
-------------------------------- */

const searchInput = document.getElementById("studentSearch");
const courseFilter = document.getElementById("courseFilter");

function getFilteredStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  return students.filter(student => {
    const matchesQuery = [
      student.name,
      student.roll,
      student.course,
      student.parent,
      student.phone
    ].some(value => String(value || "").toLowerCase().includes(query));

    const matchesCourse = !selectedCourse || student.course === selectedCourse;
    return matchesQuery && matchesCourse;
  });
}

searchInput.addEventListener("input", renderStudentTable);
courseFilter.addEventListener("change", renderStudentTable);

document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  courseFilter.value = "";
  renderStudentTable();
  searchInput.focus();
});

/* -------------------------------
   Student table and actions
-------------------------------- */

function renderStudentTable() {
  const table = document.getElementById("studentsTable");
  const filtered = getFilteredStudents();

  if (!filtered.length) {
    table.innerHTML = emptyRow(7, "No students match your search. Try another name or roll number.");
  } else {
    table.innerHTML = filtered.map(student => `
      <tr>
        <td class="roll">${escapeHTML(student.roll)}</td>
        <td>${studentDetailsCell(student)}</td>
        <td>${escapeHTML(student.course)}</td>
        <td>${escapeHTML(student.year)}</td>
        <td>${formatAttendance(student.attendance)}</td>
        <td>${feeBadge(student.fees)}</td>
        <td>
          <div class="action-group">
            <button class="icon-btn" data-action="view" data-id="${escapeHTML(student.id)}" title="View student">View</button>
            <button class="icon-btn" data-action="edit" data-id="${escapeHTML(student.id)}" title="Edit student">Edit</button>
            <button class="icon-btn delete" data-action="delete" data-id="${escapeHTML(student.id)}" title="Delete student">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("resultsCount").textContent =
    `Showing ${filtered.length} of ${students.length} students`;
}

document.getElementById("studentsTable").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const student = students.find(item => item.id === button.dataset.id);
  if (!student) {
    showToast("Student record not found.");
    return;
  }

  const action = button.dataset.action;

  if (action === "edit") {
    openStudentModal(student);
  } else if (action === "view") {
    alert(
      `STUDENT DETAILS\n\n` +
      `Name: ${student.name}\n` +
      `Roll Number: ${student.roll}\n` +
      `Course: ${student.course}\n` +
      `Academic Year: ${student.year}\n` +
      `Parent/Guardian: ${student.parent || "Not provided"}\n` +
      `Phone: ${student.phone || "Not provided"}\n` +
      `Attendance: ${student.attendance}%\n` +
      `Marks: ${student.marks}%\n` +
      `Fee Status: ${student.fees}`
    );
  } else if (action === "delete") {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name} (${student.roll})?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const previousStudents = students;
    students = students.filter(item => item.id !== student.id);

    if (!saveStudents()) {
      students = previousStudents;
      renderAll();
      return;
    }

    renderAll();
    showToast("Student record deleted.");
  }
});

/* -------------------------------
   Render related tables
-------------------------------- */

function renderRecentStudents() {
  const tbody = document.getElementById("recentStudents");
  const recent = [...students].slice(0, 5);

  tbody.innerHTML = recent.length ? recent.map(student => `
    <tr>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td>${studentDetailsCell(student)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${escapeHTML(student.year)}</td>
      <td>${feeBadge(student.fees)}</td>
    </tr>
  `).join("") : emptyRow(5, "No student records yet.");
}

function renderAttendance() {
  const tbody = document.getElementById("attendanceTable");
  tbody.innerHTML = students.length ? students.map(student => `
    <tr>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${formatAttendance(student.attendance)}</td>
    </tr>
  `).join("") : emptyRow(4);
}

function renderPerformance() {
  const tbody = document.getElementById("performanceTable");
  tbody.innerHTML = students.length ? students.map(student => `
    <tr>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${Number(student.marks) || 0}%</td>
      <td>${formatAttendance(student.attendance)}</td>
    </tr>
  `).join("") : emptyRow(5);
}

function renderFees() {
  const tbody = document.getElementById("feesTable");
  tbody.innerHTML = students.length ? students.map(student => `
    <tr>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${feeBadge(student.fees)}</td>
    </tr>
  `).join("") : emptyRow(4);
}

function renderParents() {
  const tbody = document.getElementById("parentsTable");
  tbody.innerHTML = students.length ? students.map(student => `
    <tr>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.parent || "Not provided")}</td>
      <td>${escapeHTML(student.phone || "Not provided")}</td>
    </tr>
  `).join("") : emptyRow(4);
}

function renderFaculty() {
  document.getElementById("facultyTable").innerHTML = faculty.map(member => `
    <tr>
      <td class="roll">${escapeHTML(member.id)}</td>
      <td>${escapeHTML(member.name)}</td>
      <td>${escapeHTML(member.department)}</td>
    </tr>
  `).join("");
}

function renderCourses() {
  const html = courseInfo.map(course => `
    <article class="info-card">
      <div class="course-icon">${course.icon}</div>
      <h3>${escapeHTML(course.name)}</h3>
      <p><strong>${escapeHTML(course.title)}</strong></p>
      <p>${escapeHTML(course.description)}</p>
      <p style="margin-top:12px">
        Enrolled students: ${students.filter(student => student.course === course.name).length}
      </p>
    </article>
  `).join("");

  document.getElementById("coursesGrid").innerHTML = html;
  document.getElementById("programsGrid").innerHTML = html;
}

function renderCourseFilter() {
  const previousValue = courseFilter.value;
  const courses = [...new Set([
    ...courseInfo.map(course => course.name),
    ...students.map(student => student.course)
  ])].filter(Boolean).sort();

  courseFilter.innerHTML =
    '<option value="">All Courses</option>' +
    courses.map(course =>
      `<option value="${escapeHTML(course)}">${escapeHTML(course)}</option>`
    ).join("");

  if (courses.includes(previousValue)) courseFilter.value = previousValue;
}

/* -------------------------------
   Dashboard totals
-------------------------------- */

function renderStats() {
  const total = students.length;
  const averageAttendance = total
    ? Math.round(students.reduce((sum, student) => sum + (Number(student.attendance) || 0), 0) / total)
    : 0;

  const representedCourses = new Set(students.map(student => student.course)).size;

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("studentCount").textContent = total;
  document.getElementById("totalCourses").textContent = courseInfo.length;
  document.getElementById("totalFaculty").textContent = faculty.length;
  document.getElementById("averageAttendance").textContent = `${averageAttendance}%`;
  document.getElementById("studentAvgAttendance").textContent = `${averageAttendance}%`;
  document.getElementById("representedCourses").textContent = representedCourses;
  document.getElementById("academicStudents").textContent = total;
  document.getElementById("academicCourses").textContent = courseInfo.length;
}

function renderAll() {
  renderStats();
  renderCourseFilter();
  renderStudentTable();
  renderRecentStudents();
  renderAttendance();
  renderPerformance();
  renderFees();
  renderParents();
  renderFaculty();
  renderCourses();
}

/* -------------------------------
   Initial page setup
-------------------------------- */

document.getElementById("todayDate").textContent =
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

document.getElementById("year").textContent = new Date().getFullYear();

renderAll();
