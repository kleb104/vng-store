function saveCart(cartArray){
    localStorage.setItem("compravg",JSON.stringify(cartArray))
    console.log("Carrito guardo: ", cartArray)
}
function getCart(){
    const cart=localStorage.getItem("compravg")
    return cart ? JSON.parse(cart) : []
}
function addToCart(idProducto) {
  fetch("productos.json")
    .then(res => res.json())
    .then(products => {
      const producto = products.find(p => p.id == idProducto);
      if (!producto) {
        toastr.error("Producto no encontrado", "Error");
        return;
      }

      let cartArray = getCart();
      const indexItem = cartArray.findIndex(p => p.id === idProducto);

      if (indexItem !== -1) {
        // Si ya está en el carrito, aumentar cantidad
        cartArray[indexItem].quantity += 1;
        toastr.info(
          `Cantidad de "${producto.titulo}" actualizada a ${cartArray[indexItem].quantity}`,
          "Carrito Actualizado"
        );
      } else {
        // Si no está, lo agregamos con quantity=1
        const carItem = {
          id: producto.id,
          imagen: producto.imagen,
          titulo: producto.titulo,
          precio: producto.precio,
          quantity: 1,
        };
        cartArray.push(carItem);
        toastr.success(`"${producto.titulo}" agregado al carrito`, "Producto Agregado");
      }

      saveCart(cartArray);
    })
    .catch(error => {
      console.error("Error cargando productos.json:", error);
      toastr.error("No se pudieron cargar los productos", "Error");
    });
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }