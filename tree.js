
// general tree functions

var includeNodes = function(source, target) {
    // check if the source Array of nodes includes all nodes found in target
    var m = 0;
    for (var i=0; i < target.length; i++) {
        if (source.filter(function(e) { return e.id == target[i].id; }).length > 0 ) {
            m += 1;
        }
    }
    if (m == target.length) {
        return true;
    } else {
        return false;
    }
}

var mra = function(nodes) {
    // Finds the most recent ancestor for a list of nodes
    // Algorithm: navigates backwards from the first node until find a parent
    //            that includes all other nodes.
    var node = nodes[0];
    while (!includeNodes(tree.descendants(node), nodes)) {
        node = node.parent;
    }
    return node;
}

var uniqueNodes = function(species) {
    // based on a list of tip names, return all nodes that go from each tip to
    // root without duplicates.

    // Get nodes of species
    var spNodes = [];
    for (var i=0; i < species.length; i++) {
        spNodes.push(tree.get_node_by_name(species[i]));
    }

    var uNodes = [];
    for (var i=0; i < spNodes.length; i++) {
        var node = spNodes[i];
        while (node.depth != 0) {
            if (uNodes.filter(function(e) { return e.id == node.id; }).length == 0 ) {
                uNodes.push(node);
            }
            node = node.parent;
        }
    }

    return uNodes;
}

var phyloDiv = function(species) {
    // Calculate Faith's Phlogenetic Diversity for a array of species,
    var uNd = uniqueNodes(species);
    var pd = 0;
    for (var i=0; i < uNd.length; i++) {
        // Edge lenghts from newick are stored in node.attribute as strings
        pd += parseFloat(uNd[i].attribute);
    }

    return pd;
}

var selectUnodes = function(species) {
    // Modify selection based on list of species
    var uNd =  uniqueNodes(species);
    tree.modify_selection (function (d) { 
        return (uNd.filter(function(e) { return e.id == d.target.id; }).length > 0 );
        }
    );
}

var getTipNames = function() {
    // get a list of current tree tip names
    var names = [];
    var nodes = tree.get_nodes();
    for (var i=0; i < nodes.length; i++) {
        if (tree.is_leafnode(nodes[i])) {
            names.push(nodes[i].name);
        }
    }
    return names;
}
