<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COVID-19 Tree Map - Brasil</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href="./css/index.css" rel="stylesheet">

</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-8 text-center">
                <h1>COVID-19 Tree Map - Brasil</h1>
                <select id="mesAno" class="form-control mb-3">
                    <option value="" disabled selected>Selecione o mês e ano</option>
                </select>
                <div id="relatorio" class="mt-4"></div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="infoModalLabel">Informações do Estado</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="grafico-pizza">
                        <h4>Casos (<b id="qtdCasos"></b>)</h4>
                        <canvas id="casosGrafico"></canvas>
                    </div>
                    <div class="grafico-pizza">
                        <h4>Vacinação (<b id="qtdVacinacao"></b>)</h4>
                        <canvas id="vacinacaoGrafico"></canvas>
                    </div>
                    <div class="grafico-pizza">
                        <h4>Mortes (<b id="qtdMortes"></b>)</h4>
                        <canvas id="mortesGrafico"></canvas>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/index.js"></script>
</body>

</html>