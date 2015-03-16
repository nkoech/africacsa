/**
 * Created by nkoech on 28/02/2015.
 */

var app = (function(){
    var households = {

        initMap: function() {

            //Get layer  token
            L.mapbox.accessToken = 'pk.eyJ1IjoiYWZyaWNhY3NhIiwiYSI6IjVqZGs5UW8ifQ.i8gT2b0XHC66u7WC_srvRw';

            //Set map options
            map = L.mapbox.map('map', null, {
                maxZoom: 9,
                minZoom: 3
            }).setView([1.8047,25.000], 3);
        },

        getMapComponent: function() {

            //Set layers
            layers = {
                admin0: L.mapbox.tileLayer('africacsa.8451ad0f'),
                admin1: L.mapbox.tileLayer('africacsa.53abf605'),
                admin2: L.mapbox.tileLayer('africacsa.5893b9a7')
            };
            grids = {
                admin0: L.mapbox.gridLayer('africacsa.8451ad0f'),
                admin1: L.mapbox.gridLayer('africacsa.53abf605'),
                admin2: L.mapbox.gridLayer('africacsa.5893b9a7')
            };
            gridControls = {
                admin0: L.mapbox.gridControl(grids.admin0),
                admin1: L.mapbox.gridControl(grids.admin1),
                admin2: L.mapbox.gridControl(grids.admin2)
            };
        },

        mapComponent: function() {
            var legendAdmin0 = "admin0-legend";
            var legendAdmin2 = "admin2-legend";
            var legendAdmin1 = "admin1-legend";

            //Add initial layer, grid and controls to map
            layers.admin0.addTo(map);
            grids.admin0.addTo(map);
            gridControls.admin0.addTo(map);
            map.legendControl.addLegend(document.getElementById('admin0-legend').innerHTML);

            //Change layer and legend on certain zoom levels
            map.on('zoomend', function() {
                if(map.getZoom() >= 5 && map.getZoom() <= 7){
                    if (map.hasLayer(layers.admin0)) {
                        //Remove admin0 layers and controls
                        households.removeMapComponent(legendAdmin0,layers.admin0,gridControls.admin0,grids.admin0);
                        //Add admin1 layers and controls
                        households.addMapComponent(layers.admin1,legendAdmin1,grids.admin1,gridControls.admin1);
                    }
                    if (map.hasLayer(layers.admin2)) {
                        //Remove admin2 layers and controls
                        households.removeMapComponent(legendAdmin2,layers.admin2,gridControls.admin2,grids.admin2);
                        //Add admin1 layers and controls
                        households.addMapComponent(layers.admin1,legendAdmin1,grids.admin1,gridControls.admin1);
                    }
                } else if (map.getZoom() >= 8){
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        households.removeMapComponent(legendAdmin1,layers.admin1,gridControls.admin1,grids.admin1);
                        //Add admin2 layers and controls
                        households.addMapComponent(layers.admin2,legendAdmin2,grids.admin2,gridControls.admin2);
                    }
                }else{
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        households.removeMapComponent(legendAdmin1,layers.admin1,gridControls.admin1,grids.admin1);
                        //Add admin0 layers and controls
                        households.addMapComponent(layers.admin0,legendAdmin0,grids.admin0,gridControls.admin0);
                    }
                }
            });
        },

        removeMapComponent: function(legend,layer,gridControl,grid){

            map.legendControl.removeLegend(document.getElementById(legend).innerHTML);
            map.removeLayer(layer);
            map.removeControl(gridControl);
            map.removeLayer(grid);
        },

        addMapComponent: function(layer,legend,grid,gridControl){
            layer.addTo(map);
            map.legendControl.addLegend(document.getElementById(legend).innerHTML);
            grid.addTo(map);
            gridControl.addTo(map);
        }
    };

    return households;
})();

app.initMap();
app.getMapComponent();
app.mapComponent();