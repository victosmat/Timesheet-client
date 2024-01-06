import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from 'src/app/service/project/project.service';
@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  delete() {
    this.projectService.deleteProject(this.data.id).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === true) {
          this.snackBar.open('Delete project successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close();
        }
        else {
          this.snackBar.open('Delete project failed', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete project failed', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
