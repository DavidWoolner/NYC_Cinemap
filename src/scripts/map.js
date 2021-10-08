// import * as location from "./location";
import mapboxgl from 'mapbox-gl'
export { makeMap };
mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWR3b29sbmVyIiwiYSI6ImNrczliam40MzB0YTIydm9ja2x3NDN5cnQifQ.WodjI99jg0lWF31OhaXCFA';
import { Component } from "../components/component"
import { geoJSON } from '/Users/davidwoolner/Desktop/AppAcademy/NYC_Cinemap/src/assets/scene_data.js';
import { getData } from '/Users/davidwoolner/Desktop/AppAcademy/NYC_Cinemap/src/scripts/movie'
import { addToGallery } from "../index";
import { DataStore } from "../components/gallery"
import { listCard } from '../components/list_card';

export let imdbID = "tt0075686";

export const gallery = new DataStore();

const makeMap = (long = -73.98015, lat = 40.782838) => {
    //create new map object, container grabs from div with id of map
    const generateMarkers = (lon, lat, str1, str2) => {
        const marker = new mapboxgl.Marker({ color: "#d80000" })
            .setLngLat([lon, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="marker-info">${str1}</h1>
              <h2 class="marker-lon-lat">${str2}</h2>`)) // add popup
            .addTo(map);

    }
    
   
    
    const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            // center: [long, lat],
        center: [long,
            lat],
            zoom: 13

        });

    const coordinates = geoJSON.features[0].geometry.coordinates.slice()
        
    // coordinates.forEach(coord=>{
    //     console.log(coord[1])
    //     generateMarkers(coord[0], coord[1], "test", "test")
    // });
    map.on('load', () => {
        // Add an image to use as a custom marker
        generateMarkers(long, lat, "You are here!", `7 films were shot within 10 blocks of you!`)

        geoJSON.features.forEach(function (marker) {
        // create a HTML element for each feature
            const el = document.createElement('div');
            // console.log(marker)

            //here we add the properties from our geoJSON dataset to the coordinates/markers
            let film = marker.properties["Film"];
            let imdb = marker.properties["IMDB LINK"];
            let year = marker.properties["Year"];
            let location = marker.properties["Location Display Text"];
            let sceneType = marker.properties["Scene Type"]
            let creator = marker.properties["Artist Credit"];
            let director = marker.properties["Director/Filmmaker Name"];

            el.dataset.year = year;
            el.dataset.location = location;
            el.dataset.sceneType = sceneType;
            el.dataset.creator = creator;
            el.dataset.director = director;
            el.dataset.imdb = imdb.split("/")[4]
            el.dataset.imdbFull = imdb;
            el.dataset.film = film;
            el.className = 'marker';

            new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            // .addTo(map)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3 class="pop-up-title">' + film + '</h3>'))
            .addTo(map);
        })

        const markers = document.querySelectorAll(".marker");
        markers.forEach(marker=> {
            marker.addEventListener('mouseenter', (e) => {
                
                //instead of refactoring addToGallery interpolation...
                const fakeJSON = {
                    features: [ {
                        "properties": {
                            "Year": e.target.dataset.year,
                            "Location Display Text": e.target.dataset.location,
                            "Scene Type": e.target.dataset.sceneType,
                            "Artist Credit": e.target.dataset.creator,
                            "Director/Filmmaker Name": e.target.dataset.director,
                            "IMDB LINK": e.target.dataset.imdbFull,
                            "Film": e.target.dataset.film
                        }

                    }
 
                    ]
                }
                gallery.addJSON(fakeJSON);
                console.log(e.target.dataset.imdb);
                getData(e.target.dataset.imdb)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error with network response");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        gallery.addRes(data);
                        addToGallery();

                    })
                    .catch((error) => {
                        console.error(
                            "Problem intercepted: ",
                            error
                        );
                    });



            })
        })

        // add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        }));


            // make a marker for each feature and add to the map

        });


        //     map.loadImage(
        //         'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        //         (error, image) => {
        //             if (error) throw error;
        //             map.addImage('custom-marker', image);
        //             // Add a GeoJSON source with 2 points
        //             map.addSource('points', {
        //                 'type': 'geojson',
        //                 'data': geoJSON
        //             });

        //             // Add a symbol layer
        //             map.addLayer({
        //                 'id': 'points',
        //                 'type': 'symbol',
        //                 'source': 'points',
        //                 'layout': {
        //                     'icon-image': 'custom-marker'
        //                     // get the title name from the source's "title" property
        //                     // 'text-field': ['get', ""],
        //                     // 'text-font': [
        //                     //     'Open Sans Semibold',
        //                     //     'Arial Unicode MS Bold'
        //                     // ],
        //                     // 'text-offset': [0, 1.25],
        //                     // 'text-anchor': 'top'
        //                     // 'icon-color': '#000'

        //                     // ["rgb", number, number, number]: color
        //                 }
        //             });
        //         }
        //     );
        // });
            
           
            
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    //MAP load event 
    map.on('mouseenter', 'points', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const title = e.features[0].properties["Film"];
        // const year = e.features[0].properties["Year"]
        const imdb = e.features[0].properties["IMDB LINK"];
        // const credit = e.features[0].properties["Artist Credit"];
        // const director = e.features[0].properties["Director/Filmmaker Name"];
        // const location = e.features[0].properties["Location Display Text"];
        // const neighborhood = e.features[0].properties["Location Display Text"];
        // const sceneType = e.features[0].properties["Scene Type"];

        //add the data from the geoJSON Mayor's office data here
        gallery.addJSON(e);

        imdbID = imdb.split("/")[4]

        getData(imdbID)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error with network response");
                }
                return response.json(); 
            })
            .then((data) => {
                gallery.addRes(data);
                addToGallery();

            })
            .catch((error) => {
                console.error(
                    "Problem intercepted: ",
                    error
                );
            });
            
        // const title = e.features[0].properties["Film"];
        // const year = e.features[0].properties["Year"];
        // const gallery = document.querySelector("#gallery");
        // const div = document.createElement("div");
        // div.innerHTML =`<h1>${title}</h1><h2>${year}</h2>` ;
        // div.id = "gallery-current"
        // gallery.appendChild(div);



      
        popup.setLngLat(coordinates).setHTML(title).addTo(map);
        // const gallery = new Component("h1", "this thing works!", document.body)
        //  gallery.create();
        
    });

    map.on('mouseleave', 'points', (e) => {
        map.getCanvas().style.cursor = '';
        // const div = document.querySelector("#gallery-current");
        // div.remove();
        popup.remove();
    });
}
        // scene_data.slice(1).forEach(film => {
        //     if (film["IMDB LINK"] !== null) { 
        //         let imdbID = film["IMDB LINK"];
        //         imdbID = imdbID.split("/")[4]
        //         generateMarkers(film.LONGITUDE, film.LATITUDE, film.Film, imdbID);
        //     };
        // })







    // const popup = new mapboxgl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    // });


    //     //add marker to map
    // const marker = new mapboxgl.Marker()
    //     .setLngLat([-74.0079, 40.7137])
    //     .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>")) // add popup
    //     .addTo(map);
    // const { success, error, options} = location;

    


    // //iterate over every film but for first object which is column info

    // //current user marker
    


 

// geoJSON.features.forEach(function (marker) {
//     // create a HTML element for each feature
//     var el = document.createElement('div');
//     el.className = 'marker';



// make a marker for each feature and add to the map
// new mapboxgl(el)
//     .setLngLat(marker.geometry.coordinates)
//     .addTo(map)
//     .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
//         .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
//     .addTo(map);
//         });
