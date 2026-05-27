import { useState } from "react";

function App() {

const movies = {

Happy:[
{
title:"Minions",
poster:"https://image.tmdb.org/t/p/w500/dr02BdCNAUPVU07aOodwPYv6HCf.jpg",
trailer:"https://www.youtube.com/embed/P9-FCC6I7u0"
},
{
title:"Toy Story",
poster:"https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
trailer:"https://www.youtube.com/embed/KYz2wyBy3kc"
}
],

Sad:[
{
title:"Soul",
poster:"https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
trailer:"https://www.youtube.com/embed/xOsLIiBStEs"
},
{
title:"Inside Out",
poster:"https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg",
trailer:"https://www.youtube.com/embed/seMwpP0yeu4"
}
],

Romantic:[
{
title:"Titanic",
poster:"https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
trailer:"https://www.youtube.com/embed/2e-eXJ6HgkQ"
}
],

Thriller:[
{
title:"Joker",
poster:"https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
trailer:"https://www.youtube.com/embed/zAGVQLHvwOY"
}
],

Angry:[
{
title:"John Wick",
poster:"https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
trailer:"https://www.youtube.com/embed/C0BMx-qxsP4"
}
]

};

const [selectedMood,setSelectedMood] = useState("");
const [selectedTrailer,setSelectedTrailer] = useState(null);

return (

<div style={{
background:"linear-gradient(to bottom,#000,#141414)",
minHeight:"100vh",
color:"white",
padding:"40px"
}}>

<h1 style={{
color:"red",
fontSize:"70px",
textAlign:"center"
}}>
MOODFLIX
</h1>

<h2 style={{
textAlign:"center",
marginBottom:"40px"
}}>
How are you feeling today?
</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"15px",
flexWrap:"wrap"
}}>

{Object.keys(movies).map((mood)=>(

<button
key={mood}
onClick={()=>setSelectedMood(mood)}

style={{
padding:"14px 25px",
background:"red",
color:"white",
border:"none",
borderRadius:"25px",
cursor:"pointer",
fontSize:"16px"
}}
>

{mood}

</button>

))}

</div>

{selectedMood && (

<>

<h2 style={{
marginTop:"60px",
marginBottom:"30px",
textAlign:"center"
}}>
Recommended Movies for {selectedMood}
</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"30px",
flexWrap:"wrap"
}}>

{movies[selectedMood].map((movie)=>(

<div
key={movie.title}

style={{
background:"#181818",
borderRadius:"18px",
width:"260px",
overflow:"hidden",
boxShadow:"0 0 25px rgba(255,0,0,0.3)"
}}
>

<img
src={movie.poster}
alt={movie.title}

style={{
width:"100%",
height:"390px",
objectFit:"cover"
}}
/>

<div style={{padding:"20px"}}>

<h3>{movie.title}</h3>

<button

onClick={()=>setSelectedTrailer(movie.trailer)}

style={{
background:"red",
color:"white",
padding:"12px",
border:"none",
borderRadius:"10px",
cursor:"pointer",
width:"100%"
}}

>

▶ Watch Trailer

</button>

</div>

</div>

))}

</div>

</>

)}

{selectedTrailer && (

<div

style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.9)",

display:"flex",
justifyContent:"center",
alignItems:"center",

zIndex:9999
}}

>

<div style={{position:"relative"}}>

<button

onClick={()=>setSelectedTrailer(null)}

style={{
position:"absolute",
top:"-50px",
right:"0",
background:"red",
color:"white",
border:"none",
padding:"10px 15px",
cursor:"pointer",
fontSize:"18px",
borderRadius:"8px"
}}

>

✖ Close

</button>

<iframe

width="900"
height="500"

src={selectedTrailer}

title="Trailer"

frameBorder="0"

allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

allowFullScreen

style={{
borderRadius:"15px"
}}

></iframe>

</div>

</div>

)}

</div>

)

}

export default App;