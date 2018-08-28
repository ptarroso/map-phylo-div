# Mapping phylogenetic diversity

This is the source code repository for the [Mapping phylogenetic diversity](http://webpages.icav.up.pt/pessoas/ptarroso/mapphylodiv/)
website.

Phylogenetic diversity (PD) aims to describe the evolutionary history within an assemblage
of species. This diversity metric is very different from other more common (as
species richness) because it includes the evolutionary relationships between species.
A low species richeness location, for instance, might harbor notable evolutionary 
histories that would be described by high values of PD. 

The websites relies on the client-side processing for calculating the PD after 
providing a phylogenetic tree. It uses [phylotree.js](https://github.com/veg/phylotree.js/tree/master)
to open and display the phylogenetic tree, [OpenLayers](https://openlayers.org/) 
to retrieve and display geographic information, and [Turf.js](http://turfjs.org/)
for the geoprocessing of the spatial data.


## How to use

See the [video](https://www.youtube.com/watch?v=c8UKP4VziXY) for an example.

## Future 

The website, although fully functional, it is still a prototype. It relies on 
the [GBIF Occurrence API](https://www.gbif.org/developer/occurrence) to get 
all occurrence records in the defined extent and for all the species in the 
phylogenetic tree. This means that most of the processing time is spent on
downloading data and, depending on number of species and defined extent, might
become unfeasible. 

The future versions of the website will rely on the [GBIF Maps API](https://www.gbif.org/developer/maps).
The vector tiles provided by the API are fast to read and display and will provide
a better user experience. However, on the downside, geoprocessing the vector tiles
is more difficult and the project will probably need to move to node.js to be able
to parse the tiles (with vector-tile.js, for instance).

So, future versions will:

* rely on GBIF Maps API
* provide more diversity metrics related to the phylogenies (evolutionary distinctivness,
phylogenetic endemicity, etc)
* export results to a comon GIS format
