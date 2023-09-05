const CLAVE_LOCALSTORAGE = "lista_tareas";

document.addEventListener("DOMContentLoaded", function () {
  btnAddTask.addEventListener("click", function () {
    if (!modal) {
      // Si el modal no está inicializado, inicialízalo y ábrelo
      modal = new bootstrap.Modal(document.getElementById("modal"));
      modal.show();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let tareas = []; // El arreglo global de tareas
  // Declaración de elementos del DOM
  const $pendientes = document.getElementById("pendientes");
  const $contenedorTareas = document.querySelector("#contenedorTareas"),
    $btnGuardarTarea = document.querySelector("#btnAddTask"),
    $inputNuevaTarea = document.querySelector("#inputNewTask"),
    $proyect = document.querySelector("#proyect"),
    $client = document.querySelector("#client"),
    $typeTask = document.querySelector("#typeTask"),
    $inputDate = document.querySelector("#inputDate");
  const $proyectFilter = document.querySelector("#proyect-filter");
  const $spanAvance = document.getElementById("avance-semanal"); // Elemento para mostrar el avance

  // Agrega un evento de cambio al elemento #proyect
  $proyectFilter.addEventListener("change", function () {
    const proyectoSeleccionado = this.value; // obtengo el select

    // Filtra las tareas basadas en el proyecto seleccionado
    const tareasFiltradas = proyectoSeleccionado
      ? tareas.filter((tarea) => tarea.proyect === proyectoSeleccionado)
      : tareas; // Si el valor está vacío, muestra todas las tareas

    refrescarListaDeTareas(tareasFiltradas);
  });
  // Escuchar clic del botón para agregar nueva tarea
  $btnGuardarTarea.onclick = function () {
    const tarea = $inputNuevaTarea.value;
    const typeTask = $typeTask.value;
    const proyect = $proyect.value;
    const client = $client.value;
    const dateFin = $inputDate.value;
    if (!tarea || !dateFin || !typeTask || !proyect || !client) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Formatear la fecha en el formato deseado (por ejemplo, yyyy-mm-dd hh:mm:ss)
    const fechaFormateada = `${fechaActual.getFullYear()}-${
      fechaActual.getMonth() + 1
    }-${fechaActual.getDate()} `;

    // Agregar la tarea al arreglo tareas junto con la fecha
    tareas.push({
      tarea,
      proyect,
      client,
      typeTask,
      terminada: false,
      dateFin,
      date: fechaFormateada, // Agregar la fecha formateada
    });

    $inputNuevaTarea.value = "";
    $inputDate.value = "";
    $proyect.value = "";
    $client.value = "";
    $typeTask.value = "";
    guardarTareasEnAlmacenamiento();
    refrescarListaDeTareas();
  };

  const obtenerTareasDeAlmacenamiento = () => {
    const posibleLista = JSON.parse(localStorage.getItem(CLAVE_LOCALSTORAGE));
    if (posibleLista) {
      tareas = posibleLista; // Asigna el contenido del almacenamiento local a tareas
    } else {
      tareas = [];
    }

    // Inicializa tareasTerminadas con la cantidad de tareas terminadas al cargar la página
    tareasTerminadas = tareas.filter((tarea) => tarea.terminada).length;

    // Calcular el porcentaje de avance
    const totalTareas = tareas.length;
    const porcentajeAvance = (tareasTerminadas / totalTareas) * 100;

    // Actualizar el contenido del elemento span
    $spanAvance.textContent = porcentajeAvance.toFixed(2) + "%";

    return tareas; // Devuelve el arreglo de tareas
  };

  const guardarTareasEnAlmacenamiento = () => {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareas));
  };

  // Definir función que refresca la lista de tareas a partir del arreglo global
  const refrescarListaDeTareas = (tareasMostrar = tareas) => {
    $contenedorTareas.innerHTML = "";

    for (const [indice, tarea] of tareas.entries()) {
      // div con la clase "card"
      const $cardDiv = document.createElement("div");
      $cardDiv.classList.add("card");

      // estructura interna de la card
      const $iconTextDiv = document.createElement("div");
      $iconTextDiv.classList.add("icon-text");

      //  ícono clock
      const $icon = document.createElement("i");
      $icon.classList.add("fa-solid", "fa-clock");
      $icon.style.color = "var(--blue-color)";

      const $titleTextSpan = document.createElement("span");
      $titleTextSpan.classList.add("title-text");
      if (tarea.terminada) {
        $titleTextSpan.textContent = "Terminada";
        $titleTextSpan.style.color = "var(--green-color)";
      } else {
        $titleTextSpan.textContent = "En Proceso";
        $titleTextSpan.style.color = "var(--blue-color)";
      }

      const $description = document.createElement("p");
      $description.classList.add("description-text");
      $description.textContent = tarea.tarea;

      //cliente
      const $clientDiv = document.createElement("div");
      $clientDiv.classList.add("icon-text");

      //  ícono client
      const $iconClient = document.createElement("i");
      $iconClient.classList.add("fa-solid", "fa-building");
      $iconClient.style.color = "var(--blue-color)";

      const $clientText = document.createElement("p");
      $clientText.classList.add("tipo-text");
      $clientText.textContent = tarea.client;

      //proyecto
      const $proyectDiv = document.createElement("div");
      $proyectDiv.classList.add("icon-text");

      //  ícono proyect
      const $iconProyect = document.createElement("i");
      $iconProyect.classList.add("fa-solid", "fa-box");
      $iconProyect.style.color = "var(--blue-color)";

      const $proyectText = document.createElement("p");
      $proyectText.classList.add("tipo-text");
      $proyectText.textContent = tarea.proyect;

      //avance
      const $estadoDiv = document.createElement("div");
      $estadoDiv.classList.add("desarrollo");

      const $spanTitle = document.createElement("span");
      $spanTitle.classList.add("desarrollo-title");
      $spanTitle.textContent = "Desarrollo";
      const $spanDescription = document.createElement("span");
      $spanDescription.classList.add("desarrollo-porcentaje");
      $spanDescription.textContent = "100%";

      //date

      const $dateDiv = document.createElement("div");
      $dateDiv.classList.add("icon-date");

      //  ícono date
      const $iconDate = document.createElement("i");
      $iconDate.classList.add("fa-solid", "fa-calendar-days");
      $iconDate.style.color = "var(--blue-color)";

      const $dateText = document.createElement("span");
      //  $dateText.classList.add("tipo-text");
      $dateText.textContent = tarea.date;

      //date restante

      const $dateFinDiv = document.createElement("div");
      $dateFinDiv.classList.add("icon-date");

      //  ícono date fin
      const $iconFind = document.createElement("span");
      $iconFind.classList.add("fa-solid", "fa-clock");
      $iconFind.style.color = "var(--blue-color)";
      $iconFind.textContent = 300;

      const $dateFinText = document.createElement("span");
      //  $dateText.classList.add("tipo-text");
      $dateFinText.textContent = tarea.dateFin;

      // El input para marcar la tarea como terminada
      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.checked = tarea.terminada; // Establecer el estado del checkbox
      $checkbox.onchange = function () {
        const isChecked = this.checked;
        tareas[indice].terminada = this.checked; // Actualizar el estado en el arreglo
        guardarTareasEnAlmacenamiento();

        // Actualizar el contador de tareas terminadas
        if (isChecked) {
          tareasTerminadas++;
        } else {
          tareasTerminadas--;
        }

        // Calcular el porcentaje de avance
        const totalTareas = tareas.length;
        const porcentajeAvance = (tareasTerminadas / totalTareas) * 100;

        // Actualizar el contenido del elemento span
        $spanAvance.textContent = porcentajeAvance.toFixed(2) + "%";

        if (isChecked) {
          $titleTextSpan.textContent = "Terminada";
          $titleTextSpan.style.color = "var(--green-color)";
          $li.classList.add("tachado");
          $li.classList.remove("unckeck");
        } else {
          $titleTextSpan.textContent = "En Proceso";
          $titleTextSpan.style.color = "var(--blue-color)";
          $li.classList.remove("tachado");
          $li.classList.add("unckeck");
        }
      };

      const $li = document.createElement("li");
      $li.classList.add("list");
      if (tarea.terminada) {
        $li.classList.add("tachado");
      }

      $li.appendChild($checkbox);
      $li.appendChild(document.createTextNode(tarea.tarea));
      $pendientes.appendChild($li);

      $iconTextDiv.appendChild($icon);
      $iconTextDiv.appendChild($titleTextSpan);

      $cardDiv.appendChild($iconTextDiv);
      $cardDiv.appendChild($description);

      $clientDiv.appendChild($iconClient);
      $clientDiv.appendChild($clientText);
      $cardDiv.appendChild($clientDiv);

      $proyectDiv.appendChild($iconProyect);
      $proyectDiv.appendChild($proyectText);
      $cardDiv.appendChild($proyectDiv);

      $estadoDiv.appendChild($spanTitle);
      $estadoDiv.appendChild($spanDescription);
      $cardDiv.appendChild($estadoDiv);

      $dateDiv.appendChild($iconDate);
      $dateDiv.appendChild($dateText);
      $cardDiv.appendChild($dateDiv);

      $dateFinDiv.appendChild($iconFind);
      $dateFinDiv.appendChild($dateFinText);
      $cardDiv.appendChild($dateFinDiv);

      $contenedorTareas.appendChild($cardDiv);
    }
  };

  // Llamar a la función la primera vez
  obtenerTareasDeAlmacenamiento();
  refrescarListaDeTareas();
});
