// municipio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Municipio {
    id_municipio: number;
    nombre: string;
    id_provincia: number;
}

@Injectable({
    providedIn: 'root'
})
export class MunicipioService {
    private apiUrl = 'http://localhost:8080/municipio';

    constructor(private http: HttpClient) { }
    getAll(): Observable<Municipio[]> {
        return this.http.get<Municipio[]>(`${this.apiUrl}`);
    }


    getById(id: number): Observable<Municipio> {
        return this.http.get<Municipio>(`${this.apiUrl}/${id}`);
    }
}