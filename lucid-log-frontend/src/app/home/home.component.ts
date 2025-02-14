import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { DreamService } from '../service/dream.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { Dream } from '../model/dream.model';
import { environment } from '../../environments/environment'; // ✅ Import environment src/environments/environment';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // ✅ Ensure styles are linked
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  apiUrl = environment.apiUrl; // ✅ Use correct API URL
  dreamText = '';
  dreams: Dream[] = [];
  userName: string | null = null;
  userEmail: string | null = null;
  quoteIndex = 0;
  quoteText = "A dream is a microscope through which we look at the hidden occurrences in our soul.";
  fadeClass = 'fade-in';

  quotes = [
    "Dreams feel real while we're in them. It's only when we wake up that we realize something was actually strange.",
    "The dreamer is awake inside the dream.",
    "The moment you become aware that you're dreaming, you become free.",
    "In a dream, you are never just a passive observer; you are the architect of your own reality.",
    "A lucid dream is not just a dream—it’s a playground where the laws of reality bend to your will.",
    "The only limits in lucid dreams are the ones you believe in.",
    "When you realize you’re dreaming, you hold the keys to an infinite world.",
    "Lucid dreaming is like being handed a paintbrush to color the canvas of your subconscious.",
    "Control the dream, control the experience, control the self.",
    "Once you learn to become aware inside your dreams, the real adventure begins."
  ];


  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dreamService: DreamService) { }

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
      this.isLoggedIn = true;
      this.fetchDreams();

      // ✅ Fetch User Profile from MongoDB
      this.userService.getUserProfile().subscribe({
        next: (user) => {
          this.userName = user.name || 'Anonymous';
          this.userEmail = user.email || 'No Email';
        },
        error: (err) => {
          console.error('❌ Error fetching user from MongoDB:', err);
        }
      });
    }

    this.startQuoteRotation();
  }

  startQuoteRotation() {
    setInterval(() => {
      // Fade out
      this.fadeClass = 'fade-out';
      
      setTimeout(() => {
        // Change quote after fade-out
        this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
        this.quoteText = this.quotes[this.quoteIndex];

        // Fade back in
        this.fadeClass = 'fade-in';
      }, 1000); // Match CSS transition time
    }, 15000); // Change quote every 15 seconds
  }

  submitDream() {
    if (this.dreamText.trim()) {
      this.dreamService.saveDream(this.dreamText).subscribe(response => {
        this.dreams.unshift(response.dream); // ✅ Ensure dream is of type Dream
        this.dreamText = '';
      });
    }
  }

  fetchDreams() {
    this.dreamService.getDreams().subscribe({
      next: (dreams) => {
        this.dreams = dreams.reverse(); // ✅ Ensures newest dreams appear first
      },
      error: (err) => {
        console.error('❌ Error Fetching Dreams:', err);
      }
    });
  }

  deleteDream(dreamId: string) {
      this.dreamService.deleteDream(dreamId).subscribe(response => {
        this.dreams = this.dreams.filter(dream => dream._id !== dreamId);
      }, error => {
        console.error('❌ Error deleting dream:', error);
      });
  }
    
  redirectToLogin() {
    window.location.href = environment.apiUrl + '/auth/login';
  }

  logout() {
    localStorage.removeItem('auth_token'); // ✅ Clear stored token
    this.auth.logout(); // ✅ Calls Auth0 logout
    window.location.href = environment.apiUrl + '/auth/logout'; // ✅ Redirects correctly based on environment
  }  

  toggleNav() {
    const sidenav = document.querySelector('.sidenav');
    sidenav?.classList.toggle('open'); // ✅ Toggles the `open` class
  }
  
}
