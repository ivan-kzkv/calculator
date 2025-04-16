import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ClarityModule} from "@clr/angular";
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from "./app.component";
import {InputComponent} from './components/input/input.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ClarityModule,
    AppComponent,
    InputComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
