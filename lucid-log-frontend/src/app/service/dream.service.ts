import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DreamService {
  private apiUrl = 'http://localhost:5000/api/dreams';

  constructor(private http: HttpClient, private auth: AuthService) {}

  saveDream(text: string): Observable<any> {
    return from(this.auth.getAccessTokenSilently()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.post(this.apiUrl, { text }, { headers });
      })
    );
  }

  getDreams(userId: string): Observable<any> {
    return from(this.auth.getAccessTokenSilently()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.apiUrl}/${userId}`, { headers });
      })
    );
  }
}
