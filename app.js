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

    document.getElementById('btnAprovados').addEventListener('click', gerarRelatorioAprovados);
    document.getElementById('btnMediaNotas').addEventListener('click', gerarRelatorioMediaNotas);
    document.getElementById('btnMediaIdades').addEventListener('click', gerarRelatorioMediaIdades);
    document.getElementById('btnNomesAlfabeticos').addEventListener('click', gerarRelatorioNomesAlfabeticos);
    document.getElementById('btnQtdPorCurso').addEventListener('click', gerarRelatorioAlunosPorCurso);

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
        
        console.log(`Aluno ${aluno.nome} editado com sucesso!`);
        idEdicao = null;
    } else {
        const novoAluno = new Aluno(nome, idade, curso, notaFinal);
        alunos.push(novoAluno);
        console.log(`Aluno ${novoAluno.nome} cadastrado com sucesso!`);
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
        console.log(`Aluno ${aluno.nome} excluído.`);
    }
}

function gerarRelatorioAprovados() {
    console.clear();
    console.log("--- Relatório: Alunos Aprovados ---");
    const aprovados = alunos.filter(aluno => aluno.isAprovado());
    if (aprovados.length === 0) {
        console.log("Nenhum aluno aprovado.");
        return;
    }
    aprovados.forEach(aluno => console.log(aluno.toString()));
}

function gerarRelatorioMediaNotas() {
    console.clear();
    console.log("--- Relatório: Média das Notas Finais ---");
    if (alunos.length === 0) {
        console.log("Nenhum aluno cadastrado.");
        return;
    }
    const totalNotas = alunos.reduce((soma, aluno) => soma + aluno.notaFinal, 0);
    const media = totalNotas / alunos.length;
    console.log(`A média das notas finais é: ${media.toFixed(2)}`);
}

function gerarRelatorioMediaIdades() {
    console.clear();
    console.log("--- Relatório: Média das Idades ---");
    if (alunos.length === 0) {
        console.log("Nenhum aluno cadastrado.");
        return;
    }
    const totalIdades = alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
    const media = totalIdades / alunos.length;
    console.log(`A média de idade dos alunos é: ${media.toFixed(1)} anos`);
}

function gerarRelatorioNomesAlfabeticos() {
    console.clear();
    console.log("--- Relatório: Nomes em Ordem Alfabética ---");
    if (alunos.length === 0) {
        console.log("Nenhum aluno cadastrado.");
        return;
    }
    const nomes = alunos
        .map(aluno => aluno.nome)
        .sort((a, b) => a.localeCompare(b));
    
    nomes.forEach(nome => console.log(nome));
}

function gerarRelatorioAlunosPorCurso() {
    console.clear();
    console.log("--- Relatório: Quantidade de Alunos por Curso ---");
    if (alunos.length === 0) {
        console.log("Nenhum aluno cadastrado.");
        return;
    }
    const contagemPorCurso = alunos.reduce((contagem, aluno) => {
        const curso = aluno.curso;
        contagem[curso] = (contagem[curso] || 0) + 1;
        return contagem;
    }, {});

    console.log(contagemPorCurso);
}