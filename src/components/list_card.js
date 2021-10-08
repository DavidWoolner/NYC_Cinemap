import { Component } from "./component";
export { listCard, listCardFetch}

function parseForSearch(title) {
    const abc = "abcdefghijklmnopqrstuvwxyz";
    if (title !== undefined){ 
        title = title.toLowerCase().split(" ")
        title = title.map((word, i)=>{
            return word.split("").map((char, i) => {
                if (!abc.includes(char)) char = "";
                return char;
            }).join("");
        })
        return title.join("-");
    }
    return title;
}

const listCard = (obj) => {

    const image = document.getElementById("card-img");
    // const title = document.getElementById("gallery-title");
    // const overview = document.getElementById("gallery-overview");
    // const listContainer = document.getElementsByClassName("list-container");
    const result = obj.data.movie_results[0] || obj.data.tv_results[0];

    const justWatchTitle = parseForSearch(obj.geoJSON.features[0].properties["Film"]);
    const template =`
        <span data-id="${result.id}" id="destroy">X</span>
        <h3 id="list-title" data-id="${result.id}">${result.title}</h3>
        <img id="list-img" src="${image.src}" alt="">
        <p id="score">Score: ${result.vote_average}</p>

        <p id="year">${obj.geoJSON.features[0].properties["Year"]}</p>
        <a id="imdb-link" href="${obj.geoJSON.features[0].properties["IMDB LINK"]}" target="_blank">IMDB Link</a>
        <a id="just-watch-link" href="https://www.justwatch.com/us/movie/${justWatchTitle}" target="_blank">Just Watch Link</a>`
        return template;
}

const listCardFetch = (template) => {
    const justWatchTitle = parseForSearch(template.title);

    const year = template.release_date ? template.release_date.slice(0, 4) : "";
    console.log(template)
    const newTemplate = `
                            <span data-id="${template.id}" id="destroy">X</span>
                            <h3 id="list-title" data-id="${template.id}">${template.title}</h3>
                            <img id="list-img" src="https://image.tmdb.org/t/p/w500/${template.poster_path}" alt="">
                            <p id="score">Score: ${template.vote_average}</p>

                            <p id="year">${year}</p>
                            <a id="imdb-link" href="http://www.imdb.com/title/${template.imdb_id}" target="_blank">IMDB Link</a>
                            <a id="just-watch-link" href="https://www.justwatch.com/us/movie/${justWatchTitle}" target="_blank">Just Watch Link</a>`
        return newTemplate
                }




