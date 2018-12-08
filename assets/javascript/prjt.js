$(document).ready(function() {
  // Initialize animations
  new WOW().init();
  var showLink;
  $("#search-btn").on("click", function() {
    //Set User Input
    var userSearch = $("#search-input")
      .val()
      .trim();
    console.log(userSearch);
    /* var date = moment(
      $("#date").val()
       .trim() 
    ); */
    //Songkicker, Capturing Band Name
    var queryURL =
      "https://api.songkick.com/api/3.0/search/artists.json?apikey=5KXgncncFq2otJd6&query=" +
      userSearch;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      showLink =
        response.resultsPage.results.artist[0].identifier[0].eventsHref;
      console.log(showLink);
      var eventsQuery = showLink + "?apikey=5KXgncncFq2otJd6";
      //Songkicker, Getting Upcoming Shows
      $.ajax({
        url: eventsQuery,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        $("#modal-band-shows").empty();
        //Looping through upcoming shows
        for (var i = 0; i <= 5; i++) {
          var venu = $("<a>")
            .text(response.resultsPage.results.event[i].venue.displayName)
            .attr({
              id: "venu",
              "data-lat": response.resultsPage.results.event[i].venue.lat,
              "data-long": response.resultsPage.results.event[i].venue.lng,
              href: "map-page.html",
              target: "_blank"
            });
          console.log(venu);
          var city = $("<p>")
            .text(response.resultsPage.results.event[i].location.city)
            .attr("id", "city");
          console.log(city);
          var linkOut = $("<a>")
            .text("Songkick Event Page")
            .attr("href", response.resultsPage.results.event[i].uri)
            .attr("target", "_blank");
          console.log(linkOut);
          var date = $("<p>")
            .text(response.resultsPage.results.event[i].start.date)
            .attr("id", "date");
          console.log(date);
          var line = $("<hr>");
          //Appending information to modal
          $("#modal-band-shows").append(date, city, venu, linkOut, line);
          //Sending lat and lng to google map
          $("#modal-band-shows").on("click", "#venu", function() {
            var location = $(this);
            (function initMap() {
              var myLatLng = {
                lat: location.attr("data-lat"),
                lng: location.attr("data-long")
              };
              console.log("This worked", myLatLng);
              var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 8,
                center: myLatLng,
                mapTypeId: "terrain"
              });
              var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "Hello World!"
              });
            })();
          });
        }
        //Appending band name to modal title. Outside of Loop
        $("#modal-band-title").text(userSearch);
      });
    });
  });
});
