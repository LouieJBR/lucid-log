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
    
    console.log("Auth Token Being Sent:", token); // ✅ Log the token
  
    if (!token) {
      console.error("❌ No Auth Token Found! User may be logged out.");
      return new Observable<Dream[]>(); // Return empty observable if no token
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.get<Dream[]>(`${this.apiUrl}/user-dreams`, { headers });
  }

  deleteDream(dreamId: string): Observable<{ message: string; dreamId: string }> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.delete<{ message: string; dreamId: string }>(
      `${this.apiUrl}/${dreamId}`,
      { headers }
    );
  }
  
  
}
