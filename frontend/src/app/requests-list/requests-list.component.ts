import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request.model';
import { FormsModule } from '@angular/forms';
import { RequestFilters } from '../models/request-filters.model';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.css'
})
export class RequestsListComponent {
  constructor(private requestService: RequestService) { }

  requests!: Observable<RequestModel[]>;
  errorMessage = '';
  filters: RequestFilters = {
    applicantName: null,
    itemDescription: null,
    approved: null
  };

  async fetchRequests() {
    this.requests = this.requestService.fetchRequests(this.filters)

    this.requests.subscribe({
      error: (err) => { this.errorMessage = err.message }
    })
  }

  async ngOnInit(): Promise<void> {
    this.fetchRequests()
  }
}
