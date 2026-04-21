// año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// pequeños helpers: smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});

document.getElementById("calcular").addEventListener("click", () => {
  const P = parseFloat(document.getElementById("monto").value) || 0;
  const aporte = parseFloat(document.getElementById("aporte").value) || 0;
  const r = (parseFloat(document.getElementById("tasa").value) || 0) / 100;
  const t = parseFloat(document.getElementById("plazo").value) || 0;

  const meses = t * 12;
  const tasaMensual = r / 12;

  let total = P;
  let invertido = P;

  const dataTotal = [];
  const dataInvertido = [];

  for (let i = 0; i < meses; i++) {
    total = total * (1 + tasaMensual) + aporte;
    invertido += aporte;

    dataTotal.push(total);
    dataInvertido.push(invertido);
  }

  const ganancia = total - invertido;

  document.getElementById("resultado").innerHTML = `
    Total final: $${total.toFixed(2)} <br>
    Invertido: $${invertido.toFixed(2)} <br>
    Ganancia: $${ganancia.toFixed(2)}
  `;

  dibujarGrafica(dataTotal, dataInvertido);
});

function dibujarGrafica(dataTotal, dataInvertido) {
  const canvas = document.getElementById("grafica");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = 320;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 50;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;

  const maxValor = Math.max(...dataTotal);
  const pasos = dataTotal.length;

  const escalaY = height / maxValor;
  const escalaX = width / (pasos - 1);

  const colorTotal = "#144e44";     
  const colorInvertido = "#9aa6a3"; 

  // 📊 Función para formatear dinero
  const formatMoney = (num) =>
    "$" + Math.round(num).toLocaleString("es-MX");

  // 📈 Dibujar líneas
  function dibujarLinea(data, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((valor, i) => {
      const x = padding + i * escalaX;
      const y = canvas.height - padding - valor * escalaY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  // 🪵 Ejes
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // 🧠 Configurar texto (más grande para móvil)
  ctx.fillStyle = "#2b3a39";
  ctx.font = "13px Inter";

  // 📍 Eje Y (dinero)
  const divisionesY = 4;
  for (let i = 0; i <= divisionesY; i++) {
    const valor = (maxValor / divisionesY) * i;
    const y = canvas.height - padding - valor * escalaY;

    ctx.fillText(formatMoney(valor), 5, y + 4);

    // líneas guía horizontales
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  // 📍 Eje X (años)
  const totalAnios = dataTotal.length / 12;
  const pasosX = Math.min(6, totalAnios); // máximo 6 etiquetas

  for (let i = 0; i <= pasosX; i++) {
    const anio = (totalAnios / pasosX) * i;
    const index = Math.floor((anio * 12));

    const x = padding + index * escalaX;

    ctx.fillText(anio.toFixed(0) + "a", x - 10, canvas.height - 10);

    // líneas guía verticales
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.stroke();
  }

  // Dibujar datos encima de la grid
  dibujarLinea(dataInvertido, colorInvertido);
  dibujarLinea(dataTotal, colorTotal);

  // 🏷️ Leyenda simple
  ctx.fillStyle = colorTotal;
  ctx.fillText("Total", canvas.width - 100, padding - 10);

  ctx.fillStyle = colorInvertido;
  ctx.fillText("Invertido", canvas.width - 100, padding + 10);
}