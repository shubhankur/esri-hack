import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { County } from './county.model';
import { FormData } from './form-data.model';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }


  sendData(state: string, parameter1: string, parameter2: string, parameter3: string) {
    const params = { state: state };
    const data = { first: parameter1, second: parameter2, third: parameter3 };

    return this.http.post(this.apiUrl + "/suitability", data, { params: params }).pipe(
      tap((response: any) => {
        console.log("API Response:", response);
      })
    );
  }
  getCountiesByState(state: string): Observable<County[]> {
    const url = this.apiUrl+"/getAllCounties/"+state;
    console.log(url);
    return this.http.get<County[]>(url);
  }

  sendReview(county: string, rating:number, review:string): Observable<any> {
    const params = { county: county };
    const data = { rating:rating, review:review };
    return this.http.post<any>(this.apiUrl+"/review", data, { params: params } );
  }
  fetchData(){
    return 
  }
  sendAlert(county: string,level: string, details: string){
    const params = { county: county };
    const data = { level: level, details: details};

    return this.http.post(this.apiUrl + "/alert", data, { params: params }).pipe(
      tap((response: any) => {
        console.log("API Response:", response);
      })
    );
  }
  getCountyDetails(countyId: number) {
    return this.http.get<any>(`${this.apiUrl}/${countyId}`);
  }

  sendSubscriptionData(county: string, name: string, email: string,){
    const params = { county: county };
    const data = { name: name, email: email};

    return this.http.post(this.apiUrl + "/subscribe", data, { params: params }).pipe(
      tap((response: any) => {
        console.log("API Response:", response);
      })
    );
  }
}
