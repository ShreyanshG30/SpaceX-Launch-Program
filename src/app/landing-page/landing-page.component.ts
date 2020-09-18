import { Component, OnInit } from '@angular/core';
import { LandingPageService } from './landing-page.service';
import { LaunchData } from './models/launchData';
import { Location } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [LandingPageComponent]
})
export class LandingPageComponent implements OnInit {

  public launchesList = [];
  public filtersArray = [
    {
      filterName: "Launch Year",
      selected: "",
      filterValues: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },
    {
      filterName: "Successful Launch",
      selected: "",
      filterValues: ['True', 'False']
    },
    {
      filterName: "Successful Landing",
      selected: "",
      filterValues: ['True', 'False']
    }
  ];

  constructor(private landingService: LandingPageService, private location: Location) { }

  ngOnInit() {
    this.getAllLaunchesList();
  }

  public getAllLaunchesList() {
    this.landingService.getAllLaunches().subscribe((resp: any) => {
      if (resp && resp.length > 0) {
        resp.forEach((launch: any) => {
          const launchObject = this.setupLaunchArray(launch);
          this.launchesList.push(launchObject);
        });
      }
    },
      (e) => {
        console.log(e);
      }
    )
  }

  public setupLaunchArray(launch: any) {
    let launchObject = new LaunchData();
    launchObject.missionName = launch.mission_name;
    launchObject.flightNumber = launch.flight_number;
    launchObject.successLaunch = launch.launch_success;
    launchObject.launchYear = launch.launch_year;
    launchObject.missionIds = launch.mission_id;
    launchObject.image = launch.links.mission_patch_small ? launch.links.mission_patch_small : launch.links.mission_patch ? launch.links.mission_patch : launch.links.flickr_images && launch.links.flickr_images.length > 0 ? launch.links.flickr_images[0] : '';
    return launchObject;
  }

  public filterClicked(filter, value) {
    const selectedFilter = this.filtersArray.find(f => f.filterName == filter);
    selectedFilter.selected = value;
    value = value.toLowerCase();
    let filterUrl = ''
    switch(filter) {
      case 'Launch Year': filterUrl = 'launch_year'; break;
      case 'Successful Launch': filterUrl = 'launch_scuccess'; break;
      case 'Successful Landing': filterUrl = 'land_scuccess'; break;
      default: break;
    }
    const reqObj = {
      filter: filterUrl,
      filterValue: value
    };
    this.landingService.getFilteredLaunches(reqObj).subscribe((resp: any) => {
      if (resp && resp.length > 0) {
        this.launchesList = [];
        this.location.replaceState(`/${filterUrl}_${value}`)
        resp.forEach((launch: any) => {
          const launchObject = this.setupLaunchArray(launch);
          this.launchesList.push(launchObject);
        });
      }
    },
      (e) => {
        console.log(e);
      }
    );
  }

}
