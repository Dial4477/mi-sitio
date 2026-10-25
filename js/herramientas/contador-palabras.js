// Lógica del contador de palabras. No depende del idioma de la página.
(function () {
  const texto = document.getElementById('texto');
  const salida = {
    palabras: document.getElementById('r-palabras'),
    caracteres: document.getElementById('r-caracteres'),
    sinEspacios: document.getElementById('r-sin-espacios'),
    frases: document.getElementById('r-frases'),
    parrafos: document.getElementById('r-parrafos'),
    lectura: document.getElementById('r-lectura'),
  };

  function analizar(t) {
    const limpio = t.trim();
    const palabras = limpio === '' ? 0 : limpio.split(/\s+/).length;
    const caracteres = t.length;
    const sinEspacios = t.replace(/\s/g, '').length;
    // Una frase termina en . ! ? (o sus versiones repetidas, como "...")
    const frases = limpio === '' ? 0 : (limpio.match(/[^.!?¡¿]+[.!?]+|[^.!?¡¿]+$/g) || []).length;
    // Un párrafo es un bloque de texto separado por líneas en blanco
    const parrafos = limpio === '' ? 0 : limpio.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
    // Lectura media: unas 200 palabras por minuto
    const minutos = palabras / 200;
    return { palabras, caracteres, sinEspacios, frases, parrafos, minutos };
  }

  function formatearLectura(min) {
    if (min === 0) return '0 s';
    if (min < 1) return Math.max(1, Math.round(min * 60)) + ' s';
    return Math.round(min) + ' min';
  }

  function actualizar() {
    const r = analizar(texto.value);
    salida.palabras.textContent = r.palabras;
    salida.caracteres.textContent = r.caracteres;
    salida.sinEspacios.textContent = r.sinEspacios;
    salida.frases.textContent = r.frases;
    salida.parrafos.textContent = r.parrafos;
    salida.lectura.textContent = formatearLectura(r.minutos);
  }

  texto.addEventListener('input', actualizar);

  document.getElementById('btn-borrar').addEventListener('click', function () {
    texto.value = '';
    actualizar();
    texto.focus();
  });

  actualizar();
})();
