import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback
} from "react";
import axios from "axios";
import "./App.css"; 

function BuscarPokemon() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [datosPokemon, setDatosPokemon] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [historia, setHistoria] = useState("");

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = () => {
    const datosIniciales = {
      name: "Pikachu",
      sprites: { front_default: "url_de_la_imagen" },
      height: 40,
      weight: 60
    };

    // Descripción ficticia
    const descripcionInicial =
      "Pikachu es un Pokémon eléctrico muy conocido por su poderoso ataque de rayo.";

    setDatosPokemon(datosIniciales);
    setHistoria(descripcionInicial);
  };

  const botonBusquedaRef = useRef(null);

  const obtenerDescripcionPokemon = (id) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
      .then((response) => {
        const descripcion = response.data.flavor_text_entries.find(
          (entry) => entry.language.name === "es" 
        );
        if (descripcion) {
          setHistoria(descripcion.flavor_text);
        }
      })
      .catch((error) => {
        console.error("Error al obtener la descripción:", error);
      });
  };

  const manejarBusqueda = useCallback(() => {
    if (terminoBusqueda.trim() === "") {
      alert("Ingresa un nombre o ID de Pokémon");
      return;
    }

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${terminoBusqueda.toLowerCase()}`)
      .then((response) => {
        setDatosPokemon(response.data);
        botonBusquedaRef.current.style.backgroundColor = getRandomColor();
        setBackgroundColor("gray");
        // Obtener descripción del Pokémon
        obtenerDescripcionPokemon(response.data.id);
      })
      .catch((error) => {
        console.error("Error:", error);
        setDatosPokemon(null);
      });
  }, [terminoBusqueda]);

  useLayoutEffect(() => {
    if (datosPokemon) {
      const randomColor = getRandomColor();
      botonBusquedaRef.current.style.backgroundColor = randomColor;
    }
  }, [datosPokemon]);

  return (
    <div className="container">
      <div className="section" style={{ backgroundColor }}>
        <h2>Buscar un Pokémon</h2>
        <input
          type="text" // Corregido el tipo de input a "text"
          placeholder="Ingresa el nombre o ID de un Pokémon"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
        <button ref={botonBusquedaRef} onClick={manejarBusqueda}>
          Buscar
        </button>
        {datosPokemon && (
          <div>
            <h3>{datosPokemon.name}</h3>
            <img
              src={datosPokemon.sprites.front_default}
              alt={datosPokemon.name}
              className="pokemon-image" // Aplica la clase de estilo a la imagen
            />
            <p className="pokemon-info">
              Altura: {datosPokemon.height / 10} metros
            </p>
            <p className="pokemon-info">Peso: {datosPokemon.weight / 10} kg</p>
          </div>
        )}
        {historia && (
          <div>
            <h3 className="description-title">Descripción</h3>
            <p className="pokemon-description">{historia}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuscarPokemon;
