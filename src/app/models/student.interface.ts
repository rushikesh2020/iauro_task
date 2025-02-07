export interface Student {
  id: string;
  fullName: string; // Full name of the student
  email: string; // Contact email
  gender: string; // Gender (Male, Female, Other)
  year: string; // Class Year (e.g., 1st year, 2nd year)
  electives: string[]; // Array of electives selected
  branch: string; // Engineering branch
}
