import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { PwaPromptComponent } from './shared/components/prompt/prompt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HeaderComponent, PwaPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('stock-shop');
}
