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

class AlunoController {
    
    constructor() {
        this.alunos = [];
        this.idEdicao = null;

        this.form = document.getElementById('alunoForm');
        this.nomeEl = document.getElementById('nome');
        this.idadeEl = document.getElementById('idade');
        this.cursoEl = document.getElementById('curso');
        this.notaFinalEl = document.getElementById('notaFinal');
        this.tbody = document.getElementById('tabelaAlunosBody');
        this.outputEl = document.getElementById('resultadosRelatorios');

        this.registrarEventListeners();
        this.renderizarTabela();
    }

    registrarEventListeners() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.salvarAluno();
        });

        document.getElementById('btnAprovados').addEventListener('click', () => this.gerarRelatorioAprovados());
        document.getElementById('btnMediaNotas').addEventListener('click', () => this.gerarRelatorioMediaNotas());
        document.getElementById('btnMediaIdades').addEventListener('click', () => this.gerarRelatorioMediaIdades());
        document.getElementById('btnNomesAlfabeticos').addEventListener('click', () => this.gerarRelatorioNomesAlfabeticos());
        document.getElementById('btnQtdPorCurso').addEventListener('click', () => this.gerarRelatorioAlunosPorCurso());
    }

    salvarAluno() {
        const nome = this.nomeEl.value;
        const idade = this.idadeEl.value;
        const curso = this.cursoEl.value;
        const notaFinal = this.notaFinalEl.value;

        if (this.idEdicao !== null) {
            const aluno = this.alunos[this.idEdicao];
            aluno.nome = nome;
            aluno.idade = parseInt(idade);
            aluno.curso = curso;
            aluno.notaFinal = parseFloat(notaFinal);
            console.log(`Aluno ${aluno.nome} editado com sucesso!`);
            this.idEdicao = null;
        } else {
            const novoAluno = new Aluno(nome, idade, curso, notaFinal);
            this.alunos.push(novoAluno);
            console.log(`Aluno ${novoAluno.nome} cadastrado com sucesso!`); 
        }

        this.renderizarTabela();
        this.form.reset();
    }

    renderizarTabela() {
        this.tbody.innerHTML = '';

        this.alunos.forEach((aluno, index) => {
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
                this.prepararEdicao(index);
            });
            
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.addEventListener('click', () => {
                this.excluirAluno(index);
            });

            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);
            tr.appendChild(tdAcoes);
            this.tbody.appendChild(tr);
        });
    }

    prepararEdicao(index) {
        const aluno = this.alunos[index];
        this.nomeEl.value = aluno.nome;
        this.idadeEl.value = aluno.idade;
        this.cursoEl.value = aluno.curso;
        this.notaFinalEl.value = aluno.notaFinal;
        this.idEdicao = index;
    }

    excluirAluno(index) {
        const aluno = this.alunos[index];
        if (confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) {
            this.alunos.splice(index, 1);
            this.renderizarTabela();
            console.log(`Aluno ${aluno.nome} excluído.`); 
        }
    }

    exibirRelatorio(titulo, conteudo) {
        if (!conteudo) {
            conteudo = "Nenhum aluno cadastrado.";
        }
        this.outputEl.innerText = `${titulo}\n\n${conteudo}`;
    }

    gerarRelatorioAprovados() {
        const titulo = "Relatório: Alunos Aprovados";
        const aprovados = this.alunos.filter(aluno => aluno.isAprovado());
        
        if (aprovados.length === 0) {
            this.exibirRelatorio(titulo, "Nenhum aluno aprovado.");
            return;
        }
        
        const conteudo = aprovados
            .map(aluno => aluno.toString())
            .join("\n"); 
        
        this.exibirRelatorio(titulo, conteudo);
    }

    gerarRelatorioMediaNotas() {
        const titulo = "Relatório: Média das Notas Finais";
        if (this.alunos.length === 0) {
            this.exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
            return;
        }
        const totalNotas = this.alunos.reduce((soma, aluno) => soma + aluno.notaFinal, 0);
        const media = totalNotas / this.alunos.length;
        const conteudo = `A média das notas finais é: ${media.toFixed(2)}`;
        
        this.exibirRelatorio(titulo, conteudo);
    }

    gerarRelatorioMediaIdades() {
        const titulo = "Relatório: Média das Idades";
        if (this.alunos.length === 0) {
            this.exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
            return;
        }
        const totalIdades = this.alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
        const media = totalIdades / this.alunos.length;
        const conteudo = `A média de idade dos alunos é: ${media.toFixed(1)} anos`;

        this.exibirRelatorio(titulo, conteudo);
    }

    gerarRelatorioNomesAlfabeticos() {
        const titulo = "--- Relatório: Nomes em Ordem Alfabética ---";
        if (this.alunos.length === 0) {
            this.exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
            return;
        }
        const nomes = this.alunos
            .map(aluno => aluno.nome)
            .sort((a, b) => a.localeCompare(b));
        
        const conteudo = nomes.join("\n");
        this.exibirRelatorio(titulo, conteudo);
    }

    gerarRelatorioAlunosPorCurso() {
        const titulo = "Relatório: Quantidade de Alunos por Curso";
        if (this.alunos.length === 0) {
            this.exibirRelatorio(titulo, "Nenhum aluno cadastrado.");
            return;
        }
        const contagemPorCurso = this.alunos.reduce((contagem, aluno) => {
            const curso = aluno.curso;
            contagem[curso] = (contagem[curso] || 0) + 1;
            return contagem;
        }, {});

        let conteudo = "";
        for (const curso in contagemPorCurso) {
            conteudo += `${curso}: ${contagemPorCurso[curso]} aluno(s)\n`;
        }

        this.exibirRelatorio(titulo, conteudo.trim());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlunoController();
});