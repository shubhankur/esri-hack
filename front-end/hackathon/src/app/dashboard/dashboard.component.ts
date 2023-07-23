import { Component, OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';
import { ApiServiceService } from '../api.service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

export interface TableData {
  // Define your table data structure based on the API response
  // For example:
  county: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  data: any;
  dataSource: any[] = [];
  displayedColumns: string[] = ['name'];
  dialog: any;
  list: TableData[] = [];

  constructor(private dataService: ApiServiceService,private router: Router, private route: ActivatedRoute,private dataService1: DataService) {}
  
  ngOnInit(): void {
    // Load ArcGIS modules and create the map when the component is initialized
    this.initMap();
    // Get the data from the route state
    this.dataSource = this.dataService1.getApiResponse();
    this.dataSource.forEach(item=> {
      this.list.push(item.FIPS);
    });
  }

  openCountyDetails(countyId: string): void {
    this.router.navigate(['/county-details', countyId]);
  }
  async initMap() {
    try {
      // Load the required ArcGIS modules
      const [esriConfig, Map, MapView, FeatureLayer, SimpleRenderer] = await loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/renderers/SimpleRenderer'
      ]);

      // Set your ArcGIS API key here
      esriConfig.apiKey = 'AAPKee661b1c5b7c4f2e92c3bf150d54e342lxm6G6GbIGVB9mMkhbtR_8OtaRXXalnC2h8dK3schLaPKW7cZvRZYj40veOlSdve';

      // Create the map
      const map = new Map({
        basemap: 'arcgis-topographic' // Basemap layer service
      });

      // Create the map view
      const view = new MapView({
        map: map,
        center: [-117.3755, 33.9806], // Los Angeles coordinates
        zoom: 5, // Zoom level
        container: 'viewDiv' // Div element
      });

      // Create a polygon feature layer to show selected counties
      const fipsList = this.list; // List of FIPS codes for Los Angeles, Orange, and Riverside counties
      const fipsExpression = fipsList.map(fips => "FIPS = '" + fips + "'").join(' OR ');

      const featureLayer = new FeatureLayer({
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0',
        // Replace with the URL to your feature layer service representing the counties
        definitionExpression: fipsExpression,
        renderer: new SimpleRenderer({
          symbol: {
            type: 'simple-fill',
            color: [48, 63, 159, 0.6], // Red color with 50% transparency
            outline: {
              color: "#9FA8DA", // Black outline with 80% transparency
              width: 1
            }
          }
        })
      });

      // Add the feature layer to the map
      map.add(featureLayer);

    } catch (error) {
      console.error('Error loading ArcGIS modules:', error);
    }
  }
}