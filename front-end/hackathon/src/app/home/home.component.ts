import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiServiceService } from '../api.service.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private dataService: ApiServiceService,private router: Router,private dataService2: DataService, private http: HttpClient) {}
  title = 'hackathon';
  selectedState: string = ''; // Will store the selected state
  parameter1: string = 'None'; // Will store the state of parameter 1
  parameter2: string = 'None'; // Will store the state of parameter 2
  parameter3: string = 'None'; // Will store the state of parameter 3
  


  // Array of US states for the dropdown
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  onSubmit() {
    // Implement any actions you want to take when the form is submitted
    console.log('Submitted Data:');
    console.log('Selected State:', this.selectedState);
    console.log('Parameter 1:', this.parameter1);
    console.log('Parameter 2:', this.parameter2);
    console.log('Parameter 3:', this.parameter3);


    this.dataService.sendData(this.selectedState, this.parameter1, this.parameter2, this.parameter3)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          this.dataService2.setApiResponse(response);
          this.router.navigate(['/dashboard', { data: (response) }]);
          // Handle the API response as needed
        },
        (error) => {
          console.error('Error:', error);
          // Handle any errors that occurred during the request
          this.router.navigate(['/dashboard']);
        }
      );
  }
}
