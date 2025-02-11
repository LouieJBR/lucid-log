import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { DreamService } from '../service/dream.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { Dream } from '../model/dream.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, AsyncPipe, DatePipe],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  dreamText = '';
  dreams: Dream[] = [];
  userName: string | null = null;
  userEmail: string | null = null;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dreamService: DreamService) {}

  ngOnInit() {
    // Check if a token exists in the URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        localStorage.setItem('auth_token', token); // ✅ Store token in local storage
        this.router.navigate(['/']); // ✅ Remove token from URL after storing
      }
    });

    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      console.log('Stored token:', storedToken);
      this.isLoggedIn = true;
      this.fetchDreams();

      // ✅ Fetch User Profile from MongoDB
      this.userService.getUserProfile().subscribe({
        next: (user) => {
          console.log('✅ MongoDB User Data:', user);
          this.userName = user.name || 'Anonymous';
          this.userEmail = user.email || 'No Email';
        },
        error: (err) => {
          console.error('❌ Error fetching user from MongoDB:', err);
        }
      });
    }
  }

  submitDream() {
    if (this.dreamText.trim()) {
      this.dreamService.saveDream(this.dreamText).subscribe(response => {
        console.log('✅ Saved Dream:', response.dream);
        console.log('dream date:', response.dream.date);
        this.dreams.unshift(response.dream); // ✅ Ensure dream is of type Dream
        this.dreamText = '';
      });
    }
  }

  fetchDreams() {
    this.dreamService.getDreams().subscribe(response => {
      console.log('✅ Fetched Dreams:', response);
      this.dreams = response as Dream[]; // ✅ Ensure response is cast to Dream[]
    });
  }

  redirectToLogin() {
    window.location.href = 'http://localhost:5000/api/auth/login';
  }
}
