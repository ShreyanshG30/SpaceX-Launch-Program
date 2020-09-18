import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LandingPageService {

    public lastUrl = '';
    public baseUrl = 'https://api.spacexdata.com/v3/launches?limit=100';

    constructor(private http: HttpClient) { }

    getAllLaunches() {
        return this.http.get(this.baseUrl);
    }

    getFilteredLaunches(reqParams: any) {
        const base = this.lastUrl.length == 0 ? this.baseUrl : this.lastUrl;
        const currentParams = reqParams.filter + '=' + reqParams.filterValue;
        const updatedBase = base + '&' + currentParams;
        this.lastUrl = reqParams.filter != 'launch_year' ? updatedBase : '';
        return this.http.get(updatedBase);
    }
}