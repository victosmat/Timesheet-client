import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CheckinService } from '../service/checkin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCheckinDialogComponent } from './confirm-checkin-dialog/confirm-checkin-dialog.component';

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
    private dialog: MatDialog
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
        this.dialog.open(ConfirmCheckinDialogComponent, {
          data: {
            employeeId: response.employeeId,
            probability: response.probability,
            isSave: response.isSave
          }
        }).afterClosed().subscribe(result => {
          console.log(result);
          this.checkPermissions();
        });
      },
      error: (error: any) => {
        this.loading = false;
        console.log(error);
      }
    });

  }
}
