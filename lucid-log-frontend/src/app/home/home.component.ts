import { Component } from '@angular/core';
import { DreamService } from '../service/dream.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  dreamText: string = '';
  dreams: any[] = [];

  constructor(private dreamService: DreamService, public auth: AuthService) {}

  submitDream() {
    if (this.dreamText.trim()) {
      this.dreamService.saveDream(this.dreamText).subscribe(response => {
        this.dreams.unshift(response);
        this.dreamText = '';
      });
    }
  }

  fetchDreams(userId: string) {
    this.dreamService.getDreams(userId).subscribe(response => {
      this.dreams = response;
    });
  }
}
