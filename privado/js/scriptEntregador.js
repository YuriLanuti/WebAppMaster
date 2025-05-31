const urlBase = 'http://localhost:4000/entregadores';

const formulario = document.getElementById("formCadEntregador");
let listaDeEntregadores = [];

if (localStorage.getItem("entregadores")) {
    listaDeEntregadores = JSON.parse(localStorage.getItem("entregadores"));
}

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento) {
    if (formulario.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const veiculo = document.getElementById("veiculo").value;
        const placa = document.getElementById("placa").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const entregador = { nome, telefone, veiculo, placa, cidade, uf, cep };
        cadastrarEntregador(entregador);
        formulario.reset();
        mostrarTabelaEntregadores();
    } else {
        formulario.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaEntregadores() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";
    if (listaDeEntregadores.length === 0) {
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há entregadores cadastrados</p>";
    } else {
        const tabela = document.createElement('table');
        tabela.className = "table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML = `
            <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i = 0; i < listaDeEntregadores.length; i++) {
            const linha = document.createElement('tr');
            linha.id = listaDeEntregadores[i].id;
            linha.innerHTML = `
                <td>${listaDeEntregadores[i].nome}</td>
                <td>${listaDeEntregadores[i].telefone}</td>
                <td>${listaDeEntregadores[i].veiculo}</td>
                <td>${listaDeEntregadores[i].placa}</td>
                <td>${listaDeEntregadores[i].cidade}</td>
                <td>${listaDeEntregadores[i].uf}</td>
                <td>${listaDeEntregadores[i].cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirEntregador('${listaDeEntregadores[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirEntregador(id) {
    if (confirm("Deseja realmente excluir o entregador " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        }).then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        }).then((dados) => {
            alert("Entregador excluído com sucesso!");
            listaDeEntregadores = listaDeEntregadores.filter((entregador) => {
                return entregador.id !== id;
            });
            document.getElementById(id)?.remove();
        }).catch((erro) => {
            alert("Não foi possível excluir o entregador: " + erro);
        });
    }
}

function obterDadosEntregadores() {
    fetch(urlBase, {
        method: "GET"
    })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((entregadores) => {
            listaDeEntregadores = entregadores;
            mostrarTabelaEntregadores();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar entregadores do servidor!");
        });
}

function cadastrarEntregador(entregador) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entregador)
    })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((dados) => {
            alert(`Entregador incluído com sucesso! ID:${dados.id}`);
            listaDeEntregadores.push(entregador);
            mostrarTabelaEntregadores();
        })
        .catch((erro) => {
            alert("Erro ao cadastrar o entregador: " + erro);
        });
}

obterDadosEntregadores();
