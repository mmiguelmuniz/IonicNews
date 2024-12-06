import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Article } from 'src/app/interfaces';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  @Input()
  article!: Article;

  favorites: Article[] = [];

  constructor(
    private newsService: NewsService,
    private platform: Platform,
    private iab: InAppBrowser
    
  ) {}

  openArticle(url: string) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(url);
      browser.show();
      return;
    }
    window.open(url, '_blank');
  }


  ngOnInit() {
    this.favorites = this.newsService.getFavorites();
  }

  removeFavorite(article: Article) {
    this.newsService.removeFavorite(article);
    this.favorites = this.newsService.getFavorites();
  }
}
