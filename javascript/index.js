// Normalizar texto para ignorar tildes y mayúsculas
  function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  let productosGlobal = [];

  // Cargar productos desde JSON
  fetch('productos.json')
    .then(res => res.json())
    .then(productos => {
      productosGlobal = productos;
      mostrarProductos(productos.filter(p => p.relevante));
    });

  function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos-relevantes');
    contenedor.innerHTML = '';

    productos.forEach(prod => {
      contenedor.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${prod.imagenes?.[0] || prod.imagen || 'imgs/default.jpg'}" 
                 class="card-img-top" alt="${prod.titulo}">
            <div class="card-body">
              <h5 class="card-title">${prod.titulo}</h5>
              <p class="card-text">Precio: $${prod.precio}</p>
              <p class="card-text">${prod.descripcion}</p>
              <a href="detalle-producto.html?id=${prod.id}" class="btn btn-primary">Ver más</a>
            </div>
          </div>
        </div>
      `;
    });

    // Animación al aparecer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(".card").forEach(card => observer.observe(card));
  }