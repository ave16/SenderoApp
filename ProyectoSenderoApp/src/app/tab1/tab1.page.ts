import { Component} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';

//Posición y Dirección para el marker (datos en carpeta angular.json)
const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';
const iconDefault = L.icon({
iconRetinaUrl,
iconUrl,
shadowUrl,
iconSize: [26, 41],
iconAnchor: [13, 41],
popupAnchor: [1, -34],
tooltipAnchor: [16, -28],
shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

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

    //ABRIR geojson (linea)
    fetch('./assets/data/ruta_l.json')
      .then(response => {     
     return response.json();
  })
      .then(data => {
        var Ruta =L.geoJSON(data, {
          style: function (feature) {
            return{
            color: " #ff0000 ",
            weight: 5,
            opacity:1
          };
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip ("Nombre: "+feature.properties.N+"<br>Longitud: "+feature.properties.L, {permanent:true, opacity:0.6});
        }
        }).addTo(this.map)
        this.map.fitBounds(Ruta.getBounds());
        //this.map.flyToBounds(Ruta.getBounds(), {'duration':3});
      });

      //ABRIR geojson (puntos)
    fetch('./assets/data/ruta_p.json')
    .then(response => {     
    return response.json();
  })
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindTooltip ("<b>"+feature.properties.NAME, {permanent:true});
      },
      pointToLayer: function(feature, latlng) {
    
        return L.marker(latlng, { });     
           }
         }).addTo(this.map);	
       }); 

  //.catch(error => console.error(error));
  }
  
  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

}


