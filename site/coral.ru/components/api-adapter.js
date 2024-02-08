import { params2query } from "./usefuls";
import dayjs from "dayjs";

export function apiUrl(endpoint) {
    const apiHost = location.hostname === 'localhost' ? 'http://localhost:8010/proxy' : '';
    // const apiHost = location.hostname === 'localhost' ? 'http://localhost:8888' : '';
    return apiHost + endpoint;
}

export async function fetchDestinationByKeyword(keyword) {
    const cacheKey = `destination-${ keyword }`;
    const cachedResponse = sessionStorage.getItem(cacheKey);
    if (cachedResponse) return Promise.resolve(JSON.parse(cachedResponse));

    return new Promise(resolve => {
        const query_string = params2query({ type: 'package', keyword: keyword });
        fetch(apiUrl(`/v1/search/destinations?${ query_string }`))
            .then(response => response.json())
            .then(json => {
                const destination = json.Results[0];
                sessionStorage.setItem(cacheKey, JSON.stringify(destination));
                resolve(destination);
            });
    });
}

export async function packageQueryWithProduct(product, departure, charters_only) {
    return new Promise(async resolve => {
        const reqData = {
            isCharter: true,
            isRegular: !charters_only,
            Guest:     { Adults: 2 },
            // DateRange: 3,
            BeginDate:    dayjs(product.since).format('YYYY-MM-DD'),
            EndDate:      dayjs(product.until).format('YYYY-MM-DD'),
            SelectedDate: dayjs(product.since).format('YYYY-MM-DD'),
            Acc: product.nights ? [product.nights] : [7],
            Departures: [{ Id: departure.eeID, Label: departure.name }],
            Destination: [{ ...(await fetchDestinationByKeyword(product.countrylName)) }]
        };
        resolve(reqData);
    });
}

export async function fetchPackageSearchLinkWithQuery(query) {
    return new Promise(async resolve => {
        $.post(apiUrl('/v1/package/search'), query).done(response => {
            resolve(response);
        });
    });
}
export async function fetchAvailableFlights(departure, destination, charters_only) {

    if (!departure?.eeID || !destination?.eeID) {
        return Promise.reject();
    }
    const cacheKey = `${ departure.eeID }->${ destination.eeID }`;
    const cachedResponse = sessionStorage.getItem(cacheKey);
    if (cachedResponse) return Promise.resolve(JSON.parse(cachedResponse));

    return new Promise(resolve => {
        $.get(apiUrl('/v1/flight/availablealldatev2'), {
            fromAreaId: departure.eeID,
            toCountryId: destination.eeID,
            destinationId: `Country${ destination.eeID }`,
            // nearestAirports: destination.airports.join(',')
        }).done(response => {
            const results = response.Result || JSON.parse(response).Result;
            const conformedFlightsList = Array.from((function* (results) {
                for (const result of results) {
                    const mapped = {
                        timestamp: Number(result.FlightDate.match(/\d+/)[0]),
                        type:      result.FlightType
                    };
                    if (charters_only) {
                        if (result.FlightType !== 1) yield mapped;
                    } else {
                        yield mapped;
                    }
                }
            })(results));
            sessionStorage.setItem(cacheKey, JSON.stringify(conformedFlightsList));
            resolve(conformedFlightsList);
        });
    });
}

export async function fetchAvailableNights(departure, destination, charters_only, beginDateFormatted, endDateFormatted) {
    if (!departure?.eeID || !destination?.eeID) {
        return Promise.reject();
    }
    const cacheKey = `${ departure.eeID }->${ destination.eeID }@${ beginDateFormatted }-${ endDateFormatted }`;
    const cachedResponse = sessionStorage.getItem(cacheKey);
    if (cachedResponse) return Promise.resolve(JSON.parse(cachedResponse));

    return new Promise(resolve => {
        $.get(apiUrl('/v1/flight/availablenights'), {
            fromAreaId:    departure.eeID,
            toCountryId:   destination.eeID,
            destinationId: `Country${ destination.eeID }`,
            // nearestAirports: destination.airports.join(',')
            beginDate: beginDateFormatted,
            endDate:   endDateFormatted,
            // flightType: charters_only ? [0,2] : ''
        }).done(response => {
            const results = response.Result || JSON.parse(response).Result;
            sessionStorage.setItem(cacheKey, JSON.stringify(results));
            resolve(results);
        });
    });
}

export function fetchPackageSearchLink(departure, destination, charters_only, guest, beginDate, endDate, selectedDate, nights) {
    const nights_normalized = JSON.parse(JSON.stringify(nights)).sort((a, b) => Number(a) - Number(b));
    return new Promise(resolve => {
        const reqData = {
            isCharter: true,
            isRegular: !charters_only,
            Guest:     { ...(JSON.parse(JSON.stringify(guest))) },
            // DateRange: 3,
            BeginDate:    beginDate,
            EndDate:      endDate,
            SelectedDate: selectedDate,
            Acc: nights_normalized,
            Departures: [{ Id: departure.eeID, Label: departure.name }],
            Destination: [{
                Id:               `Country${ destination.eeID }`,
                DataId:           destination.eeID,
                TopDataId:        '',
                ParentDataId:     '',
                TitleRu:          destination.name,
                ModelType:        1,
                Priority:         1,
                RecordSourceType: 2,
                HasAirport:       false,
                NearestAirports:  (destination.airports && JSON.parse(JSON.stringify(destination.airports))) || [],
            }]
        };
        console.log('+++ fetchPackageSearchLink reqData: %o', reqData);
        $.post(apiUrl('/v1/package/search'), reqData).done(response => {
            resolve(response);
        });
    });
}

export function fetchHotelSearchLink(destination, guest, beginDate, endDate) {
    return new Promise(resolve => {
        const reqData = {
            Guest:     { ...(JSON.parse(JSON.stringify(guest))) },
            BeginDate:    beginDate,
            EndDate:      endDate,
            Destination: {
                Id:               `Country${ destination.eeID }`,
                DataId:           destination.eeID,
                TopDataId:        '',
                ParentDataId:     '',
                Title:            destination.title,
                TitleRu:          destination.name,
                ParentTitle:      '',
                ParentTitleRu:    '',
                ModelType:        1,
                Priority:         1,
                RecordSourceType: 2,
                HasAirport:       false,
                NearestAirports:  (destination.airports && JSON.parse(JSON.stringify(destination.airports))) || [],
            }
        };
        console.log('+++ fetchHotelSearchLink reqData: %o', reqData);
        $.post(apiUrl('/v1/onlyhotel/search'), reqData).done(response => {
            resolve(response);
        });
    });
}

