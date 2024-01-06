import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CheckinService } from '../service/checkin/checkin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCheckinDialogComponent } from './confirm-checkin-dialog/confirm-checkin-dialog.component';
import { EmployeeService } from '../service/employee/employee.service';
import { EmployeeDetailDto } from '../model/employee-detail-dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-checkin',
  templateUrl: './my-checkin.component.html',
  styleUrls: ['./my-checkin.component.scss']
})
export class MyCheckinComponent implements AfterViewInit {
  loading = false;
  currentTime: Date = new Date();

  constructor(
    private checkinService: CheckinService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  ngAfterViewInit() {
    this.checkPermissions();
  }

  ngOnInit() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    this.currentTime = new Date();
  }

  async checkPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 500,
          height: 600
        }
      });
      this.videoElement.nativeElement.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  }

  capture() {
    this.loading = true;

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.nativeElement.videoWidth;
    canvas.height = this.videoElement.nativeElement.videoHeight;
    canvas.getContext('2d')?.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL();
    console.log('Base64 image:', imageDataURL);

    this.checkinService.recognizeFace({
      image: imageDataURL
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log(response);
    
        let employeeDetailDto: EmployeeDetailDto; 
    
        this.employeeService.getProfile(response.employeeId).subscribe({
          next: (profileResponse: any) => {
            employeeDetailDto = profileResponse;
    
            this.dialog.open(ConfirmCheckinDialogComponent, {
              data: {
                employee: employeeDetailDto, 
                probability: response.probability,
                isSave: response.isSave
              }
            }).afterClosed().subscribe(result => {
              console.log(result);
              this.checkPermissions();
            });
          },
          error: (profileError: any) => {
            console.log(profileError);
            this.snackBar.open('Failed to retrieve employee profile!', 'OK', {
              duration: 2000
            });
          }
        });
      },
      error: (error: any) => {
        this.loading = false;
        console.log(error);
        this.snackBar.open('Checkpoint failed!', 'OK', {
          duration: 2000
        });
      }
    });
    

  }
}
