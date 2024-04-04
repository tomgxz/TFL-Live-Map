// CONSTANTS / VARIABLES

const toggles_wrapper = $("main .content-wrapper .toggle-panel"),
      elements_wrapper = $("main .content-wrapper .element-panel"),
      map = $("#map"),
      lines = [ "bakerloo", "central", "circle", "district", "hc", "jubilee", "metropolitan", "northern", "piccadilly", 
                "victoria", "wc", "dlr", "cablecar", "overground", "elizabeth", "thameslink", "tram" ];




for (let line of lines) {
    let linetoggle = toggles_wrapper.children(`.toggle.${line}`)

    map.toggleClass(line)
    linetoggle.toggleClass("enabled")

    linetoggle.click(function() {
      map.toggleClass(line)
      $(this).toggleClass("enabled")
    })
}



elements_wrapper.children(".stations").click(function() {
  map.toggleClass("stations").toggleClass("stationnames")
  $(this).toggleClass("enabled")
})

elements_wrapper.children(".farezones").click(function() {
  map.toggleClass("farezones")
  $(this).toggleClass("enabled")
})

elements_wrapper.children(".river").click(function() {
  map.toggleClass("river")
  $(this).toggleClass("enabled")
})