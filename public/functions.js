const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.buscarYoutube = functions.https.onRequest(async (req, res) => {
  const query = req.query.q;
  const apiKey = "TU_API_KEY_DE_YOUTUBE";

  if (!query) {
    res.status(400).send("Falta el parámetro 'q'");
    return;
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=5&key=${apiKey}`;

  try {
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar en YouTube");
  }
});
