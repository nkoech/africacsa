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
                        cnty_prof = window.admin0Data; // Get external admin0 JSON file
                        tabPaneFarmSystem = households.showMapFarmSystem(mapData, cnty_prof, "ADM0_NAME");
                    } else if (map.hasLayer(layers.admin1)) {
                        cnty_prof = window.admin1Data;
                        tabPaneFarmSystem = households.showMapFarmSystem(mapData, cnty_prof, "ADM1_NAME");
                    }else{
                        cnty_prof = window.admin2Data;
                        tabPaneFarmSystem = households.showMapFarmSystem(mapData, cnty_prof, "ADM2_NAME");
                    }
                    // Chart html
                    tabPaneHtml = '<div class="map-rcp-body"><div class="row"><div class="tab-pane-rcp-btn"><div class="col-xs-6"><a class="btn btn-large btn-danger btn-md" id="btnTemp" onclick="app.showMapScenarioTempChartOnBtnClick();"><span class="btn-label"> Temperature </span></a></div><div class="col-xs-6"><a class="btn btn-large btn-primary btn-md pull-right" id="btnPrec" onclick="app.showMapScenarioPrecChartOnBtnClick();"><span class="btn-label"> Precipitation </span></a></div></div></div><div class="map-rcp-chart"><div id="map-rcp-chart-container"></div></div></div>';
                    $('.tab-pane-rcp-chart').append(tabPaneHtml); // Append html to existing html class to show chart
                    $("#map-rcp-chart-container").width(($(window).width() - $(".map-canvas").width()) - 7); // Set chart container width
                    //show temperature and precipitation scenario chart for rcp 8.5 and 4.5
                    if  (households.globalVal.mapClickEvent) {
                        households.showMapEmissionsScenarioChart("FUTURE TEMPERATURE CHANGE", tabPaneHtmlScenario85.rcpTempData, tabPaneHtmlScenario45.rcpTempData, "Temperature (°C)", "°C");
                        households.globalVal.clickTemp = false;
                        $('#btnTemp').disable(true); // Grey out / Disable temperature button
                    } else{
                        households.showMapEmissionsScenarioChart("CHANGE IN PRECIPITATION", tabPaneHtmlScenario85.rcpPrecData, tabPaneHtmlScenario45.rcpPrecData, "Precipitation (%)", "%");
                        $('#btnPrec').disable(true); // Grey out / Disable precipitation button
                    }
                    // Assign rcp 8.5 and 4.5 temperature data to global variables
                    households.globalVal.rcpTempData45 = tabPaneHtmlScenario85.rcpTempData;
                    households.globalVal.rcpTempData85 = tabPaneHtmlScenario45.rcpTempData;
                    // Assign rcp 8.5 and 4.5 precipitation data to global variables
                    households.globalVal.rcpPrecData45 = tabPaneHtmlScenario85.rcpPrecData;
                    households.globalVal.rcpPrecData85 = tabPaneHtmlScenario45.rcpPrecData;

                    /*//Show temperature scenario text for rcp 8.5 and 4.5
                    tabPaneHtml = '<div class="map-rcp-body">' + tabPaneHtmlScenario85.tabPaneHtml + tabPaneHtmlScenario45.tabPaneHtml + '<div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div>';
                    $('.tab-pane-rcp').append(tabPaneHtml);*/

                    if (tabPaneFarmSystem.farmSystemLevelNext.length !=0 ) {
                        // Assign data to global pagination variables
                        households.globalVal.farmSystemLevelNextData = tabPaneFarmSystem.farmSystemLevelNext;
                        households.globalVal.farmSystemPercNextData = tabPaneFarmSystem.farmSystemPercNext;
                        households.globalVal.farmSystemLevelPrevData = tabPaneFarmSystem.farmSystemLevelPrev;
                        households.globalVal.farmSystemPercPrevData = tabPaneFarmSystem.farmSystemPercPrev;
                        // Farm system with pagination - html display
                        tabPaneHtml = '<div class="map-rcp-body">' + tabPaneFarmSystem.tabPaneHtml + '</tbody></table><nav><ul class="pager"><li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next"><a onclick="app.showMapFarmSystemOnNextClick();">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
                        $('.tab-pane-farmsys-tab').append(tabPaneHtml);
                    }else{
                        // Farm system without pagination - html display
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

            /*$('.tab-pane-rcp').append(tabPaneHtml);*/

            $('.tab-pane-farmsys-tab').append(tabPaneHtml);
        },

        showMapEmissionsScenario: function(mapData, searchRcp, rcpCategory){

            /*var count_rcp = 0;
            var count_pc = 0;
            var tabPaneHtml = "";*/

            var rcpTempData = [];
            var rcpPrecData = [];

            for (var key in mapData) {
                if (mapData.hasOwnProperty(key)) { //check if data has key
                    if (key !== "No_HSEHOLD" && key !== "RURAL_POP") {
                        //Display emission scenario
                        if (key.indexOf(searchRcp)!== -1){

                            /*//Section emmision and temperature titles
                            if (count_rcp < 1){
                                tabPaneHtml += '<p class="map-rcp-emission-title">Emission Scenario ' + rcpCategory + '</p>';
                                tabPaneHtml += '<p class="map-rcp-emission-subtitle">Future Temperature Change</p>';
                            }*/

                            //List future temperature change by year
                            if (key.indexOf("AV_TMP") !== -1){
                                if (key.indexOf("_30") !== -1){

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';*/

                                    rcpTempData.push(mapData[key]);
                                } else if (key.indexOf("_50") !== -1){

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';*/

                                    rcpTempData.push(mapData[key]);
                                }else{

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span><span class="map-rcp-year-data">' + mapData[key] + '&deg;C</span></p>';*/
                                    rcpTempData.push(mapData[key]);
                                }
                            }else{

                                /*//Precipitation section title
                                if (count_pc < 1){
                                    tabPaneHtml += '<p class="map-rcp-emission-subtitle">Change in Precipitation</p>';
                                }*/

                                //List change in precipitation
                                if (key.indexOf("_30") !== -1){

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2030: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';*/

                                    rcpPrecData.push( + mapData[key]); // Convert to Number type and push
                                }
                                else if (key.indexOf("_50") !== -1){

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2050: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';*/

                                    rcpPrecData.push( + mapData[key]);
                                }else{

                                    /*tabPaneHtml += '<p class="map-rcp"><span class="map-rcp-year-label">2080: </span><span class="map-rcp-year-data">' + mapData[key] + '%</span></p>';*/

                                    rcpPrecData.push( + mapData[key]);
                                }

                                /*count_pc += 1;*/

                            }

                            /*count_rcp += 1;*/

                        }
                    }
                }
            }
            return {

                /*tabPaneHtml: tabPaneHtml,*/

                rcpTempData: rcpTempData,
                rcpPrecData: rcpPrecData
            };
        },

        showMapFarmSystem: function(mapData, cnty_prof, layerFieldName){
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
                            if (obj.hasOwnProperty("country") && obj.hasOwnProperty("region") && obj.hasOwnProperty("level_2")) { //check if object has property
                                if (households.replaceSpecialChar(mapData.ADM0_NAME) == households.replaceSpecialChar(obj["country"].toString())) { //check for country
                                    if (households.replaceSpecialChar(mapData[key])== households.replaceSpecialChar(obj["region"].toString())) { // check for region
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

        replaceSpecialChar: function(str){
            return str.replace(/[^a-zA-Z ]/g, ""); //Replace special characters
        },

        showMapFarmSystemOnNextClick: function(){
            var nextClick = true;
            households.showMapFarmSystemPagination(households.globalVal.farmSystemLevelNextData, households.globalVal.farmSystemPercNextData, nextClick);
        },

        showMapFarmSystemOnPrevClick: function() {
            var nextClick = false;
            households.showMapFarmSystemPagination(households.globalVal.farmSystemLevelPrevData, households.globalVal.farmSystemPercPrevData, nextClick);
        },

        showMapFarmSystemPagination: function(farmSystemLevelData, farmSystemPercData, nextClick){
            $(".tab-pane-farmsys-tab .map-rcp-body").remove(); //remove elements
            var tabPaneHtml = '<div class="map-rcp-body"><p class="map-rcp-emission-title">Farming Sub-systems</p><div class="map-farmsys-body"><table class="table table-condensed table-striped"><tbody>'; //set title
            for (var i = 0; i < farmSystemLevelData.length; i++) { // Add farming system data
                tabPaneHtml += '<tr><td class="map-rcp-year-data">' + farmSystemLevelData[i] + '<span class="map-frm-perc-data">' + ' ' + farmSystemPercData[i] + '%</span></td></tr>';
            }
            if (nextClick) { // Add pagination buttons
                tabPaneHtml += '</tbody></table><nav><ul class="pager"><li class="previous"><a onclick="app.showMapFarmSystemOnPrevClick();"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next disabled"><a href="#">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
            }else{
                tabPaneHtml += '</tbody></table><nav><ul class="pager"><li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Previous</a></li><li class="next"><a onclick="app.showMapFarmSystemOnNextClick();">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav><div class="map-rcp-source"><span>Source: <a href="http://climatewizard.ciat.cgiar.org/" target="_blank">&copy; Climate Wizard 2015 </a></span></div></div></div>';
            }
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
            households.globalVal.clickTemp = false; // Disable temperature button click event
            households.globalVal.clickPrec = true; // Enable precipitation button click event
            households.globalVal.mapClickEvent = true; // Show temperature scenario chart
            $('#btnPrec').disable(false); // Enable precipitation button
            $('#btnTemp').disable(true); // Grey out / Disable temperature button
        },

        showMapScenarioPrecChartOnBtnClick: function(){
            // Load chart values on precipitation button click
            if  (households.globalVal.clickPrec ){
                households.showMapEmissionsScenarioChart("CHANGE IN PRECIPITATION", households.globalVal.rcpPrecData85, households.globalVal.rcpPrecData45, "Precipitation (%)", "%");
            }
            households.globalVal.clickTemp = true;
            households.globalVal.clickPrec = false;
            households.globalVal.mapClickEvent = false; // Show precipitation scenario chart
            $('#btnTemp').disable(false);
            $('#btnPrec').disable(true);
        },

        extendJQueryProto: function(){
            jQuery.fn.extend({
                disable: function(state) {
                    return this.each(function() {
                        var $this = $(this);
                        $this.toggleClass('disabled', state);
                    });
                }
            });
        }
    };

    return households;
})();

app.initMap();
app.getMapComponent();
app.resizeMapCanvasHeight();
app.mapComponent();
app.extendJQueryProto();
