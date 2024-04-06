// CONSTANTS / VARIABLES

const toggles_wrapper = $("main .content-wrapper .toggle-panel"),
  elements_wrapper = $("main .content-wrapper .element-panel"),

  map = $("#map"),
  map_svg = map.children("svg"),

  lines = ["bakerloo", "central", "circle", "district", "hc", "jubilee", "metropolitan", "northern", "piccadilly",
    "victoria", "wc", "dlr", "cablecar", "overground", "elizabeth", "thameslink", "tram"];


    stationsEnabled = false,
    stationNamesEnabled = false,
    stepfreeEnabled = false;

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


  // -------------

  elements_wrapper.children(".stations").click(function () {
    stationsEnabled = !stationsEnabled
    map.toggleClass("stations")
    $(this).toggleClass("enabled")

    if (!stationsEnabled) {
      map.removeClass("stationnames")
      elements_wrapper.children(".stationnames").removeClass("enabled")
      map.removeClass("stepfree")
      elements_wrapper.children(".stepfree").removeClass("enabled")
      stationNamesEnabled = false
      stepfreeEnabled = false
    }
  })

  elements_wrapper.children(".stationnames").click(function () {
    stationNamesEnabled = !stationNamesEnabled
    map.toggleClass("stationnames")
    $(this).toggleClass("enabled")

    if (stationNamesEnabled) {
      map.addClass("stations")
      elements_wrapper.children(".stations").addClass("enabled")
      stationsEnabled = true
    }
  })
  
  elements_wrapper.children(".stepfree").click(function () {
    stepfreeEnabled = !stepfreeEnabled
    map.toggleClass("stepfree")
    $(this).toggleClass("enabled")

    if (stepfreeEnabled) {
      map.addClass("stations")
      elements_wrapper.children(".stations").addClass("enabled")
      stationsEnabled = true
    }
  })
  
  // -------------

  elements_wrapper.children(".farezones").click(function () {
    map.toggleClass("farezones")
    $(this).toggleClass("enabled")
  })

  elements_wrapper.children(".river").click(function () {
    map.toggleClass("river")
    $(this).toggleClass("enabled")
  })
  
  // -------------

  elements_wrapper.children(".showall").click(function () {
    map.addClass(lines)
  })
  
  elements_wrapper.children(".hideall").click(function () {
    map.removeClass(lines)
  })

  // #endregion

})

