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
                    var tabPaneFarmSystem = households.showMapFarmSystem(mapData, gridMapLayer); //show farming systems
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
                    //show temperature scenario text for rcp 8.5 and 4.5
                    tabPaneHtml = '<div class="map-rcp-body">' + tabPaneHtmlScenario85.tabPaneHtml + tabPaneHtmlScenario45.tabPaneHtml + '<div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div>';
                    $('.tab-pane-rcp').append(tabPaneHtml);
                    //show farming system text
                    tabPaneHtml = '<div class="map-rcp-body">' + tabPaneFarmSystem + '</tbody></table><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
                    $('.tab-pane-farmsys-tab').append(tabPaneHtml);
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

        showMapFarmSystem: function(mapData, gridMapLayer){
            var count = 0;
            //var count_out = 0;
            //var count_in = 0;
            var tabPaneHtml = "";
            var cnty_prof = {"profile": [{"country": "Tunisia", "level_2": "", "level_1": "", "fid": "0"}, {"country": "Algeria", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "1"}, {"country": "Morocco", "level_2": "", "level_1": "", "fid": "2"}, {"country": "Libyan Arab Jamahiriya", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "3"}, {"country": "Egypt", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "4"}, {"country": "Egypt", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "4"}, {"country": "Egypt", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "4"}, {"country": "Western Sahara", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "5"}, {"country": "Western Sahara", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "5"}, {"country": "Mauritania", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "6"}, {"country": "Mauritania", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "6"}, {"country": "Mauritania", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "6"}, {"country": "Mauritania", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "6"}, {"country": "Mauritania", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "6"}, {"country": "Mauritania", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "6"}, {"country": "Mali", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "7"}, {"country": "Mali", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "7"}, {"country": "Mali", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "7"}, {"country": "Mali", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "7"}, {"country": "Mali", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "7"}, {"country": "Niger", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "8"}, {"country": "Niger", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "8"}, {"country": "Niger", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "8"}, {"country": "Niger", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "8"}, {"country": "Niger", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "8"}, {"country": "Chad", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "9"}, {"country": "Chad", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "9"}, {"country": "Chad", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "9"}, {"country": "Chad", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "9"}, {"country": "Chad", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "9"}, {"country": "Chad", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "9"}, {"country": "Hala'ib triangle", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "10"}, {"country": "Hala'ib triangle", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "10"}, {"country": "Sudan", "level_2": "Maize-livestock (Ethiopian) sub-system", "level_1": "Maize mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "11"}, {"country": "Sudan", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "11"}, {"country": "Sudan", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "11"}, {"country": "Sudan", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "11"}, {"country": "Sudan", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "11"}, {"country": "Sudan", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "11"}, {"country": "Sudan", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "11"}, {"country": "Ma'tan al-Sarra", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "12"}, {"country": "Eritrea", "level_2": "Wheat-livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "13"}, {"country": "Eritrea", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "13"}, {"country": "Eritrea", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "13"}, {"country": "Eritrea", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "13"}, {"country": "Eritrea", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "13"}, {"country": "Eritrea", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "13"}, {"country": "Eritrea", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "13"}, {"country": "Eritrea", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "13"}, {"country": "Senegal", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "14"}, {"country": "Senegal", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "14"}, {"country": "Senegal", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "14"}, {"country": "Senegal", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "14"}, {"country": "Senegal", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "14"}, {"country": "Senegal", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "14"}, {"country": "Burkina Faso", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "15"}, {"country": "Burkina Faso", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "15"}, {"country": "Burkina Faso", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "15"}, {"country": "Burkina Faso", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "15"}, {"country": "Ethiopia", "level_2": "Maize-livestock (Ethiopian) sub-system", "level_1": "Maize mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Southern Ethiopia highland perrenial sub-system", "level_1": "Highland perennial", "fid": "16"}, {"country": "Ethiopia", "level_2": "Livestock-cereals highland mixed  sub-system", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Wheat-livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "16"}, {"country": "Ethiopia", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "16"}, {"country": "Ethiopia", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "16"}, {"country": "Ethiopia", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "16"}, {"country": "Ethiopia", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "16"}, {"country": "Ethiopia", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "16"}, {"country": "Nigeria", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "17"}, {"country": "Nigeria", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "17"}, {"country": "Nigeria", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Cassava-cocoyam root tuber sub-system", "level_1": "Root and tuber crop", "fid": "17"}, {"country": "Nigeria", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "17"}, {"country": "Nigeria", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "17"}, {"country": "Nigeria", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "17"}, {"country": "Nigeria", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "17"}, {"country": "Cameroon", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "18"}, {"country": "Cameroon", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "18"}, {"country": "Cameroon", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "18"}, {"country": "Cameroon", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "18"}, {"country": "Cameroon", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Cassava-cocoyam root tuber sub-system", "level_1": "Root and tuber crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "18"}, {"country": "Cameroon", "level_2": "Sahelian pastoral sub-system", "level_1": "Pastoral", "fid": "18"}, {"country": "Cameroon", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "18"}, {"country": "Cameroon", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "18"}, {"country": "Cameroon", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "18"}, {"country": "Djibouti", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "19"}, {"country": "Djibouti", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "19"}, {"country": "Djibouti", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "19"}, {"country": "Guinea", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "20"}, {"country": "Guinea", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "20"}, {"country": "Guinea", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "20"}, {"country": "Guinea", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "20"}, {"country": "Guinea", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "20"}, {"country": "Guinea", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "20"}, {"country": "Benin", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "21"}, {"country": "Benin", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "21"}, {"country": "Benin", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "21"}, {"country": "Benin", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "21"}, {"country": "Benin", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "21"}, {"country": "Benin", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "21"}, {"country": "Benin", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "21"}, {"country": "Somalia", "level_2": "Maize-livestock (Ethiopian) sub-system", "level_1": "Maize mixed", "fid": "22"}, {"country": "Somalia", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "22"}, {"country": "Somalia", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "22"}, {"country": "Somalia", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "22"}, {"country": "Somalia", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "22"}, {"country": "Somalia", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "22"}, {"country": "Guinea-Bissau", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "23"}, {"country": "Guinea-Bissau", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "23"}, {"country": "Ghana", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "24"}, {"country": "Ghana", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "24"}, {"country": "Ghana", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "24"}, {"country": "Ghana", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "24"}, {"country": "Ghana", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "24"}, {"country": "Ghana", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "24"}, {"country": "Togo", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "25"}, {"country": "Togo", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "25"}, {"country": "Togo", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "25"}, {"country": "Togo", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "25"}, {"country": "Togo", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "25"}, {"country": "Togo", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "25"}, {"country": "Togo", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "25"}, {"country": "Central African Republic", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "26"}, {"country": "Central African Republic", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "26"}, {"country": "Central African Republic", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-cocoyam root tuber sub-system", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "26"}, {"country": "Central African Republic", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "26"}, {"country": "C?te d'Ivoire", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cassava-yam/cocoyam based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "27"}, {"country": "C?te d'Ivoire", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "27"}, {"country": "Sierra Leone", "level_2": "Cereal-root and tuber-pulse-oilseed cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "28"}, {"country": "Sierra Leone", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "28"}, {"country": "Liberia", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "29"}, {"country": "Liberia", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "29"}, {"country": "Liberia", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "29"}, {"country": "Liberia", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "29"}, {"country": "Democratic Republic of the Congo", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Low population density maize-root crops (central African) sub-system", "level_1": "Maize mixed", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Albertine Rift highland perrenial sub-system", "level_1": "Highland perennial", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Yam -cassava- based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "30"}, {"country": "Democratic Republic of the Congo", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "30"}, {"country": "Ilemi triangle", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "31"}, {"country": "Kenya", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "32"}, {"country": "Kenya", "level_2": "Semi-mechanized maize mixed (Tanzanian) sub-system", "level_1": "Maize mixed", "fid": "32"}, {"country": "Kenya", "level_2": "Northern Tanzania  highland perrenial sub-system", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "Central Kenya highland perrenial sub-system", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "Western Kenya highland perrenial sub-system", "level_1": "Highland perennial", "fid": "32"}, {"country": "Kenya", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "32"}, {"country": "Kenya", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "32"}, {"country": "Kenya", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "32"}, {"country": "Uganda", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "33"}, {"country": "Uganda", "level_2": "Albertine Rift highland perrenial sub-system", "level_1": "Highland perennial", "fid": "33"}, {"country": "Uganda", "level_2": "Western Kenya highland perrenial sub-system", "level_1": "Highland perennial", "fid": "33"}, {"country": "Uganda", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "33"}, {"country": "Uganda", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "33"}, {"country": "Uganda", "level_2": "Eastern African pastoral sub-system", "level_1": "Pastoral", "fid": "33"}, {"country": "Equatorial Guinea", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "34"}, {"country": "Equatorial Guinea", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "34"}, {"country": "Equatorial Guinea", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "34"}, {"country": "Congo", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "35"}, {"country": "Congo", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "35"}, {"country": "Congo", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "35"}, {"country": "Congo", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "35"}, {"country": "Gabon", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "36"}, {"country": "Gabon", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "36"}, {"country": "Gabon", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "36"}, {"country": "Gabon", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "36"}, {"country": "United Republic of Tanzania", "level_2": "Hoe/tractor maize mixed (Kenya-Ugandan) sub-system", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Semi-mechanized maize mixed (Tanzanian) sub-system", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "High population density low livestock maize mixed (Malawian) sub-system", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Low population density maize (Mozambiquan) sub-system", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Albertine Rift highland perrenial sub-system", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Northern Tanzania  highland perrenial sub-system", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Southern Tanzania highland perrenial sub-system", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Western Kenya highland perrenial sub-system", "level_1": "Highland perennial", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "East African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "37"}, {"country": "United Republic of Tanzania", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "37"}, {"country": "Rwanda", "level_2": "Albertine Rift highland perrenial sub-system", "level_1": "Highland perennial", "fid": "38"}, {"country": "Rwanda", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "38"}, {"country": "Rwanda", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "38"}, {"country": "Burundi", "level_2": "Albertine Rift highland perrenial sub-system", "level_1": "Highland perennial", "fid": "39"}, {"country": "Burundi", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "39"}, {"country": "Burundi", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "39"}, {"country": "Angola", "level_2": "Low population density maize-root crops (central African) sub-system", "level_1": "Maize mixed", "fid": "40"}, {"country": "Angola", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "40"}, {"country": "Angola", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "40"}, {"country": "Angola", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "40"}, {"country": "Angola", "level_2": "Cassava-sweet potato-potato-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "40"}, {"country": "Angola", "level_2": "Cassava-based root tuber sub-system", "level_1": "Root and tuber crop", "fid": "40"}, {"country": "Angola", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "40"}, {"country": "Angola", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "40"}, {"country": "Angola", "level_2": "Southern African pastoral sub-system", "level_1": "Pastoral", "fid": "40"}, {"country": "Angola", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "40"}, {"country": "Angola", "level_2": "Forest-based", "level_1": "Forest-based", "fid": "40"}, {"country": "Angola", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "40"}, {"country": "Zambia", "level_2": "Semi-mechanized maize mixed (Tanzanian) sub-system", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "High population density low livestock maize mixed (Malawian) sub-system", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Low population density maize-root crops (central African) sub-system", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Low population density maize (Mozambiquan) sub-system", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "41"}, {"country": "Zambia", "level_2": "Southern Tanzania highland perrenial sub-system", "level_1": "Highland perennial", "fid": "41"}, {"country": "Zambia", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "41"}, {"country": "Zambia", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "41"}, {"country": "Zambia", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "41"}, {"country": "Malawi", "level_2": "Semi-mechanized maize mixed (Tanzanian) sub-system", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "High population density low livestock maize mixed (Malawian) sub-system", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Low population density maize (Mozambiquan) sub-system", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "42"}, {"country": "Malawi", "level_2": "Southern Tanzania highland perrenial sub-system", "level_1": "Highland perennial", "fid": "42"}, {"country": "Malawi", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "42"}, {"country": "Malawi", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "42"}, {"country": "Madagascar", "level_2": "Maize irrigated rice (Madagascan) sub-system", "level_1": "Maize mixed", "fid": "43"}, {"country": "Madagascar", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "43"}, {"country": "Madagascar", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "43"}, {"country": "Madagascar", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "43"}, {"country": "Madagascar", "level_2": "Humid lowland tree crop", "level_1": "Humid lowland tree crop", "fid": "43"}, {"country": "Mozambique", "level_2": "Semi-mechanized maize mixed (Tanzanian) sub-system", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "High population density low livestock maize mixed (Malawian) sub-system", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Low population density maize (Mozambiquan) sub-system", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Dualistic maize mixed (southern African) sub-system", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Medium population density maize mixed (Zambian) sub-system", "level_1": "Maize mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "44"}, {"country": "Mozambique", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "44"}, {"country": "Mozambique", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "44"}, {"country": "Mozambique", "level_2": "Perennial mixed", "level_1": "Perennial mixed", "fid": "44"}, {"country": "Zimbabwe", "level_2": "Low population density maize (Mozambiquan) sub-system", "level_1": "Maize mixed", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Dualistic maize mixed (southern African) sub-system", "level_1": "Maize mixed", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Lake fish based sub-system", "level_1": "Fish-based", "fid": "45"}, {"country": "Zimbabwe", "level_2": "Floodplain fish based sub-system", "level_1": "Fish-based", "fid": "45"}, {"country": "Namibia", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "46"}, {"country": "Namibia", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "46"}, {"country": "Namibia", "level_2": "Southern African pastoral sub-system", "level_1": "Pastoral", "fid": "46"}, {"country": "Namibia", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "46"}, {"country": "Namibia", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "46"}, {"country": "Botswana", "level_2": "Dualistic maize mixed (southern African) sub-system", "level_1": "Maize mixed", "fid": "47"}, {"country": "Botswana", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "47"}, {"country": "Botswana", "level_2": "Southern African pastoral sub-system", "level_1": "Pastoral", "fid": "47"}, {"country": "South Africa", "level_2": "Dualistic maize mixed (southern African) sub-system", "level_1": "Maize mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Livestock-cereals highland mixed  sub-system", "level_1": "Highland mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "48"}, {"country": "South Africa", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "48"}, {"country": "South Africa", "level_2": "Coral reef fish based sub-system", "level_1": "Fish-based", "fid": "48"}, {"country": "South Africa", "level_2": "Sandy coast fish based sub-system", "level_1": "Fish-based", "fid": "48"}, {"country": "South Africa", "level_2": "Southern African pastoral sub-system", "level_1": "Pastoral", "fid": "48"}, {"country": "South Africa", "level_2": "Perennial mixed", "level_1": "Perennial mixed", "fid": "48"}, {"country": "South Africa", "level_2": "", "level_1": "", "fid": "48"}, {"country": "South Africa", "level_2": "Arid pastoral-oases", "level_1": "Arid pastoral-oases", "fid": "48"}, {"country": "Swaziland", "level_2": "Southern African agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "49"}, {"country": "Swaziland", "level_2": "Perennial mixed", "level_1": "Perennial mixed", "fid": "49"}, {"country": "Lesotho", "level_2": "Dualistic maize mixed (southern African) sub-system", "level_1": "Maize mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Livestock-cereals highland mixed  sub-system", "level_1": "Highland mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Maize livestock highland mixed  sub-system", "level_1": "Highland mixed", "fid": "50"}, {"country": "Lesotho", "level_2": "Perennial mixed", "level_1": "Perennial mixed", "fid": "50"}, {"country": "Gambia", "level_2": "Cereal-pulse-oilseed-root and tuber cereal root crop sub-system", "level_1": "Cereal-root crop mixed", "fid": "51"}, {"country": "Gambia", "level_2": "Sahelian agro-pastoral sub-system", "level_1": "Agro-pastoral", "fid": "51"}, {"country": "Gambia", "level_2": "Mangrove deltaic fish based sub-system", "level_1": "Fish-based", "fid": "51"}, {"country": "Gambia", "level_2": "Irrigated", "level_1": "Irrigated", "fid": "51"}]};

            for (var key in mapData) {
                if (mapData.hasOwnProperty(key)) { //check if data has key
                    if (key.indexOf("ADM") !== -1) { //search for word 'ADM' in keys
                        if (count < 1){
                            tabPaneHtml += '<p class="map-rcp-emission-title">Farming Systems</p><div class="map-farmsys-body"><table class="table table-condensed table-striped"><tbody>'; //set title
                        }
                        if (map.hasLayer(layers.admin0)) { //for admin0
                            if (key == "ADM0_NAME") { // Country name key
                                for (var i = 0; i < cnty_prof.profile.length; i++) { //get farming system information
                                    var obj = cnty_prof.profile[i];
                                    if (obj.hasOwnProperty("country") && obj.hasOwnProperty("level_2")) { //check if object has property
                                        if (mapData[key] == obj["country"].toString()) {
                                            //tabPaneHtml += '<p class="map-farmsys"><span class="map-rcp-year-data">' + obj["level_2"].toString() + '</span></p>';
                                            tabPaneHtml += '<tr><td class="map-rcp-year-data">' + obj["level_2"].toString() + '</td></tr>';
                                        }
                                    }
                                }
                            }
                        }
                        count += 1;
                    }
                }
            }
            return tabPaneHtml;
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
