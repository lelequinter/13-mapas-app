import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [number, number] | undefined;

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert('No se puedo obtener la geo localización');
          console.log(err);
          reject();
        }
      )
    });
  }

  getPlacesByQuery(query: string = '') {
    //todo: evaluar cuando query es un string vacio

    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=co&proximity=-73.990593%2C40.740121&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoicmVkeWVsIiwiYSI6ImNsOXB1ZGhvZTA4OTUzb285N3lvanoxbXkifQ.d2hdFasT0j3tEIN_xDlt2Q`)
      .subscribe(res => {
        console.log(res.features);
        this.isLoadingPlaces = false;
        this.places = res.features;

      })

  }

}
