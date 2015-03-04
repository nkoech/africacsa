/**
 * Created by nkoech on 28/02/2015.
 */
var app = (function(){
    var households = {
        initMap: function(){

            //Get layer  token
            L.mapbox.accessToken = 'pk.eyJ1IjoiYWZyaWNhY3NhIiwiYSI6IjVqZGs5UW8ifQ.i8gT2b0XHC66u7WC_srvRw';

            //Set map options
            var map = L.mapbox.map('map', null, {
                maxZoom: 9,
                minZoom: 3
            }).setView([1.8047,25.000], 3);

            //Set layers
            var layers = {
                admin0: L.mapbox.tileLayer('africacsa.8451ad0f'),
                admin1: L.mapbox.tileLayer('africacsa.53abf605'),
                admin2: L.mapbox.tileLayer('africacsa.5893b9a7')
            };
            var grids = {
                admin0: L.mapbox.gridLayer('africacsa.8451ad0f'),
                admin1: L.mapbox.gridLayer('africacsa.53abf605'),
                admin2: L.mapbox.gridLayer('africacsa.5893b9a7')
            };
            var gridControls = {
                admin0: L.mapbox.gridControl(grids.admin0),
                admin1: L.mapbox.gridControl(grids.admin1),
                admin2: L.mapbox.gridControl(grids.admin2)
            };

            //Add initial layer, grid and controls to map
            layers.admin0.addTo(map);
            grids.admin0.addTo(map);
            gridControls.admin0.addTo(map);
            //var nprControl = L.mapbox.gridControl(grids.admin0).addTo(map);
            map.legendControl.addLegend(document.getElementById('admin0-legend').innerHTML);

            //Change layer and legend on certain zoom levels
            map.on('zoomend', function() {
                if(map.getZoom() >= 5 && map.getZoom() <= 7){
                    if (map.hasLayer(layers.admin0)) {
                        console.log(map);
                        //Remove admin0 layers and controls
                        map.legendControl.removeLegend(document.getElementById('admin0-legend').innerHTML);
                        map.removeLayer(layers.admin0);
                        map.removeControl(gridControls.admin0);
                        map.removeLayer(grids.admin0);

                        //Add admin1 layers and controls
                        layers.admin1.addTo(map);
                        map.legendControl.addLegend(document.getElementById('admin1-legend').innerHTML);
                        grids.admin1.addTo(map);
                        gridControls.admin1.addTo(map);
                    }
                    if (map.hasLayer(layers.admin2)) {
                        //Remove admin2 layers and controls
                        map.legendControl.removeLegend(document.getElementById('admin2-legend').innerHTML);
                        map.removeLayer(layers.admin2);
                        map.removeControl(gridControls.admin2);
                        map.removeLayer(grids.admin2);

                        //Add admin1 layers and controls
                        layers.admin1.addTo(map);
                        map.legendControl.addLegend(document.getElementById('admin1-legend').innerHTML);
                        grids.admin1.addTo(map);
                        gridControls.admin1.addTo(map);
                    }
                } else if (map.getZoom() >= 8){
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        map.legendControl.removeLegend(document.getElementById('admin1-legend').innerHTML);
                        map.removeLayer(layers.admin1);
                        map.removeControl(gridControls.admin1);
                        map.removeLayer(grids.admin1);

                        //Add admin2 layers and controls
                        layers.admin2.addTo(map);
                        map.legendControl.addLegend(document.getElementById('admin2-legend').innerHTML);
                        grids.admin2.addTo(map);
                        gridControls.admin2.addTo(map);
                    }
                }else{
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        map.legendControl.removeLegend(document.getElementById('admin1-legend').innerHTML);
                        map.removeLayer(layers.admin1);
                        map.removeControl(gridControls.admin1);
                        map.removeLayer(grids.admin1);

                        //Add admin0 layers and controls
                        layers.admin0.addTo(map);
                        map.legendControl.addLegend(document.getElementById('admin0-legend').innerHTML);
                        grids.admin0.addTo(map);
                        gridControls.admin0.addTo(map);
                    }
                }
            });
        }
    };

    return households;
})();

app.initMap();