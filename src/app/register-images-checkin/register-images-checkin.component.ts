import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CheckinService } from '../service/checkin.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-images-checkin',
  templateUrl: './register-images-checkin.component.html',
  styleUrls: ['./register-images-checkin.component.scss']
})
export class RegisterImagesCheckinComponent implements OnInit {

  loading = false;
  currentTime: Date = new Date();
  imageBase64List: any[] = [];

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  filteredOptions: any[] = [];

  constructor(
    private checkinService: CheckinService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
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
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

      // Chuyển ảnh sang dạng base64 và lưu vào mảng imageBase64List
      const imageDataURL = canvas.toDataURL();
      this.imageBase64List.push(imageDataURL);

      // Cập nhật trạng thái loading và hiển thị ảnh đã chụp
      this.loading = false;
      console.log('Base64 image:', imageDataURL);
    }
  }

  registerImages() { }

  deleteImage(index: number) {
    this.imageBase64List.splice(index, 1);
  }
}
