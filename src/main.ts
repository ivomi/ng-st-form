import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TicketsList } from './tickets-list/tickets-list';

@Component({
  selector: 'app-root',
  imports: [TicketsList],
  template: `<app-tickets-list />`,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
