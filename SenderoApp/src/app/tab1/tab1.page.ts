import { Component} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  map: L.Map;
  propertyList = [];

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    this.map = new L.Map('mapId').setView([38.38229, -0.50837], 10);

    //distintos mapas que podemos visualizar
    var orto = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri &mdash '+'- Luis (UPUA)'}).addTo(this.map);
      
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' + '- Luis (UPUA)',
    });

    var Mapa = L.tileLayer.wms('http://www.ign.es/wms-inspire/mapa-raster', {
      layers: 'mtn_rasterizado',
      format: 'image/png',	
      //continuousWorld : true,    (este parametro no se puede asignar, da un error)
      maxZoom: 18,
      attribution: '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">IGN España</a> '+ '- Luis (UPUA)'});

    var baseLayers = {		
      "<span style='color: green'>Imagen</span>": orto,
      "<span style='color: red'>Mapa</span>": osm,
      "<span style='color: brown'>Topográfico</span>": Mapa
    };

    //asignacion de mapas
    L.control.layers(baseLayers).addTo(this.map);

    //localizacion GPS
    L.control.locate().addTo(this.map);

    fetch('./assets/data/data1.json')
      .then(res => res.json())
      .then(data => {        
        this.propertyList = data.properties,data.coordinates;

        this.Puntos();
      }).catch(err => console.error(err));

  }

  Puntos() {
    for (const property of this.propertyList) {
      L.marker(property.coordinates).addTo(this.map)
        .bindTooltip("<b>"+property.city,{permanent:true});
    }         
  } 

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

}


