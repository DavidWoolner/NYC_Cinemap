


// const Gallery = (data) => {
//     const template = `
//         <div class="card">
//             <img id="card-img" src="https://image.tmdb.org/t/p/w500/${data.movie_results[0].poster_path}" alt="${data.movie_results[0].title}" srcset="">
//         </div>
//         <div class="card">
//             <h3 id="gallery-title" data-id="${data.movie_results[0].id}">${data.movie_results[0].title}</h3>
//             <p id="gallery-overview">${data.movie_results[0].overview.slice(0,100)+"..."}</p>
//         </div>`
//     return template
// }


// Gallery = (data) => {
//     const template = `
//         <div class="card">
//             <img id="card-img" src="https://image.tmdb.org/t/p/w500/${data.movie_results[0].poster_path}" alt="${data.movie_results[0].title}" srcset="">
//         </div>
//         <div class="card">
//             <h3 id="gallery-title" data-id="${data.movie_results[0].id}">${data.movie_results[0].title}</h3>
//             <p id="gallery-overview">${data.movie_results[0].overview.slice(0, 100) + "..."}</p>
//         </div>`
//     return template
// }
window.DataStore = DataStore;

function DataStore() {
    this.templates = [];
}

DataStore.prototype.addRes = function(data){
    this.data = data;
}

DataStore.prototype.addJSON = function(geoJSON) {
    this.geoJSON = geoJSON;
}


DataStore.prototype.createTemplate = function() {
    // console.log(this.geoJSON);
    let scene = this.geoJSON.features[0].properties["Scene Type"];

    if (scene === 'N/A') {
        scene = "";
    } else {
        scene = `Scene type: ${scene}` 
    }

    const template = 
                `<div class="card">
                    <img id="card-img" src="https://image.tmdb.org/t/p/w500/${this.data.movie_results[0].poster_path}"
                        alt="" srcset="">
                </div>
                <div class="card-info">
                    <h2 id="gallery-title" data-id="${this.data.movie_results[0].id}">${this.data.movie_results[0].title}</h3>
                    <h3 id="year">${this.geoJSON.features[0].properties["Year"]}</h3>
                    <h4 id="director">${this.geoJSON.features[0].properties["Artist Credit"]} ${this.geoJSON.features[0].properties["Director/Filmmaker Name"]}</h4>
                    <h5 id="score">Score: ${this.data.movie_results[0].vote_average}</h5>
                    <br>
                    <p id="gallery-overview">${this.data.movie_results[0].overview.slice(0, 100) + "..."}</p>
                    <br>
                    <p id="location">${this.geoJSON.features[0].properties["Location Display Text"]}</p>
                    <p id="scene-type">${scene}</p>
                </div>`
    return template;
}


export { DataStore };
