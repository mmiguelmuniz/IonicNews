import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule,
            HttpClientModule,
            FormsModule
          ],
  providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        InAppBrowser,
        SocialSharing,
        AuthGuard
        ],
  bootstrap: [AppComponent],
})
export class AppModule {}
