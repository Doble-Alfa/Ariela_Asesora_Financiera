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

  for (let i = 0; i < meses; i++) {
    total = total * (1 + tasaMensual) + aporte;
    invertido += aporte;
  }

  const ganancia = total - invertido;

  document.getElementById("resultado").innerHTML = `
    Total final: $${total.toFixed(2)} <br>
    Invertido: $${invertido.toFixed(2)} <br>
    Ganancia: $${ganancia.toFixed(2)}
  `;
});