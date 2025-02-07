import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  NgForm,
} from '@angular/forms';
import { StudentDataService } from 'src/app/services/student-data.service';
import { Student } from 'src/app/models/student.interface';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  editingStudentId: string | null = null; // Track id of editing a student

  electives = [
    'Artificial Intelligence & Machine Learning',
    'Robotics & Automation',
    'Electric Vehicle Technology',
    'Business Analytics',
    'Supply Chain Management',
  ];

  branches = [
    'Computer Science & Engineering (CSE)',
    'Electronics & Communication Engineering (ECE)',
    'Mechanical Engineering (ME)',
    'Chemical Engineering (ChE)',
    'Information Technology (IT)',
  ];

  // Filtered branches for autocomplete
  filteredBranches: string[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentDataService
  ) {}

  ngOnInit() {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      year: ['', Validators.required],
      electives: this.fb.array(
        this.electives.map(() => this.fb.control(false))
      ), // Initialize FormArray for electives
      branch: [''],
    });

    // Subscribe to the student being edited
    this.studentService.studentToEdit$.subscribe((student) => {
      if (student) {
        this.editingStudentId = student.id; // Track the editing ID
        this.studentForm.patchValue({
          ...student,
          electives: this.electives.map((elective) =>
            student.electives.includes(elective)
          ), // Set the checkboxes based on the student's electives
        });
      } else {
        this.editingStudentId = null;
        this.studentForm.reset(); // Clear form for new student
      }
    });

    // Autocomplete filter logic for branches
    this.studentForm.get('branch')?.valueChanges.subscribe((value) => {
      this.filteredBranches = this.filterBranches(value || '');
    });
  }

  // Filter branches based on user input
  private filterBranches(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.branches.filter((branch) =>
      branch.toLowerCase().includes(filterValue)
    );
  }
  clear(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].setErrors(null);
    });
  }

  // Form submission
  onSubmit() {
    if (this.studentForm.valid) {
      const selectedElectives = this.studentForm.value.electives
        .map((checked: boolean, i: number) =>
          checked ? this.electives[i] : null
        )
        .filter((v: string | null) => v !== null);

      const formData: Student = {
        id: this.editingStudentId || '',
        fullName: this.studentForm.value.fullName,
        email: this.studentForm.value.email,
        gender: this.studentForm.value.gender,
        year: this.studentForm.value.year,
        electives: selectedElectives,
        branch: this.studentForm.value.branch || '',
      };

      if (this.editingStudentId) {
        // Update existing student
        this.studentService.updateStudent(this.editingStudentId, formData);
      } else {
        // Add new student
        this.studentService.addStudent(formData);
      }

      this.resetForm(); // Reset the form and mark controls as untouched and pristine
      this.studentService.clearStudentToEdit(); // Clear editing state
    }
  }

  // Reset form and mark controls as untouched and pristine
  private resetForm() {
    this.studentForm.reset();
    this.studentForm.markAsUntouched();
    this.studentForm.markAsPristine();
    Object.keys(this.studentForm.controls).forEach((key) => {
      const control = this.studentForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach((ctrl) => {
          ctrl.markAsUntouched();
          ctrl.markAsPristine();
        });
      } else {
        control?.markAsUntouched();
        control?.markAsPristine();
      }
    });
  }
}
