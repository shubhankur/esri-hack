import { Injectable } from '@angular/core';

interface ApiResponse {
  // Define the structure of your API response objects here
  county: string;
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiResponseData: any[] = [];

  constructor() { }

  setApiResponse(data: any[]): void {
    this.apiResponseData = data;
  }

  getApiResponse(): any[] {
    return this.apiResponseData;
  }
}