import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor( private newService: NewsService, private router: Router) { }

  onRegister() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.newService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao registrar:', error);
      },
    });
  }

  ngOnInit() {
  }

}
