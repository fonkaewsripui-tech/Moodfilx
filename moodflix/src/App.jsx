import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p/w500";

export default function App() {

const [genres,setGenres]=useState([]);
const [selectedGenre,setSelectedGenre]=useState(null);
const [movies,setMovies]=useState([]);
const [trailerUrl,setTrailerUrl]=useState(null);

useEffect(()=>{

fetch(

`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`

)

.then(res=>res.json())

.then(data=>{

setGenres(data.genres||[]);

});

},[]);

useEffect(()=>{

if(!selectedGenre) return;

fetch(

`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre.id}&sort_by=popularity.desc&vote_count.gte=3000`

)

.then(res=>res.json())

.then(data=>{

const topMovies=(data.results||[])

.filter(movie=>movie.poster_path)

.slice(0,20);

setMovies(topMovies);

});

},[selectedGenre]);

async function openTrailer(movieId){

const res=await fetch(

`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`

);

const data=await res.json();

const trailer=(data.results||[])

.find(

(video)=>

video.site==="YouTube" &&

(video.type==="Trailer"||

video.type==="Teaser")

);

if(trailer){

setTrailerUrl(

`https://www.youtube.com/embed/${trailer.key}`

);

}

else{

alert("No trailer available.");

}

}

return(

<div style={styles.app}>

<h1 style={styles.logo}>
MOODFLIX
</h1>

{!selectedGenre ? (

<div style={styles.genreWrap}>

{genres.map((genre)=>(

<button

key={genre.id}

style={styles.genreBtn}

onClick={()=>setSelectedGenre(genre)}

>

{genre.name}

</button>

))}

</div>

):(


<>

<button

style={styles.backBtn}

onClick={()=>{

setSelectedGenre(null);
setMovies([]);

}}

>

Back

</button>

<h2 style={styles.genreTitle}>

{selectedGenre.name}

Movies

</h2>

<div style={styles.grid}>

{movies.map((movie)=>(

<div
key={movie.id}
style={styles.card}
>

<img

src={`${IMG}${movie.poster_path}`}

alt={movie.title}

style={styles.poster}

/>

<div style={styles.content}>

<h3 style={styles.title}>
{movie.title}
</h3>

<p>
Rating: {movie.vote_average}
</p>

<p>
Votes: {movie.vote_count}
</p>

<p>
Popularity: {Math.round(movie.popularity)}
</p>

<p>
Release: {movie.release_date}
</p>

<button

style={styles.trailerBtn}

onClick={()=>openTrailer(movie.id)}

>

Watch Trailer

</button>

</div>

</div>

))}

</div>

</>

)}

{trailerUrl && (

<div style={styles.modal}>

<div style={styles.modalBox}>

<button

style={styles.closeBtn}

onClick={()=>setTrailerUrl(null)}

>

Close

</button>

<iframe

src={trailerUrl}

title="Trailer"

allowFullScreen

style={styles.iframe}

/>

</div>

</div>

)}

</div>

);

}

const styles={

app:{
background:"#111",
minHeight:"100vh",
padding:"40px",
fontFamily:"Arial",
color:"white"
},

logo:{
fontSize:"80px",
textAlign:"center",
marginBottom:"55px",
fontWeight:"bold"
},

genreWrap:{
display:"flex",
flexWrap:"wrap",
justifyContent:"center",
gap:"18px"
},

genreBtn:{
background:"#1E1E1E",
color:"white",
padding:"18px 28px",
border:"1px solid #444",
borderRadius:"10px",
cursor:"pointer",
fontSize:"17px",
fontWeight:"bold"
},

backBtn:{
background:"#333",
color:"white",
padding:"12px 18px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"25px"
},

genreTitle:{
textAlign:"center",
marginBottom:"35px"
},

grid:{
display:"grid",
gridTemplateColumns:
"repeat(auto-fill,minmax(260px,1fr))",
gap:"28px"
},

card:{
background:"#1A1A1A",
borderRadius:"14px",
overflow:"hidden",
boxShadow:
"0 0 18px rgba(0,0,0,0.35)"
},

poster:{
width:"100%",
height:"390px",
objectFit:"cover"
},

content:{
padding:"18px"
},

title:{
fontSize:"22px",
marginBottom:"12px"
},

trailerBtn:{
width:"100%",
marginTop:"15px",
background:"white",
color:"black",
padding:"12px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
},

modal:{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.92)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
},

modalBox:{
width:"90%",
maxWidth:"950px",
position:"relative"
},

closeBtn:{
position:"absolute",
top:"-50px",
right:0,
background:"white",
color:"black",
padding:"10px 16px",
border:"none",
borderRadius:"8px",
cursor:"pointer"
},

iframe:{
width:"100%",
height:"520px",
border:"none",
borderRadius:"12px"
}

};