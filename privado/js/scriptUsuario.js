const urlBase = 'http://localhost:4000/usuarios';

const formulario = document.getElementById("formLoginUsuario");
let listaDeUsuarios = [];

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento) {
    if (formulario.checkValidity()) {
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const usuario = { email, senha };
        cadastrarUsuario(usuario);
        formulario.reset();
        mostrarTabelaUsuarios();
    } else {
        formulario.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaUsuarios() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";
    if (listaDeUsuarios.length === 0) {
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há usuários cadastrados</p>";
    } else {
        const tabela = document.createElement('table');
        tabela.className = "table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML = `
            <tr>
                <th>Email</th>
                <th>Senha</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i = 0; i < listaDeUsuarios.length; i++) {
            const linha = document.createElement('tr');
            linha.id = listaDeUsuarios[i].id;
            linha.innerHTML = `
                <td>${listaDeUsuarios[i].email}</td>
                <td>${listaDeUsuarios[i].senha}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirUsuario('${listaDeUsuarios[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirUsuario(id) {
    if (confirm("Deseja realmente excluir o usuário " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        }).then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        }).then((dados) => {
            alert("Usuário excluído com sucesso!");
            listaDeUsuarios = listaDeUsuarios.filter((usuario) => {
                return usuario.id !== id;
            });
            document.getElementById(id)?.remove();
        }).catch((erro) => {
            alert("Não foi possível excluir o usuário: " + erro);
        });
    }
}

function obterDadosUsuarios() {
    fetch(urlBase, {
        method: "GET"
    })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((usuarios) => {
            listaDeUsuarios = usuarios;
            mostrarTabelaUsuarios();
        })
        .catch((erro) => {
            alert("Erro ao tentar recuperar usuários do servidor!");
        });
}

function cadastrarUsuario(usuario) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario)
    })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        })
        .then((dados) => {
            alert(`Usuário incluído com sucesso! ID:${dados.id}`);
            listaDeUsuarios.push(usuario);
            mostrarTabelaUsuarios();
        })
        .catch((erro) => {
            alert("Erro ao cadastrar o usuário: " + erro);
        });
}

obterDadosUsuarios();
