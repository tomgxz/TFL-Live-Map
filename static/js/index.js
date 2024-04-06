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
      
      map = $("#map"),
      map_svg = map.children("svg"),
      trains_wrapper = map_svg.children("#TRAINS-WRAPPER"),

      lines = ["bakerloo", "central", "circle", "district", "hc", "jubilee", "metropolitan", "northern", "piccadilly",
        "victoria", "wc", "dlr", "cablecar", "overground", "elizabeth", "thameslink", "tram"];

var active_trains = {},

    stationsEnabled = false,
    stationNamesEnabled = false,
    stepfreeEnabled = false;


const toggle_fn_stations = () => {
  stationsEnabled = !stationsEnabled

  map.toggleClass("stations")
  toggle_el_stations.toggleClass("enabled")

  if (!stationsEnabled) {
    map.removeClass("stationnames","stepfree")
    toggle_el_stationnames.removeClass("enabled")
    toggle_el_stepfree.removeClass("enabled")

    stationNamesEnabled = false
    stepfreeEnabled = false
  }
}

const toggle_fn_stationnames = () => {
  stationNamesEnabled = !stationNamesEnabled

  map.toggleClass("stationnames")
  toggle_el_stationnames.toggleClass("enabled")

  if (stationNamesEnabled) {
    map.addClass("stations")
    toggle_el_stations.addClass("enabled")
    stationsEnabled = true
  }
}

const toggle_fn_stepfree = () => {
  stepfreeEnabled = !stepfreeEnabled

  map.toggleClass("stepfree")
  toggle_el_stepfree.toggleClass("enabled")

  if (stepfreeEnabled) {
    map.addClass("stations")
    toggle_el_stations.addClass("enabled")
    stationsEnabled = true
  }
}

// ------

const toggle_fn_farezones = () => {
  map.toggleClass("farezones")
  toggle_el_farezones.toggleClass("enabled")
}

const toggle_fn_river = () => {
  map.toggleClass("river")
  toggle_el_river.toggleClass("enabled")
}

// ------

const toggle_fn_showall = () => { map.addClass(lines) }
const toggle_fn_hideall = () => {  map.removeClass(lines) }


$(window).on("load", function () {

  // INIT TOGGLES 
  // #region

  for (let line of lines) {
    let linetoggle = toggles_wrapper.children(`.toggle.${line}`)

    // map.toggleClass(line)
    // linetoggle.toggleClass("enabled")

    linetoggle.click(function () {
      map.toggleClass(line)
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

