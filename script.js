
let datos = [];

document.addEventListener('DOMContentLoaded', function() {
    const input = document.querySelector("#email");
    input.addEventListener('blur', validar);
});

function validar (e){
    if(e.target.value.trim()===''){
        console.log("el input email esta vacio")
    }
    else{
        console.log(e.target.value)
    }

    if(e.target.id === 'email'){
        const regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
        const result= regex.test(e.target.value)

        if(result != true){
            alert("El email no es valido");
            document.getElementById("email").value = "";
        }
        else{-
            alert("El email es valido")
            agregarDatos()
        }
    }
}

function agregarDatos() 
{
   let codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  let fecha = document.getElementById("fecha").value;
  const email = document.getElementById("email").value;

    if (codigo && nombre && apellido && fecha && email) 
    {
    datos.push({ Código: codigo, Nombre: nombre, Apellido: apellido, Fecha: fecha, Email: email });
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("email").value = "";
    mostrarDatos();
  } 
}


function limpiar()
{
document.getElementById("codigo").value="";
document.getElementById("nombre").value="";
document.getElementById("apellido").value="";
document.getElementById("fecha").value = "";
document.getElementById("email").value = "";
}

function mostrarDatos() {
  const tabla = document.getElementById("tablaDatos");
  tabla.innerHTML = "";

  if (datos.length > 0) {
    const table = document.createElement("table");
    const headerRow = table.insertRow(0);

    for (const key in datos[0]) {
      const th = document.createElement("th");
      th.innerHTML = key;
      headerRow.appendChild(th);
    }

    for (let i = 0; i < datos.length; i++) {
      const row = table.insertRow(i + 1);
      for (const key in datos[i]) {
        const cell = row.insertCell();
        cell.innerHTML = datos[i][key];
      }
    }

    tabla.appendChild(table);
    document.getElementById("exportButton").style.display = "block";
  } else {
    document.getElementById("exportButton").style.display = "none";
  }
}

function buscarCodigo() {
  const codigoBuscado = document.getElementById("buscarCodigo").value;
  const resultadoBusqueda = document.getElementById("resultadoBusqueda");
  resultadoBusqueda.innerHTML = "";

  if (codigoBuscado) {
    const resultados = datos.filter((item) => item["Código"] === codigoBuscado);

    if (resultados.length > 0) {
      const table = document.createElement("table");
      const headerRow = table.insertRow(0);

      for (const key in resultados[0]) {
        const th = document.createElement("th");
        th.innerHTML = key;
        headerRow.appendChild(th);
      }

      resultados.forEach((item, index) => {
        const row = table.insertRow(index + 1);
        for (const key in item) {
          const cell = row.insertCell();
          cell.innerHTML = item[key];
        }
      });

      resultadoBusqueda.appendChild(table);

      // Mostrar los datos encontrados en las cajas de texto del formulario
      document.getElementById("codigo").value = resultados[0]["Código"];
      document.getElementById("nombre").value = resultados[0]["Nombre"];
      document.getElementById("apellido").value = resultados[0]["Apellido"];
      document.getElementById("fecha").value = resultados[0]["Fecha"];
      document.getElementById("email").value = resultados[0]["Email"];


    } else {
      resultadoBusqueda.innerHTML = "Código no encontrado.";
    }
  }
}

function actualizarDatos() {
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const fecha = document.getElementById("fecha").value;
  const email = document.getElementById("email").value;
  if (codigo) {
    const indice = datos.findIndex((item) => item["Código"] === codigo);

    if (indice !== -1) {
      datos[indice] = { Código: codigo, Nombre: nombre, Apellido: apellido, Fecha: fecha, Email: email };
      mostrarDatos();
      limpiar();
    }
  }
}

function eliminarDatos() {
  const codigo = document.getElementById("codigo").value;

  if (codigo) {
    const indice = datos.findIndex((item) => item["Código"] === codigo);

    if (indice !== -1) {
      datos.splice(indice, 1);
      mostrarDatos();
      limpiar();
    }
  }
}

function cargarDatosDesdeExcel() {
  const fileInput = document.getElementById("cargarArchivo");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      datos = jsonData;
      mostrarDatos();
    };

    reader.readAsArrayBuffer(file);
  }
}

function exportToExcel() {
  if (datos.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, "datos.xlsx");
  }
}