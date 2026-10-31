import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  get<T>(path: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.endpoint(path), { params });
  }

  post<TRequest, TResponse>(path: string, body: TRequest): Observable<ApiResponse<TResponse>> {
    return this.http.post<ApiResponse<TResponse>>(this.endpoint(path), body);
  }

  put<TRequest, TResponse>(path: string, body: TRequest): Observable<ApiResponse<TResponse>> {
    return this.http.put<ApiResponse<TResponse>>(this.endpoint(path), body);
  }

  patch<TRequest, TResponse>(path: string, body: TRequest): Observable<ApiResponse<TResponse>> {
    return this.http.patch<ApiResponse<TResponse>>(this.endpoint(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.endpoint(path));
  }

  private endpoint(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}
