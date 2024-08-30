import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api/data';

  constructor(private http: HttpClient) { }

  // Method to load data from JSON file and send to backend
  sendDataFromFile(): Observable<any> {
    // Load the JSON file
    return this.http.get('assets/data.json').pipe(
      // Once data is loaded, make the POST request
      switchMap((data: any) => {
        const jsonData = JSON.stringify(data);
        const buffer = new TextEncoder().encode(jsonData);
        const compressedData = pako.gzip(buffer);

        const blob = new Blob([compressedData], { type: 'application/gzip' });
        const headers = new HttpHeaders({ 'Content-Type': 'application/octet-stream', 'Content-Encoding': 'gzip' });
        return this.http.post(this.apiUrl, blob, { headers });
      })
    );
  }
}
