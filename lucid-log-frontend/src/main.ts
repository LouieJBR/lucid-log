import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideAuth0, AuthClientConfig, AuthConfig } from '@auth0/auth0-angular';

//  Define Auth0 Configuration
const authConfig: AuthConfig = {
  domain: 'dev-m1vbm7mjkcjugfu4.uk.auth0.com',
  clientId: 'FoaAMzt1kISLkfPu5OqO2eAfcd6xdnk2',
  authorizationParams: {
    redirect_uri: window.location.origin
  }
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAuth0(authConfig), //  Correctly pass Auth0 configuration
    { provide: AuthClientConfig, useValue: new AuthClientConfig(authConfig) } //  Fixes the `configFactory.get` error
  ]
}).catch(err => console.error(err));
