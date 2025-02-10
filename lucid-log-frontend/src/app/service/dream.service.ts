import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DreamService {
  private apiUrl = 'http://localhost:5000/api/dreams';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveDream(text: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/save`, { text }, { headers });
  }

  getDreams(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/user-dreams`, { headers });
  }
}
