$(document).ready(function() {
  // Initialize animations
  new WOW().init();
  var showLink;
  $("#search-btn").on("click", function(e) {
    e.preventDefault();
    //Set User Input
    var userSearch = $("#search-input")
      .val()
      .trim();

    //API to get photo of band/artist
    var queryURL =
      "https://rest.bandsintown.com/artists/" +
      userSearch +
      "?app_id=b7b374713cf3e2cf710b82eac648971e";
    $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
      var artistImage = $("<img>");
      artistImage.attr({
        src: response.image_url,
        class: "z-depth-5 mb-3 img-fluid rounded"
      });
      $("#modal-band-img").html(artistImage);
    });
    //Songkicker, Capturing Band Name
    var queryURL =
      "https://api.songkick.com/api/3.0/search/artists.json?apikey=5KXgncncFq2otJd6&query=" +
      userSearch;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      if (response.resultsPage.totalEntries == 0) {
        $("#modal-band-shows").empty();
        $("#modal-band-title").text("No artists found");
      }

      var bandName = response.resultsPage.results.artist[0].displayName;
      $("#modal-band-title").text(bandName);
      localStorage.setItem("bandName", bandName);

      showLink =
        response.resultsPage.results.artist[0].identifier[0].eventsHref;

      var eventsQuery = showLink + "?apikey=5KXgncncFq2otJd6";
      //Songkicker, Getting Upcoming Shows
      $.ajax({
        url: eventsQuery,
        method: "GET"
      }).then(function(response) {
        if (response.resultsPage.totalEntries == 0) {
          var sorry = $("<p>").text(
            localStorage.getItem("bandName") + " has no upcoming shows"
          );
          $("#modal-band-shows").html(sorry);
        } else {
          $("#modal-band-shows").empty();
        }
        //Looping through upcoming shows
        for (var i = 0; i <= 5; i++) {
          var venu = $("<a>")
            .text(response.resultsPage.results.event[i].venue.displayName)
            .attr({
              id: "venu",
              "data-lat": response.resultsPage.results.event[i].venue.lat,

              "data-long": response.resultsPage.results.event[i].venue.lng,
              "data-name":
                response.resultsPage.results.event[i].venue.displayName,
              href: "map-page.html"
            });

          var city = $("<p>")
            .text(response.resultsPage.results.event[i].location.city)
            .attr("id", "city");

          var linkOut = $("<a>")
            .text("Songkick Event Page")
            .attr("href", response.resultsPage.results.event[i].uri)
            .attr("target", "_blank")
            .attr("class", "link-out mx-auto");

          var date = $("<p>")
            .text(response.resultsPage.results.event[i].start.date)
            .attr("id", "date");

          var line = $("<hr>");
          //Appending information to modal
          $("#modal-band-shows").append(date, city, venu, linkOut, line);
        }
        //Sending lat and lng to google map
        $("#modal-band-shows").on("click", "#venu", function() {
          var location = $(this);
          localStorage.setItem("venue", location.attr("data-name"));
          localStorage.setItem("lat", location.attr("data-lat"));
          localStorage.setItem("long", location.attr("data-long"));
        });
      });
    });
  });
});
