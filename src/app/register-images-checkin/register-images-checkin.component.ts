import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CheckinService } from '../service/checkin/checkin.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeViews } from '../model/EmployeeViews';
import { ProjectDetailDto } from '../model/project-view-detail';
import { EmployeeService } from '../service/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-images-checkin',
  templateUrl: './register-images-checkin.component.html',
  styleUrls: ['./register-images-checkin.component.scss']
})
export class RegisterImagesCheckinComponent implements OnInit {

  loading = false;
  currentTime: Date = new Date();
  imageBase64List: any[] = [];
  keyword = '';
  employeeSelected: any;
  pageNumber = 1;
  pageSize = 100;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  employeeView: EmployeeViews[] = [];
  projectDetailDto: ProjectDetailDto = {};
  selectedEmployee: EmployeeViews | undefined;
  isLinear = false;
  selectedEmployeeCheck = false;
  checkAuthen = false;

  formAuth: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
  });

  constructor(
    private checkinService: CheckinService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
  ) { }

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  ngAfterViewInit() {
    if (this.videoElement) this.checkPermissions();
  }

  ngOnInit() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  filter() {
    console.log("sscsccs");
    this.pageNumber = 1;
    this.pageSize = 100;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    this.employeeService
      .getEmployees(
        this.pageNumber,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.keyword,
        '',
        '',
        '',
        ''
      )
      .subscribe({
        next: (response: any) => {
          this.employeeView = response.content;
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  chooseEmployee(employee: any) {
    this.employeeSelected = employee;
    console.log(this.employeeSelected);
    this.selectedEmployeeCheck = true;
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

  searchOrFilter() {
    this.filter();
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

  registerImages() {
    if (this.employeeSelected === undefined) {
      this.snackBar.open('Please choose employee', 'Close', {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
      return;
    }

    console.log(this.employeeSelected.id);
    console.log(this.imageBase64List);

    this.checkinService.registerImages(this.employeeSelected.id, this.imageBase64List).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === true) {
          this.snackBar.open('Register images successfully!', 'Close', {
            duration: 2000,
            panelClass: ['green-snackbar'],
          });
          this.imageBase64List = [];
          this.employeeSelected = undefined;
          this.selectedEmployeeCheck = false;
        } else {
          this.snackBar.open('User already exists!', 'Close', {
            duration: 2000,
            panelClass: ['red-snackbar'],
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Register images failed!', 'Close', {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => { },
    });
  }

  deleteImage(index: number) {
    this.imageBase64List.splice(index, 1);
  }

  ConfirmAuthen() {
    if (this.formAuth.invalid) {
      this.snackBar.open('Please enter password', 'Close', {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
    }

    const password = this.formAuth.value.password;
    this.employeeService.checkPasswordSystemAuth(password).subscribe({
      next: (response: any) => {
        console.log(response);
        this.checkAuthen = true;
        this.snackBar.open('System authentication successful!', 'Close', {
          duration: 2000,
          panelClass: ['green-snackbar'],
        });

        this.pageNumber = 1;
        this.pageSize = 100;
        this.keyword = '';
        this.sortField = 'id';
        this.sortOrder = 'asc';
        this.employeeService
          .getEmployees(
            this.pageNumber,
            this.pageSize,
            this.sortField,
            this.sortOrder,
            this.keyword,
            '',
            '',
            '',
            ''
          )
          .subscribe({
            next: (response: any) => {
              this.employeeView = response.content;
              this.pageSize = response.pageable.pageSize;
              this.pageNumber = response.pageable.pageNumber;
              this.totalElements = response.totalElements;
            },
            error: (error) => {
              console.log(error);
            },
          });

        this.checkPermissions();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Verify system failure!', 'Close', {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => { },
    });
  }
}
