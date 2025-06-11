
const urlBase = 'http://localhost:4000/categoria';

const formulario = document.getElementById("formCadCategoria");
let listaDeCategoria = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nomeCategoria = document.getElementById("nomeCategoria").value;
        const desc = document.getElementById("desc").value;
        const categoria = {nomeCategoria,desc};
        evento.preventDefault();
        cadastrarCategoria(categoria)
        formulario.reset();
        mostrarTabelaClientes();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaCategoria(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeCategoria.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há categorias cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Descricao</th>
                
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeCategoria.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeCategoria[i].id;
            linha.innerHTML=`
                <td>${listaDeCategoria[i].nomeCategoria}</td>
                <td>${listaDeCategoria[i].desc}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirCategoria('${listaDeCategoria[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirCategoria(id){
    if(confirm("Deseja realmente excluir a Categoria " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Categoria excluído com sucesso!");
            listaDeCategoria = listaDeCategoria.filter((categoria) => { 
                return categoria.id !== id;
            });
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir a categoria: " + erro);
        });
    }
}

function obterDadosCategoria(){
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((categoria)=>{
        listaDeCategoria=categoria;
        mostrarTabelaCategoria();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar categorias do servidor!");
    });
}


function cadastrarCategoria(categoria) {
    // Verificação se o nome da categoria já existe 
    const existe = listaDeCategoria.some(cat =>
        cat.nomeCategoria.trim().toLowerCase() === categoria.nomeCategoria.trim().toLowerCase()
    );

    if (existe) {
        alert("Categoria já cadastrada!");
        return;
    }

    // Se não existe, faz o cadastro
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria)
    })
    .then((resposta) => {
        if (resposta.ok) {
            return resposta.json();
        }
    })
    .then((dados) => {
        alert(`Categoria incluída com sucesso! ID: ${dados.id}`);
        listaDeCategoria.push(dados); 
        mostrarTabelaCategoria();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar a Categoria: " + erro);
    });
}


obterDadosCategoria();