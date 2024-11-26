import { Component } from "@angular/core";
import { TicketsDetail } from "../tickets-detail/tickets-detail";

@Component({
    selector: 'app-tickets-list',
    imports: [TicketsDetail],
    templateUrl: './tickets-list.html',
})
export class TicketsList {}
