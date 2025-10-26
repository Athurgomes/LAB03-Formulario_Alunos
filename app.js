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
        
        console.log(`Aluno ${aluno.nome} editado com sucesso!`); // Log de console mantido
        idEdicao = null;
    } else {
        const novoAluno = new Aluno(nome, idade, curso, notaFinal);
        alunos.push(novoAluno);
        console.log(`Aluno ${novoAluno.nome} cadastrado com sucesso!`); // Log de console mantido
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
        console.log(`Aluno ${aluno.nome} excluído.`); // Log de console mantido
    }
}

// --- FUNÇÕES DE RELATÓRIO MODIFICADAS ---

// Função auxiliar para exibir o relatório na tela
function exibirRelatorio(titulo, conteudo) {
    const outputEl = document.getElementById('resultadosRelatorios');
    if (!conteudo) {
        conteudo = "Nenhum aluno cadastrado.";
    }
    outputEl.innerText = `${titulo}\n\n${conteudo}`;
}

function gerarRelatorioAprovados() {
    const titulo = "--- Relatório: Alunos Aprovados ---";
    const aprovados = alunos.filter(aluno => aluno.isAprovado());
    
    if (aprovados.length === 0) {
        exibirRelatorio(titulo, "Nenhum aluno aprovado.");
        return;
    }
    
    const conteudo = aprovados
        .map(aluno => aluno.toString())
        .join("\n"); // Junta todos os alunos com quebra de linha
    
    exibirRelatorio(titulo, conteudo);
}

function gerarRelatorioMediaNotas() {
    const titulo = "--- Relatório: Média das Notas Finais ---";
    if (alunos.length === 0) {
        exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
        return;
    }
    const totalNotas = alunos.reduce((soma, aluno) => soma + aluno.notaFinal, 0);
    const media = totalNotas / alunos.length;
    const conteudo = `A média das notas finais é: ${media.toFixed(2)}`;
    
    exibirRelatorio(titulo, conteudo);
}

function gerarRelatorioMediaIdades() {
    const titulo = "--- Relatório: Média das Idades ---";
    if (alunos.length === 0) {
        exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
        return;
    }
    const totalIdades = alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
    const media = totalIdades / alunos.length;
    const conteudo = `A média de idade dos alunos é: ${media.toFixed(1)} anos`;

    exibirRelatorio(titulo, conteudo);
}

function gerarRelatorioNomesAlfabeticos() {
    const titulo = "--- Relatório: Nomes em Ordem Alfabética ---";
    if (alunos.length === 0) {
        exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
        return;
    }
    const nomes = alunos
        .map(aluno => aluno.nome)
        .sort((a, b) => a.localeCompare(b));
    
    const conteudo = nomes.join("\n");
    exibirRelatorio(titulo, conteudo);
}

function gerarRelatorioAlunosPorCurso() {
    const titulo = "--- Relatório: Quantidade de Alunos por Curso ---";
    if (alunos.length === 0) {
        exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
        return;
    }
    const contagemPorCurso = alunos.reduce((contagem, aluno) => {
        const curso = aluno.curso;
        contagem[curso] = (contagem[curso] || 0) + 1;
        return contagem;
    }, {});

    // Formata o objeto para uma string legível
    let conteudo = "";
    for (const curso in contagemPorCurso) {
        conteudo += `${curso}: ${contagemPorCurso[curso]} aluno(s)\n`;
    }

    exibirRelatorio(titulo, conteudo.trim());
}