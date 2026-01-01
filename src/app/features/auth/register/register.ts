import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  userData = { name: '', email: '', password: '', password_confirmation: '' };
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onRegister() {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.userData.password !== this.userData.password_confirmation) {
      this.isLoading = false;
      this.errorMessage = 'Password and password confirmation are not identical!';
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('access_token', res.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error.message || err.message || 'Something went wrong, please try again later.';

        this.cdr.detectChanges();
      },
    });
  }
}
