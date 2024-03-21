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
  clearValidationAlerts(); 

  var equationInput = document.getElementById('equationInput').value.trim();

  // Validar que se haya ingresado una ecuación
  if (!equationInput) {
    displayValidationAlert('Por favor, ingrese una ecuación.');
    return;
  }

  // Extraer la parte izquierda y derecha de la ecuación
  var equationParts = equationInput.split('=');
  if (equationParts.length !== 2) {
    alert('La ecuación debe tener la forma "dy/dx = f(x)".');
    return;
  }

  var leftSide = equationParts[0].trim();
  var rightSide = equationParts[1].trim();

  // Convertir la ecuación a funciones evaluables
  var funcLeft, funcRight;
  try {
    funcLeft = math.parse(leftSide).compile();
    funcRight = math.parse(rightSide).compile();
  } catch (error) {
    alert('Error al analizar la ecuación: ' + error.message);
    return;
  }

  // Definir el rango de x
  var xStart = -10;
  var xEnd = 10;
  var xStep = 0.1;
  var xValues = math.range(xStart, xEnd, xStep).toArray();

  // Evaluar la función derecha (dy/dx) para obtener los valores de y'
  var yPrimeValues = xValues.map(function(x) {
    return funcRight.evaluate({ x: x });
  });

  // Calcular la solución usando el método de Euler
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

  // Si existe una instancia anterior del gráfico, destruirla
  if (solutionChart) {
    solutionChart.destroy();
  }

  // Mostrar la solución en el gráfico
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

  // Mostrar más datos importantes
  var equationInfo = `Ecuación: ${equationInput}\n`;
  equationInfo += `Rango de x: [${xStart}, ${xEnd}]\n`;
  equationInfo += `Paso: ${xStep}\n`;
  equationInfo += `Valor inicial de y: ${yInitial}\n`;
  equationInfo += `Resultado: y(x) = ${yValues.map(value => value.toFixed(4)).join(', ')}`; // Redondear los valores de y a 4 decimales

  // Mostrar la solución como texto
  document.getElementById('result').innerText = equationInfo;
}
function displayValidationAlert(message) {
  var alertDiv = document.createElement('div');
  alertDiv.classList.add('validation-alert');
  alertDiv.innerText = message;
  document.getElementById('homePage').prepend(alertDiv);
}

function clearValidationAlerts() {
  var alerts = document.querySelectorAll('.validation-alert');
  alerts.forEach(function(alert) {
    alert.remove();
  });
}