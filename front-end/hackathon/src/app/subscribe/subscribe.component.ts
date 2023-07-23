import { Component } from '@angular/core';
import { ApiServiceService } from '../api.service.service';
import { Router } from '@angular/router';
import { County } from '../county.model';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent {

  county: string = '';
  name:string='';
  email: string='';
  selectedState: string = '';
  counties: County[] = [];
  selectedCounty: string='';

      // Array of US states for the dropdown
      states: string[] = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
        'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
        'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ];

  constructor(private dataService: ApiServiceService,private router: Router) {}
  
  ngOnInit(): void{
    this.onStateChange();
  }

  onSubmit(){
    console.log('Submitted Data:');
    console.log('Selected County:', this.selectedCounty);
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    this.dataService.sendSubscriptionData(this.selectedCounty, this.name, this.email)
    .subscribe(
      (response) => {
        console.log('API Response:', response);
        this.router.navigate(['/home', { data: (response) }]);
        // Handle the API response as needed
      },
      (error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the request
        this.router.navigate(['/dashboard']);
      }
    );
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
