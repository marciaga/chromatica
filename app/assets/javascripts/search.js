var relatedArtistSearch = function() {
  var init = function() {
    var n = {},
         $context,
         $artist,
         $findArtist,
         $artistSearch,
         artist,
         artistId,
         artistName,
         artistImage,
         artistUrl;

    function nodeClick(nodeObject) {
      ajaxCalls(nodeObject.name);
    };

    function drawGraph(n) {
      d3.select("svg").remove()
      // more D3 variables
      // Width and height
      var w = 960;
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

      var graph = {
      // Nodes gets populated with values from the AJAX call
      nodes: [
        { name: n[0].artist },
        { name: n[1].artist },
        { name: n[2].artist },
        { name: n[3].artist },
        { name: n[4].artist },
        { name: n[5].artist },
        { name: n[6].artist },
        { name: n[7].artist },
        { name: n[8].artist },
        { name: n[9].artist },
        { name: n[10].artist},
        { name: n[11].artist },
        { name: n[12].artist },
        { name: n[13].artist },
        { name: n[14].artist },
        { name: n[15].artist },
        { name: n[16].artist},
        { name: n[17].artist },
        { name: n[18].artist },
        { name: n[19].artist },
        { name: n[20].artist }
        ], // this must be 21 objects exactly
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

      var gnodes = svg.selectAll('g.gnode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);

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
    };

    function spotifyCall(event) {
      $context = $('#wrapper');
      $artist = $context.find('#artist');
      $findArtist = $context.find('#findArtist');
      $artistSearch = $context.find('#artistSearch');
      // this draws the focus to the artist search box
      $artist.focus();
      // this prevents the default behavior of the form
      $artistSearch.submit(function(event) {
        event.preventDefault();
      });

      if (!$artist.val()) { return; }
      artist = $artist.val();
      //  hide the image element in the splash partial
      $("#splash img").hide();

      ajaxCalls(artist);
    };

    function ajaxCalls(artist) {
      $.ajax({
        type: 'GET',
        url:  'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
        dataType: 'json'
      }).done(function (result) {

        n = {};
        artistId = result.artists.items[0].id;
        artistName = result.artists.items[0].name;
        artistImage = result.artists.items[0].images[1].url ? result.artists.items[0].images[1].url :  'http://placehold.it/300&text=no+image+found';

        artistUrl = result.artists.items[0].external_urls.spotify;

        if (artistId) {
          n['0'] = {artist: artistName, url: artistUrl, image: artistImage, spotify_id: artistId};
        }

        $.ajax({
          type: 'GET',
          url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists' ,
          dataType: 'json'
        }).done(function (result) {

          for (var i = 0; i < 20; i++) {
            artistName = result.artists[i].name;
            artistImage = result.artists[i].images[1] ? result.artists[i].images[1].url : 'http://placehold.it/300&text=no+image+found';
            artistUrl = result.artists[i].external_urls.spotify;
            artistId = result.artists[i].id;
            n[(i+1).toString()] = {artist: artistName, url: artistUrl, image: artistImage, spotify_id: artistId};
          };
          // if user is authenticated, send in their user_id otherwise, just save this array n
          // was previously http://localhost:3000/search_histories
          $.post('/search_histories', {search_history:{results_attributes:n}}, function() {});
          drawGraph(n);
        });
      });
    };

    $('body').on('click', '#findArtist', function(event) {
      spotifyCall(event);
    });
  }; // this closes out the init function
  return {
    init: init
  };
}(); // this closes out the whole thing
