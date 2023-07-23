import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ApiServiceService } from '../api.service.service';
import { HttpClient } from '@angular/common/http';
import { County } from '../county.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  constructor(private dataService: ApiServiceService,private router: Router,private dataService2: DataService, private http: HttpClient) {}
  ngOnInit(): void{
    this.onStateChange();
  }
  parameter1: string = 'None'; 
  parameter2: string = 'None'; 
  parameter3: string = 'None';
  parameter4: string = 'None';
  details: string = '';
  level: string = '';
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

  onSubmit(){
    console.log('Selected State:', this.selectedCounty);
    this.dataService.sendAlert(this.selectedCounty,this.level, this.details)
    .subscribe(
      (response) => {
        console.log('API Response:', response);
        this.router.navigate(['/home']);
        // Handle the API response as needed
      },
      (error) => {
        console.error('Error:', error);
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
