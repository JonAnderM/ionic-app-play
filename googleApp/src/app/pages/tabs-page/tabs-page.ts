import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  selected=true;
  selected2=false;
  selected3=false;
  selected4=false;


  mostrarNombre(tab){
    console.log(tab+ "---JOIN");
    this.selected=false;
    this.selected2=false;
    this.selected3=false;
    this.selected4=false;
    switch (tab) {
      case 1: {
        this.selected=true;
        break;
      }
      case 2: {
          this.selected2=true;
          break;
      }
      case 3: {
        this.selected3=true;
        break;
      }
      case 4: {
        this.selected4=true;
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
     }
    }
    
  }
}
