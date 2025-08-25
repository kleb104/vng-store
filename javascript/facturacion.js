function finalizarCompra() {
  const cart = getCart();
  let facturaHTML = '';
  let total = 0;

  cart.forEach(item => {
    const producto = productosData.find(p => p.id === item.id);
    if (!producto) return;

    const subtotal = producto.precio * item.quantity;
    total += subtotal;

    facturaHTML += `
      <div>${producto.titulo} x${item.quantity} - $${subtotal.toFixed(2)}</div>
    `;
  });

  facturaHTML += `<div><strong>Total: $${total.toFixed(2)}</strong></div>`;
  document.getElementById('resumen-factura').innerHTML = facturaHTML;
  alert('¡Compra registrada correctamente!');
}