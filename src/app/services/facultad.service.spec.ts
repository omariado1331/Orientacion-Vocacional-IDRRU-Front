// facultad.service.spec.ts - Pruebas unitarias para el servicio de facultades
import { TestBed, fakeAsync, tick } from '@angular/core/testing'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { FacultadService } from './facultad.service';
import { Facultad } from '../interfaces/facultad.interface';

describe('FacultadService', () => {
  let service: FacultadService;
  let httpTestingController: HttpTestingController;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;
  let removeItemSpy: jasmine.Spy;
  let clearSpy: jasmine.Spy;

  beforeEach(() => {
    // Configurar espías para localStorage
    getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null); 
    setItemSpy = spyOn(localStorage, 'setItem').and.callThrough(); 
    removeItemSpy = spyOn(localStorage, 'removeItem').and.callThrough();
    clearSpy = spyOn(localStorage, 'clear').and.callThrough();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FacultadService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(FacultadService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Reiniciar contadores de llamadas
    getItemSpy.calls.reset();
    setItemSpy.calls.reset();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve facultades from the API', fakeAsync(() => {
    const dummyFacultades: Facultad[] = [
      { codigo: 'F001', nombre: 'Facultad 1', carreras: ['Carrera A', 'Carrera B'], active: true },
      { codigo: 'F002', nombre: 'Facultad 2', carreras: ['Carrera C'], active: true }
    ];

    service.cargarFacultades().subscribe(facultades => {
      expect(facultades.length).toBe(2);
      expect(facultades).toEqual(dummyFacultades);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/facultad');
    expect(req.request.method).toBe('GET');
    req.flush(dummyFacultades);

    tick();

    // Verificar que se guardó en caché
    expect(setItemSpy).toHaveBeenCalled();
    expect(setItemSpy.calls.first().args[0]).toBe('facultades_cache');
    const cachedData = JSON.parse(setItemSpy.calls.first().args[1]);
    expect(cachedData.data).toEqual(dummyFacultades);
    expect(cachedData.timestamp).toEqual(jasmine.any(Number));
    expect(cachedData.timestamp).toBeCloseTo(new Date().getTime(), -100);
  }));

  it('should load facultades from cache if available and not expired', fakeAsync(() => {
    const cachedFacultades: Facultad[] = [
      { codigo: 'F001', nombre: 'Cached Facultad 1', carreras: ['Cached Carrera X'], active: true }
    ];
    const now = new Date().getTime();
    const cachedItem = JSON.stringify({ data: cachedFacultades, timestamp: now - 10000 }); 

    getItemSpy.and.returnValue(cachedItem);

    let loadedFacultades: Facultad[] = [];
    service.facultades$.subscribe(facs => loadedFacultades = facs);

    tick(); 

    expect(loadedFacultades).toEqual(cachedFacultades);
    expect(getItemSpy).toHaveBeenCalledWith('facultades_cache');

    // Resetear y cargar nuevos datos de API
    getItemSpy.calls.reset();
    const apiFacultades: Facultad[] = [
      { codigo: 'F003', nombre: 'New Facultad 3', carreras: ['New Carrera Y'], active: true }
    ];
    
    service.cargarFacultades().subscribe(facs => {
      expect(facs).toEqual(apiFacultades);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/facultad');
    req.flush(apiFacultades);

    tick();
    expect(loadedFacultades).toEqual(apiFacultades);
    expect(setItemSpy).toHaveBeenCalled();
  }));

  it('should fetch careers for a given faculty', fakeAsync(() => {
    const codigoFacultad = 'F001';
    const dummyCarreras: string[] = ['Carrera A', 'Carrera B'];

    service.getCarrerasByFacultad(codigoFacultad).subscribe(carreras => {
      expect(carreras).toEqual(dummyCarreras);
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/facultad/${codigoFacultad}/carrera`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCarreras);

    tick();
  }));

  it('should handle errors when loading facultades from the API and return empty array if no cache', fakeAsync(() => {
    getItemSpy.and.returnValue(null);

    service.cargarFacultades().subscribe(facultades => {
      expect(facultades).toEqual([]);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/facultad');
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });

    tick();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).not.toHaveBeenCalled();
  }));

  it('should handle errors when loading facultades from the API and return cache if available', fakeAsync(() => {
    const cachedFacultades: Facultad[] = [
      { codigo: 'F001', nombre: 'Cached Facultad 1', carreras: ['Cached Carrera X'], active: true }
    ];
    const now = new Date().getTime();
    const cachedItem = JSON.stringify({ data: cachedFacultades, timestamp: now - 10000 });

    getItemSpy.and.returnValue(cachedItem);

    let loadedFacultades: Facultad[] = [];
    service.facultades$.subscribe(facs => loadedFacultades = facs);

    tick();
    getItemSpy.calls.reset();

    service.cargarFacultades().subscribe(facultades => {
      expect(facultades).toEqual(cachedFacultades);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/facultad');
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });

    tick();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).not.toHaveBeenCalled();
  }));

  it('should handle errors when fetching careers and return an empty array', fakeAsync(() => {
    const codigoFacultad = 'F999';

    service.getCarrerasByFacultad(codigoFacultad).subscribe(carreras => {
      expect(carreras).toEqual([]);
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/facultad/${codigoFacultad}/carrera`);
    req.error(new ErrorEvent('Not Found error'), { status: 404, statusText: 'Not Found' });

    tick();
  }));

  it('should not use localStorage in server environment', () => {
    TestBed.resetTestingModule();

    const localStorageGetSpy = spyOn(localStorage, 'getItem');
    const localStorageSetSpy = spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FacultadService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverService = TestBed.inject(FacultadService);
    const serverHttp = TestBed.inject(HttpTestingController);

    serverService.cargarFacultades().subscribe(() => {});

    const req = serverHttp.expectOne('http://localhost:8080/facultad');
    req.flush([]);

    expect(localStorageGetSpy).not.toHaveBeenCalled();
    expect(localStorageSetSpy).not.toHaveBeenCalled();

    serverHttp.verify();
  });
});