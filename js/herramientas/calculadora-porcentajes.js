// Calculadora de porcentajes. Compartida por la versión en español y en inglés.
// El idioma se toma del atributo lang del <html>.
(function () {
  const lang = document.documentElement.lang || 'es';
  const simboloPct = lang === 'es' ? '\u00a0%' : '%'; // en español: espacio fino antes del %

  // Convierte el texto escrito en un número válido para JavaScript.
  // Acepta punto y coma como separador decimal, y también separadores de miles.
  function normalizar(v) {
    v = v.replace(/\s/g, '');
    const tienePunto = v.indexOf('.') !== -1;
    const tieneComa = v.indexOf(',') !== -1;

    if (tienePunto && tieneComa) {
      // Con ambos, el que aparece el último es el decimal: 1.500,5 o 1,500.5
      const decimal = v.lastIndexOf(',') > v.lastIndexOf('.') ? ',' : '.';
      const miles = decimal === ',' ? /\./g : /,/g;
      return v.replace(miles, '').replace(decimal, '.');
    }
    if (tieneComa) {
      const comas = v.split(',').length - 1;
      // Varias comas (1,500,000): separadores de miles
      if (comas > 1) return v.replace(/,/g, '');
      return v.replace(',', '.'); // una sola coma: decimal (12,5)
    }
    if (tienePunto && (v.split('.').length - 1) > 1) return v.replace(/\./g, ''); // 1.500.000
    return v;
  }

  // Lee un número de un campo; devuelve null si está vacío o no es válido
  function leer(id) {
    const v = normalizar(document.getElementById(id).value.trim());
    if (v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // Resultado sin separador de miles y con punto decimal (ej.: 10000.5), en ambos idiomas
  function formatear(n, conSigno) {
    return Number(n.toFixed(4)).toLocaleString('en-US', {
      useGrouping: false,
      maximumFractionDigits: 4,
      signDisplay: conSigno ? 'exceptZero' : 'auto',
    });
  }

  // Escribe el resultado (y una etiqueta opcional) en su elemento
  function mostrar(idResultado, texto, etiqueta) {
    const el = document.getElementById(idResultado);
    el.textContent = texto;
    if (etiqueta) {
      const s = document.createElement('small');
      s.textContent = etiqueta;
      el.appendChild(s);
    }
  }

  function textoCero() {
    return document.getElementById('res2').dataset.cero;
  }

  // 1) ¿Cuánto es el A % de B?
  function calc1() {
    const a = leer('a1'), b = leer('b1');
    if (a === null || b === null) return mostrar('res1', '');
    mostrar('res1', formatear(a * b / 100));
  }

  // 2) A es qué porcentaje de B
  function calc2() {
    const a = leer('a2'), b = leer('b2');
    if (a === null || b === null) return mostrar('res2', '');
    if (b === 0) return mostrar('res2', textoCero());
    mostrar('res2', formatear(a / b * 100) + simboloPct);
  }

  // 3) Variación porcentual de A a B
  function calc3() {
    const a = leer('a3'), b = leer('b3');
    const res = document.getElementById('res3');
    if (a === null || b === null) return mostrar('res3', '');
    if (a === 0) return mostrar('res3', textoCero());
    const variacion = (b - a) / Math.abs(a) * 100;
    const etiqueta = variacion > 0 ? res.dataset.sube : variacion < 0 ? res.dataset.baja : res.dataset.igual;
    mostrar('res3', formatear(variacion, true) + simboloPct, etiqueta);
  }

  const bloques = { a1: calc1, b1: calc1, a2: calc2, b2: calc2, a3: calc3, b3: calc3 };
  Object.keys(bloques).forEach(function (id) {
    document.getElementById(id).addEventListener('input', bloques[id]);
  });
})();
