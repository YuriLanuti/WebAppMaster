const urlBase = 'http://localhost:4000/fornecedores';

const formulario = document.getElementById("formCadFornecedor");
let listaDeFornecedores = [];

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cnpj = document.getElementById("cnpj").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const fornecedor = {cnpj, nome, telefone, cidade, uf, cep};
        cadastrarFornecedor(fornecedor); // enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaFornecedores();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); // cancelamento do evento
    evento.stopPropagation(); // impedindo que outros observem esse evento
}

function mostrarTabelaFornecedores(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = ""; // apagando o conteúdo da div
    if (listaDeFornecedores.length === 0){
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há fornecedores cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className = "table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML = `
            <tr>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i = 0; i < listaDeFornecedores.length; i++){
            const linha = document.createElement('tr');
            linha.id = listaDeFornecedores[i].id;
            linha.innerHTML = `
                <td>${listaDeFornecedores[i].cnpj}</td>
                <td>${listaDeFornecedores[i].nome}</td>
                <td>${listaDeFornecedores[i].telefone}</td>
                <td>${listaDeFornecedores[i].cidade}</td>
                <td>${listaDeFornecedores[i].uf}</td>
                <td>${listaDeFornecedores[i].cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirFornecedor('${listaDeFornecedores[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirFornecedor(id){
    if(confirm("Deseja realmente excluir o fornecedor " + id + "?")){
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados) => {
            alert("Fornecedor excluído com sucesso!");
            listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => {
                return fornecedor.id !== id;
            });
            document.getElementById(id)?.remove(); // excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o fornecedor: " + erro);
        });
    }
}

function obterDadosFornecedores(){
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((fornecedores) => {
        listaDeFornecedores = fornecedores;
        mostrarTabelaFornecedores();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar fornecedores do servidor!");
    });
}

function cadastrarFornecedor(fornecedor){
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedor)
    })
    .then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) => {
        alert(`Fornecedor incluído com sucesso! ID:${dados.id}`);
        listaDeFornecedores.push(fornecedor);
        mostrarTabelaFornecedores();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar o fornecedor: " + erro);
    });
}

obterDadosFornecedores();
