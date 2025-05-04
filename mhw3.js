function apertura(event){
    const listener = event.currentTarget;

    const nav_menu = document.querySelector("nav");
    const tendina = document.querySelector(".menu-content");
    const bottone=document.querySelectorAll("#menu_button div");

    if (nav_menu.classList.contains("menu-open")) {
        console.log("Chiusura menu");

        nav_menu.classList.remove("menu-open");

        tendina.classList.add("nascosto");
        for(let i of bottone){
            if(i.classList.contains("linea")){
                i.classList.remove("nascosto");
            }
            else{
                i.classList.add("nascosto");
            }
        }

        return;
    }
    else{
        nav_menu.classList.add("menu-open"); // Aggiungiamo la classe al <nav> per lo stile 

        for(let i of bottone){
            if(i.classList.contains("linea")){
                i.classList.add("nascosto");
            }
            else{
                i.classList.remove("nascosto");
            }
        }

        tendina.classList.remove("nascosto");
    }

}

function cambio(event) {
    let listener = event.currentTarget;
    console.log(listener);

    let lista=[{name: "Sala Antares", img : "mirador5.jpg"},
               {name: "Sala Sinfonia", img : "mirador7.jpg" },
               {name: "Sala Congressi", img : "mirador8.jpg"},
               {name: "Sala Luxury", img : "mirador9.jpg"}
              ];
    console.log( lista );

    let box= document.querySelector(".galleria-box");
    console.log(box.dataset.pos);
    
    let pos= box.dataset.pos;
    pos= ++pos%lista.length;
    console.log(pos);

    const div_box=document.createElement("div");
    div_box.classList.add("galleria-box");
    div_box.id="g1";
    div_box.dataset.pos=pos;
    console.log(div_box);

    const div_img=document.createElement("img");
    div_img.id="par2g";
    div_img.src=lista[pos].img;

    const div_testo=document.createElement("div");
    div_testo.classList.add("center");
    div_testo.textContent=lista[pos].name;

    div_box.appendChild(div_img);
    div_box.appendChild(div_testo);

    listener.innerHTML='';
    listener.appendChild(div_box);   
};


// Finestra del meteo

function meteoResponse(resp){
    if(!resp.ok) {
        console.log("Errore nella risposta del servizio meteo");
        return null;
    }
    else
    return resp.json();
}

function meteoJSON(text) {
    console.log( text );
    const Box = document.querySelector("#meteo-box");
    const box_contenitore= document.createElement("div");
    box_contenitore.id="box_contenitore" ;
    Box.appendChild(box_contenitore);
    box_contenitore.textContent="IL METEO A VILLA MIRADOR OGGI";
    const icona= document.createElement("div");
    box_contenitore.appendChild(icona);
    const immagine= document.createElement("img");
    icona.appendChild(immagine);
    immagine.id="icona_meteo";
    immagine.src="https://openweathermap.org/img/wn/"+ text.weather[0].icon +"@2x.png";
    const descrizione= document.createElement("div");
    box_contenitore.appendChild(descrizione);
    descrizione.textContent= text.weather[0].description;
    const temperatura= document.createElement("div");
    box_contenitore.appendChild(temperatura);
    temperatura.textContent= "Temperatura: " + text.main.temp + "°";
}

function toggleMeteo() {
    let existingBox = document.querySelector("#meteo-box");
    if (existingBox) {
        existingBox.removeEventListener("click", toggleMeteo);
        existingBox.remove();
        const meteo = document.createElement("div");
        meteo.id = "meteo";
        meteo_img=document.createElement('img');
        //meteo_img.id = "meteo";
        meteo_img.src= "meteo.png";
        meteo.appendChild(meteo_img);
        meteo.addEventListener("click", toggleMeteo);
        document.body.appendChild(meteo);
        return;
    }
    existingBox=document.querySelector("#meteo");
    existingBox.removeEventListener("click", toggleMeteo);
    existingBox.remove();
    const meteo = document.createElement("div");
    meteo.id = "meteo-box";

    // Bottone chiusura
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Chiudi";
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", toggleMeteo);
    meteo.appendChild(closeBtn);

    // Richiesta al servizio meteo
    //   Coordinate di Villa Mirador: lat=37.7029028, lon=15.1130236
    const meteo_url = 'https://api.openweathermap.org/data/2.5/weather?lat=37.7029028&lon=15.1130236&units=metric&lang=it&appid=secret';
    fetch(meteo_url).then(meteoResponse).then(meteoJSON);
    
    document.body.appendChild(meteo);
}


//
// Finstra del calcolo percorso/mappa
// 

function apiResponse(resp){
    if(!resp.ok) {
        console.log("Errore nella risposta del servizio mappa");
        return null;
    }
    else
    return resp.json();
}

function mapinfoJSON(info){
    console.log(info);
    let distanza =info.routes[0].summary.lengthInMeters;
    console.log(distanza);
    let tempo =info.routes[0].summary.travelTimeInSeconds;
    console.log(tempo);
    tempoH=Math.floor(tempo/3600); 
    tempoM=Math.floor((tempo%3600)/60);
    distanza=distanza/1000;

    const dist= document.createElement("div");
    dist.textContent= "Distanza: " + distanza + "km";
    dist.id="descrizione";
    const tem= document.createElement("div");
    tem.id="descrizione";
    tem.textContent= "Tempo di percorrenza: " + tempoH+"h " + tempoM + "min";
    const mappaBox = document.querySelector("#mappa-box");
    const box_descrizione = document.querySelector("#box_descrizione");
    mappaBox.appendChild(box_descrizione);
    box_descrizione.appendChild(tem);
    box_descrizione.appendChild(dist);
}

function coordJSON(coord) {
    const posMirador= {"lat" : 37.7029028, "lon" : 15.1130236};
    console.log( coord );
    const ind=coord.results[0].address.freeformAddress; //indirizzo di partenza

    let box_descrizione= document.querySelector("#box_descrizione");
    if (box_descrizione)
        box_descrizione.remove();
    box_descrizione= document.createElement("div");
    box_descrizione.id="box_descrizione";

    const partenza= document.createElement("div");
    partenza.id="descrizione";
    partenza.textContent= "Partenza: " + ind;
    const mappaBox = document.querySelector("#mappa-box");
    mappaBox.appendChild(box_descrizione);
    box_descrizione.appendChild(partenza);

    console.log( ind );

    const pos=coord.results[0].position;
   // const url='https://api.tomtom.com/routing/1/calculateRoute/';
    let url= posMirador.lat+','+posMirador.lon+':'+pos.lat+','+pos.lon;
    url=encodeURIComponent(url);
    url= 'https://api.tomtom.com/routing/1/calculateRoute/' + url + '/json?travelMode=car&key=secret';
    console.log( url );

    fetch(url).then(apiResponse).then(mapinfoJSON);  
}

function sendMessage(){
    const indirizzo= document.querySelectorAll('#mappa-input');
    let geo_url = 'https://api.tomtom.com/search/2/geocode/';
    let ind_url='';
    for(let i=0; i<indirizzo.length; i++){
        ind_url += indirizzo[i].value;
        if(i!==2){
            ind_url += ' ';
        }
    }
    ind_url= encodeURIComponent(ind_url);
    geo_url = geo_url + ind_url + '.json?storeResult=false&view=Unified&key=secret';
    fetch(geo_url).then(apiResponse).then(coordJSON);
    return;
}

function toggleMappa() {
    let existingBox = document.querySelector("#mappa-box");
    if (existingBox) { // E' aperta la fnestra con la mappa
        existingBox.removeEventListener("click", toggleMappa);
        existingBox.remove();
        const mappa = document.createElement("div");
        mappa.id = "mappa";
        mappa_img=document.createElement('img');
        mappa_img.src= "mappa.jpg";
        mappa.appendChild(mappa_img);
        mappa.addEventListener("click", toggleMappa);
        document.body.appendChild(mappa);
        return;
    }

    // Non visualizzo il bottone e visualizzo la finestra
    existingBox=document.querySelector("#mappa");
    existingBox.removeEventListener("click", toggleMappa);
    existingBox.remove();
    const mappa = document.createElement("div");
    mappa.id = "mappa-box";

    // Bottone chiusura
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Chiudi";
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", toggleMappa);
    mappa.appendChild(closeBtn);

    const inputArea = document.createElement("div");
    inputArea.id="box_input";
    const inputvia = document.createElement("input");
    inputvia.type = "text";
    inputvia.placeholder = "Via";
    inputvia.id = "mappa-input";
    const inputnum = document.createElement("input");
    inputnum.type = "text";
    inputnum.placeholder = "Numero";
    inputnum.id = "mappa-input";
    const inputcitta = document.createElement("input");
    inputcitta.type = "text";
    inputcitta.placeholder = "Citta'";
    inputcitta.id = "mappa-input";
    inputArea.appendChild(inputvia);
    inputArea.appendChild(inputnum);
    inputArea.appendChild(inputcitta);

    const invioBtn = document.createElement("button");
    //invioBtn.type= "submit";
    invioBtn.textContent = "Invia";
    invioBtn.addEventListener("click", sendMessage);
    inputArea.appendChild(invioBtn);

    mappa.appendChild(inputArea);

    document.body.appendChild(mappa);

    
}


const menu=document.querySelector("#menu_button");
menu.addEventListener("click", apertura); 
const v_nav = document.querySelector("nav");

const galleria=document.querySelector("#galleria");
galleria.addEventListener("click", cambio);

const meteoIcon = document.querySelector("#meteo");
meteoIcon.addEventListener("click", toggleMeteo);

const mappaIcon = document.querySelector("#mappa");
mappaIcon.addEventListener("click", toggleMappa);