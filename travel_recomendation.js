let datosGlobales = {};

function cargarRecomendaciones() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      datosGlobales = data; // Guardar datos para búsquedas futuras
      //mostrarTodasLasRecomendaciones(data);
    })
    .catch(error => console.error('Error al cargar JSON:', error));
}

function mostrarTodasLasRecomendaciones(data) {
  const contenedor = document.getElementById('recommendations');
  contenedor.innerHTML = '';

  mostrarSeccion("Templos Recomendados", data.temples);
  mostrarSeccion("Playas Recomendadas", data.beaches);

  data.countries.forEach(pais => {
    mostrarSeccion(`Ciudades en ${pais.name}`, pais.cities);
  });
}

function mostrarSeccion(titulo, lista) {
  const contenedor = document.getElementById('recommendations');
  const seccion = document.createElement('div');
  seccion.classList.add('seccion');

  const encabezado = document.createElement('h2');
  encabezado.textContent = titulo;
  seccion.appendChild(encabezado);

  lista.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <img src="${item.imageUrl}" alt="${item.name}" width="300">
    `;
    seccion.appendChild(card);
  });

  contenedor.appendChild(seccion);
}

function buscarPorPalabraClave() {
  const input = document.getElementById('searchInput').value.toLowerCase().trim();
  const contenedor = document.getElementById('recommendations');
  contenedor.innerHTML = '';

  if (!input) {
    mostrarTodasLasRecomendaciones(datosGlobales);
    return;
  }

  const esPlaya = ['playa', 'playas'].some(p => input.includes(p));
  const esTemplo = ['templo', 'templos'].some(t => input.includes(t));

  if (esPlaya) {
    mostrarSeccion("Playas relacionadas", datosGlobales.beaches);
  }

  if (esTemplo) {
    mostrarSeccion("Templos relacionados", datosGlobales.temples);
  }

  // Buscar coincidencias en países
  const paisesFiltrados = datosGlobales.countries.filter(p =>
    p.name.toLowerCase().includes(input)
  );

  paisesFiltrados.forEach(pais => {
    mostrarSeccion(`Ciudades en ${pais.name}`, pais.cities);
  });

  // Si no se encontró nada
  if (!esPlaya && !esTemplo && paisesFiltrados.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron resultados para esa palabra clave.</p>';
  }
}

function limpiarResultados() {
  document.getElementById('searchInput').value = '';
  mostrarTodasLasRecomendaciones(datosGlobales);
}

// Asignar funciones a botones
window.onload = () => {
  cargarRecomendaciones();

  document.getElementById('searchButton').addEventListener('click', buscarPorPalabraClave);
  document.getElementById('clearButton').addEventListener('click', limpiarResultados);
};