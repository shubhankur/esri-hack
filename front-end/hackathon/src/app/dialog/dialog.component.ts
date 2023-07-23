import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ApiServiceService } from '../api.service.service';

export interface County {
  // Define your table data structure based on the API response
  // For example:
  alert: string;

}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {
  constructor(private dataService: ApiServiceService,private route: ActivatedRoute,private router: Router,private dataService2: DataService, private http: HttpClient) {}
data: any[]=[]

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const countyId = params['countyId']; // The '+' sign converts the parameter to a number
  
      // Call the API service to fetch county details based on the countyId
      this.dataService.getCountyDetails(countyId).subscribe(
        (response) => {
          // Handle the API response data here, for example, store it in a variable
          console.log('County Details:', response);
          this.data=response

        },
        (error) => {
          console.error('Error fetching County Details:', error);
        }
      );
    });
  }
}
