import React, { useState, useEffect } from "react";

function BuscadorHTMLExistente() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  useEffect(() => {
    const icono = document.getElementById("btnBuscar");
    const contenedor = document.getElementById("searchContainer");
    const input = document.getElementById("searchInput");

    if (!icono || !contenedor || !input) {
      console.warn("No se encontraron los elementos del buscador");
      return;
    }

    const toggleBuscador = () => {
      const nuevoDisplay = contenedor.style.display === "none" ? "block" : "none";
      contenedor.style.display = nuevoDisplay;
      if (nuevoDisplay === "block") {
        input.focus();
        setMostrarBuscador(true);
      } else {
        setMostrarBuscador(false);
        setResultados([]);
        setQuery("");
      }
    };

    const manejarEnter = async (e) => {
      if (e.key === "Enter" && query.trim() !== "") {
        try {
          // URL de tu Firebase Function (reemplaza TU_PROYECTO y TU_REGION)
          const url = `https://us-central1-TU_PROYECTO.cloudfunctions.net/buscarYoutube?q=${encodeURIComponent(query)}`;
          const res = await fetch(url);
          const data = await res.json();
          setResultados(data.items || []);
        } catch (error) {
          console.error("Error en la búsqueda:", error);
        }
      }
    };

    const manejarInput = (e) => {
      setQuery(e.target.value);
    };

    icono.addEventListener("click", toggleBuscador);
    input.addEventListener("keydown", manejarEnter);
    input.addEventListener("input", manejarInput);

    return () => {
      icono.removeEventListener("click", toggleBuscador);
      input.removeEventListener("keydown", manejarEnter);
      input.removeEventListener("input", manejarInput);
    };
  }, [query]);

  return (
    <>
      {mostrarBuscador && resultados.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "5px",
            padding: "10px",
          }}
        >
          {resultados.map((video) => (
            <a
              key={video.id.videoId}
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                marginBottom: "10px",
                textDecoration: "none",
                color: "#000",
              }}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                style={{ marginRight: "10px" }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {video.snippet.title}
                </p>
                <small>{video.snippet.channelTitle}</small>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default BuscadorHTMLExistente;
