// Normalizar texto para ignorar tildes y mayúsculas
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

let productos = [];

// Cargar productos
fetch('productos.json')
  .then(res => res.json())
  .then(data => productos = data);

// Referencias
const inputBuscar = document.getElementById('input-buscar');
const resultados = document.getElementById('resultados-busqueda');

// Estilos del contenedor de resultados
resultados.style.position = 'absolute';
resultados.style.top = '100%';
resultados.style.left = '0';
resultados.style.right = '0';
resultados.style.zIndex = '1000';
resultados.style.background = '#ffffff';
resultados.style.border = '1px solid #ccc';
resultados.style.borderRadius = '5px';
resultados.style.maxHeight = '300px';
resultados.style.overflowY = 'auto';
resultados.style.padding = '0';
resultados.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

// Escuchar mientras escribe
inputBuscar.addEventListener('input', () => {
  const termino = normalizar(inputBuscar.value.trim());
  resultados.innerHTML = '';

  if (!termino) return;

  // Filtrar productos
  const sugerencias = productos.filter(p =>
    normalizar(p.titulo).includes(termino)
  ).slice(0, 6); // máximo 6 resultados

  // Renderizar sugerencias
  sugerencias.forEach(p => {
    const item = document.createElement('div');
    item.classList.add('d-flex', 'align-items-center', 'p-2');
    item.style.cursor = 'pointer';
    item.style.borderBottom = '1px solid #ddd';
    item.style.backgroundColor = '#fff';
    item.style.color = '#000';

    item.innerHTML = `
      <img src="${p.imagen}" alt="${p.titulo}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
      <span>${p.titulo}</span>
    `;

    // Click en sugerencia
    item.addEventListener('click', () => {
      window.location.href = `detalle-producto.html?id=${p.id}`;
    });

    // Hover
    item.addEventListener('mouseenter', () => item.style.backgroundColor = '#f0f0f0');
    item.addEventListener('mouseleave', () => item.style.backgroundColor = '#fff');

    resultados.appendChild(item);
  });
});

// Ocultar resultados si hace click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('#form-buscar')) {
    resultados.innerHTML = '';
  }
});

