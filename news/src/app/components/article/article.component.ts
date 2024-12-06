import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  {

  @Input()
  article!: Article;
  @Input()
  index!: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private newService: NewsService
  ) { }

  openArticle(){
      if( this.platform.is('ios') || this.platform.is('android') ){
        const browser = this.iab.create(this.article.url)
        browser.show()
        return
      }

      window.open( this.article.url, '_blank' )
  }

  async openMenu(){
    const normalBtns: ActionSheetButton[] = [
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler: () => this.articleFavorito()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]
    
    const shareBtn: ActionSheetButton = {
      text: 'Compartilhar',
      icon: 'share-outline',
      handler: () => this.shareArticle()
    }

    if(this.platform.is('capacitor')) {
      normalBtns.unshift(shareBtn)
    }


    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opcoes',
      buttons: normalBtns

    })

    await actionSheet.present()

  }

  shareArticle(){
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      this.article.content,
      this.article.url
    )
  }

  articleFavorito(){
    this.newService.addFavorite(this.article);
    console.log('Noticia Favoritada')
  }
}
