import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-county-details',
  templateUrl: './county-details.component.html',
  styleUrls: ['./county-details.component.css']
})
export class CountyDetailsComponent {
  countyId: number | undefined;
  countyData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    // Get the countyId parameter from the route
    this.route.params.subscribe(async params => {
      console.log(params)
      this.countyId = params['countyId']; // Convert the parameter to a number (if needed)
      // Make the API call with the countyId
      await this.fetchCountyDetails();
      console.log(this.countyData);
    });
  }

  async fetchCountyDetails(): Promise<void> {
    // Replace 'your-api-endpoint' with your actual API endpoint
    const data = await this.http.get<any>('http://127.0.0.1:5000/county/' + this.countyId).toPromise();
    console.log(data);
    this.countyData = data;
  }
}