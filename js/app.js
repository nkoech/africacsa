/**
 * Created by nkoech on 28/02/2015.
 */

var app = (function(){
    var households = {

        initMap: function() {

            //Get layer  token
            L.mapbox.accessToken = 'pk.eyJ1IjoiYWZyaWNhY3NhIiwiYSI6InBSaTNVbXMifQ.Hzv8HZqod9eP4QX2joeQBg';

            //Set map options
            map = L.mapbox.map('map', null, {
                maxZoom: 9,
                minZoom: 3
            }).setView([5.7909,22.5], 3);
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

        resizeMapCanvasHeight: function(){
            $(window).on("resize", function() {
                // Get browser window height and  assign it to map canvas
                $(".map-canvas").height($(window).height());
                map.invalidateSize();
            }).trigger("resize");
        },

        mapComponent: function() {
            // Admin0 map tooltip template
            var admin0Template = "<p><span style=\"font-size: 20px;\">{{ADM0_NAME}}</span><hr noshade>{{#C_RURALPOP}}<span style=\"font-size:14px;\"><strong>Total Rural Population: </strong></span>{{C_RURALPOP}}<br>{{/C_RURALPOP}}{{#C_NoHSEHLD}}<span style=\"font-size:14px;\"><strong>Total Farming Households: </strong></span>{{C_NoHSEHLD}}<br>{{/C_NoHSEHLD}}<small style=\"color:#336699\">Click map for Emission Scenarios ....</small></p>";

            //Add initial layer, grid, controls and map tooltip template to map
            layers.admin0.addTo(map);
            grids.admin0.addTo(map);
            households.showMapEmissionsScenarioOnClick(grids.admin0); //Show emission scenario for  admin 0
            gridControls.admin0.addTo(map);
            gridControls.admin0.setTemplate(admin0Template);
            map.legendControl.addLegend($('#admin0-legend')[0].innerHTML); //get the html legend
            //Map events
            households.mapComponentEvent(admin0Template);
        },

        mapComponentEvent: function(admin0Template){
            var legendAdmin0 = "admin0-legend";
            var legendAdmin2 = "admin2-legend";
            var legendAdmin1 = "admin1-legend";
            //Admin0 and admin1 map tooltip templates
            var admin1Template = "<p><span style=\"font-size:20px\">{{ADM0_NAME}}</span><hr noshade> {{#ADM1_NAME}}<span style=\"font-size:14px;\"><strong>Region: </strong></span>{{ADM1_NAME}}<br>{{/ADM1_NAME}}{{#C_RURALPOP}}<span style=\"font-size:14px;\"><strong>Total Rural Population: </strong></span>{{C_RURALPOP}}<br>{{/C_RURALPOP}}{{#C_NoHSEHLD}}<span style=\"font-size:14px;\"><strong>Total Farming Households: </strong></span>{{C_NoHSEHLD}}<br>{{/C_NoHSEHLD}}<small style=\"color:#336699\">Click map for Emission Scenarios ....</small></p>";
            var admin2Template = "<p><span style=\"font-size:20px\">{{ADM0_NAME}}</span><hr noshade>{{#ADM2_NAME}}<span style=\"font-size:14px;\"><strong>Region: </strong></span>{{ADM2_NAME}}<br>{{/ADM2_NAME}}{{#C_RURALPOP}}<span style=\"font-size:14px;\"><strong>Total Rural Population: </strong></span>{{C_RURALPOP}}<br>{{/C_RURALPOP}}{{#C_NoHSEHLD}}<span style=\"font-size:14px;\"><strong>Total Farming Households: </strong></span>{{C_NoHSEHLD}}<br>{{/C_NoHSEHLD}}<small style=\"color:#336699\">Click map for Emission Scenarios ....</small></p>";

            //Change layer, legend and emission scenarios on certain zoom levels and a click on the map
            map.on('zoomend', function() {
                if(map.getZoom() >= 5 && map.getZoom() <= 7){
                    if (map.hasLayer(layers.admin0)) {
                        //Remove admin0 layers and controls
                        households.removeMapComponent(legendAdmin0,layers.admin0,gridControls.admin0,grids.admin0);
                        //Add admin1 layers, controls map tooltip template
                        households.addMapComponent(layers.admin1,legendAdmin1,grids.admin1,gridControls.admin1,admin1Template);
                    }
                    if (map.hasLayer(layers.admin2)) {
                        //Remove admin2 layers and controls
                        households.removeMapComponent(legendAdmin2,layers.admin2,gridControls.admin2,grids.admin2);
                        //Add admin1 layers, controls map tooltip template
                        households.addMapComponent(layers.admin1,legendAdmin1,grids.admin1,gridControls.admin1,admin1Template);
                    }
                    households.showMapEmissionsScenarioOnClick(grids.admin1); //Show emission scenario
                } else if (map.getZoom() >= 8){
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        households.removeMapComponent(legendAdmin1,layers.admin1,gridControls.admin1,grids.admin1);
                        //Add admin2 layers, controls map tooltip template
                        households.addMapComponent(layers.admin2,legendAdmin2,grids.admin2,gridControls.admin2,admin2Template);
                    }
                    households.showMapEmissionsScenarioOnClick(grids.admin2); //Show emission scenario
                }else{
                    if (map.hasLayer(layers.admin1)) {
                        //Remove admin1 layers and controls
                        households.removeMapComponent(legendAdmin1,layers.admin1,gridControls.admin1,grids.admin1);
                        //Add admin0 layers, controls map tooltip template
                        households.addMapComponent(layers.admin0,legendAdmin0,grids.admin0,gridControls.admin0,admin0Template);
                    }
                    households.showMapEmissionsScenarioOnClick(grids.admin0); //Show emission scenario
                }
            });

            map.on('click', function() {
                households.mapEventRemoveControl(); //remove grid control
            });

            map.on('mouseout', function() {
                households.mapEventRemoveControl(); //remove grid control
            });

            map.on('mousemove', function() {
                //Add grid control to show map tooltip
                if ($(".map-tooltip-content").length == 1){
                    if (map.hasLayer(layers.admin0)) {
                        gridControls.admin0.addTo(map);
                    }else if (map.hasLayer(layers.admin1)){
                        gridControls.admin1.addTo(map);
                    }else{
                        gridControls.admin2.addTo(map);
                    }
                }
            });
        },

        mapEventRemoveControl: function(){
            //Remove grid control to hide map tooltip
            if ($(".map-tooltip-content").length == 2){
                if (map.hasLayer(layers.admin0)) {
                    map.removeControl(gridControls.admin0);
                }else if (map.hasLayer(layers.admin1)){
                    map.removeControl(gridControls.admin1);
                }else{
                    map.removeControl(gridControls.admin2);
                }
            }
        },

        removeMapComponent: function(legend,layer,gridControl,grid){
            map.legendControl.removeLegend(document.getElementById(legend).innerHTML); //Remove html legend
            map.removeLayer(layer);
            map.removeControl(gridControl);
            map.removeLayer(grid);
        },

        addMapComponent: function(layer,legend,grid,gridControl,mapTooltipTemplate){
            layer.addTo(map);
            map.legendControl.addLegend(document.getElementById(legend).innerHTML); //Add html legend
            grid.addTo(map);
            gridControl.addTo(map);
            gridControl.setTemplate(mapTooltipTemplate);
        },

        showMapEmissionsScenarioOnClick: function(gridMapLayer){
            gridMapLayer.on('click', function (e) {
                var mapData = e.data; // get grid layer data
                var tabPaneHtml = "";
                if (mapData) {
                    $('#mapTab a[href="#map-rcp-tab"]').tab('show'); //show tab panel
                    $(".map-rcp-title-bg,.map-rcp-body,.tab-pane-rcp p, br").remove(); //remove p and  br elements
                    households.showMapEmissionsScenarioTitle(mapData); //show emission titles
                    var tabPaneHtmlScenario85 =  households.showMapEmissionsScenario(mapData, "8_", "8.5"); //show emission scenario 8.5
                    var tabPaneHtmlScenario45 =  households.showMapEmissionsScenario(mapData, "4_", "4.5"); //show emission scenario 4.5
                    //Add source to tab panel html"
                    tabPaneHtml = '<div class="map-rcp-body">' + tabPaneHtmlScenario85 + tabPaneHtmlScenario45 + '<div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div>';
                    $('.tab-pane-rcp').append(tabPaneHtml);
                }
            });
        },

        showMapEmissionsScenarioTitle: function(mapData){
            var tabPaneHtml = "";
            //Create tab panel html
            if (mapData.ADM0_NAME !== undefined){
                tabPaneHtml = '<div class="map-rcp-title-bg"><p class="map-rcp-country-title">' + mapData.ADM0_NAME + '</p>';
            }else{
                tabPaneHtml = '<div class="map-rcp-title-bg"><p class="map-rcp-country-title"> No Record </p>';
            }
            if (mapData.ADM1_NAME !== undefined){
                tabPaneHtml += '<p class="map-rcp-region-title"> Region: ' + mapData.ADM1_NAME + '</p></div>';
            }
            else if (mapData.ADM2_NAME !== undefined){
                tabPaneHtml += '<p class="map-rcp-region-title"> Region: ' + mapData.ADM2_NAME + '</p></div>';
            }else{
                tabPaneHtml += '<p class="map-rcp-region-title"> Region: No Record </p></div>';
            }
            $('.tab-pane-rcp').append(tabPaneHtml);
        },

        showMapEmissionsScenario: function(mapData, searchRcp, rcpCategory){
            var count_rcp = 0;
            var count_pc = 0;
            var tabPaneHtml = "";
            for (var key in mapData) {
                if (mapData.hasOwnProperty(key)) { //check if data has key
                    if (key !== "No_HSEHOLD" && key !== "RURAL_POP") {
                        //Display emission scenario 8.5
                        if (key.indexOf(searchRcp)!== -1){
                            //Section emmision and temperature titles
                            if (count_rcp < 1){
                                tabPaneHtml += '<p class="map-rcp-emission-title">Emission Scenario ' + rcpCategory + '</p>';
                                tabPaneHtml += '<p class="map-rcp-emission-subtitle">Future Temperature Change</p>';
                            }
                            //List future temperature change by year
                            if (key.indexOf("AV_TMP")!== -1){
                                if (key.indexOf("_30")!== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                }
                                else if (key.indexOf("_50")!== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                }else{
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                }
                            }else{
                                //Precipitation section title
                                if (count_pc < 1){
                                    tabPaneHtml += '<p class="map-rcp-emission-subtitle">Change in Precipitation</p>';
                                }
                                //List change in precipitation
                                if (key.indexOf("_30")!== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span></span><span class="map-rcp-year-data">' + mapData[key] + '</span></p>';
                                }
                                else if (key.indexOf("_50")!== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span></span><span class="map-rcp-year-data">' + mapData[key] + '</span></p>';
                                }else{
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span></span><span class="map-rcp-year-data">' + mapData[key] + '</span></p>';
                                }
                                count_pc += 1;
                            }
                            count_rcp += 1;
                        }
                    }
                }
            }
            return tabPaneHtml;
        }
    };

    return households;
})();

app.initMap();
app.getMapComponent();
app.resizeMapCanvasHeight();
app.mapComponent();