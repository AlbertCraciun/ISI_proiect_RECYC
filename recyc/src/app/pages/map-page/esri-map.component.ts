import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy
  } from "@angular/core";
  
  import esri = __esri; // Esri TypeScript Types
  
  import { Subscription } from "rxjs";
  import { FirebaseService, ITestItem } from "src/app/services/database/firebase";
  import { FirebaseMockService } from "src/app/services/database/firebase-mock";
  
  import Config from '@arcgis/core/config';
  import WebMap from '@arcgis/core/WebMap';
  import MapView from '@arcgis/core/views/MapView';
  
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
  import Graphic from '@arcgis/core/Graphic';
  import Point from '@arcgis/core/geometry/Point';
  
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { IRecyclePoint } from "src/app/services/database/firebase.service";
  
  @Component({
    selector: "app-esri-map",
    templateUrl: "./esri-map.component.html",
    styleUrls: ["./esri-map.component.scss"]
  })
  export class EsriMapComponent implements OnInit, OnDestroy {
    // The <div> where we will place the map
    @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  
    // Instances
    map: esri.Map;
    view: esri.MapView;
    pointGraphic: esri.Graphic;
    graphicsLayer: esri.GraphicsLayer;
  
    // Attributes
    zoom = 10;
    center: Array<number> = [-118.73682450024377, 34.07817583063242];
    basemap = "streets-vector";
    loaded = false;
    pointCoords: number[] = [-118.73682450024377, 34.07817583063242];
    dir: number = 0;
    count: number = 0;
    timeoutHandler = null;
  
    // firebase sync
    isConnected: boolean = false;
    subscriptionList: Subscription;
    subscriptionObj: Subscription;
  
    constructor(
      private fbs: FirebaseService
      // private fbs: FirebaseMockService
    ) { }
  
    async initializeMap() {
      try {
  
        // Configure the Map
        const mapProperties: esri.WebMapProperties = {
          basemap: this.basemap
        };
  
        Config.apiKey = "";
  
        this.map = new WebMap(mapProperties);
  
        this.addFeatureLayers();
        this.addGraphicLayers();
  
        this.addPoint(this.pointCoords[1], this.pointCoords[0], true);
  
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

    connectFirebase() {
        if (this.isConnected) {
          return;
        }
        this.isConnected = true;
        this.fbs.connectToDatabase();
        this.subscriptionList = this.fbs.getRecyclePointsFeed().subscribe((points: IRecyclePoint[]) => {
          console.log("got new recycle points: ", points);
          this.graphicsLayer.removeAll();
          for (let point of points) {
            // Utilizarea structurii IRecyclePoint pentru a adăuga puncte
            this.addPoint(point.lat, point.lng, point.addedBy, point.dateAdded, point.pointType, point.acceptedMaterials, false);
          }
        });
    }
  
    addPointItem() {
        console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);
        const newPoint: IRecyclePoint = {
            lat: this.view.center.latitude,
            lng: this.view.center.longitude,
            addedBy: "username", // Trebuie să fie înlocuit cu numele de utilizator real
            dateAdded: new Date().toISOString(),
            pointType: "recycling", // sau "collection", în funcție de context
            acceptedMaterials: {
                metal: true,
                glass: false,
                paper: true,
                plastic: false,
                batteries: false,
                electronics: false,
                oil: false,
                others: false
            }
        };
        this.fbs.addRecyclePoint(newPoint);
      }
  
    disconnectFirebase() {
      if (this.subscriptionList != null) {
        this.subscriptionList.unsubscribe();
      }
      if (this.subscriptionObj != null) {
        this.subscriptionObj.unsubscribe();
      }
    }
  
    ngOnInit() {
      // Initialize MapView and return an instance of MapView
      console.log("initializing map");
      this.initializeMap().then(() => {
        // The map has been initialized
        console.log("mapView ready: ", this.view.ready);
        this.loaded = this.view.ready;
      });
    }
  
    ngOnDestroy() {
      if (this.view) {
        // destroy the map view
        this.view.container = null;
      }
      this.disconnectFirebase();
    }
  }
  