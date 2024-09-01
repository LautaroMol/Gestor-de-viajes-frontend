import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

if(!navigator.geolocation){
  alert('navegador no compatible')
  throw new Error('Navegador no compatible')
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));