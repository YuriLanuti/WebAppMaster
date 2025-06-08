
const urlBase = 'http://localhost:4000/produtos';

const formulario = document.getElementById("formCadProdutos");
let listaDeProdutos = [];
let listaDeCategoria = [];

if (localStorage.getItem("categoria")){
    //recuperando do armazenamento local a lista de clientes
    listaDeCategoria = JSON.parse(localStorage.getItem("categoria"));
}

if (localStorage.getItem("produtos")){
    listaDeProdutos = JSON.parse(localStorage.getItem("produtos"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nomeProduto = document.getElementById("nomeProduto").value;
        const preco = document.getElementById("preco").value;
        const produtos = {nomeProduto,preco};
        evento.preventDefault();
        cadastrarProduto(produtos)
        formulario.reset();
        mostrarTabelaProdutos();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

document.addEventListener("DOMContentLoaded", function() {
    const categoria = listaDeCategoria;
    console.log(categoria,"categoria")
    console.log(listaDeCategoria)
    const select = document.getElementById("categoria");
    select.innerHTML = `<option selected disabled value="">Escolha uma categoria</option>`;
    categoria.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.nomeCategoria;
        select.appendChild(option);
    });
});

function mostrarTabelaProdutos(){
    
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeProdutos.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há produtos cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Preco</th>
                <th>Categoria</th>
                
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeProdutos.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeProdutos[i].id;
            linha.innerHTML=`
                <td>${listaDeProdutos[i].nomeProduto}</td>
                <td>${listaDeProdutos[i].preco}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirProduto('${listaDeProdutos[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirProduto(id){
    if(confirm("Deseja realmente excluir o Produto " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Produto excluído com sucesso!");
            listaDeProdutos = listaDeProdutos.filter((produtos) => { 
                return produtos.id !== id;
            });
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}

function obterDadosProduto(){
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((produtos)=>{
        listaDeProdutos=produtos;
        mostrarTabelaProdutos();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar produtos do servidor!");
    });
}


function cadastrarProduto(produto){  //Enviar dados para o servidor

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(produto)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`Produto incluído com sucesso! ID:${dados.id}`);
        listaDeProdutos.push(produto);
        mostrarTabelaProdutos();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Produto:" + erro);
    });

}



obterDadosProduto();