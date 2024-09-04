import { Component } from '@angular/core';
import { RequestService } from '../request.service';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateRequestSchema } from '../models/CreateRequestSchema.model';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.css'
})
export class CreateRequestComponent {
  form: FormGroup;

  constructor(private requestService: RequestService, private fb: FormBuilder) {
    this.form = this.fb.group({
      applicantName: ['', Validators.required],
      itemDescription: ['', Validators.required],
      itemPrice: ['', Validators.required],
    })
  }

  formattedPrice: string = '';
  errorMessage = '';

  onPriceInput(event: any) {
    let input = event.target.value;

    const numericValue = input.replace(/[^0-9]/g, '');

    if (numericValue == '') {
      this.formattedPrice = 'R$ 00,00';
      return;
    }

    this.formattedPrice = this.formatPrice(numericValue);

    const valueInCents = parseInt(numericValue, 10);

    this.form.get('itemPrice')?.setValue(valueInCents);
  }

  formatPrice(value: string): string {
    const formattedValue = (parseInt(value, 10) / 100).toFixed(2);

    return `R$ ${formattedValue.replace('.', ',')}`;
  }

  onSubmit() {
    if (this.form.valid) {
      const createSchema: CreateRequestSchema = this.form.value
      this.requestService.createRequest(createSchema).subscribe({
        error: (err) => { this.errorMessage = err.message },
        next: () => { alert('Solicitação criada com sucesso'); this.form.reset() }
      })
    }
  }
}