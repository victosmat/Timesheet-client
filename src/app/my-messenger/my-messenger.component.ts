import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../service/chat/websocket.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../service/profile/profile.service';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { is } from 'date-fns/locale';

@Component({
  selector: 'app-my-messenger',
  templateUrl: './my-messenger.component.html',
  styleUrls: ['./my-messenger.component.scss']
})
export class MyMessengerComponent implements OnInit {
  messageForm!: FormGroup;

  messageInput: string | undefined;
  messages: any[] = [];
  fullName: string | undefined;
  isConnected = false;
  employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  isOwner: boolean | undefined;

  constructor(
    private websocketService: WebsocketService,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      messageInput: new FormControl(null, Validators.required),
    });

    this.employeeService.getProfile(this.employeeId).subscribe({
      next: (response: any) => {
        console.log("Response: " + response);
        this.fullName = response.firstName + ' ' + response.lastName;
        this.websocketService.connect(
          this.fullName,
          this.employeeId,
          this.onMessageReceived.bind(this),
          () => console.log('WebSocket connection established'),
          (error) => console.error('WebSocket connection error:', error)
        );

        this.isConnected = true;
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { }
    });
  }

  onMessageReceived(payload: { body: string; }): void {
    const message = JSON.parse(payload.body);

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
      const eventMessage = {
        sender: null,
        content: `${message.sender} ${message.type === 'JOIN' ? 'joined!' : 'left!'}`,
        type: message.type
      }
      this.messages.push(eventMessage);
    } else {
      console.log("message: " + message.employeeID);
      console.log("employeeID current: " + this.employeeId);
      const isOwner = message.employeeID === this.employeeId;
      console.log("isOwner: " + isOwner);

      this.messages.push({
        sender: message.sender,
        content: message.content,
        type: message.type,
        isOwner: isOwner
      });
    }
  }

  sendMessage(): void {
    const messageInput = this.messageForm.value.messageInput;
    console.log("messageInput: " + messageInput);
    if (messageInput) {
      const chatMessage = {
        sender: this.fullName,
        content: messageInput,
        type: 'CHAT',
        employeeID: this.employeeId,
      };
      this.websocketService.sendMessage(chatMessage);
      this.messageForm.reset();
    }
  }
}
