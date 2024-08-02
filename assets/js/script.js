$(function () {
  $("#btn").click(function () {
    //boton de busqueda
    let heroId = $("#form").val().trim(); //captura de informacion

    // Validar que la entrada sea un número
    if (!/^\d+$/.test(heroId)) {
      alert("Por favor, ingresa un número válido");
      return;
      // Validar que el número sea entre 0 y 731
    } else if (heroId < 0 || heroId > 731) {
      alert("Por favor, ingresa un número entre 0 y 731");
      return;
    }

    // Consultar la API de SuperHero
    $.ajax({
      url: `https://www.superheroapi.com/api.php/39061931e847500796f4d24baba2ee82/${heroId}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        renderHero(data); //renderizar informacion
      },
      error: function () {
        //alerta de error
        alert("Error al cargar la información del superhéroe.");
      },
    });
  });

  $("#hero-section").show(); //efecto de aparicion de la imagen "SuperHero"
  anime({
    targets: "#imagen-hero",
    opacity: [0, 1],
    scale: [0, 1],
    duration: 1000,
    easing: "easeOutExpo",
  });

  function renderHero(hero) {
    //funcion para mostrar informacion de superheroe, uso de cards de bootstrap y  mostrar grafico de canvasjs
    let heroHtml = `
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="${
                              hero.image.url
                            }" class="card-img" alt="${hero.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <p id="title" class="fw-bold fs-3">SuperHero Encontrado</p>
                                <h5 class="card-title">${hero.name}</h5>
                                <p class="card-text"><strong>Conexiones:</strong> ${
                                  hero.connections["group-affiliation"]
                                }</p>
                                <p class="card-text"><strong>Publicado por:</strong> ${
                                  hero.biography.publisher
                                }</p>
                                <p class="card-text"><strong>Ocupación:</strong> ${
                                  hero.work.occupation
                                }</p>
                                <p class="card-text"><strong>Primera Aparición:</strong> ${
                                  hero.biography["first-appearance"]
                                }</p>
                                <p class="card-text"><strong>Altura:</strong> ${hero.appearance.height.join(
                                  " - "
                                )}</p>
                                <p class="card-text"><strong>Peso:</strong> ${hero.appearance.weight.join(
                                  " - "
                                )}</p>
                                <p class="card-text"><strong>Alianzas:</strong> ${hero.biography.aliases.join(
                                  ", "
                                )}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          <div class="col-md-6 mt-2" id="chartContainer" style="height: 370px; width: 50%;"></div>
        `;
    $("#Hero-Info").html(heroHtml);
    renderHeroChart(hero);
  }

  function renderHeroChart(hero) {
    // se obtiene las estadísticas de poder del superheroe con un arreglo de objetos
    let powerStats = [
      { label: "Inteligencia", value: parseInt(hero.powerstats.intelligence) },
      { label: "Fuerza", value: parseInt(hero.powerstats.strength) },
      { label: "Velocidad", value: parseInt(hero.powerstats.speed) },
      { label: "Durabilidad", value: parseInt(hero.powerstats.durability) },
      { label: "Poder", value: parseInt(hero.powerstats.power) },
      { label: "Combate", value: parseInt(hero.powerstats.combat) },
    ];

    // Se ordena las estadísticas por valor de forma descendente
    powerStats.sort((a, b) => b.value - a.value);

    // Crear puntos de datos para el gráfico usando un ciclo for
    let dataPoints = [];
    for (let i = 0; i < powerStats.length; i++) {
      dataPoints.push({
        y: powerStats[i].value,
        label: powerStats[i].label,
      });
    }

    // Configurar y renderizar el gráfico
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: `Estadísticas de poder para ${hero.name}`,
        fontFamily: "Bangers",
      },
      data: [
        {
          type: "pie", //tipo de grafico
          startAngle: 240, //angulo inicial
          yValueFormatString: "##0",
          indexLabel: "{label} {y}",
          dataPoints: dataPoints, // usar los puntos de datos creados
        },
      ],
    });
    chart.render();
  }
});
