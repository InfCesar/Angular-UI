import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiButtonComponent } from './components/button/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UiButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-ui';
}
