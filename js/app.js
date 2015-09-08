/**
 * Created by nkoech on 28/02/2015.
 */

var app = (function(){
    var households = {

        globalVal: {
            // Global variables
            rcpPrecData45: "",
            rcpPrecData85: "",
            rcpTempData45: "",
            rcpTempData85: "",
            farmSystemLevelNextData: "",
            farmSystemPercNextData: "",
            farmSystemLevelPrevData: "",
            farmSystemPercPrevData: "",
            clickTemp: true,
            clickPrec: true,
            mapClickEvent: true
        },

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
                // Set map window height
                if ($(".tabbable").height() > $(window).height()){
                    $(".map-canvas").height($(".tabbable").height() + 35);
                }else{
                    $(".map-canvas").height($(window).height());
                }
                map.invalidateSize();
                $("#map-rcp-chart-container").width(($(window).width() - $(".map-canvas").width()) - 7); // Set chart container width
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
                    if ($(".nav-tabs .active").text() == "About") { // Show chart tab if about tab is active
                        $('#mapTab a[href="#map-rcp-chart-tab"]').tab('show');
                    }
                    $(".map-rcp-title-bg,.map-rcp-body").remove(); //remove p and  br elements
                    households.showMapEmissionsScenarioTitle(mapData); //show emission titles
                    var tabPaneHtmlScenario85 =  households.showMapEmissionsScenario(mapData, "8_", "8.5"); //show emission scenario 8.5
                    var tabPaneHtmlScenario45 =  households.showMapEmissionsScenario(mapData, "4_", "4.5"); //show emission scenario 4.5
                    var tabPaneFarmSystem = "";
                    var cnty_prof = "";
                    // Get farming system for each region
                    if (map.hasLayer(layers.admin0)) {
                        cnty_prof = {"profile": [{"country": "Algeria", "level_2": "Arid pastoral-oases", "level_perc": "0.13", "level_1": "Arid pastoral-oases", "fid": "1"}, {"country": "Angola", "level_2": "Forest-based", "level_perc": "0.32", "level_1": "Forest-based", "fid": "40"}, {"country": "Angola", "level_2": "Irrigated", "level_perc": "0.27", "level_1": "Irrigated", "fid": "40"}, {"country": "Angola", "level_2": "Arid pastoral-oases", "level_perc": "0.93", "level_1": "Arid pastoral-oases", "fid": "40"}, {"country": "Angola", "level_2": "Maize livestock highland mixed", "level_perc": "2.43", "level_1": "Highland mixed", "fid": "40"}, {"country": "Angola", "level_2": "Southern African agro-pastoral", "level_perc": "32.41", "level_1": "Agro-pastoral", "fid": "40"}, {"country": "Angola", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "20.46", "level_1": "Root and tuber crop", "fid": "40"}, {"country": "Angola", "level_2": "Cassava-based root tuber", "level_perc": "0.15", "level_1": "Root and tuber crop", "fid": "40"}, {"country": "Angola", "level_2": "Sandy coast fish based", "level_perc": "1.53", "level_1": "Fish-based", "fid": "40"}, {"country": "Angola", "level_2": "Mangrove deltaic fish based", "level_perc": "0.15", "level_1": "Fish-based", "fid": "40"}, {"country": "Angola", "level_2": "Southern African pastoral", "level_perc": "0.01", "level_1": "Pastoral", "fid": "40"}, {"country": "Angola", "level_2": "Low population density maize-root crops (central African)", "level_perc": "41.31", "level_1": "Maize mixed", "fid": "40"}, {"country": "Angola", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "0.03", "level_1": "Maize mixed", "fid": "40"}, {"country": "Benin", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "69.07", "level_1": "Cereal-root crop mixed", "fid": "21"}, {"country": "Benin", "level_2": "Sahelian agro-pastoral", "level_perc": "10.07", "level_1": "Agro-pastoral", "fid": "21"}, {"country": "Benin", "level_2": "Yam -cassava- based root tuber", "level_perc": "17.39", "level_1": "Root and tuber crop", "fid": "21"}, {"country": "Benin", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "0.14", "level_1": "Root and tuber crop", "fid": "21"}, {"country": "Benin", "level_2": "Sandy coast fish based", "level_perc": "3.3", "level_1": "Fish-based", "fid": "21"}, {"country": "Benin", "level_2": "Mangrove deltaic fish based", "level_perc": "0.02", "level_1": "Fish-based", "fid": "21"}, {"country": "Botswana", "level_2": "Southern African agro-pastoral", "level_perc": "52.13", "level_1": "Agro-pastoral", "fid": "47"}, {"country": "Botswana", "level_2": "Southern African pastoral", "level_perc": "46.96", "level_1": "Pastoral", "fid": "47"}, {"country": "Botswana", "level_2": "Dualistic maize mixed (southern Africa)", "level_perc": "0.91", "level_1": "Maize mixed", "fid": "47"}, {"country": "Burkina Faso", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "38.43", "level_1": "Cereal-root crop mixed", "fid": "15"}, {"country": "Burkina Faso", "level_2": "Sahelian agro-pastoral", "level_perc": "52.87", "level_1": "Agro-pastoral", "fid": "15"}, {"country": "Burkina Faso", "level_2": "Sahelian pastoral", "level_perc": "8.7", "level_1": "Pastoral", "fid": "15"}, {"country": "Burundi", "level_2": "Albertine Rift highland perrenial", "level_perc": "80.56", "level_1": "Highland perennial", "fid": "39"}, {"country": "Burundi", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "12.58", "level_1": "Root and tuber crop", "fid": "39"}, {"country": "Burundi", "level_2": "Lake fish based", "level_perc": "6.86", "level_1": "Fish-based", "fid": "39"}, {"country": "C?te d'Ivoire", "level_2": "Forest-based", "level_perc": "0.55", "level_1": "Forest-based", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "29.21", "level_1": "Cereal-root crop mixed", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Yam -cassava- based root tuber", "level_perc": "15.53", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "0.05", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cassava-based root tuber", "level_perc": "0.11", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Sandy coast fish based", "level_perc": "3.27", "level_1": "Fish-based", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Lake fish based", "level_perc": "1.63", "level_1": "Fish-based", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Humid lowland tree crop", "level_perc": "49.64", "level_1": "Humid lowland tree crop", "fid": "27"}, {"country": "Cameroon", "level_2": "Forest-based", "level_perc": "19.44", "level_1": "Forest-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Irrigated", "level_perc": "0.04", "level_1": "Irrigated", "fid": "18"}, {"country": "Cameroon", "level_2": "Maize livestock highland mixed", "level_perc": "8.37", "level_1": "Highland mixed", "fid": "18"}, {"country": "Cameroon", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "15.88", "level_1": "Cereal-root crop mixed", "fid": "18"}, {"country": "Cameroon", "level_2": "Sahelian agro-pastoral", "level_perc": "7.17", "level_1": "Agro-pastoral", "fid": "18"}, {"country": "Cameroon", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.04", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "0.04", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Cassava-cocoyam root tuber", "level_perc": "19.13", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Sandy coast fish based", "level_perc": "0.06", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Mangrove deltaic fish based", "level_perc": "1.77", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Floodplain fish based", "level_perc": "0.42", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Sahelian pastoral", "level_perc": "0.52", "level_1": "Pastoral", "fid": "18"}, {"country": "Cameroon", "level_2": "Humid lowland tree crop", "level_perc": "27.04", "level_1": "Humid lowland tree crop", "fid": "18"}, {"country": "Central African Republic", "level_2": "Forest-based", "level_perc": "5.61", "level_1": "Forest-based", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "14.73", "level_1": "Cereal-root crop mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "1.64", "level_1": "Maize mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop", "level_perc": "21.65", "level_1": "Cereal-root crop mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Sahelian agro-pastoral", "level_perc": "2.05", "level_1": "Agro-pastoral", "fid": "26"}, {"country": "Central African Republic", "level_2": "Yam -cassava- based root tuber", "level_perc": "54.02", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-cocoyam root tuber", "level_perc": "0.09", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "0.04", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-based root tuber", "level_perc": "0.18", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Chad", "level_2": "Irrigated", "level_perc": "0.32", "level_1": "Irrigated", "fid": "9"}, {"country": "Chad", "level_2": "Arid pastoral-oases", "level_perc": "53.13", "level_1": "Arid pastoral-oases", "fid": "9"}, {"country": "Chad", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "10.99", "level_1": "Cereal-root crop mixed", "fid": "9"}, {"country": "Chad", "level_2": "Sahelian agro-pastoral", "level_perc": "18.22", "level_1": "Agro-pastoral", "fid": "9"}, {"country": "Chad", "level_2": "Floodplain fish based", "level_perc": "0.85", "level_1": "Fish-based", "fid": "9"}, {"country": "Chad", "level_2": "Sahelian pastoral", "level_perc": "16.4", "level_1": "Pastoral", "fid": "9"}, {"country": "Congo", "level_2": "Forest-based", "level_perc": "60.43", "level_1": "Forest-based", "fid": "35"}, {"country": "Congo", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "0", "level_1": "Root and tuber crop", "fid": "35"}, {"country": "Congo", "level_2": "Cassava-based root tuber", "level_perc": "37.53", "level_1": "Root and tuber crop", "fid": "35"}, {"country": "Congo", "level_2": "Sandy coast fish based", "level_perc": "2.03", "level_1": "Fish-based", "fid": "35"}, {"country": "Democratic Republic of the Congo", "level_2": "Forest-based", "level_perc": "35.63", "level_1": "Forest-based", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Albertine Rift highland perrenial", "level_perc": "2.29", "level_1": "Highland perennial", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "2.55", "level_1": "Maize mixed", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.06", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "0.1", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Cassava-based root tuber", "level_perc": "43.1", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Mangrove deltaic fish based", "level_perc": "0.03", "level_1": "Fish-based", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Lake fish based", "level_perc": "1.03", "level_1": "Fish-based", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Low population density maize-root crops (central African)", "level_perc": "15.12", "level_1": "Maize mixed", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "0.09", "level_1": "Maize mixed", "fid": "30"}, {"country": "Djibouti", "level_2": "Arid pastoral-oases", "level_perc": "55.44", "level_1": "Arid pastoral-oases", "fid": "19"}, {"country": "Djibouti", "level_2": "Coral reef fish based", "level_perc": "13.67", "level_1": "Fish-based", "fid": "19"}, {"country": "Djibouti", "level_2": "Eastern African pastoral", "level_perc": "30.9", "level_1": "Pastoral", "fid": "19"}, {"country": "Egypt", "level_2": "Arid pastoral-oases", "level_perc": "0.01", "level_1": "Arid pastoral-oases", "fid": "4"}, {"country": "Egypt", "level_2": "Coral reef fish based", "level_perc": "0.01", "level_1": "Fish-based", "fid": "4"}, {"country": "Egypt", "level_2": "Lake fish based", "level_perc": "0.01", "level_1": "Fish-based", "fid": "4"}, {"country": "Equatorial Guinea", "level_2": "Forest-based", "level_perc": "77.21", "level_1": "Forest-based", "fid": "34"}, {"country": "Equatorial Guinea", "level_2": "Sandy coast fish based", "level_perc": "15.6", "level_1": "Fish-based", "fid": "34"}, {"country": "Equatorial Guinea", "level_2": "Mangrove deltaic fish based", "level_perc": "7.19", "level_1": "Fish-based", "fid": "34"}, {"country": "Eritrea", "level_2": "Irrigated", "level_perc": "1.56", "level_1": "Irrigated", "fid": "13"}, {"country": "Eritrea", "level_2": "Arid pastoral-oases", "level_perc": "34.14", "level_1": "Arid pastoral-oases", "fid": "13"}, {"country": "Eritrea", "level_2": "Wheat-livestock highland mixed", "level_perc": "1.21", "level_1": "Highland mixed", "fid": "13"}, {"country": "Eritrea", "level_2": "Maize livestock highland mixed", "level_perc": "12.14", "level_1": "Highland mixed", "fid": "13"}, {"country": "Eritrea", "level_2": "Sahelian agro-pastoral", "level_perc": "0.03", "level_1": "Agro-pastoral", "fid": "13"}, {"country": "Eritrea", "level_2": "East African agro-pastoral", "level_perc": "9.53", "level_1": "Agro-pastoral", "fid": "13"}, {"country": "Eritrea", "level_2": "Coral reef fish based", "level_perc": "9.61", "level_1": "Fish-based", "fid": "13"}, {"country": "Eritrea", "level_2": "Eastern African pastoral", "level_perc": "31.77", "level_1": "Pastoral", "fid": "13"}, {"country": "Ethiopia", "level_2": "Maize-livestock (Ethiopian)", "level_perc": "15.64", "level_1": "Maize mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Southern Ethiopia highland perrenial", "level_perc": "7.6", "level_1": "Highland perennial", "fid": "16"}, {"country": "Ethiopia", "level_2": "Arid pastoral-oases", "level_perc": "0.92", "level_1": "Arid pastoral-oases", "fid": "16"}, {"country": "Ethiopia", "level_2": "Livestock-cereals highland mixed", "level_perc": "1.44", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Wheat-livestock highland mixed", "level_perc": "6.47", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Maize livestock highland mixed", "level_perc": "18.04", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "0.04", "level_1": "Cereal-root crop mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "0.09", "level_1": "Maize mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop", "level_perc": "0.02", "level_1": "Cereal-root crop mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Sahelian agro-pastoral", "level_perc": "0.01", "level_1": "Agro-pastoral", "fid": "16"}, {"country": "Ethiopia", "level_2": "East African agro-pastoral", "level_perc": "16.44", "level_1": "Agro-pastoral", "fid": "16"}, {"country": "Ethiopia", "level_2": "Lake fish based", "level_perc": "0.3", "level_1": "Fish-based", "fid": "16"}, {"country": "Ethiopia", "level_2": "Eastern African pastoral", "level_perc": "32.98", "level_1": "Pastoral", "fid": "16"}, {"country": "Gabon", "level_2": "Forest-based", "level_perc": "55.96", "level_1": "Forest-based", "fid": "36"}, {"country": "Gabon", "level_2": "Cassava-based root tuber", "level_perc": "33.44", "level_1": "Root and tuber crop", "fid": "36"}, {"country": "Gabon", "level_2": "Sandy coast fish based", "level_perc": "3.02", "level_1": "Fish-based", "fid": "36"}, {"country": "Gabon", "level_2": "Sandy coast fish based", "level_perc": "1.83", "level_1": "Fish-based", "fid": "36"}, {"country": "Gabon", "level_2": "Mangrove deltaic fish based", "level_perc": "5.75", "level_1": "Fish-based", "fid": "36"}, {"country": "Gambia", "level_2": "Irrigated", "level_perc": "61.19", "level_1": "Irrigated", "fid": "51"}, {"country": "Gambia", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "8.85", "level_1": "Cereal-root crop mixed", "fid": "51"}, {"country": "Gambia", "level_2": "Sahelian agro-pastoral", "level_perc": "21.75", "level_1": "Agro-pastoral", "fid": "51"}, {"country": "Gambia", "level_2": "Mangrove deltaic fish based", "level_perc": "8.22", "level_1": "Fish-based", "fid": "51"}, {"country": "Ghana", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "37.37", "level_1": "Cereal-root crop mixed", "fid": "24"}, {"country": "Ghana", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.14", "level_1": "Root and tuber crop", "fid": "24"}, {"country": "Ghana", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "24", "level_1": "Root and tuber crop", "fid": "24"}, {"country": "Ghana", "level_2": "Sandy coast fish based", "level_perc": "2", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Mangrove deltaic fish based", "level_perc": "1.97", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Lake fish based", "level_perc": "9.01", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Humid lowland tree crop", "level_perc": "6199.12", "level_1": "Humid lowland tree crop", "fid": "24"}, {"country": "Guinea", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "72.42", "level_1": "Cereal-root crop mixed", "fid": "20"}, {"country": "Guinea", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.13", "level_1": "Root and tuber crop", "fid": "20"}, {"country": "Guinea", "level_2": "Cassava-based root tuber", "level_perc": "18.5", "level_1": "Root and tuber crop", "fid": "20"}, {"country": "Guinea", "level_2": "Mangrove deltaic fish based", "level_perc": "3.84", "level_1": "Fish-based", "fid": "20"}, {"country": "Guinea", "level_2": "Humid lowland tree crop", "level_perc": "5.1", "level_1": "Humid lowland tree crop", "fid": "20"}, {"country": "Guinea-Bissau", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "71.4", "level_1": "Cereal-root crop mixed", "fid": "23"}, {"country": "Guinea-Bissau", "level_2": "Mangrove deltaic fish based", "level_perc": "28.49", "level_1": "Fish-based", "fid": "23"}, {"country": "Hala'ib triangle", "level_2": "Arid pastoral-oases", "level_perc": "75.12", "level_1": "Arid pastoral-oases", "fid": "10"}, {"country": "Hala'ib triangle", "level_2": "Coral reef fish based", "level_perc": "23.45", "level_1": "Fish-based", "fid": "10"}, {"country": "Ilemi triangle", "level_2": "Eastern African pastoral", "level_perc": "100", "level_1": "Pastoral", "fid": "31"}, {"country": "Kenya", "level_2": "Northern Tanzania  highland perrenial", "level_perc": "0.02", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "Central Kenya highland perrenial", "level_perc": "1.73", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "Western Kenya highland perrenial", "level_perc": "3.63", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "15.54", "level_1": "Maize mixed", "fid": "32"}, {"country": "Kenya", "level_2": "East African agro-pastoral", "level_perc": "9.41", "level_1": "Agro-pastoral", "fid": "32"}, {"country": "Kenya", "level_2": "Coral reef fish based", "level_perc": "0.69", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Semi-mechanized maize mixed (Tanzanian)", "level_perc": "0.01", "level_1": "Maize mixed", "fid": "32"}, {"country": "Kenya", "level_2": "Mangrove deltaic fish based", "level_perc": "0.16", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Lake fish based", "level_perc": "2.84", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Floodplain fish based", "level_perc": "0.16", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Eastern African pastoral", "level_perc": "65.8", "level_1": "Pastoral", "fid": "32"}, {"country": "Lesotho", "level_2": "Perennial mixed", "level_perc": "0.01", "level_1": "Perennial mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Livestock-cereals highland mixed", "level_perc": "38.15", "level_1": "Highland mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Maize livestock highland mixed", "level_perc": "55.66", "level_1": "Highland mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Dualistic maize mixed (southern Africa)", "level_perc": "6.19", "level_1": "Maize mixed", "fid": "50"}, {"country": "Liberia", "level_2": "Forest-based", "level_perc": "10.68", "level_1": "Forest-based", "fid": "29"}, {"country": "Liberia", "level_2": "Sandy coast fish based", "level_perc": "9.58", "level_1": "Fish-based", "fid": "29"}, {"country": "Liberia", "level_2": "Mangrove deltaic fish based", "level_perc": "0.43", "level_1": "Fish-based", "fid": "29"}, {"country": "Liberia", "level_2": "Humid lowland tree crop", "level_perc": "79.31", "level_1": "Humid lowland tree crop", "fid": "29"}, {"country": "Libyan Arab Jamahiriya", "level_2": "Arid pastoral-oases", "level_perc": "0.09", "level_1": "Arid pastoral-oases", "fid": "3"}, {"country": "Madagascar", "level_2": "Southern African agro-pastoral", "level_perc": "57.06", "level_1": "Agro-pastoral", "fid": "43"}, {"country": "Madagascar", "level_2": "Coral reef fish based", "level_perc": "2.06", "level_1": "Fish-based", "fid": "43"}, {"country": "Madagascar", "level_2": "Mangrove deltaic fish based", "level_perc": "1.08", "level_1": "Fish-based", "fid": "43"}, {"country": "Madagascar", "level_2": "Humid lowland tree crop", "level_perc": "13.75", "level_1": "Humid lowland tree crop", "fid": "43"}, {"country": "Madagascar", "level_2": "Maize irrigated rice (Madagascan)", "level_perc": "25.72", "level_1": "Maize mixed", "fid": "43"}, {"country": "Malawi", "level_2": "Southern Tanzania highland perrenial", "level_perc": "0", "level_1": "Highland perennial", "fid": "42"}, {"country": "Malawi", "level_2": "Southern African agro-pastoral", "level_perc": "0.13", "level_1": "Agro-pastoral", "fid": "42"}, {"country": "Malawi", "level_2": "Semi-mechanized maize mixed (Tanzanian)", "level_perc": "0.11", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Lake fish based", "level_perc": "25.05", "level_1": "Fish-based", "fid": "42"}, {"country": "Malawi", "level_2": "High population density low livestock maize mixed (Malawian)", "level_perc": "73.05", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Low population density maize (Mozambiquan)", "level_perc": "1.02", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "0.72", "level_1": "Maize mixed", "fid": "42"}, {"country": "Mali", "level_2": "Irrigated", "level_perc": "3.8", "level_1": "Irrigated", "fid": "7"}, {"country": "Mali", "level_2": "Arid pastoral-oases", "level_perc": "58.17", "level_1": "Arid pastoral-oases", "fid": "7"}, {"country": "Mali", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "8.23", "level_1": "Cereal-root crop mixed", "fid": "7"}, {"country": "Mali", "level_2": "Sahelian agro-pastoral", "level_perc": "16.63", "level_1": "Agro-pastoral", "fid": "7"}, {"country": "Mali", "level_2": "Sahelian pastoral", "level_perc": "13.08", "level_1": "Pastoral", "fid": "7"}, {"country": "Ma'tan al-Sarra", "level_2": "Arid pastoral-oases", "level_perc": "7.15", "level_1": "Arid pastoral-oases", "fid": "12"}, {"country": "Mauritania", "level_2": "Irrigated", "level_perc": "1.1", "level_1": "Irrigated", "fid": "6"}, {"country": "Mauritania", "level_2": "Arid pastoral-oases", "level_perc": "84.22", "level_1": "Arid pastoral-oases", "fid": "6"}, {"country": "Mauritania", "level_2": "Sahelian agro-pastoral", "level_perc": "0.54", "level_1": "Agro-pastoral", "fid": "6"}, {"country": "Mauritania", "level_2": "Sandy coast fish based", "level_perc": "0.45", "level_1": "Fish-based", "fid": "6"}, {"country": "Mauritania", "level_2": "Mangrove deltaic fish based", "level_perc": "0.34", "level_1": "Fish-based", "fid": "6"}, {"country": "Mauritania", "level_2": "Sahelian pastoral", "level_perc": "13.23", "level_1": "Pastoral", "fid": "6"}, {"country": "Mozambique", "level_2": "Perennial mixed", "level_perc": "0.19", "level_1": "Perennial mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Maize livestock highland mixed", "level_perc": "2.48", "level_1": "Highland mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Southern African agro-pastoral", "level_perc": "31.26", "level_1": "Agro-pastoral", "fid": "44"}, {"country": "Mozambique", "level_2": "Coral reef fish based", "level_perc": "2.05", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Semi-mechanized maize mixed (Tanzanian)", "level_perc": "0.14", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Sandy coast fish based", "level_perc": "0.58", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Mangrove deltaic fish based", "level_perc": "1.54", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Lake fish based", "level_perc": "1.57", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Floodplain fish based", "level_perc": "0.28", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "High population density low livestock maize mixed (Malawian)", "level_perc": "0.13", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Low population density maize (Mozambiquan)", "level_perc": "59.73", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Dualistic maize mixed (southern Africa)", "level_perc": "0.01", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "0.04", "level_1": "Maize mixed", "fid": "44"}, {"country": "Namibia", "level_2": "Irrigated", "level_perc": "0.42", "level_1": "Irrigated", "fid": "46"}, {"country": "Namibia", "level_2": "Arid pastoral-oases", "level_perc": "30.94", "level_1": "Arid pastoral-oases", "fid": "46"}, {"country": "Namibia", "level_2": "Southern African agro-pastoral", "level_perc": "21.02", "level_1": "Agro-pastoral", "fid": "46"}, {"country": "Namibia", "level_2": "Sandy coast fish based", "level_perc": "2.42", "level_1": "Fish-based", "fid": "46"}, {"country": "Namibia", "level_2": "Southern African pastoral", "level_perc": "45.2", "level_1": "Pastoral", "fid": "46"}, {"country": "Niger", "level_2": "Irrigated", "level_perc": "1.04", "level_1": "Irrigated", "fid": "8"}, {"country": "Niger", "level_2": "Arid pastoral-oases", "level_perc": "71.15", "level_1": "Arid pastoral-oases", "fid": "8"}, {"country": "Niger", "level_2": "Sahelian agro-pastoral", "level_perc": "10.8", "level_1": "Agro-pastoral", "fid": "8"}, {"country": "Niger", "level_2": "Floodplain fish based", "level_perc": "0.24", "level_1": "Fish-based", "fid": "8"}, {"country": "Niger", "level_2": "Sahelian pastoral", "level_perc": "16.66", "level_1": "Pastoral", "fid": "8"}, {"country": "Nigeria", "level_2": "Irrigated", "level_perc": "4.13", "level_1": "Irrigated", "fid": "17"}, {"country": "Nigeria", "level_2": "Maize livestock highland mixed", "level_perc": "1.32", "level_1": "Highland mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "25.36", "level_1": "Cereal-root crop mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop", "level_perc": "13.44", "level_1": "Cereal-root crop mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Sahelian agro-pastoral", "level_perc": "29.88", "level_1": "Agro-pastoral", "fid": "17"}, {"country": "Nigeria", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.02", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "11.17", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Cassava-cocoyam root tuber", "level_perc": "0.01", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Sandy coast fish based", "level_perc": "0.57", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Mangrove deltaic fish based", "level_perc": "1.68", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Lake fish based", "level_perc": "0.44", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Floodplain fish based", "level_perc": "0.17", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Sahelian pastoral", "level_perc": "2.14", "level_1": "Pastoral", "fid": "17"}, {"country": "Nigeria", "level_2": "Humid lowland tree crop", "level_perc": "9.68", "level_1": "Humid lowland tree crop", "fid": "17"}, {"country": "Rwanda", "level_2": "Albertine Rift highland perrenial", "level_perc": "94.77", "level_1": "Highland perennial", "fid": "38"}, {"country": "Rwanda", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "1.14", "level_1": "Root and tuber crop", "fid": "38"}, {"country": "Rwanda", "level_2": "Lake fish based", "level_perc": "4.08", "level_1": "Fish-based", "fid": "38"}, {"country": "Senegal", "level_2": "Irrigated", "level_perc": "3.85", "level_1": "Irrigated", "fid": "14"}, {"country": "Senegal", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "20.95", "level_1": "Cereal-root crop mixed", "fid": "14"}, {"country": "Senegal", "level_2": "Sahelian agro-pastoral", "level_perc": "50.33", "level_1": "Agro-pastoral", "fid": "14"}, {"country": "Senegal", "level_2": "Sandy coast fish based", "level_perc": "1.89", "level_1": "Fish-based", "fid": "14"}, {"country": "Senegal", "level_2": "Mangrove deltaic fish based", "level_perc": "1.42", "level_1": "Fish-based", "fid": "14"}, {"country": "Senegal", "level_2": "Sahelian pastoral", "level_perc": "21.56", "level_1": "Pastoral", "fid": "14"}, {"country": "Sierra Leone", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop", "level_perc": "11.92", "level_1": "Cereal-root crop mixed", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Cassava-based root tuber", "level_perc": "46.65", "level_1": "Root and tuber crop", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Mangrove deltaic fish based", "level_perc": "14.87", "level_1": "Fish-based", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Humid lowland tree crop", "level_perc": "26.56", "level_1": "Humid lowland tree crop", "fid": "28"}, {"country": "Somalia", "level_2": "Maize-livestock (Ethiopian)", "level_perc": "0.03", "level_1": "Maize mixed", "fid": "22"}, {"country": "Somalia", "level_2": "Irrigated", "level_perc": "6.34", "level_1": "Irrigated", "fid": "22"}, {"country": "Somalia", "level_2": "Arid pastoral-oases", "level_perc": "19.19", "level_1": "Arid pastoral-oases", "fid": "22"}, {"country": "Somalia", "level_2": "East African agro-pastoral", "level_perc": "13.33", "level_1": "Agro-pastoral", "fid": "22"}, {"country": "Somalia", "level_2": "Coral reef fish based", "level_perc": "0.46", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Mangrove deltaic fish based", "level_perc": "0.21", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Floodplain fish based", "level_perc": "0.82", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Eastern African pastoral", "level_perc": "59.62", "level_1": "Pastoral", "fid": "22"}, {"country": "South Africa", "level_2": "Perennial mixed", "level_perc": "15.03", "level_1": "Perennial mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Arid pastoral-oases", "level_perc": "7.38", "level_1": "Arid pastoral-oases", "fid": "48"}, {"country": "South Africa", "level_2": "Livestock-cereals highland mixed", "level_perc": "0.26", "level_1": "Highland mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Maize livestock highland mixed", "level_perc": "1.6", "level_1": "Highland mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Southern African agro-pastoral", "level_perc": "19.86", "level_1": "Agro-pastoral", "fid": "48"}, {"country": "South Africa", "level_2": "Coral reef fish based", "level_perc": "0.16", "level_1": "Fish-based", "fid": "48"}, {"country": "South Africa", "level_2": "Sandy coast fish based", "level_perc": "2.75", "level_1": "Fish-based", "fid": "48"}, {"country": "South Africa", "level_2": "Southern African pastoral", "level_perc": "28.61", "level_1": "Pastoral", "fid": "48"}, {"country": "South Africa", "level_2": "Dualistic maize mixed (southern Africa)", "level_perc": "24.31", "level_1": "Maize mixed", "fid": "48"}, {"country": "Sudan", "level_2": "Maize-livestock (Ethiopian)", "level_perc": "0.04", "level_1": "Maize mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Irrigated", "level_perc": "6.99", "level_1": "Irrigated", "fid": "11"}, {"country": "Sudan", "level_2": "Arid pastoral-oases", "level_perc": "39.73", "level_1": "Arid pastoral-oases", "fid": "11"}, {"country": "Sudan", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "12.53", "level_1": "Cereal-root crop mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "4.2", "level_1": "Maize mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop", "level_perc": "6.11", "level_1": "Cereal-root crop mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Sahelian agro-pastoral", "level_perc": "13.42", "level_1": "Agro-pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "East African agro-pastoral", "level_perc": "0.02", "level_1": "Agro-pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "Yam -cassava- based root tuber", "level_perc": "0.01", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "2.46", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Cassava-based root tuber", "level_perc": "0", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Coral reef fish based", "level_perc": "0.29", "level_1": "Fish-based", "fid": "11"}, {"country": "Sudan", "level_2": "Lake fish based", "level_perc": "0.02", "level_1": "Fish-based", "fid": "11"}, {"country": "Sudan", "level_2": "Sahelian pastoral", "level_perc": "12.4", "level_1": "Pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "Eastern African pastoral", "level_perc": "1.76", "level_1": "Pastoral", "fid": "11"}, {"country": "Swaziland", "level_2": "Perennial mixed", "level_perc": "99.66", "level_1": "Perennial mixed", "fid": "49"}, {"country": "Swaziland", "level_2": "Southern African agro-pastoral", "level_perc": "0.34", "level_1": "Agro-pastoral", "fid": "49"}, {"country": "Togo", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop", "level_perc": "50.31", "level_1": "Cereal-root crop mixed", "fid": "25"}, {"country": "Togo", "level_2": "Yam -cassava- based root tuber", "level_perc": "40.32", "level_1": "Root and tuber crop", "fid": "25"}, {"country": "Togo", "level_2": "Cassava-yam/cocoyam based root tuber", "level_perc": "0.62", "level_1": "Root and tuber crop", "fid": "25"}, {"country": "Togo", "level_2": "Sandy coast fish based", "level_perc": "0.25", "level_1": "Fish-based", "fid": "25"}, {"country": "Togo", "level_2": "Mangrove deltaic fish based", "level_perc": "2.62", "level_1": "Fish-based", "fid": "25"}, {"country": "Togo", "level_2": "Humid lowland tree crop", "level_perc": "5.89", "level_1": "Humid lowland tree crop", "fid": "25"}, {"country": "Uganda", "level_2": "Albertine Rift highland perrenial", "level_perc": "25.47", "level_1": "Highland perennial", "fid": "33"}, {"country": "Uganda", "level_2": "Western Kenya highland perrenial", "level_perc": "3.17", "level_1": "Highland perennial", "fid": "33"}, {"country": "Uganda", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "37.05", "level_1": "Maize mixed", "fid": "33"}, {"country": "Uganda", "level_2": "East African agro-pastoral", "level_perc": "4.52", "level_1": "Agro-pastoral", "fid": "33"}, {"country": "Uganda", "level_2": "Lake fish based", "level_perc": "18.68", "level_1": "Fish-based", "fid": "33"}, {"country": "Uganda", "level_2": "Eastern African pastoral", "level_perc": "11.11", "level_1": "Pastoral", "fid": "33"}, {"country": "United Republic of Tanzania", "level_2": "Albertine Rift highland perrenial", "level_perc": "1.49", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Northern Tanzania  highland perrenial", "level_perc": "1.43", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Southern Tanzania highland perrenial", "level_perc": "8.28", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Western Kenya highland perrenial", "level_perc": "0.08", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan)", "level_perc": "0.02", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "East African agro-pastoral", "level_perc": "33.76", "level_1": "Agro-pastoral", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Cassava-sweet potato-potato-based root tuber", "level_perc": "5.12", "level_1": "Root and tuber crop", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Coral reef fish based", "level_perc": "0.87", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Semi-mechanized maize mixed (Tanzanian)", "level_perc": "40.94", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Mangrove deltaic fish based", "level_perc": "0.61", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Lake fish based", "level_perc": "7.28", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Floodplain fish based", "level_perc": "0.02", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "High population density low livestock maize mixed (Malawian)", "level_perc": "0.02", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Low population density maize (Mozambiquan)", "level_perc": "0.07", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "0.03", "level_1": "Maize mixed", "fid": "37"}, {"country": "Western Sahara", "level_2": "Arid pastoral-oases", "level_perc": "0.74", "level_1": "Arid pastoral-oases", "fid": "5"}, {"country": "Western Sahara", "level_2": "Sandy coast fish based", "level_perc": "0.03", "level_1": "Fish-based", "fid": "5"}, {"country": "Zambia", "level_2": "Irrigated", "level_perc": "0.79", "level_1": "Irrigated", "fid": "41"}, {"country": "Zambia", "level_2": "Southern Tanzania highland perrenial", "level_perc": "0", "level_1": "Highland perennial", "fid": "41"}, {"country": "Zambia", "level_2": "Southern African agro-pastoral", "level_perc": "16.18", "level_1": "Agro-pastoral", "fid": "41"}, {"country": "Zambia", "level_2": "Semi-mechanized maize mixed (Tanzanian)", "level_perc": "0.03", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Lake fish based", "level_perc": "0.87", "level_1": "Fish-based", "fid": "41"}, {"country": "Zambia", "level_2": "High population density low livestock maize mixed (Malawian)", "level_perc": "0.11", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Low population density maize-root crops (central African)", "level_perc": "0.3", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Low population density maize (Mozambiquan)", "level_perc": "0.06", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Medium population density maize mixed (Zambian)", "level_perc": "81.64", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zimbabwe", "level_2": "Maize livestock highland mixed", "level_perc": "4.6", "level_1": "Highland mixed", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Southern African agro-pastoral", "level_perc": "48.63", "level_1": "Agro-pastoral", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Lake fish based", "level_perc": "0.8", "level_1": "Fish-based", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Floodplain fish based", "level_perc": "0", "level_1": "Fish-based", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Low population density maize (Mozambiquan)", "level_perc": "0.03", "level_1": "Maize mixed", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Dualistic maize mixed (southern Africa)", "level_perc": "45.95", "level_1": "Maize mixed", "fid": "45"}]};
                        tabPaneFarmSystem = households.showMapFarmSystem(mapData, cnty_prof, "ADM0_NAME", "country");
                    }
                    // Chart html
                    tabPaneHtml = '<div class="map-rcp-body"><div class="row"><div class="tab-pane-rcp-btn"><div class="col-xs-6"><a class="btn btn-large btn-danger btn-md" id="btnTemp" onclick="app.showMapScenarioTempChartOnBtnClick();"><span class="btn-label"> Temperature </span></a></div><div class="col-xs-6"><a class="btn btn-large btn-primary btn-md pull-right" id="btnPrec" onclick="app.showMapScenarioPrecChartOnBtnClick();"><span class="btn-label"> Precipitation </span></a></div></div></div><div class="map-rcp-chart"><div id="map-rcp-chart-container"></div></div></div>';
                    $('.tab-pane-rcp-chart').append(tabPaneHtml); // Append html to existing html class to show chart
                    $("#map-rcp-chart-container").width(($(window).width() - $(".map-canvas").width()) - 7); // Set chart container width
                    //show temperature and precipitation scenario chart for rcp 8.5 and 4.5
                    if  (households.globalVal.mapClickEvent) {
                        households.showMapEmissionsScenarioChart("FUTURE TEMPERATURE CHANGE", tabPaneHtmlScenario85.rcpTempData, tabPaneHtmlScenario45.rcpTempData, "Temperature (°C)", "°C");
                        households.globalVal.clickTemp = false;
                    } else{
                        households.showMapEmissionsScenarioChart("CHANGE IN PRECIPITATION", tabPaneHtmlScenario85.rcpPrecData, tabPaneHtmlScenario45.rcpPrecData, "Precipitation (%)", "%");
                    }
                    // Assign rcp 8.5 and 4.5 temperature data to global variables
                    households.globalVal.rcpTempData45 = tabPaneHtmlScenario85.rcpTempData;
                    households.globalVal.rcpTempData85 = tabPaneHtmlScenario45.rcpTempData;
                    // Assign rcp 8.5 and 4.5 precipitation data to global variables
                    households.globalVal.rcpPrecData45 = tabPaneHtmlScenario85.rcpPrecData;
                    households.globalVal.rcpPrecData85 = tabPaneHtmlScenario45.rcpPrecData;
                    //Show temperature scenario text for rcp 8.5 and 4.5
                    tabPaneHtml = '<div class="map-rcp-body">' + tabPaneHtmlScenario85.tabPaneHtml + tabPaneHtmlScenario45.tabPaneHtml + '<div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div>';
                    $('.tab-pane-rcp').append(tabPaneHtml);

                    if (tabPaneFarmSystem.farmSystemLevelNext.length !=0 ) {
                        // Assign data to global pagination variables
                        households.globalVal.farmSystemLevelNextData = tabPaneFarmSystem.farmSystemLevelNext;
                        households.globalVal.farmSystemPercNextData = tabPaneFarmSystem.farmSystemPercNext;
                        households.globalVal.farmSystemLevelPrevData = tabPaneFarmSystem.farmSystemLevelPrev;
                        households.globalVal.farmSystemPercPrevData = tabPaneFarmSystem.farmSystemPercPrev;
                        // Farm system with pagination html display
                        tabPaneHtml = '<div class="map-rcp-body">' + tabPaneFarmSystem.tabPaneHtml + '</tbody></table><nav><ul class="pager"><li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next"><a onclick="app.showMapFarmSystemOnNextClick();">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
                        $('.tab-pane-farmsys-tab').append(tabPaneHtml);
                    }else{
                        // Farm system without pagination html display
                        tabPaneHtml = '<div class="map-rcp-body">' + tabPaneFarmSystem.tabPaneHtml + '</tbody></table><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
                        $('.tab-pane-farmsys-tab').append(tabPaneHtml);
                    }
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
            $('.tab-pane-rcp-chart').append(tabPaneHtml);
            $('.tab-pane-rcp').append(tabPaneHtml);
            $('.tab-pane-farmsys-tab').append(tabPaneHtml);
        },

        showMapEmissionsScenario: function(mapData, searchRcp, rcpCategory){
            var count_rcp = 0;
            var count_pc = 0;
            var tabPaneHtml = "";
            var rcpTempData = [];
            var rcpPrecData = [];

            for (var key in mapData) {
                if (mapData.hasOwnProperty(key)) { //check if data has key
                    if (key !== "No_HSEHOLD" && key !== "RURAL_POP") {
                        //Display emission scenario
                        if (key.indexOf(searchRcp)!== -1){
                            //Section emmision and temperature titles
                            if (count_rcp < 1){
                                tabPaneHtml += '<p class="map-rcp-emission-title">Emission Scenario ' + rcpCategory + '</p>';
                                tabPaneHtml += '<p class="map-rcp-emission-subtitle">Future Temperature Change</p>';
                            }
                            //List future temperature change by year
                            if (key.indexOf("AV_TMP") !== -1){
                                if (key.indexOf("_30") !== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                    rcpTempData.push(mapData[key]);
                                }
                                else if (key.indexOf("_50") !== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                    rcpTempData.push(mapData[key]);
                                }else{
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';
                                    rcpTempData.push(mapData[key]);
                                }
                            }else{
                                //Precipitation section title
                                if (count_pc < 1){
                                    tabPaneHtml += '<p class="map-rcp-emission-subtitle">Change in Precipitation</p>';
                                }
                                //List change in precipitation
                                if (key.indexOf("_30") !== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';
                                    rcpPrecData.push( + mapData[key]); // Convert to Number type
                                }
                                else if (key.indexOf("_50") !== -1){
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';
                                    rcpPrecData.push( + mapData[key]);
                                }else{
                                    tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';
                                    rcpPrecData.push( + mapData[key]);
                                }
                                count_pc += 1;
                            }
                            count_rcp += 1;
                        }
                    }
                }
            }
            return {
                tabPaneHtml: tabPaneHtml,
                rcpTempData: rcpTempData,
                rcpPrecData: rcpPrecData
            };
        },

        showMapFarmSystem: function(mapData, cnty_prof, layerFieldName, regionId){
            var count = 0; // Count for title display
            var farmSystemCount = 0; // Count for pagination
            var tabPaneHtml = "";
            // Pagination arrays
            var farmSystemLevelNext = [];
            var farmSystemPercNext = [];
            var farmSystemLevelPrev = [];
            var farmSystemPercPrev = [];
            for (var key in mapData) {
                if (mapData.hasOwnProperty(key)) { //check if data has key
                    if (key.indexOf("ADM") !== -1) { //search for word 'ADM' in keys
                        if (count < 1){
                            tabPaneHtml += '<p class="map-rcp-emission-title">Farming Sub-systems</p><div class="map-farmsys-body"><table class="table table-condensed table-striped"><tbody>'; //set title
                        }
                        for (var i = 0; i < cnty_prof.profile.length; i++) { //get farming system JSON information
                            var obj = cnty_prof.profile[i];
                            if (obj.hasOwnProperty(regionId) && obj.hasOwnProperty("level_2")) { //check if object has property
                                if (mapData[key] == obj[regionId].toString()) {
                                    farmSystemCount += 1;
                                    if (key == layerFieldName) { // Get farming systems data and set html
                                        if (farmSystemCount < 10) {
                                            tabPaneHtml += '<tr><td class="map-rcp-year-data">' + obj["level_2"].toString() + '<span class="map-frm-perc-data">' + ' ' + obj["level_perc"].toString() + '%</span></td></tr>';
                                            farmSystemLevelPrev.push(obj["level_2"].toString());
                                            farmSystemPercPrev.push(obj["level_perc"].toString());
                                        } else {
                                            farmSystemLevelNext.push(obj["level_2"].toString());
                                            farmSystemPercNext.push(obj["level_perc"].toString());
                                        }
                                    }
                                }
                            }
                        }
                        count += 1;
                    }
                }
            }
            return {
                tabPaneHtml: tabPaneHtml,
                farmSystemLevelNext: farmSystemLevelNext,
                farmSystemPercNext: farmSystemPercNext,
                farmSystemLevelPrev: farmSystemLevelPrev,
                farmSystemPercPrev: farmSystemPercPrev
            };
        },

        showMapFarmSystemOnNextClick: function(){
            $(".map-rcp-body").remove(); //remove p and  br elements
            var tabPaneHtml = '<div class="map-rcp-body"><p class="map-rcp-emission-title">Farming Sub-systems</p><div class="map-farmsys-body"><table class="table table-condensed table-striped"><tbody>'; //set title
            for (var i = 0; i < households.globalVal.farmSystemLevelNextData.length; i++) {
                tabPaneHtml += '<tr><td class="map-rcp-year-data">' + households.globalVal.farmSystemLevelNextData[i] + '<span class="map-frm-perc-data">' + ' ' + households.globalVal.farmSystemPercNextData[i] + '%</span></td></tr>';
            }
            tabPaneHtml += '</tbody></table><nav><ul class="pager"><li class="previous"><a onclick="app.showMapFarmSystemOnPrevClick();"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next disabled"><a href="#">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
            $('.tab-pane-farmsys-tab').append(tabPaneHtml);
        },

        showMapFarmSystemOnPrevClick: function() {
            $(".map-rcp-body").remove(); //remove p and  br element
            var tabPaneHtml = '<div class="map-rcp-body"><p class="map-rcp-emission-title">Farming Sub-systems</p><div class="map-farmsys-body"><table class="table table-condensed table-striped"><tbody>'; //set title
            for (var i = 0; i < households.globalVal.farmSystemLevelPrevData.length; i++) {
                tabPaneHtml += '<tr><td class="map-rcp-year-data">' + households.globalVal.farmSystemLevelPrevData[i] + '<span class="map-frm-perc-data">' + ' ' + households.globalVal.farmSystemPercPrevData[i] + '%</span></td></tr>';
            }
            tabPaneHtml += '</tbody></table><nav><ul class="pager"><li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next"><a onclick="app.showMapFarmSystemOnNextClick();">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
            $('.tab-pane-farmsys-tab').append(tabPaneHtml);
        },

        showMapEmissionsScenarioChart: function(chartTitle, scenario85Data, scenario45Data, yAxisLabel, valSuffix){
            var scenarioChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: 'map-rcp-chart-container'
                },
                colors: ["#5cb85c", "#f0ad4e"],
                title: {
                    text: chartTitle,
                    style: {"fontSize": "14px"}
                },
                subtitle: {
                    useHTML: true,
                    text: '<div class="chart-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">© Climate Wizard 2015</a></span></div>'
                },
                xAxis: {
                    categories: ['2030', '2050', '2080']
                },
                yAxis: {
                    title: {
                        text: yAxisLabel
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: valSuffix
                },
                series: [{
                    name: 'RCP-4.5',
                    data: scenario45Data
                }, {
                    name: 'RCP-8.5',
                    data: scenario85Data
                }]
            });
        },

        showMapScenarioTempChartOnBtnClick: function(){
            // Load chart values on temperature button click
            if  (households.globalVal.clickTemp){
                households.showMapEmissionsScenarioChart("FUTURE TEMPERATURE CHANGE", households.globalVal.rcpTempData85, households.globalVal.rcpTempData45, "Temperature (°C)", "°C");
            }
            households.globalVal.clickTemp = false; // Disable temperature button
            households.globalVal.clickPrec = true; // Enable precipitation button
            households.globalVal.mapClickEvent = true; // Show temperature scenario chart
        },

        showMapScenarioPrecChartOnBtnClick: function(){
            // Load chart values on precipitation button click
            if  (households.globalVal.clickPrec ){
                households.showMapEmissionsScenarioChart("CHANGE IN PRECIPITATION", households.globalVal.rcpPrecData85, households.globalVal.rcpPrecData45, "Precipitation (%)", "%");
            }
            households.globalVal.clickTemp = true;
            households.globalVal.clickPrec = false;
            households.globalVal.mapClickEvent = false; // Show precipitation scenario chart
        }
    };

    return households;
})();

app.initMap();
app.getMapComponent();
app.resizeMapCanvasHeight();
app.mapComponent();
