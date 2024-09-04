import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request.model';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './pending-list.component.html',
  styleUrl: './pending-list.component.css'
})
export class PendingListComponent {
  constructor(private requestService: RequestService, private router: Router) { }

  requests!: Observable<RequestModel[]>;
  errorMessage = '';

  async fetchPendingRequests() {
    this.requests = this.requestService.fetchPendingRequests()

    this.requests.subscribe({
      error: (err) => { this.errorMessage = err.message }
    })
  }

  async ngOnInit(): Promise<void> {
    this.fetchPendingRequests()
  }

  navigateToJudge(requestId: number) {
    this.router.navigate([`/judge/${requestId}`])
  }
}
