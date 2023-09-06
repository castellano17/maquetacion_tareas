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
  const $clientFilter = document.querySelector("#client-filter");
  const $spanAvance = document.getElementById("avance-semanal"); // Elemento para mostrar el avance
  const $enEquipoCheckbox = document.getElementById("enEquipoCheckbox");
  const $criticoCheckbox = document.getElementById("criticoCheckbox");
  const $documentacionCheckbox = document.getElementById(
    "documentacionCheckbox"
  );
  const $reporteCheckbox = document.getElementById("reporteCheckbox");
  const $capacitacionCheckbox = document.getElementById("capacitacionCheckbox");
  const $trabajoEnEquipo = document.getElementById("trabajoEnEquipo");
  const $critico = document.getElementById("critico");
  const $documentacion = document.getElementById("documentacion");
  const $capacitacion = document.getElementById("capacitacion");
  const $reporte = document.getElementById("reporte");

  // Agrega un evento de cambio al elemento #proyect
  $proyectFilter.addEventListener("change", function () {
    const proyectoSeleccionado = this.value; // obtengo el select

    // Filtra las tareas basadas en el proyecto seleccionado
    const tareasFiltradas = proyectoSeleccionado
      ? tareas.filter((tarea) => tarea.proyect === proyectoSeleccionado)
      : tareas; // Si el valor está vacío, muestra todas las tareas

    refrescarListaDeTareas(tareasFiltradas);
  });

  // Filtro para los clientes
  // Agrega un evento de cambio al elemento #proyect
  $clientFilter.addEventListener("change", function () {
    const clienteSeleccionado = this.value; // obtengo el select

    // Filtra las tareas basadas en el proyecto seleccionado
    const tareasFiltradas = clienteSeleccionado
      ? tareas.filter((tarea) => tarea.client === clienteSeleccionado)
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
    const enEquipoCheckbox = $enEquipoCheckbox.checked;
    const criticoCheckbox = $criticoCheckbox.checked;
    const documentacionCheckbox = $documentacionCheckbox.checked;
    const reporteCheckbox = $reporteCheckbox.checked;
    const capacitacionCheckbox = $capacitacionCheckbox.checked;

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
      enEquipo: enEquipoCheckbox,
      critico: criticoCheckbox,
      documentacion: documentacionCheckbox,
      reporte: reporteCheckbox,
      capacitacion: capacitacionCheckbox,
      date: fechaFormateada,
    });

    $inputNuevaTarea.value = "";
    $inputDate.value = "";
    $proyect.value = "";
    $client.value = "";
    $typeTask.value = "";
    $enEquipoCheckbox.checked = false;
    $criticoCheckbox.checked = false;
    $documentacionCheckbox.checked = false;
    $reporteCheckbox.checked = false;
    $capacitacionCheckbox.checked = false;
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

  //Función para filtrar y contar las propiedad de los checkbox
  function contarTareasPorPropiedad(tareas, propiedad) {
    return tareas.filter((tarea) => tarea[propiedad] === true).length;
  }

  // Definir función que refresca la lista de tareas a partir del arreglo global
  const refrescarListaDeTareas = (tareasMostrarAhora) => {
    // envíar dato a la función para contar las tareas con diferentes propiedades
    const cantidadTareasEnEquipo = contarTareasPorPropiedad(tareas, "enEquipo");
    const cantidadTareasCriticas = contarTareasPorPropiedad(tareas, "critico");
    const cantidadTareasDocumentacion = contarTareasPorPropiedad(
      tareas,
      "documentacion"
    );
    const cantidadTareasReporte = contarTareasPorPropiedad(tareas, "reporte");
    const cantidadTareasCapacitacion = contarTareasPorPropiedad(
      tareas,
      "capacitacion"
    );

    $trabajoEnEquipo.textContent = cantidadTareasEnEquipo;
    $critico.textContent = cantidadTareasCriticas;
    $documentacion.textContent = cantidadTareasDocumentacion;
    $reporte.textContent = cantidadTareasReporte;
    $capacitacion.textContent = cantidadTareasCapacitacion;

    // Antes de agregar nuevos checkboxes, eliminar los antiguos
    while ($pendientes.firstChild) {
      $pendientes.removeChild($pendientes.firstChild);
    }

    $contenedorTareas.innerHTML = "";

    const isFiltered = tareasMostrarAhora || tareas; // Si no tengo un filtro muestro todas las tareas

    isFiltered.forEach((renderTarea, indice) => {
      // Paso las tareas al forEch para que las renderice

      // div con la clase "card"
      const $cardDiv = document.createElement("div");
      $cardDiv.classList.add("card");

      // estructura interna de la card
      const $iconTextDiv = document.createElement("div");
      $iconTextDiv.classList.add("icon-text");

      //  ícono clock
      const $icon = document.createElement("i");
      $icon.classList.add("fa-solid", "fa-clock");

      const $titleTextSpan = document.createElement("span");
      $titleTextSpan.classList.add("title-text");
      if (renderTarea.terminada) {
        $titleTextSpan.textContent = "Terminada";
        $titleTextSpan.style.color = "var(--green-color)";
        $icon.style.color = "var(--blue-color)";
      } else {
        $titleTextSpan.textContent = "En Proceso";
        $titleTextSpan.style.color = "var(--blue-color)";
        $icon.style.color = "var(--red-color)";
      }

      const $description = document.createElement("p");
      $description.classList.add("description-text");
      $description.textContent = renderTarea.tarea;

      //cliente
      const $clientDiv = document.createElement("div");
      $clientDiv.classList.add("icon-text");

      //  ícono client
      const $iconClient = document.createElement("i");
      $iconClient.classList.add("fa-solid", "fa-building");
      $iconClient.style.color = "var(--blue-color)";

      const $clientText = document.createElement("p");
      $clientText.classList.add("tipo-text");
      $clientText.textContent = renderTarea.client;

      //proyecto
      const $proyectDiv = document.createElement("div");
      $proyectDiv.classList.add("icon-text");

      //  ícono proyect
      const $iconProyect = document.createElement("i");
      $iconProyect.classList.add("fa-solid", "fa-box");
      $iconProyect.style.color = "var(--blue-color)";

      const $proyectText = document.createElement("p");
      $proyectText.classList.add("tipo-text");
      $proyectText.textContent = renderTarea.proyect;

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
      $dateText.textContent = renderTarea.date;

      //date restante

      const $dateFinDiv = document.createElement("div");
      $dateFinDiv.classList.add("icon-date");

      //  ícono date fin

      // Calcula los días restantes
      const fechaActual = new Date();
      const fechaFin = new Date(renderTarea.dateFin);
      const diferenciaMs = fechaFin - fechaActual;
      const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)); // Milisegundos a días

      const $iconFind = document.createElement("span");
      $iconFind.classList.add("fa-solid", "fa-clock");
      $iconFind.style.color =
        diasRestantes <= 0 ? "var(--red-color)" : "var(--blue-color)";
      $iconFind.textContent = diasRestantes;

      const $dateFinText = document.createElement("span");
      //  $dateText.classList.add("tipo-text");
      $dateFinText.textContent = renderTarea.dateFin;

      //colores de variables
      const $variablesColores = document.createElement("div");
      $variablesColores.style.display = "flex";
      $variablesColores.style.justifyContent = "flex-end";

      // Objeto que contiene las propiedades y los colores correspondientes
      const propiedadesColores = {
        enEquipo: "var(--gray-color)",
        critico: "var(--red-color)",
        documentacion: "var(--blue-color)",
        capacitacion: "var(--yellow-color)",
        reporte: "var(--green-color)",
      };

      // Itera a través de las propiedades y agrega círculos para las propiedades verdaderas
      for (const propiedad in propiedadesColores) {
        if (renderTarea[propiedad] === true) {
          const $circulo = document.createElement("i");
          $circulo.classList.add("fa-solid", "fa-circle");
          $circulo.style.color = propiedadesColores[propiedad];
          $circulo.style.marginLeft = "10px";
          $variablesColores.appendChild($circulo);
        }
      }

      // Luego, agrega $variablesColores al elemento que desees en tu página.

      // Luego, agrega $variablesColores al elemento que desees en tu página.

      // El input para marcar la tarea como terminada
      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.checked = renderTarea.terminada; // Establecer el estado del checkbox
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
          $icon.style.color = "var(--blue-color)";
          $li.classList.add("tachado");
          $li.classList.remove("unckeck");
        } else {
          $titleTextSpan.textContent = "En Proceso";
          $titleTextSpan.style.color = "var(--blue-color)";
          $icon.style.color = "var(--red-color)";
          $li.classList.remove("tachado");
          $li.classList.add("unckeck");
        }
      };

      const $li = document.createElement("li");
      $li.classList.add("list");
      if (renderTarea.terminada) {
        $li.classList.add("tachado");
      }

      $li.appendChild($checkbox);
      $li.appendChild(document.createTextNode(renderTarea.tarea));
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
      $cardDiv.appendChild($variablesColores);

      $contenedorTareas.appendChild($cardDiv);
    });
  };

  // Llamar a la función la primera vez
  obtenerTareasDeAlmacenamiento();
  refrescarListaDeTareas();
});
