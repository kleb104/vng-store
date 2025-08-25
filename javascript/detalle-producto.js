const params = new URLSearchParams(window.location.search);
const idProducto = params.get('id');

fetch('productos.json')
  .then(res => res.json())
  .then(productos => {
    const producto = productos.find(p => p.id == idProducto);
    if (!producto) {
      document.getElementById('detalle-producto').innerHTML = "<p>Producto no encontrado.</p>";
      return;
    }

    // Calcular promedio de reseñas
    const promedio = producto.reseñas && producto.reseñas.length
      ? (producto.reseñas.reduce((acc, r) => acc + r.calificacion, 0) / producto.reseñas.length).toFixed(1)
      : 'Sin calificación';

    document.getElementById('detalle-producto').innerHTML = `
  <div class="row animate__animated animate__fadeInUp" data-bs-theme="dark">
    <div class="col-md-6">

    <div>
    <buton class="btn btn-primary mb-3" onclick="window.history.back()">Volver a ver productos</buton>
    </div>
      <!-- Carrusel -->
      <div id="carouselProducto" class="carousel slide mb-3" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${(producto.imagenes || []).map((img, i) => `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
              <img src="${img}" class="d-block object-fit-contain w-100" alt="${producto.titulo}">
            </div>
          `).join('')}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselProducto" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselProducto" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>

      <!-- Miniaturas -->
      <div class="row g-2">
        ${(producto.imagenes || []).map((img, i) => `
          <div class="col-3">
            <img src="${img}" class="img-fluid rounded border thumbnail-img" 
                 style="cursor:pointer" 
                 data-bs-target="#carouselProducto" 
                 data-bs-slide-to="${i}" 
                 alt="Miniatura ${i+1}">
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Info del producto -->
    <div class="col-md-6">
      <h2>${producto.titulo}</h2>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Disponibilidad:</strong> ${producto.cantidad + ' Unidades disponibles' || 'No disponible'}</p>
      <p>${producto.descripcion}</p>
      <p><strong>Tiempo de entrega:</strong> ${producto.tiempoEntrega || '3-5 días hábiles'}</p>
      <p><strong>Costo de envío:</strong> ${producto.envio !== undefined ? '$' + producto.envio : 'Incluido'}</p>
      <p><strong>Promedio de reseñas:</strong> ${promedio} / 5</p>

      <button class="btn btn-primary mt-2" onclick="addToCart(${producto.id})">
        Agregar al carrito
      </button>
      
      <h4>Reseñas:</h4>
      <div id="reseñas">
        ${producto.reseñas ? producto.reseñas.map(r => `
          <div class="mb-2">
            <strong>${r.usuario}</strong> - ${'★'.repeat(r.calificacion)}${'☆'.repeat(5 - r.calificacion)}<br>
            ${r.comentario}
          </div>
        `).join('') : '<p>No hay reseñas aún.</p>'}
      </div>

      <h5>Agregar Reseña:</h5>
      <form id="form-reseña">
        <input type="text" placeholder="Nombre" id="usuario" class="form-control mb-2" required>
        <textarea placeholder="Comentario" id="comentario" class="form-control mb-2" required></textarea>
        <select id="calificacion" class="form-control mb-2">
          <option value="1">★</option>
          <option value="2">★★</option>
          <option value="3">★★★</option>
          <option value="4">★★★★</option>
          <option value="5">★★★★★</option>
        </select>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </div>
  </div>
`;

    // Manejar envío de reseña
    document.getElementById('form-reseña').addEventListener('submit', e => {
      e.preventDefault();
      const usuario = document.getElementById('usuario').value;
      const comentario = document.getElementById('comentario').value;
      const calificacion = parseInt(document.getElementById('calificacion').value);

      const reseñasDiv = document.getElementById('reseñas');
      reseñasDiv.innerHTML += `
            <div class="mb-2">
              <strong>${usuario}</strong> - ${'★'.repeat(calificacion)}${'☆'.repeat(5 - calificacion)}<br>
              ${comentario}
            </div>
          `;
      e.target.reset();
    });
  });
