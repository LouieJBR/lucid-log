import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dream } from '../model/dream.model';

@Injectable({
  providedIn: 'root'
})
export class DreamService {
  private apiUrl = 'http://localhost:5000/api/dreams';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveDream(text: string): Observable<{ message: string; dream: Dream }> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<{ message: string; dream: Dream }>(
      `${this.apiUrl}/save`,
      { text },
      { headers }
    );
  }

  getDreams(): Observable<Dream[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<Dream[]>(`${this.apiUrl}/user-dreams`, { headers });
  }
}
