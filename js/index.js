const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const meses = Array.from({ length: 12 }, (_, i) => formatMonth(2023, i));

function formatMonth(year, mes) {
  return `${String(mes + 1).padStart(2, "0")}/${year}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const mesAno = document.getElementById("mesAno");
  meses.forEach(mes => {
    const opcao = document.createElement("option");
    opcao.value = mes;
    opcao.textContent = mes;
    mesAno.appendChild(opcao);
  });

  let mesDataAux = [];

  const data2023 = {};

  estados.forEach(estado => {
    data2023[estado] = meses.map(mes => {
      const casos = Math.floor(Math.random() * 2000) + 500;
      const vacinacao = Math.floor(Math.random() * 5000) + 1000;
      const mortes = Math.floor(Math.random() * 200) + 50;

      return {
        mes,
        vacinacao,
        casos,
        mortes,
        faixaEtaria: {
          casos: {
            "0-18": (Math.random() * 0.2 + 0.1) * casos,
            "18-40": (Math.random() * 0.2 + 0.2) * casos,
            "40-65": (Math.random() * 0.2 + 0.2) * casos,
            "65+": (Math.random() * 0.2 + 0.2) * casos,
          },
          vacinacao: {
            "0-18": (Math.random() * 0.2 + 0.1) * vacinacao,
            "18-40": (Math.random() * 0.2 + 0.2) * vacinacao,
            "40-65": (Math.random() * 0.2 + 0.2) * vacinacao,
            "65+": (Math.random() * 0.2 + 0.2) * vacinacao,
          },
          mortes: {
            "0-18": (Math.random() * 0.2 + 0.1) * mortes,
            "18-40": (Math.random() * 0.2 + 0.2) * mortes,
            "40-65": (Math.random() * 0.2 + 0.2) * mortes,
            "65+": (Math.random() * 0.2 + 0.2) * mortes,
          },
        },
      };
    });
  });

  let previousMonthData = null;

  function carregaTreeMap() {
    const selectedMonth = document.getElementById("mesAno").value;
    if (!selectedMonth) return;

    const filteredData = estados.map(estado => {
      const monthlyData = data2023[estado].find(dadoEstado => dadoEstado.mes === selectedMonth);
      return {
        estado,
        vacinacao: monthlyData ? monthlyData.vacinacao : 0,
        casos: monthlyData ? monthlyData.casos : 0,
        mortes: monthlyData ? monthlyData.mortes : 0,
        faixaEtaria: monthlyData ? monthlyData.faixaEtaria : {
          casos: { "0-18": 0, "18-40": 0, "40-65": 0, "65+": 0 },
          vacinacao: { "0-18": 0, "18-40": 0, "40-65": 0, "65+": 0 },
          mortes: { "0-18": 0, "18-40": 0, "40-65": 0, "65+": 0 },
        },
      };
    });

    if (selectedMonth !== meses[0]) {
      const mesSelecionado = meses[meses.indexOf(selectedMonth) - 1];
      mesDataAux = estados.map(estado => {
        const dadosMensais = data2023[estado].find(dadoEstado => dadoEstado.mes === mesSelecionado);
        return {
          estado,
          casos: dadosMensais ? dadosMensais.casos : 0,
        };
      });
    }

    const periodoAnteriorData = filteredData.map(dadoEstado => {
      const dadosPrevistos = mesDataAux.find(pd => pd.estado === dadoEstado.estado);
      const qtdCasosAnterior = dadosPrevistos ? dadosPrevistos.casos : 0;
      const diferencaPorcentagem = qtdCasosAnterior === 0 ? (dadoEstado.casos > 0 ? 100 : 0) : ((dadoEstado.casos - qtdCasosAnterior) / qtdCasosAnterior) * 100;
      return {
        ...dadoEstado,
        diferencaPorcentagem: diferencaPorcentagem.toFixed(2),
      };
    });

    periodoAnteriorData.sort((a, b) => a.casos - b.casos);

    criarTreeMap(periodoAnteriorData);
  }

  function criarTreeMap(data) {
    const relatorio = document.getElementById("relatorio");
    relatorio.innerHTML = "";
    const totalCases = data.reduce((sum, dadoEstado) => sum + dadoEstado.casos, 0);
    const maxCases = data[data.length - 1].casos;
    const width = relatorio.clientWidth;
    const height = relatorio.clientHeight;

    let x = 0;
    let y = 0;
    let ga = 0;

    data.forEach(dadoEstado => {
      const casos = dadoEstado.casos;
      const area = (casos / totalCases) * (width * height);
      const rectWidth = Math.sqrt(area * (width / height));
      const rectHeight = area / rectWidth;

      if (x + rectWidth > width) {
        x = 0;
        y += ga;
        ga = 0;
      }

      const colorRatio = casos / maxCases;
      const red = Math.floor(255 * colorRatio);
      const green = Math.floor(255 * (1 - colorRatio));
      const backgroundColor = `rgb(${red}, ${green}, 0)`;

      const node = document.createElement("div");
      node.className = "node";
      node.style.width = `${rectWidth}px`;
      node.style.height = `${rectHeight}px`;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.backgroundColor = backgroundColor;
      node.innerHTML = `
        <div class="estado-name">${dadoEstado.estado}</div>
        <div class="casos">${dadoEstado.casos} casos</div>
        <div class="percentage">${dadoEstado.diferencaPorcentagem >= 0 ? "+" : ""}${dadoEstado.diferencaPorcentagem}%</div>
      `;

      node.addEventListener("click", () => abrirModal(dadoEstado));

      relatorio.appendChild(node);

      x += rectWidth;
      if (rectHeight > ga) {
        ga = rectHeight;
      }
    });
  }

  let graficoCasos = null;
  let graficoVacinacao = null;
  let graficoMortes = null;

  function abrirModal(dadoEstado) {
    const casosGraficoAux = document.getElementById("casosGrafico").getContext("2d");
    const vacinacaoGraficoAux = document.getElementById("vacinacaoGrafico").getContext("2d");
    const mortesGraficoAux = document.getElementById("mortesGrafico").getContext("2d");
    const campoQuantidadeCasos = document.getElementById("qtdCasos");
    const campoQuantidadeVacinacao = document.getElementById("qtdVacinacao");
    const campoQuantidadeMortes = document.getElementById("qtdMortes");
    const modalTitle = document.getElementById("infoModalLabel");

    modalTitle.innerHTML = `Informações do Estado - ${dadoEstado.estado}`;

    campoQuantidadeCasos.innerHTML = dadoEstado.casos;
    campoQuantidadeVacinacao.innerHTML = dadoEstado.vacinacao;
    campoQuantidadeMortes.innerHTML = dadoEstado.mortes;

    if (graficoCasos) graficoCasos.destroy();
    if (graficoVacinacao) graficoVacinacao.destroy();
    if (graficoMortes) graficoMortes.destroy();

    graficoCasos = new Chart(casosGraficoAux, {
      type: "pie",
      data: {
        datasets: [{
          label: "Casos por Idade",
          data: [
            dadoEstado.faixaEtaria.casos["0-18"],
            dadoEstado.faixaEtaria.casos["18-40"],
            dadoEstado.faixaEtaria.casos["40-65"],
            dadoEstado.faixaEtaria.casos["65+"],
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          borderColor: ["#fff", "#fff", "#fff", "#fff"],
          borderWidth: 1,
        }],
        labels: ["0-18", "18-40", "40-65", "65+"],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value.toFixed(2)} (${((value / dadoEstado.casos) * 100).toFixed(2)}%)`;
              },
            },
          },
        },
      },
    });

    graficoVacinacao = new Chart(vacinacaoGraficoAux, {
      type: "pie",
      data: {
        datasets: [{
          label: "Vacinas por Idade",
          data: [
            dadoEstado.faixaEtaria.vacinacao["0-18"],
            dadoEstado.faixaEtaria.vacinacao["18-40"],
            dadoEstado.faixaEtaria.vacinacao["40-65"],
            dadoEstado.faixaEtaria.vacinacao["65+"],
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          borderColor: ["#fff", "#fff", "#fff", "#fff"],
          borderWidth: 1,
        }],
        labels: ["0-18", "18-40", "40-65", "65+"],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value.toFixed(2)} (${((value / dadoEstado.vacinacao) * 100).toFixed(2)}%)`;
              },
            },
          },
        },
      },
    });

    graficoMortes = new Chart(mortesGraficoAux, {
      type: "pie",
      data: {
        datasets: [{
          label: "Mortes por Idade",
          data: [
            dadoEstado.faixaEtaria.mortes["0-18"],
            dadoEstado.faixaEtaria.mortes["18-40"],
            dadoEstado.faixaEtaria.mortes["40-65"],
            dadoEstado.faixaEtaria.mortes["65+"],
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          borderColor: ["#fff", "#fff", "#fff", "#fff"],
          borderWidth: 1,
        }],
        labels: ["0-18", "18-40", "40-65", "65+"],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value.toFixed(2)} (${((value / dadoEstado.mortes) * 100).toFixed(2)}%)`;
              },
            },
          },
        },
      },
    });

    $("#infoModal").modal("show");
  }

  document.getElementById("mesAno").addEventListener("change", carregaTreeMap);
});
