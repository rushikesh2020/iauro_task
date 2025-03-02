import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentDataService } from 'src/app/services/student-data.service';
import { Student } from 'src/app/models/student.interface';
// import { MatDialog } from '@angular/material/dialog';
// import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css'],
})
export class StudentTableComponent implements OnInit {
  // DataSource for the Material table
  dataSource = new MatTableDataSource<Student>();

  // Columns to display in the table
  displayedColumns: string[] = [
    'fullName',
    'email',
    'gender',
    'year',
    'electives',
    'branch',
    'actions',
  ];

  constructor(
    private studentService: StudentDataService // private dialog: MatDialog // Inject MatDialog for Delete Confirmation
  ) {}

  ngOnInit() {
    // Subscribe to the student list from the service
    this.studentService.students$.subscribe((students) => {
      this.dataSource.data = students;
    });
  }

  // Handle the Edit button click
  onEdit(student: Student) {
    // const studentCopy = { ...student, electives: Array.isArray(student.electives) ? student.electives : [] };
    // console.log(studentCopy);
    this.studentService.setStudentToEdit(student); // Pass the student to the service
  }

  // Handle the Delete button click
  onDelete(id: string) {
    this.studentService.deleteStudent(id);
  }
}
