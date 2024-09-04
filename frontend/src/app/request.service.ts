import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestModel } from './models/request.model';
import { catchError, map, throwError } from 'rxjs';
import { RequestFilters } from './models/request-filters.model';
import { CreateRequestSchema } from './models/CreateRequestSchema.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) { }

  apiUrl = 'http://127.0.0.1:3001/request'

  fetchRequests(filters: RequestFilters) {
    let params = new HttpParams();

    if (filters.applicantName) {
      params = params.set('applicantName', filters.applicantName);
    }
    if (filters.itemDescription) {
      params = params.set('itemDescription', filters.itemDescription);
    }
    if (filters.approved != null) {
      params = params.set('approved', filters.approved);
    }


    return this.http.get<RequestModel[]>(this.apiUrl, { params }).pipe(
      map((requests) =>
        requests.map(
          (request) =>
            RequestModel.fromObject(request)
        )
      ),
      catchError((error) => {
        return throwError(() => new Error('Ocorreu um erro ao buscar os pedidos.'))
      })
    );
  }

  fetchPendingRequests() {
    let params = new HttpParams();
    params = params.set('approved', 'null');


    return this.http.get<RequestModel[]>(this.apiUrl, { params }).pipe(
      map((requests) =>
        requests.map(
          (request) =>
            RequestModel.fromObject(request)
        )
      ),
      catchError((error) => {
        return throwError(() => new Error('Ocorreu um erro ao buscar os pedidos.'))
      })
    );
  }

  createRequest(request: CreateRequestSchema) {
    return this.http.post<RequestModel>(this.apiUrl, request).pipe(
      map((request) => {
        RequestModel.fromObject(request)
      }),
      catchError((error) => {
        return throwError(() => new Error('Ocorreu um erro ao criar o pedido.'))
      })
    )
  }

  fetchRequest(requestId: string) {
    return this.http.get<RequestModel>(`${this.apiUrl}/${requestId}`).pipe(
      map((request) =>
        RequestModel.fromObject(request)
      ),
      catchError((error) => {
        return throwError(() => new Error('Ocorreu um erro ao buscar o pedido.'))
      })
    );
  }

  judgeRequest(requestId: number, approved: boolean, observations: string | null) {
    const middleRoute = approved ? 'approve' : 'reject'
    return this.http.put(`${this.apiUrl}/${middleRoute}/${requestId}`, { observations }, { responseType: 'text' }).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {
        console.log(error)
        return throwError(() => new Error('Ocorreu um erro ao salvar o pedido.'))
      })
    );
  }
}
