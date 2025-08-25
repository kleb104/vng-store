function showDetail(){
    let cartRowHTML=''
    let itemCount=0
    let total=0
    const cart=getCart()
    if(cart.length >0){
        itemCount=cart.length
        cart.forEach(item => {
            const price =parseFloat(item.precio) || 0
            const quantity =parseFloat(item.quantity) || 0
            const subtotal= price * quantity
            cartRowHTML +=`<div class="row mb-4 d-flex justify-content-between align-items-center">
                  <div class="col-md-3 d-flex align-items-center">
                    <img src="${item.imagen}" class="img-fluid rounded-3 me-2" alt="${item.titulo}"
                      style="max-width: 100px;">
                    <h6 class="name-producto mb-0">${item.titulo}</h6>
                  </div>
                  <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                  <input type="text" min="0" name="${item.quantity}" value="${quantity}" class="form-control form-control-sm quantity-producto"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '');" onchange="updateCartItemQty(this)" data-id="${item.id}"/>
                  </div>
                  <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0 price-producto">&dollar; ${price.toFixed(2)}</h6>
                  </div>
                  <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0 subtotal-producto">&dollar; ${subtotal.toFixed(2)}</h6>
                  </div>
                  <div class="col-md-1 col-lg-1 col-xl">
                    <button type="button" class="btn btn-danger" onclick="eliminarItem(${item.id})"><i class="bi bi-trash" ></i></button>
                  </div>
                </div>
                <hr class="my-4">`
            total +=subtotal
        });
    }else{
        cartRowHTML = `<div class="alert alert-danger" role="alert">
                        El carrito está vacío.
                      </div>`;
    }
    document.getElementById("detail").innerHTML=cartRowHTML
    document.getElementById("total-items").textContent=itemCount

    // Aplicar cobro adicional si se selecciona envío
    const envio = document.querySelector('input[name="envio"]:checked')
    let shippingCost = envio ? parseFloat(envio.value) : 0
    total += shippingCost

    document.getElementById("total-compra").textContent="$"+total.toFixed(2)
}

function eliminarItem(idProducto){
    let cartArray=getCart()
    if(cartArray.length >0){
        cartArray=cartArray.filter((item)=> item.id !== idProducto)
        toastr.warning("Producto eliminado","Compra")
    }else{
        toastr.info("Seleccione productos a comprar","Compra")
    }
    saveCart(cartArray)
    showDetail()
}

function updateCartItemQty(element) {
  const idProducto = element.dataset.id;
  const newQuantity = parseInt(element.value, 10);
  if (isNaN(newQuantity)) {
    toastr.error("La cantidad no es un número válido.", "Error de Entrada");
    showDetail();
    return;
  }

  let cartArray = getCart();
  const itemIndex = cartArray.findIndex((obj) => obj.id == idProducto);

  if (itemIndex !== -1) {
    if (newQuantity < 0 || newQuantity == 0) {
      toastr.warning(
        "Cantidad no válida. Use el botón de eliminar para quitar el producto.",
        "Advertencia"
      );
      element.value = cartArray[itemIndex].quantity;
    } else {
      cartArray[itemIndex].quantity = newQuantity;
      saveCart(cartArray);
      showDetail();
      toastr.success(
        `Cantidad de "${cartArray[itemIndex].name}" actualizada a ${newQuantity}.`,
        "Cantidad Actualizada"
      );
    }
  } else {
    toastr.error("El producto no se encontró en el carrito.", "Error");
    showDetail();
  }
}

// Detectar cambios en el tipo de envío y actualizar total
document.addEventListener("DOMContentLoaded", () => {
  showDetail();

  const envioRadios = document.querySelectorAll('input[name="envio"]');
  envioRadios.forEach(radio => {
      radio.addEventListener('change', showDetail);
  });

  const btnPago = document.getElementById("btn-pago");
  if(btnPago){
      btnPago.addEventListener("click", (e) => {
        const cart = getCart();
        if (!cart || cart.length === 0) {
          e.preventDefault();
          toastr.warning("El carrito está vacío. Agrega productos antes de continuar.", "Compra");
        }
      });
  }
});
