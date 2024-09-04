import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-judge-request',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './judge-request.component.html',
  styleUrl: './judge-request.component.css'
})
export class JudgeRequestComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private requestService: RequestService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      approvalStatus: ['approved'],
      observations: ['']
    });
  }

  requestId: string | null = null;
  errorMessage = '';


  request!: Observable<RequestModel>;
  isRejected = false;

  async fetchRequest() {
    this.request = this.requestService.fetchRequest(this.requestId!)

    this.request.subscribe({
      error: (err) => { this.errorMessage = err.message },
      next: (request) => {
        if (request.approved != null) {
          alert('Solicitação já aprovada!')
          this.router.navigate(['/judge'])
        }
      },
    })
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.fetchRequest()

    this.form.get('approvalStatus')?.valueChanges.subscribe(value => {
      this.isRejected = value === 'rejected';
      this.updateObservationsValidator();
    });
  }

  updateObservationsValidator() {
    const observationsControl = this.form.get('observations');
    if (this.isRejected) {
      observationsControl?.setValidators([Validators.required]);
    } else {
      observationsControl?.clearValidators();
    }
    observationsControl?.updateValueAndValidity();
  }

  onStatusChange() {
    this.updateObservationsValidator();
  }

  onSubmit(request: RequestModel) {
    if (this.form.valid) {
      const approved = this.form.get('approvalStatus')?.value === 'approved';
      const observations = this.form.get('observations')?.value;
      const requestId = request.id;

      this.requestService.judgeRequest(requestId, approved, observations).subscribe({
        next: () => {
          alert('Pedido salvo com sucesso!');
          this.router.navigate(['/judge'])
        },
        error: (err) => {
          console.log(err)
          this.errorMessage = err.message || 'Erro ao salvar o pedido.';
        }
      })
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}
