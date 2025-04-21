import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter([])
  ]
}).catch(err => console.error(err));

// Отключаем DevTools при запуске
if (window.console) {
  window.console.log = function() {};
  window.console.error = function() {};
  window.console.warn = function() {};
}
