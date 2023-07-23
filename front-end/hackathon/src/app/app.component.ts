import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  title = 'hackathon';
  goToHomePage(){
    this.router.navigate(['']);
  }
  goToReviewPage(){
    this.router.navigate(['/review']);
  }
  goToAlertPage(){
    this.router.navigate(['/alert']);
  }
  goToSubscribePage(){
    this.router.navigate(['/subscribe']);
  }
}
