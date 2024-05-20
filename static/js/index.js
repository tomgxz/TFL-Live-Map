// CONSTANTS / VARIABLES

const toggles_wrapper = $("main .content-wrapper .toggle-panel"),
      elements_wrapper = $("main .content-wrapper .element-panel"),

      toggle_el_stations = elements_wrapper.children(".stations"),
      toggle_el_stationnames = elements_wrapper.children(".stationnames"),
      toggle_el_stepfree = elements_wrapper.children(".stepfree"),
      toggle_el_farezones = elements_wrapper.children(".farezones"),
      toggle_el_river = elements_wrapper.children(".river"),
      toggle_el_showall = elements_wrapper.children(".showall"),
      toggle_el_hideall = elements_wrapper.children(".hideall"),
      
      map_el = $("#map"),
      map_svg = map_el.children("svg"),
      trains_wrapper = map_svg.children("#TRAINS-WRAPPER"),

      lines = [
        "bakerloo", "central", "circle", "district", "hc", "jubilee", "metropolitan", "northern", "piccadilly",
        "victoria", "wc", "dlr", "cablecar", "overground", "elizabeth", "thameslink", "tram"],

      linecolors = {
        "bakerloo": "#B06010", "central": "#EE3124", "circle": "#FFD200", "district": "#00853F", "hc": "#F386A1", 
        "jubilee": "#949CA1", "metropolitan": "#97005E", "northern": "#000000", "piccadilly": "#1C3F94",
        "victoria": "#009DDC", "wc": "#86CEBC", "dlr": "#00B1B0", "cablecar": "#E31937", "overground": "#F58025", 
        "elizabeth": "#1C3F94", "thameslink": "#D385A9", "tram": "#7AC143"};

var active_trains = {},

    stationsEnabled = false,
    stationNamesEnabled = false,
    stepfreeEnabled = false;


const toggle_fn_stations = () => {
  stationsEnabled = !stationsEnabled

  map_el.toggleClass("stations")
  toggle_el_stations.toggleClass("enabled")

  if (!stationsEnabled) {
    map_el.removeClass("stationnames","stepfree")
    toggle_el_stationnames.removeClass("enabled")
    toggle_el_stepfree.removeClass("enabled")

    stationNamesEnabled = false
    stepfreeEnabled = false
  }
}

const toggle_fn_stationnames = () => {
  stationNamesEnabled = !stationNamesEnabled

  map_el.toggleClass("stationnames")
  toggle_el_stationnames.toggleClass("enabled")

  if (stationNamesEnabled) {
    map_el.addClass("stations")
    toggle_el_stations.addClass("enabled")
    stationsEnabled = true
  }
}

const toggle_fn_stepfree = () => {
  stepfreeEnabled = !stepfreeEnabled

  map_el.toggleClass("stepfree")
  toggle_el_stepfree.toggleClass("enabled")

  if (stepfreeEnabled) {
    map_el.addClass("stations")
    toggle_el_stations.addClass("enabled")
    stationsEnabled = true
  }
}

// ------

const toggle_fn_farezones = () => {
  map_el.toggleClass("farezones")
  toggle_el_farezones.toggleClass("enabled")
}

const toggle_fn_river = () => {
  map_el.toggleClass("river")
  toggle_el_river.toggleClass("enabled")
}

// ------

const toggle_fn_showall = () => { map_el.addClass(lines) }
const toggle_fn_hideall = () => {  map_el.removeClass(lines) }


$(window).on("load", function () {

  // INIT TOGGLES 
  // #region

  for (let line of lines) {
    let linetoggle = toggles_wrapper.children(`.toggle.${line}`)

    // map.toggleClass(line)
    // linetoggle.toggleClass("enabled")

    linetoggle.click(function () {
      map_el.toggleClass(line)
      $(this).toggleClass("enabled")
    })
  }

  toggle_el_stations.click(toggle_fn_stations)
  toggle_el_stationnames.click(toggle_fn_stationnames)
  toggle_el_stepfree.click(toggle_fn_stepfree)
  
  toggle_el_farezones.click(toggle_fn_farezones)
  toggle_el_river.click(toggle_fn_river)
  
  toggle_el_showall.click(toggle_fn_showall)
  toggle_el_hideall.click(toggle_fn_hideall)

  toggle_fn_showall()

  toggle_fn_stations()
  toggle_fn_stationnames()
  toggle_fn_stepfree()

  // #endregion

})

// var train = addTrain("bakerloo","1")

class Train {
  constructor(train) {
    if (!(lines.includes(train.line))) return null;

    this.id = train.id;
    this.line = train.line;
    this.route = train.next;

    this.startPoint = train.point;
    this.justLeft = train.left;

    this.position = null;

    this.title = train.title;
    this.string = train.string;
    this.link = train.link;

    this.info = "";

    this.fillcolor = linecolors[this.line];
    this.angle = 0;

    this.element = $("<rect />")
                    .addClass("train").addClass(line).addClass(`train-${this.id}`)
                    .attr("x",254.5).attr("y",274.1)
                    .attr("width","20").attr("height","8");
    
    this.popup = $("<div />")

    this.create_title()
  }

  create_title() {
    let html = "";

    html = `${this.title} <br> ${this.info}`;
    if (this.string) html += `<br><em> ${this.string} </em>`
    if (this.link) html += `<br><a href="${this.link}">View board</a></em>`

    this.popup.html(html)
  }

  calculate_location(secs) {
    var point = 0;
        from = this.startPoint,
        from_name = this.justLeft;

    if (from_name == "-" && this.route.length && secs < this.route[0].mins*60) return;

    for (let r=0; r<this.route.length; r++) {
      var stop = this.route[r];

      if (secs < stop.mins*60) {

        if (from[1] == stop.point[1] && from[0] == stop.point[0]) {
          var new_x = from[0], new_y = from[1];
        }

        else if (typeof arc !== "undefined") {
          var gc = new arc.GreatCircle(new arc.Coord(new_y, new_x), new arc.Coord(stop.point[1], stop.point[0])),
              gc_new = gc.interpolate(secs/(stop.mins*60)),
              new_x = gc_new[1],
              new_y = gc_new[0]
        }

        else {
          var dx = stop.point[0] - from[0],
              dy = stop.point[1] - from[1],
              new_x = from[0] + dx/(stop.mins*60)*secs,
              new_y = from[1] + dy/(stop.mins*60)*secs;
        }

        point = [new_x, new_y];
        this.info = "";

        if (from_name) this.info += `(left ${from_name}, <br>`
        
        this.info += `expected ${stop.name}`;
        if (stop.dexp) this.info += ` ${stop.dexp}`

        this.info += ")"
        break;

      }

      secs -= stop.mins*60;
      from = stop.point;
      from_name = stop.name;

    }

    if (!point) point = from;
    this.point = point;

    var current = this.position;
    if (current) {
      var dx = this.point[1] - current.x,
          dy = this.point[0] - current.y,
          bearing = Math.atan2(dx, dy);
      this.angle = bearing;
    }

    this.position = this.point;
    this.create_title();
  }

}




/*

var map = null;
var trains = new L.LayerGroup([]);
var stations = new L.FeatureGroup([]);
var train_byID = new Array();
var starttime = new Date();
var extra = 0;
var Speed = 1;
var mapCentre = [51.507, -0.120];

map = L.map("map",{
  attributionControl: false,
  maxZoom: 13,
  minZoom: 10,
}).setView(mapCentre,10);

L.imageOverlay("/.ignore/Edited/Tube Map - Edited.svg", [[52.0,-1], [51,1]],{
  alt: "Underground Map"
}).addTo(map);

trains.addTo(map);

>>>>>>> Stashed changes
*/