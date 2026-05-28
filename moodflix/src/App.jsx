import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p/w500";

const GENRE_META = {
  Action:            { emoji: "💥", color: "#FF4D4D", bg: "#2A1010" },
  Comedy:            { emoji: "😂", color: "#F4D03F", bg: "#28260E" },
  Drama:             { emoji: "🎭", color: "#9B59B6", bg: "#1E1228" },
  Romance:           { emoji: "❤️", color: "#FF6B8A", bg: "#2A0E18" },
  Horror:            { emoji: "👻", color: "#E74C3C", bg: "#240A0A" },
  Thriller:          { emoji: "😰", color: "#E67E22", bg: "#2A1A08" },
  "Science Fiction": { emoji: "🚀", color: "#00D4FF", bg: "#001A2A" },
  Fantasy:           { emoji: "🧙", color: "#BB8FCE", bg: "#1E1228" },
  Mystery:           { emoji: "🔍", color: "#85C1E9", bg: "#0A1828" },
  Animation:         { emoji: "🎨", color: "#FFD166", bg: "#2A2510" },
  Adventure:         { emoji: "🗺️", color: "#FF8C42", bg: "#2A1A0A" },
};

// แต่ละรายการเป็นได้ 2 แบบ:
//  - "ชื่อหนัง"                         → ค้นจากหนัง (movie)
//  - { q: "ชื่อ", type: "tv", year: 2019 } → ระบุประเภท/ปีได้ (type: "movie" | "tv")
const CUSTOM_MOVIES = {
  Action: [
    "John Wick", "The Matrix", "Top Gun Maverick", "American Sniper",
    "13 Hours", "The Covenant", "12 Strong", "Pirates of the Caribbean",
    "Reacher", "Iron Man",
  ],
  Comedy: [
    "Zootopia", "Now You See Me", "The Man from Toronto",
    "Red Notice", "Jumanji", "The King's Man",
    "The Hangover", "Deadpool", "Free Guy", "Home Alone",
  ],
  Drama: [
    "The Walking Dead", "Money Heist", "Queen of Tears",
    { q: "Vagabond", type: "tv", year: 2019 },
    "Titanic", "Miu404", "Voice", "Hopper",
    "The Shawshank Redemption", "Forrest Gump",
  ],
  Romance: [
    "Your Name", "Queen of Tears", "Titanic",
    "La La Land", "The Notebook", "Pride and Prejudice",
    "Me Before You", "A Star Is Born", "Crazy Rich Asians",
    "500 Days of Summer",
  ],
  Horror: [
    "P Nak", "Undertaker",
    "The Conjuring", "It", "A Quiet Place", "Hereditary",
    "The Nun", "Annabelle", "Get Out", "Insidious",
  ],
  Thriller: [
    "Stranger Things", "Money Heist", "Parasite", "Miu404",
    "Gone Girl", "Shutter Island", "Se7en",
    "The Silence of the Lambs", "Prisoners", "Joker",
  ],
  "Science Fiction": [
    "Avatar", "Star Wars", "Interstellar",
    "Valerian and the City of a Thousand Planets", "The Matrix",
    "Inception", "Blade Runner 2049", "Dune", "Tenet",
    "Edge of Tomorrow",
  ],
  Fantasy: [
    "Harry Potter and the Sorcerer's Stone", "The Lord of the Rings",
    "Hotarubi no Mori e", "Attack on Titan",
    "The Hobbit", "Fantastic Beasts and Where to Find Them",
    "Pan's Labyrinth", "Stardust", "The Chronicles of Narnia",
    "Maleficent",
  ],
  Mystery: [
    "Detective Conan", "Spider-Man", "Stranger Things", "Voice",
    "Knives Out", "Glass Onion", "Murder on the Orient Express",
    "Zodiac", "Sherlock Holmes", "The Girl with the Dragon Tattoo",
  ],
  Animation: [
    "One Piece", "Zootopia", "Spirited Away", "My Neighbor Totoro",
    "Attack on Titan", "Spider-Man Into the Spider-Verse",
    "Toy Story", "Frozen", "Coco", "The Lion King",
  ],
  Adventure: [
    "Avatar", "Zootopia", "The Lord of the Rings",
    "Pirates of the Caribbean", "Jumanji",
    { q: "The Fast and the Furious", type: "movie", year: 2001 },
    "One Piece", "Indiana Jones", "Jurassic Park", "The Hunger Games",
  ],
};

// แปลงรายการให้อยู่ในรูปแบบเดียวกัน
function normalizeEntry(entry) {
  if (typeof entry === "string") return { q: entry, type: "movie", year: null };
  return { type: "movie", year: null, ...entry };
}

export default function App() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const allowed = Object.keys(GENRE_META);
        const filtered = (data.genres || []).filter((g) => allowed.includes(g.name));
        setGenres(filtered);
      });
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;
    const entries = CUSTOM_MOVIES[selectedGenre.name] || [];
    if (entries.length === 0) return;
    setLoading(true);
    setMovies([]);
    Promise.all(
      entries.map((entry) => {
        const { q, type, year } = normalizeEntry(entry);
        const yearParam = year
          ? type === "tv"
            ? `&first_air_date_year=${year}`
            : `&primary_release_year=${year}`
          : "";
        return fetch(
          `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(q)}&language=en-US${yearParam}`
        )
          .then((res) => res.json())
          .then((data) => {
            const result = (data.results || []).find((m) => m.poster_path);
            if (!result) return null;
            // ทำให้หนัง (movie) และซีรีส์ (tv) มีโครงสร้างเหมือนกัน
            return {
              id: result.id,
              mediaType: type,
              title: result.title || result.name,
              poster_path: result.poster_path,
              vote_average: result.vote_average,
              vote_count: result.vote_count,
              release_date: result.release_date || result.first_air_date,
            };
          });
      })
    ).then((results) => {
      const found = results.filter(Boolean);
      const unique = found.filter(
        (movie, index, self) =>
          index ===
          self.findIndex((m) => m.id === movie.id && m.mediaType === movie.mediaType)
      );
      setMovies(unique);
      setLoading(false);
    });
  }, [selectedGenre]);

  async function openTrailer(movie) {
    const res = await fetch(
      `https://api.themoviedb.org/3/${movie.mediaType}/${movie.id}/videos?api_key=${API_KEY}`
    );
    const data = await res.json();
    const trailer = (data.results || []).find(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
    );
    if (trailer) {
      setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
    } else {
      alert("No trailer available.");
    }
  }

  const meta = selectedGenre
    ? GENRE_META[selectedGenre.name] || { emoji: "🎬", color: "#fff", bg: "#1A1A1A" }
    : null;

  return (
    <div style={styles.app}>
      <h1 style={styles.logo}>
        <span style={styles.logoM}>M</span>
        <span style={styles.logoOOD}>OOD</span>
        <span style={styles.logoFLIX}>FLIX</span>
      </h1>
      <p style={styles.tagline}>เลือกอารมณ์ · ดูหนัง · สนุกได้เลย</p>

      {!selectedGenre ? (
        <>
          <p style={styles.sectionLabel}>— เลือกแนวหนังที่ชอบ —</p>
          <div style={styles.genreGrid}>
            {genres.map((genre) => {
              const m = GENRE_META[genre.name] || { emoji: "🎬", color: "#aaa", bg: "#1E1E1E" };
              const isHovered = hoveredGenre === genre.id;
              return (
                <button
                  key={genre.id}
                  style={{
                    ...styles.genreBtn,
                    background: isHovered ? m.color : m.bg,
                    borderColor: m.color,
                    color: isHovered ? "#000" : m.color,
                    transform: isHovered ? "translateY(-4px) scale(1.04)" : "none",
                    boxShadow: isHovered ? `0 8px 24px ${m.color}55` : "none",
                  }}
                  onClick={() => setSelectedGenre(genre)}
                  onMouseEnter={() => setHoveredGenre(genre.id)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <span style={styles.genreEmoji}>{m.emoji}</span>
                  <span style={styles.genreName}>{genre.name}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div style={styles.topBar}>
            <button
              style={styles.backBtn}
              onClick={() => { setSelectedGenre(null); setMovies([]); }}
            >
              ← กลับ
            </button>
            <h2 style={{ ...styles.genreTitle, color: meta.color }}>
              {meta.emoji} {selectedGenre.name}
            </h2>
          </div>

          {loading && <p style={styles.loadingText}>กำลังโหลด...</p>}

          <div style={styles.grid}>
            {movies.map((movie) => (
              <div key={`${movie.mediaType}-${movie.id}`} style={styles.card}>
                <div style={styles.posterWrap}>
                  <img
                    src={`${IMG}${movie.poster_path}`}
                    alt={movie.title}
                    style={styles.poster}
                  />
                </div>
                <div style={styles.content}>
                  <h3 style={styles.title}>{movie.title}</h3>
                  <div style={styles.stats}>
                    <span style={styles.badge}>⭐ {(movie.vote_average || 0).toFixed(1)}</span>
                    <span style={styles.badge}>🗳️ {((movie.vote_count || 0) / 1000).toFixed(1)}k</span>
                    <span style={styles.badge}>📅 {movie.release_date?.slice(0, 4)}</span>
                  </div>
                  <button
                    style={{ ...styles.trailerBtn, borderColor: meta.color, color: meta.color }}
                    onClick={() => openTrailer(movie)}
                  >
                    ▶ Watch Trailer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {trailerUrl && (
        <div style={styles.modal} onClick={() => setTrailerUrl(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setTrailerUrl(null)}>
              ✕ ปิด
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

const styles = {
  app: {
    background: "#0D0D0D",
    minHeight: "100vh",
    padding: "40px 48px 80px",
    fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    color: "white",
  },
  logo: {
    fontSize: "72px",
    textAlign: "center",
    marginBottom: "8px",
    fontWeight: "900",
    letterSpacing: "4px",
    lineHeight: 1,
  },
  logoM: { color: "#E50914" },
  logoOOD: { color: "#ffffff" },
  logoFLIX: {
    background: "linear-gradient(90deg,#E50914,#FF6B35)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    textAlign: "center",
    color: "#666",
    marginBottom: "40px",
    fontSize: "15px",
    letterSpacing: "2px",
  },
  sectionLabel: {
    textAlign: "center",
    color: "#555",
    fontSize: "13px",
    letterSpacing: "3px",
    marginBottom: "28px",
    textTransform: "uppercase",
  },
  genreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  genreBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "20px 12px",
    border: "1px solid",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "all 0.2s ease",
    letterSpacing: "0.5px",
  },
  genreEmoji: { fontSize: "28px" },
  genreName: { fontSize: "13px", textAlign: "center" },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },
  backBtn: {
    background: "#1E1E1E",
    color: "#ccc",
    padding: "10px 18px",
    border: "1px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    flexShrink: 0,
  },
  genreTitle: {
    fontSize: "26px",
    fontWeight: "800",
    margin: 0,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: "16px",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#161616",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  posterWrap: { position: "relative", overflow: "hidden" },
  poster: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    display: "block",
  },
  content: { padding: "14px" },
  title: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "10px",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  stats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "12px",
  },
  badge: {
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "#ccc",
    background: "#2A2A2A",
  },
  trailerBtn: {
    width: "100%",
    background: "transparent",
    border: "1px solid",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "0.5px",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.92)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalBox: {
    width: "90%",
    maxWidth: "950px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "-48px",
    right: 0,
    background: "#222",
    color: "white",
    padding: "10px 18px",
    border: "1px solid #444",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  iframe: {
    width: "100%",
    height: "520px",
    border: "none",
    borderRadius: "12px",
  },
};