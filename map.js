var getCurrentExtent = function() {
    // get current view extent and align to major axes
    var extent = map.getView().calculateExtent();
    extent[0] = extent[0] - extent[0] % 1;
    extent[1] = extent[1] - extent[1] % 1;
    extent[2] = extent[2] + 1 - extent[2] % 1;
    extent[3] = extent[3] + 1 - extent[3] % 1;
    return(extent);
}



var collectData = function(grid) {
    // uses the grid to collect data
    // Return a grid with unique species per polygon and remove polygons without species

    // creates turf points from occurence data (assumes occ as global var)
    var points = [];
    for (var i=0; i < occ.found.length; i++) {
        for (var j=0; j < occ.found[i].coords.length; j++) {
            points.push(turf.point(occ.found[i].coords[j], {species: occ.found[i].name}));
        }
    }
    points = turf.featureCollection(points);

    var collected = turf.collect(grid, points, 'species', 'species');
    
    var feat = [];
    for (var i=0; i < collected.features.length; i++) {
        var tmp = collected.features[i];
        if (tmp.properties.species.length > 0) {
            tmp.properties.species =  Array.from(new Set (tmp.properties.species));
            feat.push(tmp);
        }
    }

    collected.features = feat;

    return(collected);
};

var turfToSource = function(turfData) {
    var source = new ol.source.Vector();
    var format = new ol.format.GeoJSON();
    var marker = format.readFeatures(turfData);
    source.addFeatures(marker);
    return source;
};

var stroke = new ol.style.Stroke({
        color: "#ffffff44",
        width: 1
});
var pStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#ffffff00' }),
    stroke: stroke
});
var gradStyle1 = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#f7fcf5cc' }),
    stroke: stroke
});
var gradStyle2 = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#ccebc5cc' }),
    stroke: stroke
});
var gradStyle3 = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#8fd18ccc' }),
    stroke: stroke
});
var gradStyle4 = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#17813dcc' }),
    stroke: stroke
});
var gradStyle5 = new ol.style.Style({
    fill: new ol.style.Fill({ color: '#00441bcc' }),
    stroke: stroke
});


var stylePD =  function(feature, resolution) {
    var pd = feature.get('pd') / maxPD;
    if (pd < 0.2) {
        return(gradStyle1);
    } else if (pd < 0.4) {
        return(gradStyle2);
    } else if (pd < 0.6) {
        return(gradStyle3);
    } else if (pd < 0.8) {
        return(gradStyle4);
    } else {
        return(gradStyle5);
    }
};
