function showDetail() {
  let cartRowHTML = '';
  let itemCount = 0;
  let total = 0;

  const cart = getCart();
  if (cart.length > 0) {
    itemCount = cart.length;
    cart.forEach(item => {
      const price = parseFloat(item.precio) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const subtotal = price * quantity;
      cartRowHTML += `
        <div class="row mb-4 d-flex justify-content-between align-items-center">
          <div class="col-md-3 d-flex align-items-center">
            <img src="${item.imagen}" class="img-fluid rounded-3 me-2" alt="${item.titulo}" style="max-width: 100px;">
            <h6 class="name-producto mb-0">${item.titulo}</h6>
          </div>
          <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
            <input type="text" min="0" name="${item.quantity}" value="${item.quantity}" 
              class="form-control form-control-sm quantity-producto"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');" 
              onchange="updateCartItemQty(this)" data-id="${item.id}"/>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
            <h6 class="mb-0 price-producto">&dollar; ${item.precio.toFixed(2)}</h6>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
            <h6 class="mb-0 subtotal-producto">&dollar; ${subtotal.toFixed(2)}</h6>
          </div>
          <div class="col-md-1 col-lg-1 col-xl">
            <button type="button" class="btn btn-danger" onclick="eliminarItem(${item.id})"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <hr class="my-4">`;
      total += subtotal;
    });

  } else {
    cartRowHTML = `<div class="alert alert-danger" role="alert">
                    El carrito está vacío.
                  </div>`;
  }

  document.getElementById("detail").innerHTML = cartRowHTML;
  document.getElementById("total-items").textContent = itemCount;

  // Verificar si ya seleccionó envío o recoger
  const envioSeleccionado = document.querySelector("input[name='envio']:checked");
  const envioExtra = envioSeleccionado ? parseFloat(envioSeleccionado.value) : 0;

  const totalFinal = total + envioExtra;

  document.getElementById("total-compra").textContent = "$" + totalFinal.toFixed(2);

  // Guardar el total en localStorage (para usarlo en facturación)
  localStorage.setItem("totalCompra", totalFinal);
}

document.addEventListener("DOMContentLoaded", () => {
  showDetail();

  // Actualizar total al cambiar opción de envío
  document.querySelectorAll("input[name='envio']").forEach(radio => {
    radio.addEventListener("change", showDetail);
  });

  const btnPago = document.getElementById("btn-pago");
  btnPago.addEventListener("click", (e) => {
    const cart = getCart();
    if (!cart || cart.length === 0) {
      e.preventDefault();
      toastr.warning("El carrito está vacío. Agrega productos antes de continuar.", "Compra");
    }
  });
});
