var solutionChart; // Variable global para almacenar la instancia del gráfico

    function showHome() {
      document.getElementById('homePage').style.display = 'block';
      document.getElementById('aboutPage').style.display = 'none';
    }

    function showAbout() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('aboutPage').style.display = 'block';
    }

    function solveEquation() {
      // Limpiar resultados y gráfico anterior
      document.getElementById('result').innerText = '';

      var equationInput = document.getElementById('equationInput').value;

      // Extraemos la parte izquierda y derecha de la ecuación
      var equationParts = equationInput.split('=');
      var leftSide = equationParts[0].trim();
      var rightSide = equationParts[1].trim();

      // Convertimos la ecuación a funciones evaluables
      var funcLeft = math.parse(leftSide).compile();
      var funcRight = math.parse(rightSide).compile();

      // Definimos el rango de x
      var xMin = -10;
      var xMax = 10;
      var xStep = 0.1;
      var xValues = math.range(xMin, xMax, xStep).toArray();

      // Evaluamos la función derecha (dy/dx) para obtener los valores de y'
      var yPrimeValues = xValues.map(function(x) {
        return funcRight.evaluate({ x: x });
      });

      // Calculamos la solución usando el método de Euler
      var yValues = [];
      var yInitial = 0; // Valor inicial de y
      for (var i = 0; i < xValues.length; i++) {
        if (i === 0) {
          yValues.push(yInitial);
        } else {
          var h = xValues[i] - xValues[i - 1]; // Tamaño del paso
          var yNext = yValues[i - 1] + yPrimeValues[i - 1] * h;
          yValues.push(yNext);
        }
      }
// Obtener el contexto del gráfico
var ctx = document.getElementById('solutionChart').getContext('2d');

// Calcular el ancho del lienzo del gráfico
var chartWidth = Math.min(window.innerWidth, 500); // Limitar el ancho máximo a 500px para dispositivos móviles

// Configurar el tamaño del lienzo del gráfico
document.getElementById('solutionChart').style.width = chartWidth + 'px';
document.getElementById('solutionChart').style.height = (chartWidth * 0.75) + 'px'; // Proporción 4:3

// Si existe una instancia anterior del gráfico, destrúyela
if (solutionChart) {
  solutionChart.destroy();
}

// Mostramos la solución en el gráfico
solutionChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: xValues,
    datasets: [{
      label: 'Solución',
      data: yValues,
      borderColor: 'blue',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true, // Permitir que el gráfico sea responsive
    maintainAspectRatio: false, // No mantener el aspecto de la relación de aspecto
    scales: {
      x: {
        title: {
          display: true,
          text: 'x'
        }
      },
      y: {
        title: {
          display: true,
          text: 'y'
        }
      }
    }
  }
});


      // Mostramos la solución como texto
      document.getElementById('result').innerText = 'La solución de la ecuación es: y(x) = ' + yValues.join(', ');
    }