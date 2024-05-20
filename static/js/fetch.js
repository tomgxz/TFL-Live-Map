const api = 'https://api.tfl.gov.uk/Line/%s/Arrivals';

const linesMap = {
    'london-overground': 'Overground',
    'tram': 'Tram',
    'tfl-rail': 'TfL Rail',
    'dlr': 'DLR',
    'bakerloo': 'Bakerloo',
    'central': 'Central',
    'circle': 'Circle',
    'district': 'District',
    'elizabeth': 'Elizabeth',
    'hammersmith-city': 'Hammersmith & City',
    'jubilee': 'Jubilee',
    'metropolitan': 'Metropolitan',
    'northern': 'Northern',
    'piccadilly': 'Piccadilly',
    'victoria': 'Victoria',
    'waterloo-city': 'Waterloo & City',
}

var sub_id, sub_ids, out = {};

const parse_time = s => {

    if (typeof s == typeof 0) return s

    console.log(s)

    if (s == '-' || s == 'due') return 0
    m = s.match('(\d+):(\d+):(\d+)$')

    if (m) return int(m.group(1))*3600 + int(m.group(2))*60 + int(m.group(3))
    m = s.match('(\d+):(\d+)$')

    return int(m.group(1))*60 + int(m.group(2))
}

const parse_entry = (time_to_station, set_id, dest_code, destination, current_location, station_name, key, platform_name) => {
    time_to_station = parse_time(time_to_station)
    train_key = set_id
    train_key += '-%s' % dest_code

    if (('000', '477').includes(set_id)  || ('Unknown', 'Special', 'Network Rail TOC').includes(destination) || dest_code == '0'){

        lookup = current_location.replace('\s*Platform \d+$', "")

        if (current_location == 'At Platform'){
            lookup = 'At %s' % station_name
        }
        
        if (!sub_ids.get(lookup)) {
            sub_ids[lookup] = sub_id
            sub_id += 1
        }
        
        train_key += '-%s' % sub_ids[lookup]
    }
    
    entry = {
        'station_name': map_station_name(station_name.replace('\.$',''), key),
        'platform_name': platform_name,
        'current_location': current_location,
        'time_to_station': time_to_station,
        'destination': destination,
    }

    if (time_to_station < out.get(key, {}).get(train_key, {}).get('time_to_station', 999999)) {
        out.setdefault(key, {})[train_key] = entry
    }
    
    outNext.setdefault(key, {}).setdefault(train_key, []).append(entry)


    console.log(`${key} ${station_name} ${platform_name} | ${set_id} ${time_to_station} ${current_location}`)
}

const parse_json = (live, key) => {
    for (prediction of live) {
        station_name = prediction['stationName'].replace(' Underground Station', '')
        console.log(prediction)

        current_location = prediction["currentLocation"] || ""
        dest_code = prediction['destinationNaptanId'] || "0"

        parse_entry(
            prediction['timeToStation'], prediction['vehicleId'], dest_code,
            prediction['towards'], current_location, station_name, key, prediction['platformName'])
    }
}

for ([key, line] of Object.entries(linesMap)) {

    fetch(api.replace("%s","bakerloo"))
        .then(response => response.json())
        .then(data => parse_json(data, key))
        .catch(err => console.error(err));

}
