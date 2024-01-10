import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ImageCheckinDto } from 'src/app/model/image-checkin-dto';
import { CheckinService } from 'src/app/service/checkin/checkin.service';
import { DeleteImageCheckinDialogComponent } from './delete-image-checkin-dialog/delete-image-checkin-dialog.component';

@Component({
  selector: 'app-view-image-checkin-dialog',
  templateUrl: './view-image-checkin-dialog.component.html',
  styleUrls: ['./view-image-checkin-dialog.component.scss']
})
export class ViewImageCheckinDialogComponent implements OnInit {

  imageCheckinDtoList: ImageCheckinDto[] = [];
  imageCheckinDtoListCheck: ImageCheckinDto[] = [];
  selectedDate = new Date();
  month: number = this.selectedDate.getMonth() + 1;
  year: number = this.selectedDate.getFullYear();
  constructor(
    private checkinService: CheckinService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.checkinService.getAllImageByEmployeeId(this.data.id, this.month, this.year).subscribe({
      next: (response: any) => {
        console.log(response);
        this.imageCheckinDtoList = response.images_base64;
        this.imageCheckinDtoListCheck = response.images_base64;
        console.log(this.imageCheckinDtoList);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  filterDate() {
    this.imageCheckinDtoList = this.imageCheckinDtoListCheck;
    let data: ImageCheckinDto[] = [];
    this.imageCheckinDtoList.forEach((element) => {
      const dateArr = element.nameFile.split('_');
      const dayArr = dateArr[1].split('-');
      const month = Number(dayArr[1]);
      const year = Number(dayArr[2]);
      if (month === this.month && year === this.year) data.push(element);
    });
    console.log(data);
    this.imageCheckinDtoList = data;
  }

  findMonth() {
    console.log(this.month + " " + this.year);
    this.filterDate();
  }
  findYear() {
    console.log(this.month + " " + this.year);
    this.filterDate();
  }

  formatDate(dateStr: any) {
    const dateArr = dateStr.split('_');
    const hoursArr = dateArr[0].split('-').join(':');
    const day = dateArr[1].split('-').join('/');
    return hoursArr + ' ' + day;
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  deleteImage(image: ImageCheckinDto) {
    console.log(image);
    this.dialog.open(DeleteImageCheckinDialogComponent, {
      data: {
        image: image,
        employee: this.data,
      },
      width: '600px',
    }).afterClosed().subscribe({
      complete: () => {
        this.ngOnInit();
      },
    });
  }
}
