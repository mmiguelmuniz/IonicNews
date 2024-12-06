import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article, NewsResponse , ArticlesByCategoryAndPage } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'


const apiKey = environment.apiKey
const apiUrl = environment.apiUrl
const urlBack = environment.urlBack

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage:ArticlesByCategoryAndPage = {}
  private favorites: Article[] = [];

  constructor( 
    private http: HttpClient
) { }

register(userData: { username: string; email: string; password: string }): Observable<any> {
  return this.http.post(`${ urlBack }/register`, userData);
}

login(userData: { email: string; password: string }): Observable<any> {
  return this.http.post(`${ urlBack }/login`, userData);
}

    addFavorite(article: Article): void {
      if (!this.favorites.some(fav => fav.title === article.title)) {
        this.favorites.push(article);
        console.log('Artigo adicionado aos favoritos:', article.title);
      }
    }

    getFavorites(): Article[] {
      return this.favorites;
    }
  

    removeFavorite(article: Article): void {
      this.favorites = this.favorites.filter(fav => fav.title !== article.title);
      console.log('Artigo removido dos favoritos:', article.title);
    }
  

  private executeQuery<T>(endpoint: string){
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {
        apiKey: apiKey,
        country: 'us'
      }
    })
  }

  getTopHeadLines():Observable<Article[]> {

   return this.getTopHeadLinesByCategory( 'business' )
  }

  getTopHeadLinesByCategory( category:string, loadMore:boolean = false ):Observable<Article[]>{
    
    if( loadMore ) {
      return this.getArticlesByCategory( category )
    } 
    if( this.articlesByCategoryAndPage[category] ) {
      return of(this.articlesByCategoryAndPage[category].articles)
    }

    return this.getArticlesByCategory( category )
 
  }

  private getArticlesByCategory( category: string): Observable<Article[]>{

    if( Object.keys( this.articlesByCategoryAndPage ).includes(category) ) {

    }else{
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe(
      map(({articles}) => {

        if(articles.length === 0) return this.articlesByCategoryAndPage[category].articles

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles]
        }

        return this.articlesByCategoryAndPage[category].articles
      })
    )
  }
}
