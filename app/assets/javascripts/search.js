// an empty object initialized
var n = {};
// the search function
var relatedArtistSearch = function() {
  var init = function() {
    'use strict';
    // this speeds up the process of pinpointing the html element
    var $context = $('#wrapper');
    // this text will be appended to the URL Endpoint
    var $artist = $context.find('#artist');
    // this is the submit button
    var $findArtist = $context.find('#findArtist');
    // this is the form id
    var $artistSearch = $context.find('#artistSearch');
    // this draws the focus to the artist search box
    $artist.focus();
    // this prevents the default behavior of the form
    $artistSearch.submit(function(e) {
      e.preventDefault();
    }); 
    // this is the function that finds the tracks by making a GET request 
    // to spotify's tracks Endpoint and appending the artist name to it    
    $findArtist.click(function(e) {
      e.preventDefault();
      // jquery hide the image element in the splash partial
      $("#splash img").hide();  
      // a variable that gets the artist text from the input
      var artist = $artist.val();
      // the AJAX request 
      // the artist text gets appended to the endpoint
      $.getJSON("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", function(result) {
        n = {};
        d3.select("svg").remove();
        var artistId = result.artists.items[0].id;
        var artistName = result.artists.items[0].name;
        var artistImage = result.artists.items[0].images[1].url;
        var artistUrl = result.artists.items[0].external_urls.spotify;
        if (artistId) {
          n['0'] = {artist:artistName, url:artistUrl, image:artistImage, spotify_id:artistId};
        } else {
        };
        // Next, do another GET request to obtain related artists
        $.getJSON("https://api.spotify.com/v1/artists/" + artistId + "/related-artists", function(result) {
          // Loops through result
          for (var i = 0; i < 20; i++) {
            var a = result.artists[i].name;
            var img = result.artists[i].images[1].url;
            var u = result.artists[i].external_urls.spotify;
            var sid = result.artists[i].id;
            n[(i+1).toString()] = {artist:a, url:u, image:img, spotify_id:sid};
          }; 
          // if user is authenticated, send in their user_id
          // otherwise, just save this array n 
          // was previously http://localhost:3000/search_histories
          $.post('/search_histories', {search_history:{results_attributes:n}}, function(status) {
          });
          //The D3 Stuff 
          var nodes = [];
            for (var key in n) {
              nodes.push({ name: n[key].artist });
            };
          // initial data
          var graph = { 
            // Nodes gets populated with values from the AJAX call
            nodes: nodes, // this must be 21 objects exactly
            links: [
              { source: 0, target: 1 },
              { source: 0, target: 2 },
              { source: 0, target: 3 },
              { source: 0, target: 4 },
              { source: 0, target: 5 },
              { source: 0, target: 6 },
              { source: 0, target: 7 },
              { source: 0, target: 8 },
              { source: 0, target: 9 },
              { source: 0, target: 10 },
              { source: 0, target: 11 },
              { source: 0, target: 12 },
              { source: 0, target: 13 },
              { source: 0, target: 14 },
              { source: 0, target: 15 },
              { source: 0, target: 16 },
              { source: 0, target: 17 },
              { source: 0, target: 18 },
              { source: 0, target: 19 },
              { source: 0, target: 20 }
            ]
          };
          // console.log(graph);
          // Width and height
          var w = 750;
          var h = 500;
           // define colors
          var color = d3.scale.category20c();
          // initialize the force layout, using the nodes an dedges in dataset
          var force = d3.layout.force()
            .size([w, h])
            .linkDistance(200) // length of the edges bw nodes
            .charge(-600) // repel velocity
          // create an SVG element
          var svg = d3.select("#graph")
          .append("svg")
          .attr("width", w)
          .attr("height", h);
          var drawGraph = function(graph) {
            force
              .nodes(graph.nodes)
              .links(graph.links)
              .start();
            // create an SVG for each link between nodes as a line
            var link = svg.selectAll(".link")
              .data(graph.links)
              .enter()
              .append("line")
              .attr("class", "link")
              .style("stroke-width", function(d) { return Math.sqrt(d.value); });
            // 
            var gnodes = svg.selectAll('g.gnode')
              .data(graph.nodes)
              .enter()
              .append('g')
              .classed('gnode', true);
            // 
            var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .style("fill", function(d, i) { return color(i); })
            .on('click', nodeClick)
            .call(force.drag); 
            // This appends the text to the node
            var labels = gnodes.append("text")
              .on('click', nodeClick)
              .text(function(d) { return d.name; });
            // console.log(labels);
            // every time you tick, take the new x/y values and update in the DOM
            force.on("tick", function() {
              link.attr("x1", function(d) {
                return d.source.x;
              })
              .attr("y1", function(d) {
                return d.source.y;
              })
              .attr("x2", function(d) {
                return d.target.x;
              })
              .attr("y2", function(d) {
                return d.target.y;
              });
              gnodes.attr("transform", function(d) {
                return 'translate(' + [d.x, d.y] + ')';
              });
            });
          }; // closes out the drawGraph function
          drawGraph(graph); // this calls the drawGraph function
        }); // this closes out the second getJSON function
      }); // this closes out first the getJSON function
    }); // this closes out the main search click function
    function nodeClick(nodeObj) {
      console.log(nodeObj.name);
      var artist = nodeObj.name
      // the AJAX request 
      // the artist text gets appended to the endpoint
      $.getJSON("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", function(result) {
        // first, obtain the Spotify Artist ID
        n = {};
        d3.select("svg").remove()
        var artistId = result.artists.items[0].id;
        var artistName = result.artists.items[0].name;
        var artistImage = result.artists.items[0].images[1].url;
        var artistUrl = result.artists.items[0].external_urls.spotify;
        console.log(artistName);
        if (artistId) {
          n['0'] = {artist:artistName, url:artistUrl, image:artistImage, spotify_id:artistId};
        } else {
        };
        // Next, do another GET request to obtain related artists
        $.getJSON("https://api.spotify.com/v1/artists/" + artistId + "/related-artists", function(result) {
          // Loops through the results and prints out each Artist's name
          for (var i = 0; i < 20; i++) {
            var a = result.artists[i].name;
            var img = result.artists[i].images[1].url;
            var u = result.artists[i].external_urls.spotify;
            var sid = result.artists[i].id;
            n[(i+1).toString()] = {artist:a, url:u, image:img, spotify_id:sid};
          } 
          // if user is authenticated, send in their user_id
          // otherwise, just save this array n
          $.post('/search_histories', {search_history:{results_attributes:n}}, function(status) {
          });
          //The D3 Stuff
          var nodes = [];
            for (var key in n) {
              nodes.push({ name: n[key].artist });
            };
          // initial data
          var graph = { 
            // Nodes gets populated with values from the AJAX call
            nodes: nodes, // this must be 21 objects exactly
            links: [
              { source: 0, target: 1 },
              { source: 0, target: 2 },
              { source: 0, target: 3 },
              { source: 0, target: 4 },
              { source: 0, target: 5 },
              { source: 0, target: 6 },
              { source: 0, target: 7 },
              { source: 0, target: 8 },
              { source: 0, target: 9 },
              { source: 0, target: 10 },
              { source: 0, target: 11 },
              { source: 0, target: 12 },
              { source: 0, target: 13 },
              { source: 0, target: 14 },
              { source: 0, target: 15 },
              { source: 0, target: 16 },
              { source: 0, target: 17 },
              { source: 0, target: 18 },
              { source: 0, target: 19 },
              { source: 0, target: 20 }
            ]
          }; // closes out graph array
          // Width and height
          var w = 750;
          var h = 500;
           // define colors
          var color = d3.scale.category20c();
          // initialize the force layout, using the nodes an dedges in dataset
          var force = d3.layout.force()
            .size([w, h])
            .linkDistance(200) // length of the edges bw nodes
            .charge(-600) // repel velocity
          // create an SVG element
          var svg = d3.select("#graph")
          .append("svg")
          .attr("width", w)
          .attr("height", h);
          var drawGraph = function(graph) {
            force
              .nodes(graph.nodes)
              .links(graph.links)
              .start();
            // create an SVG for each link between nodes as a line
            var link = svg.selectAll(".link")
              .data(graph.links)
              .enter()
              .append("line")
              .attr("class", "link")
              .style("stroke-width", function(d) { return Math.sqrt(d.value); });            
            // 
            var gnodes = svg.selectAll('g.gnode')
              .data(graph.nodes)
              .enter()
              .append('g')
              .classed('gnode', true);
            // 
            var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .style("fill", function(d, i) { return color(i); })
            .on('click', nodeClick)
            .call(force.drag); 
            // This appends the text to the node
            var labels = gnodes.append("text")
              .on('click', nodeClick)
              .text(function(d) { return d.name; });
            // every time you tick, take the new x/y values and update in the DOM
            force.on("tick", function() {
              link.attr("x1", function(d) {
                return d.source.x;
              })
              .attr("y1", function(d) {
                return d.source.y;
              })
              .attr("x2", function(d) {
                return d.target.x;
              })
              .attr("y2", function(d) {
                return d.target.y;
              });
              gnodes.attr("transform", function(d) {
                return 'translate(' + [d.x, d.y] + ')';
              });
            });
          }; // closes out the drawGraph function
          // This is the function that calls the Graph to be drawn
          drawGraph(graph);
        }); // closes out second JSON
      }); // closes out first JSON    
    }; // closes out nodeClick()
  }; // this closes out the init function
  return {
    init: init
  };
}(); // this closes out the whole thing