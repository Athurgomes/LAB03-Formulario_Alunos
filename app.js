class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = parseInt(idade);
        this.curso = curso;
        this.notaFinal = parseFloat(notaFinal);
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        const status = this.isAprovado() ? 'Aprovado' : 'Reprovado';
        return `Nome: ${this.nome}, Curso: ${this.curso}, Nota: ${this.notaFinal} (${status})`;
    }
}

let alunos = [];
let idEdicao = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('alunoForm').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarAluno();
    });
    renderizarTabela();
});

function salvarAluno() {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const curso = document.getElementById('curso').value;
    const notaFinal = document.getElementById('notaFinal').value;

    if (idEdicao !== null) {
        const aluno = alunos[idEdicao];
        aluno.nome = nome;
        aluno.idade = parseInt(idade);
        aluno.curso = curso;
        aluno.notaFinal = parseFloat(notaFinal);
        
        alert(`Aluno ${aluno.nome} editado com sucesso!`);
        idEdicao = null;
    } else {
        const novoAluno = new Aluno(nome, idade, curso, notaFinal);
        alunos.push(novoAluno);
        alert(`Aluno ${novoAluno.nome} cadastrado com sucesso!`);
    }

    renderizarTabela();
    document.getElementById('alunoForm').reset();
}

function renderizarTabela() {
    const tbody = document.getElementById('tabelaAlunosBody');
    tbody.innerHTML = '';

    alunos.forEach((aluno, index) => {
        const tr = document.createElement('tr');
        const status = aluno.isAprovado() ? 'Aprovado' : 'Reprovado';

        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal.toFixed(1)}</td>
            <td>${status}</td>
        `;
        
        const tdAcoes = document.createElement('td');
        
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => {
            prepararEdicao(index);
        });
        
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => {
            excluirAluno(index);
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        tr.appendChild(tdAcoes);
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
    const aluno = alunos[index];
    if (confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) {
        alunos.splice(index, 1);
        renderizarTabela();
        alert(`Aluno ${aluno.nome} excluído.`);
    }
}