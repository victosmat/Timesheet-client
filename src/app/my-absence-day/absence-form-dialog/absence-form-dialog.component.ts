import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { AbsenceService } from 'src/app/service/absence/absence.service';
import { AbsenceDialogComponent } from '../absence-dialog/absence-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AbsenceDto } from 'src/app/model/absence-dto';
import { AbsenceTypeOffSelect } from 'src/app/model/absence-type-off-select';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum TypeTimeOff {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  FULL_DAY = "FULL_DAY",
}

@Component({
  selector: 'app-absence-form-dialog',
  templateUrl: './absence-form-dialog.component.html',
  styleUrls: ['./absence-form-dialog.component.scss']
})
export class AbsenceFormDialogComponent implements OnInit {

  absenceForm! : FormGroup;
  absenceRequest: AbsenceDto = {
    id: null,
    reason: null,
    employeeId: null,
    absenceTypeOffId: null,
    dateRequest: null,
    dateSubmit: null,
    typeTimeOff: null,
    timeOff: null,
    absenceTypeId: null
  };
  typesTimeOff = TypeTimeOff;
  absenceTypeOffSelectList! : AbsenceTypeOffSelect[];

  constructor(    
    private dialogRef: MatDialogRef<AbsenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService : CookieService,
    private absenceService : AbsenceService,
    private fb : FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    if(this.data.absenceId) {
      console.log(this.data.absenceId)
      this.absenceService.findAbsenceRequestById(Number(this.data.absenceId)).subscribe({
        next : (response) => {
          console.log(response);
          this.patchValueToForm(response);
        },
        error : (error) => {
          console.log(error);
        }
      })
    }

    // if(this.data.type === "OFF") {
    //   this.absenceService.findAllByAbsenceTypeName(this.data.type).subscribe({
    //     next : (response) => {
    //       console.log(response);
    //       this.absenceTypeOffSelectList = response;
    //     },
    //     error : (error) => {
    //       console.log(error);
    //     }
    //   });
    // }
    if(this.data.type === 'WENT_SOON' || this.data.type === 'COME_LATE') {
      this.absenceForm = this.fb.group({
        id : new FormControl(null),
        reason : new FormControl(null, Validators.required),
        dateRequest : new FormControl(null, Validators.required),
        timeOff : new FormControl(0, Validators.required),
        typeTimeOff : new FormControl(this.data.typeTimeOff, Validators.required),
      });
    } else if(this.data.type === 'OFF') {
      this.absenceForm = this.fb.group({
        id : new FormControl(null),
        reason : new FormControl(null, Validators.required),
        absenceType : new FormControl({value : this.data.type, disabled : true}),
        absenceTypeOffId : new FormControl(null),
        dateRequest : new FormControl(null, Validators.required),
        typeTimeOff : new FormControl(this.data.typeTimeOff, Validators.required),
      });
    } else {
      this.absenceForm = this.fb.group({
        id : new FormControl(null),
        reason : new FormControl(null, Validators.required),
        dateRequest : new FormControl(null, Validators.required),
        typeTimeOff : new FormControl(this.data.typeTimeOff, Validators.required),
      });
    }
  }

  patchValueToForm(response : any) {
    if(this.data.type === "OFF") {
      console.log("OFF")
      this.absenceForm = this.fb.group({
        id : new FormControl(response.id),
        reason : new FormControl(response.reason, Validators.required),
        absenceType : new FormControl({value : this.data.type, disabled : true}),
        absenceTypeOffId : new FormControl(response.absenceTypeOffId),
        dateRequest : new FormControl(new Date(response.dateRequest[0], response.dateRequest[1] - 1, response.dateRequest[2]), Validators.required),
        typeTimeOff : new FormControl(response.typeTimeOff, Validators.required),
      });
    } else if(this.data.type === "WENT_SOON" || this.data.type === "COME_LATE") {
      this.absenceForm = this.fb.group({
        id : new FormControl(response.id),
        reason : new FormControl(response.reason, Validators.required),
        dateRequest : new FormControl(new Date(response.dateRequest[0], response.dateRequest[1] - 1, response.dateRequest[2]), Validators.required),
        timeOff : new FormControl(Number(response.timeOff), Validators.required),
        typeTimeOff : new FormControl(response.typeTimeOff, Validators.required),
      });
    } else {
      this.absenceForm = this.fb.group({
        id : new FormControl(response.id),
        reason : new FormControl(response.reason, Validators.required),
        dateRequest : new FormControl(new Date(response.dateRequest[0], response.dateRequest[1] - 1, response.dateRequest[2]), Validators.required),
        typeTimeOff : new FormControl(response.typeTimeOff, Validators.required),
      });
    }
  }

  submitForm() {
    if(this.absenceForm.invalid) {
      console.log("INVALID!");
      return;
    }
    this.patchValueFromFormToDto();
    console.log("OK");
  }

  patchValueFromFormToDto() {
    this.absenceRequest.id = this.absenceForm.controls["id"].value;
    this.absenceRequest.dateRequest = this.absenceForm.controls["dateRequest"].value;
    this.absenceRequest.employeeId = Number(this.cookieService.get("TimesheetAppEmployeeId"));
    this.absenceRequest.dateSubmit = new Date();
    this.absenceRequest.reason = this.absenceForm.controls["reason"].value;
    if(this.data.type === 'OFF') {
      this.absenceRequest.absenceTypeOffId = this.absenceForm.controls["absenceTypeOffId"].value;
      this.absenceRequest.typeTimeOff = this.absenceForm.controls["typeTimeOff"].value;
      this.absenceRequest.absenceTypeId = 1;
    } else if(this.data.type === 'WENT_SOON' || this.data.type === 'COME_LATE') {
      if(this.data.type === 'WENT_SOON') {
        this.absenceRequest.absenceTypeId = 4;
      } else {
        this.absenceRequest.absenceTypeId = 5;
      }
      this.absenceRequest.typeTimeOff = this.absenceForm.controls["typeTimeOff"].value;
      this.absenceRequest.timeOff = this.absenceForm.controls["timeOff"].value;
    } else {
      if(this.data.type === 'REMOTE') {
        this.absenceRequest.absenceTypeId = 2;
      } else {
        this.absenceRequest.absenceTypeId = 3;
      }
      this.absenceRequest.typeTimeOff = this.absenceForm.controls["typeTimeOff"].value;
    }
    this.absenceService.saveAbsenceRequest(this.absenceRequest).subscribe({
      next : (response) => {
        if(response === true) {
          this.snackBar.open("Save request successfully!", "OK");
          this.dialogRef.close(this.absenceRequest.dateRequest);
        } else {
          this.snackBar.open("Error when saving request!", "OK");
          this.dialogRef.close(this.absenceRequest.dateRequest);
        }
      },
      error : (error) => {
        console.log(error);
        this.dialogRef.close(this.absenceRequest.dateRequest);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
