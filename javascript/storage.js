// Obtención de referencias a los elementos HTML
const contactForm = document.getElementById("contactForm");
const contactListLocal = document.getElementById("contactListLocal");
const contactListSession = document.getElementById("contactListSession");
const contactListCookie = document.getElementById("contactListCookie");

contactForm.addEventListener("submit", (e) => {
  // Previene el comportamiento por defecto del formulario (recargar la página).
  e.preventDefault();
  // Obtiene los valores actuales de los campos del formulario.
  const name = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  // Crea un objeto 'contact' con los datos recopilados.
  const contact = {
    name,
    email,
    message,
  };
  //--- Guardado de Contactos en Diferentes Almacenamientos ---
  // Guardar en LocalStorage
  saveContactLocalStorage(contact);
  // Guardar en SessionStorage
  saveContactSessionStorage(contact);
  // Guardar en Cookies
  saveContactCookie(contact);
  // --- Actualización de la Interfaz de Usuario ---
  // Llama a las funciones para mostrar las listas de contactos actualizadas.
  displayContactsLocalStorage();
  displayContactsSessionStorage();
  displayContactsCookie();
  // Reinicia los campos del formulario después del envío exitoso.
  contactForm.reset();
});
//--- Gestión de LocalStorage ---
// LocalStorage: Los datos persisten indefinidamente hasta que son eliminados manualmente.
const saveContactLocalStorage = (contact) => {
  // Intenta obtener los contactos existentes. Si no hay, inicializa un array vacío.
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  // Agrega el nuevo contacto al array.
  contacts.push(contact);
  // Guarda el array actualizado
  localStorage.setItem("contacts", JSON.stringify(contacts));
};
/**
 * Muestra los contactos guardados en LocalStorage en la interfaz de usuario.
 */
const displayContactsLocalStorage = () => {
  // Obtiene los contactos de LocalStorage y los convierte de string JSON a objeto/array.
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  // Usa la función genérica 'displayContacts' para renderizar la lista.
  displayContacts(contacts, contactListLocal);
};

// --- Gestión de SessionStorage ---
// SessionStorage: Los datos persisten solo mientras la pestaña del navegador está abierta.

/**
 * Guarda un nuevo contacto en SessionStorage.
 * @param {Object} contact El objeto de contacto a añadir.
 */
const saveContactSessionStorage = (contact) => {
  // Intenta obtener los contactos existentes. Si no hay, inicializa un array vacío.
  let contacts = JSON.parse(sessionStorage.getItem("contacts")) || [];
  // Agrega el nuevo contacto al array.
  contacts.push(contact);
  // Guarda el array actualizado (convertido a JSON string) en SessionStorage.
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
};

/**
 * Muestra los contactos guardados en SessionStorage en la interfaz de usuario.
 */
const displayContactsSessionStorage = () => {
  // Obtiene los contactos de SessionStorage y los convierte de string JSON a objeto/array.
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || [];
  // Usa la función genérica 'displayContacts' para renderizar la lista.
  displayContacts(contacts, contactListSession);
};

// --- Gestión de Cookies ---
// Cookies: Pequeños fragmentos de datos que se envían con cada solicitud HTTP al servidor.
// Tienen límites de tamaño y requieren manejo especial para objetos complejos.

/**
 * Guarda un contacto en una cookie.
 * @param {Object} contact El objeto de contacto a guardar.
 * @param {number} [days=7] La cantidad de días que la cookie será válida. Por defecto es 7 días.
 */
const saveContactCookie = (contact, days = 7) => {
  // Recupera el array actual de contactos desde la cookie.
  let contacts = getContactsFromCookie() || [];
  // Agrega el nuevo contacto al array.
  contacts.push(contact);

  // Convierte el array completo de contactos a una cadena JSON.
  const jsonString = JSON.stringify(contacts);
  const name = "contacts_cookie"; // Define el nombre de la cookie.

  // Calcula la fecha de expiración para la cookie.
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();

  // Crea la cookie. El valor se codifica para manejar caracteres especiales.
  // 'path=/' asegura que la cookie esté disponible en todo el dominio.
  document.cookie =
    name + "=" + encodeURIComponent(jsonString) + expires + "; path=/";
};

/**
 * Recupera los contactos de una cookie..
 * @returns {Array} Un array de contactos o un array vacío si la cookie no existe o es inválida.
 */
const getContactsFromCookie = () => {
  const name = "contacts_cookie="; // Nombre de la cookie a buscar.
  // Decodifica toda la cadena de cookies del documento.
  const decodedCookie = decodeURIComponent(document.cookie);
  // Divide la cadena en cookies individuales.
  const ca = decodedCookie.split(";");

  // Itera sobre cada parte de la cadena para encontrar la cookie deseada.
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // Elimina espacios en blanco al inicio de la cookie.
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    // Si la cookie actual comienza con el nombre buscado...
    if (c.indexOf(name) === 0) {
      try {
        // ...extrae el valor y lo parsea como JSON.
        return JSON.parse(c.substring(name.length, c.length));
      } catch (e) {
        // Maneja errores si el JSON de la cookie está corrupto.
        console.error("Error al parsear JSON de la cookie:", e);
        return []; // Retorna un array vacío para evitar que la aplicación falle.
      }
    }
  }
  return []; // Retorna un array vacío si la cookie no se encuentra.
};

/**
 * Muestra los contactos obtenidos de la cookie en la interfaz de usuario.
 */
const displayContactsCookie = () => {
  // Obtiene los contactos desde la cookie.
  const contacts = getContactsFromCookie();
  // Usa la función genérica 'displayContacts' para renderizar la lista.
  displayContacts(contacts, contactListCookie);
};

/**
 * Elimina la cookie de contactos.
 * Esto se logra sobrescribiendo la cookie con una fecha de expiración en el pasado.
 */
function removeCookie() {
  // Establece la cookie con el mismo nombre y una fecha en el pasado, lo que la elimina.
  document.cookie =
    "contacts_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Actualiza la visualización para reflejar la eliminación.
  displayContactsCookie();
}

// --- Función Genérica para Mostrar Contactos ---
/**
 * Muestra un array de objetos de contacto en un elemento HTML dado.
 * @param {Array} data El array de contactos a mostrar.
 * @param {HTMLElement} contactList El elemento HTML donde se mostrarán los contactos.
 */
const displayContacts = (data, contactList) => {
  // Limpia el contenido actual del contenedor de la lista.
  contactList.innerHTML = "";
  // Si no hay contactos, muestra un mensaje indicándolo y termina la función.
  if (data.length === 0) {
    contactList.innerHTML = "<p>No hay contactos guardados.</p>";
    return;
  }
  // Itera sobre cada contacto en el array de datos.
  data.forEach((contact) => {
    // Crea un nuevo elemento div para cada contacto.
    const contactItem = document.createElement("div");
    // Añade una clase CSS para estilizar el item.
    contactItem.classList.add("contact-item");
    // Establece el contenido HTML del item con los detalles del contacto.
    contactItem.innerHTML = `
                <p><b>Nombre:</b> ${contact.name}</p>
                <p><b>Email:</b> ${contact.email}</p>
                <p><b>Mensaje:</b> ${contact.message}</p>
            `;
    // Añade el item de contacto al contenedor de la lista.
    contactList.appendChild(contactItem);
  });
};

// --- Funciones de Eliminación Específicas de Almacenamiento ---

/**
 * Elimina todos los contactos de LocalStorage.
 */
function removeLocal() {
  localStorage.removeItem("contacts"); // Elimina la clave 'contacts' de LocalStorage.
  displayContactsLocalStorage(); // Actualiza la visualización.
}

/**
 * Elimina todos los contactos de SessionStorage.
 */
function removeSession() {
  sessionStorage.removeItem("contacts"); // Elimina la clave 'contacts' de SessionStorage.
  displayContactsSessionStorage(); // Actualiza la visualización.
}

/* --- Carga Inicial de Contactos --- */
// Al cargar la página, se muestran automáticamente todos los contactos guardados
displayContactsLocalStorage();
displayContactsSessionStorage();
displayContactsCookie();
