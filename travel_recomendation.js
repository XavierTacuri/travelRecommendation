let datosGlobales = {};
let pagina1 = 'inicio.html';
let about1 = 'nosotros.html';
let contacto ='contacto.html';
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
 contenedor.style.backgroundImage="url('cielo.jpeg')";
 contenedor.style.backgroundSize = "cover";
contenedor.style.backgroundPosition = "center";
contenedor.style.backgroundRepeat = "no-repeat";
 const seccion = document.createElement('div');
  //var frame=document.getElementById('cuerpo');
  seccion.style.backgroundColor= "#a2bfdc86";
  seccion.classList.add('seccion');

  const encabezado = document.createElement('h2');
  encabezado.textContent = titulo;
  seccion.appendChild(encabezado);

  lista.forEach(item => {
    const card = document.createElement('div');
    //card.classList.add('estiloBonito');
    card.style.backgroundColor= "#a2bfdc86";
    card.style.textAlign="center";
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <img src="${item.imageUrl}" alt="${item.name}" width="300">
    `;
    seccion.appendChild(card);
  });

  contenedor.appendChild(seccion);
  //frame.src=pagina;
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
function cargarContenido(pagina){
 //document.getElementById('recommendations').innerHTML=inico;
 fetch(pagina)
        .then(response => response.text())
        .then(data => {
          document.getElementById('recommendations').innerHTML = data;
        })
        .catch(error => {
          document.getElementById('recommendations').innerHTML = "Error al cargar el contenido.";
          console.error("Error al cargar:", error);
        }); 
}

// Asignar funciones a botones
//document.getElementById('nosotros').addEventListener('click',cargarInico(about1));
  //document.getElementById('inicio').addEventListener('click',cargarInico(pagina1));
 
  

window.onload = () => {
  cargarRecomendaciones();
  cargarContenido(pagina1);
  document.getElementById('searchButton').addEventListener('click', buscarPorPalabraClave);
  document.getElementById('clearButton').addEventListener('click', limpiarResultados);
  };