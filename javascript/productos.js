let productosGlobal = [];

// Obtener categoría desde URL (si existe)
const urlParams = new URLSearchParams(window.location.search);
const categoriaURL = urlParams.get('categoria') || 'all'; // si no hay, muestra todos

// Cargar productos desde JSON
fetch('productos.json')
  .then(res => res.json())
  .then(productos => {
    productosGlobal = productos.map(p => ({ ...p, nombre: p.titulo }));
    mostrarProductos(categoriaURL); // mostrar según categoría de URL
    activarBoton(categoriaURL); // marcar botón activo si quieres
  });

function mostrarProductos(categoria) {
  const contenedor = document.getElementById('productos-lista');
  contenedor.innerHTML = '';

  productosGlobal
    .filter(p => categoria === 'all' || p.categoria === categoria)
    .forEach(prod => {
      contenedor.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">Precio: $${prod.precio}</p>
              <p class="card-text">${prod.descripcion}</p>
              <a href="detalle-producto.html?id=${prod.id}" class="btn btn-primary">Ver más</a>
            </div>
          </div>
        </div>
      `;
    });

  // Animación
  setTimeout(() => {
    const productosCards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    productosCards.forEach(producto => observer.observe(producto));
  }, 100);
}

// Botones de filtro (si los tienes en la página)
const botones = document.querySelectorAll('.category-btn-light');
botones.forEach(btn => {
  btn.addEventListener('click', () => {
    botones.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mostrarProductos(btn.dataset.category);
  });
});

// Función opcional para marcar botón activo según URL
function activarBoton(categoria) {
  botones.forEach(b => {
    b.classList.toggle('active', b.dataset.category === categoria);
  });
}
