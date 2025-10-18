let alunos = [];
let idEdicao = null;

function salvarAluno() {
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const curso = document.getElementById('curso').value;
    const notaFinal = parseFloat(document.getElementById('notaFinal').value);

    if (idEdicao !== null) {
        const aluno = alunos[idEdicao];
        aluno.nome = nome;
        aluno.idade = idade;
        aluno.curso = curso;
        aluno.notaFinal = notaFinal;
        idEdicao = null;
    } else {
        const novoAluno = {
            nome: nome,
            idade: idade,
            curso: curso,
            notaFinal: notaFinal
        };
        alunos.push(novoAluno);
    }

    renderizarTabela();
    document.getElementById('alunoForm').reset();
}

function renderizarTabela() {
    const tbody = document.getElementById('tabelaAlunosBody');
    tbody.innerHTML = '';

    alunos.forEach((aluno, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal}</td>
            <td>
                <button onclick="prepararEdicao(${index})">Editar</button>
                <button onclick="excluirAluno(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function prepararEdicao(index) {
    const aluno = alunos[index];
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade;
    document.getElementById('curso').value = aluno.curso;
    document.getElementById('notaFinal').value = aluno.notaFinal;
    idEdicao = index;
}

function excluirAluno(index) {
    if (confirm(`Tem certeza que deseja excluir ${alunos[index].nome}?`)) {
        alunos.splice(index, 1);
        renderizarTabela();
    }
}

renderizarTabela();