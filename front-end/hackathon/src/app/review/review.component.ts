import { Component } from '@angular/core';
import { ApiServiceService } from '../api.service.service';
import { Router } from '@angular/router';
import { County } from '../county.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  http: any;

  constructor(private dataService: ApiServiceService,private router: Router) {}
  ngOnInit(): void{
    this.onStateChange();
  }

    selectedState: string = '';
    counties: County[] = [];
    selectedCounty: string='';
    review: string = '';
    // Array of US states for the dropdown
    states: string[] = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
      'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
      'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
    onSubmit(): void {
      console.log(this.currentRating)
      console.log(this.review)
  
    this.review=''
    this.dataService.sendReview(this.selectedCounty,  this.currentRating,this.review )
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          this.router.navigate(['/home'], { state: response });
          // Handle the API response as needed
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  stars: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;

  rate(rating: number): void {
    if (this.currentRating === rating) {
      // If the same rating is clicked again, reset to 0
      this.currentRating = 0;
    } else {
      this.currentRating = rating;
    }
    console.log('User rating:', this.currentRating);
  }
  onStateChange(): void {
    if (this.selectedState) {
      this.dataService.getCountiesByState(this.selectedState).subscribe(
        (counties: County[]) => {
          this.counties = counties;
          console.log(this.counties)
        },
        (error) => {
          console.log('Error fetching counties:', error);
        }
      );
    } else {
      this.counties = [];
    }
  }
}
