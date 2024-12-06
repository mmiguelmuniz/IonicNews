import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userName: string = ''; 
  userEmail: string = ''; 

  constructor(private router: Router) {}

  ngOnInit() {
   
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'Usuário Desconhecido';
    this.userEmail = user.email || 'Email não cadastrado';
  }

  logout() {
    localStorage.removeItem('user'); 
    this.router.navigate(['/login']); 
  }
  home(){
    this.router.navigate(['/tabs']);
  }
}
