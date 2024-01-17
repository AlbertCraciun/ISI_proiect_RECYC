import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import Search from "@arcgis/core/widgets/Search";
import Point from '@arcgis/core/geometry/Point';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import * as Route from '@arcgis/core/rest/route';
import Graphic from '@arcgis/core/Graphic';



import esri = __esri; // Esri TypeScript Types

import Config from '@arcgis/core/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-test-page',
  templateUrl: './map-test-page.component.html',
  styleUrls: ['./map-test-page.component.scss']
})
export class MapTestPageComponent implements OnInit, OnDestroy {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl!: ElementRef;

  constructor(private router: Router) {}

  // Instances
  map!: esri.Map;
  view!: esri.MapView;
  pointGraphic!: esri.Graphic;
  graphicsLayer!: esri.GraphicsLayer;


  // Attributes
  center: Array<number> = [26.1025, 44.4268]; // longitudine, latitudine
  zoom = 12;
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [-118.73682450024377, 34.07817583063242];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;

  async initializeMap() {
    try {

      // Configure the Map
      const mapProperties: esri.WebMapProperties = {
        basemap: this.basemap
      };

      Config.apiKey = "AAPK83da0fb54e404ae09644e66e7b1f1adcCnzLlYpldfHnxALVmCxQqYh3sKA1R2o8tjEglpeBFxb4VVRU3X9LnuyHpdwmEfJn";

      this.map = new WebMap(mapProperties);

      this.addFeatureLayers();
      this.addGraphicLayers();

      // this.addPoint(this.pointCoords[1], this.pointCoords[0], true);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);

      // Fires `pointer-move` event when user clicks on "Shift"
      // key and moves the pointer on the view.
      this.view.on('pointer-move', ["Shift"], (event) => {
        let point = this.view.toMap({ x: event.x, y: event.y });
        console.log("map moved: ", point.longitude, point.latitude);
      });

      await this.view.when(); // wait for map to load
      console.log("ArcGIS map loaded");
      console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
      return null; 
    }
  }

  async findRoute() {
    console.log("finding route");
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: [
          // // Wrap Points in Graphic objects
          // new Graphic({
          //   geometry: new Point({ longitude: 26.1025, latitude: 44.4268 })
          // }),
          // new Graphic({
          //   geometry: new Point({ longitude: 27.1025, latitude: 45.4268 })
          // })
          this.originPoint!, this.destinationPoint!
        ]
      }),
      returnDirections: true
    });
  
    try {
      const data = await Route.solve("https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", routeParams);
      
      if (data.routeResults.length > 0) {
        const routeResult = data.routeResults[0].route;
        this.graphicsLayer.add(routeResult);
        console.log("Route added to the map.");
      }
    } catch (error) {
      console.error("Error solving route: ", error);
    }
  }
  

  addGraphicLayers() {
    this.graphicsLayer = new GraphicsLayer();
    this.map.add(this.graphicsLayer);
  }

  addFeatureLayers() {
    // Trailheads feature layer (points)
    var trailheadsLayer: __esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
    });

    this.map.add(trailheadsLayer);

    // Trails feature layer (lines)
    var trailsLayer: __esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
    });

    this.map.add(trailsLayer, 0);

    // Parks and open spaces (polygons)
    var parksLayer: __esri.FeatureLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
    });

    this.map.add(parksLayer, 0);

    console.log("feature layers added");
  }

  removePoint() {
    if (this.pointGraphic != null) {
      this.graphicsLayer.remove(this.pointGraphic);
    }
  }

  navigateBack() {
    this.router.navigate(['/home']);
  }

  zoomIn() {
    this.view.zoom += 1;
  }

  zoomOut() {
    this.view.zoom -= 1;
  }

  searchWidget: Search | null = null;
  isSearchWidgetVisible: boolean = false;

  openSearch() {
    if (!this.searchWidget) {
      // Inițializează widgetul de căutare dacă nu există
      this.searchWidget = new Search({
        view: this.view,
        container: "searchWidgetContainer",
        allPlaceholder: "Caută locații sau adrese"
      });

      // Adăugarea widgetului de căutare la harta ArcGIS
      this.view.ui.add(this.searchWidget, {
        position: "top-right",
        index: 2
      });
    }

    if (this.isSearchWidgetVisible) {
      // Ascunde widgetul de căutare
      this.view.ui.remove(this.searchWidget);
    } else {
      // Afișează widgetul de căutare
      this.view.ui.add(this.searchWidget, "top-right");
    }

    // Schimbă starea vizibilității
    this.isSearchWidgetVisible = !this.isSearchWidgetVisible;
  }

  originPoint: esri.Graphic | null = null;
  destinationPoint: esri.Graphic | null = null;
  isRoutingMode = false;

  route() {
    if (this.isRoutingMode) {
      // Dezactivează modul routing și șterge punctele și ruta
      this.isRoutingMode = false;
      this.originPoint = null;
      this.destinationPoint = null;
      this.graphicsLayer.removeAll(); // Șterge toate graficele, inclusiv ruta
    } else {
      // Activează modul routing
      this.isRoutingMode = true;
    }
  }  

  handleMapClick(event: any) {
    if (this.isRoutingMode) {
      // Transformă coordonatele click-ului într-un punct
      const point = new Point({
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude
      });
      const graphic = new Graphic({
        geometry: point,
      });
  
      if (!this.originPoint) {
        // Setează punctul de origine
        this.originPoint = graphic;
        this.graphicsLayer.add(graphic);
      } else if (!this.destinationPoint) {
        // Setează punctul de destinație și găsește ruta
        this.destinationPoint = graphic;
        this.graphicsLayer.add(graphic);
        this.findRoute();
        this.isRoutingMode = false; // Dezactivează modul routing
      }
    }
  }
  

  currentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const coords = position.coords;
          const point = new Point({
            longitude: coords.longitude,
            latitude: coords.latitude
          });
  
          this.view.center = point;
          this.view.zoom = 15; // Setează nivelul de zoom dorit
        },
        err => {
          if (err.code === err.PERMISSION_DENIED) {
            console.error('Permisiunea de geolocație a fost blocată. Te rog să accesezi setările de permisiuni din browser pentru a activa geolocația.');
            // Aici poți adăuga logica pentru afișarea unui mesaj în interfața utilizatorului
            alert('Permisiunea de geolocație a fost blocată. Te rog să accesezi setările de permisiuni din browser pentru a activa geolocația.');
          } else {
            console.error('Eroare la obținerea locației: ', err);
          }
        }
      );
    } else {
      console.error('Geolocația nu este suportată de acest browser.');
    }
  }
  

  ngOnInit() {
    this.initializeMap().then(() => {
      this.loaded = this.view.ready;

      const layer1 = new FeatureLayer({
        portalItem: {
          id: "3672b9020ae0418280795b5bc801d3ab"
        }
      });
      
      this.map.add(layer1);

      const layer2 = new FeatureLayer({
        portalItem: {
          id: "855050beb3e8419ea41db0fc06b91cc4"
        }
      });
      
      this.map.add(layer2);

      const layer3 = new FeatureLayer({
        portalItem: {
          id: "3a05537b2657435d896c2ce73b9b16aa"
        }
      });
      
      this.map.add(layer3);
  
      // Ascultător pentru click-uri pe hartă
      this.view.on('click', (event) => {
        this.handleMapClick(event);
      });
    });
  }
  

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      // this.view.container = null;
    }
  }
}
