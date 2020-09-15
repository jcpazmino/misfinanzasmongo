import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string; 
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Resumen',  icon: 'dashboard', class: '' },
    { path: '/table-list', title: 'Movimientos',  icon:'content_paste', class: '' },
    { path: '/user-profile', title: 'Perfil de usuario',  icon:'person', class: '' },
    { path: '/historico', title: 'Histórico',  icon:'content_paste', class: '' },
    { path: '/fijo', title: 'Movimientos fijos',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
