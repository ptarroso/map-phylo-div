// Some global variables
var speciesID = [];
var minConf = 90;
var maxOffset = 200000;
var occ = {found: [], notfound: []};

// Match species names and fetch taxon IDs

var resetOcc = function() {
    occ = {found: [], notfound: []};
};

var addSp = function(data) {
    // add a JSON data to list of species found
    if (data.confidence >= minConf) {
        speciesID.push(data);
        console.log("Fetched data for " + data.canonicalName);
        if ($("#warninfo").length > 0) {
            $("#warninfo").html("Matched " + data.canonicalName + " with GBIF Taxonomy");
        }
    } else {
        alert("Cannot retrieve data with high confidence for species name " + data.canonicalName);
    }
};


var fetchAllTaxonID = function (i) {
    // populate speciesID by fetching data from GBIF 
    if (i === undefined) {
        var i = 0;
    }
    
    if (i == species.length) {
        // stop recursion
        return(0);
    } 

    var url = "http://api.gbif.org/v1/species/match?name=" + encodeURIComponent(species[i].trim());
    var promise = fetch(url)
          .then(res => res.json())
          .then(addSp)
          .then(function() { return(fetchAllTaxonID(i+1)); } )
    return(promise);
};

/// Fetch Occurrence data
var fetchAllOccurences = function(i, offset, lastChunk) {
    // populate Occ by fetching data from GBIF (with recursion)
    if (i === undefined) {
        i = 0;
    }

    if (offset === undefined ) {
        offset = 0;
    }
    if (lastChunk === undefined) {
        lastChunk = false;
    }

    if (lastChunk || offset > maxOffset) {
        // go to next species in list
        i += 1;
        offset = 0;
        lastChunk = false;
        //progress.value = (i / speciesID.length) * 100;
    }
    
    if (i == speciesID.length) {
        // stop recursion
        return( 0 );
    } else {
        if ($("#warninfo").length > 0) {
            var ct = i + 1;
            $("#warninfo").html("Fetching records for " + speciesID[i].canonicalName + " (" + ct + "/" + speciesID.length + ")");
        }        
    }
    var url = "http://api.gbif.org/v1/occurrence/search?taxonKey=" + speciesID[i].usageKey;
    url += "&hasCoordinate=true&hasGeospatialIssue=false&limit=300"
    url += "&offset=" + offset
    // Assumes a global variable extent to define the occurrence textarea
    url += "&decimalLongitude=" + extent[0] + "," + extent[2];
    url += "&decimalLatitude=" + extent[1] + "," + extent[3];
    var promise = fetch(url)
        .then(res => res.json())
        .then(occurenceToArray)
        .then(function(data) { 
            return(fetchAllOccurences(i, data.offset + 300, data.endOfRecords)); 
            }
        )
    return(promise);
    
};


var occurenceToArray = function(data) {
    // Process raw occurrence data to fill in the occ array
    if (data.count > maxOffset & data.offset == 0) {
        var msg = "The species " + data.results[0].species + " has more than ";
        msg += maxOffset + " records. Discarding the remaining due to access limitation.";
        alert(msg);
    }   
    if (data.count > 0) {
        // get the coordinates
        var coords = [];
        for (var i=0; i < data.results.length; i++) {
            coords.push([data.results[i].decimalLongitude, data.results[i].decimalLatitude]);
        }

        // create or add to occurence list
        if (data.offset > 0) {
            // append to existing list
            var i = occ.found.findIndex(function(i) { return i.name == data.results[0].species });
            occ.found[i].coords = occ.found[i].coords.concat(coords);
        } else {
            // create a new element
            occ.found.push( {id: occ.found.length +  occ.notfound.length, name: data.results[0].species, coords: coords} );
        }
    } else {
        occ.notfound.push( { id: occ.found.length +  occ.notfound.length} );
    };
    return(data);
};
