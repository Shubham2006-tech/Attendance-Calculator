// Initialize the student list and lecture list
let students = JSON.parse(localStorage.getItem('students')) || [];
let lectures = JSON.parse(localStorage.getItem('lectures')) || [];

// Function to display the student list and attendance buttons
function displayStudents() {
    const tableBody = document.querySelector("#attendanceTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <button class="attendance" onclick="markAttendance(${index})">Mark Attendance</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    displayAttendanceReport();
}

// Add a new student
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;

    // Add student to the array
    students.push({ name, email, attendance: [] });

    // Store the updated student list in localStorage
    localStorage.setItem('students', JSON.stringify(students));

    // Clear form fields
    document.getElementById('studentName').value = "";
    document.getElementById('studentEmail').value = "";

    // Re-display the students
    displayStudents();
});

// Add a new lecture
document.getElementById('addLectureForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const lectureName = document.getElementById('lectureName').value;
    const lectureLocation = document.getElementById('lectureLocation').value;

    // Add lecture to the array
    lectures.push({ lectureName, lectureLocation });

    // Store the updated lectures list in localStorage
    localStorage.setItem('lectures', JSON.stringify(lectures));

    // Clear form fields
    document.getElementById('lectureName').value = "";
    document.getElementById('lectureLocation').value = "";

    // Re-display the attendance report with lecture details
    displayAttendanceReport();
});

// Mark attendance for a student
function markAttendance(index) {
    const student = students[index];
    const today = new Date().toLocaleDateString();

    // Prompt the user to select a lecture
    const lectureSelect = prompt("Enter the number for the lecture:\n" + 
                                lectures.map((lec, i) => `${i + 1}. ${lec.lectureName} at ${lec.lectureLocation}`).join("\n"));

    if (lectureSelect === null) return;  // User cancelled

    const lectureIndex = parseInt(lectureSelect) - 1;

    if (lectureIndex >= 0 && lectureIndex < lectures.length) {
        const selectedLecture = lectures[lectureIndex];

        // Prompt for attendance status
        const status = prompt("Enter attendance status: Present, Absent, or Late").toLowerCase();

        if (['present', 'absent', 'late'].includes(status)) {
            student.attendance.push({ date: today, status, lecture: selectedLecture.lectureName, location: selectedLecture.lectureLocation });
            localStorage.setItem('students', JSON.stringify(students));
            displayStudents();
        } else {
            alert("Invalid status entered. Please enter 'Present', 'Absent', or 'Late'.");
        }
    } else {
        alert("Invalid lecture number. Please try again.");
    }
}

// Display the attendance report
function displayAttendanceReport() {
    const reportContainer = document.getElementById('attendanceReport');
    reportContainer.innerHTML = ""; // Clear previous report

    students.forEach((student) => {
        const attendanceStats = student.attendance.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {});

        const totalClasses = student.attendance.length;
        const presentCount = attendanceStats.present || 0;
        const absentCount = attendanceStats.absent || 0;
        const lateCount = attendanceStats.late || 0;

        const attendancePercentage = totalClasses > 0 
            ? ((presentCount / totalClasses) * 100).toFixed(2)
            : 0;

        const studentReport = document.createElement('div');
        studentReport.innerHTML = `
            <h3>${student.name} (${student.email})</h3>
            <p>Attendance: ${attendancePercentage}%</p>
            <p>Total Classes: ${totalClasses}, Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}</p>
            <div>
                ${student.attendance.map((record) => {
                    return `<span class="attendance-status ${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)} (${record.date}) in ${record.lecture} at ${record.location}</span>`;
                }).join(' ')}
            </div>
        `;
        reportContainer.appendChild(studentReport);
    });
}

// Initial load of students and lectures
displayStudents();
