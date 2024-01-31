import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  private serverUrl = 'http://localhost:8081/Timesheet/ws';
  private topic = '/topic/public';

  connect(username: string, employeeID: number, onMessageReceived: (message: any) => void, onConnected: () => void, onError: (error: any) => void): void {
    const socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);
    console.log("stompClient connect: " + this.stompClient);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(this.topic, onMessageReceived);
      this.stompClient.send("/message/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN', employeeID: employeeID }));
      onConnected();
    }, onError);
  }

  sendMessage(message: any): void {
    console.log("stompClient sendMessage: " + this.stompClient);
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send("/message/chat.sendMessage", {}, JSON.stringify(message));
    } else {
      console.error('WebSocket connection is not established.');
    }
  }
}