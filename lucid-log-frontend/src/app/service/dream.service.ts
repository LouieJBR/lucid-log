import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Dream } from '../model/dream.model';

@Injectable({
  providedIn: 'root'
})
export class DreamService {
  private apiUrl = environment.apiUrl+'/dreams'; //  Use dynamic API URL
  constructor(private http: HttpClient){}

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
