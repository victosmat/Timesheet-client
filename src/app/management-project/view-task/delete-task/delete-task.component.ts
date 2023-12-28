import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from 'src/app/service/project/project.service';
@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.scss']
})
export class DeleteTaskComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteTaskComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  delete() {
    this.projectService.deleteTask(this.data.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Delete task successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete task failed', 'Close', {
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
