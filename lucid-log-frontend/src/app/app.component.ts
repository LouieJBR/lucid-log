import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule], // ✅ Import RouterModule for routing
})
export class AppComponent {

  title = 'lucid-log-frontend';
}
