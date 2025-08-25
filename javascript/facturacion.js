function finalizarCompra() {
  const cart = getCart();

  // Validar expiración
  const expInput = document.getElementById('exp').value; // Formato YYYY-MM
  if (!expInput) {
    alert('Por favor ingresa la fecha de expiración.');
    return;
  }

  const [year, month] = expInput.split('-').map(Number);

  if (month < 1 || month > 12) {
    alert('El mes de expiración debe estar entre 01 y 12.');
    return;
  }

  const now = new Date();
  if (year < now.getFullYear() || (year === now.getFullYear() && month < (now.getMonth() + 1))) {
    alert('La tarjeta ha expirado.');
    return;
  }

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
