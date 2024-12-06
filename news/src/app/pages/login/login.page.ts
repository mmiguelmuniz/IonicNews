import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: NewsService, private router: Router) {}

  login() {
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(userData).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/tabs']); 
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
        alert('Credenciais inválidas');
      },
    });
  }
  goToRegister() {
    this.router.navigate(['/registro']);
  }
}