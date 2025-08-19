const form = document.getElementById("formCredito");
const tabla = document.getElementById("tablaCreditos").getElementsByTagName("tbody")[0];
let chart;

async function obtenerCreditos() {
    const res = await fetch("/api/creditos");
    const data = await res.json();
    tabla.innerHTML = "";
    let total = 0;

    data.forEach(credito => {
        const row = tabla.insertRow();
        row.insertCell(0).innerText = credito.id;
        row.insertCell(1).innerText = credito.cliente;
        row.insertCell(2).innerText = credito.monto;
        row.insertCell(3).innerText = credito.tasa_interes;
        row.insertCell(4).innerText = credito.plazo;
        row.insertCell(5).innerText = credito.fecha_otorgamiento;

        const acciones = row.insertCell(6);
        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "Eliminar";
        btnEliminar.onclick = () => eliminarCredito(credito.id);
        acciones.appendChild(btnEliminar);

        total += parseFloat(credito.monto);
    });

    actualizarGrafica(total);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const credito = {
        cliente: document.getElementById("cliente").value,
        monto: parseFloat(document.getElementById("monto").value),
        tasa_interes: parseFloat(document.getElementById("tasa_interes").value),
        plazo: parseInt(document.getElementById("plazo").value),
        fecha_otorgamiento: document.getElementById("fecha_otorgamiento").value
    };

    await fetch("/api/creditos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credito)
    });

    form.reset();
    obtenerCreditos();
});

async function eliminarCredito(id) {
    await fetch(`/api/creditos/${id}`, {method: "DELETE"});
    obtenerCreditos();
}

function actualizarGrafica(total) {
    const ctx = document.getElementById('graficaCreditos').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Créditos'],
            datasets: [{
                label: 'Monto total',
                data: [total],
                backgroundColor: ['#3498db']
            }]
        }
    });
}

// Cargar créditos al iniciar
obtenerCreditos();
