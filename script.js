// Array em memória (os dados serão apagados ao sair ou atualizar a página)
let dividas = [];

const form = document.getElementById('debt-form');
const debtTableBody = document.getElementById('debt-tbody');
const totalSummary = document.getElementById('total-summary');
const btnPdf = document.getElementById('btn-pdf');

// Adicionar nova dívida
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('debt-name').value.trim();
    const value = parseFloat(document.getElementById('debt-value').value);
    const totalValueInput = document.getElementById('debt-total-value').value;
    const totalValue = totalValueInput ? parseFloat(totalValueInput) : value;
    const installment = document.getElementById('debt-installment').value.trim() || 'À vista';
    const date = document.getElementById('debt-date').value;

    const novaDivida = {
        id: Date.now(),
        name,
        value,
        totalValue,
        installment,
        date: formatDate(date)
    };

    dividas.push(novaDivida);
    renderTable();
    form.reset();
});

// Converter data de AAAA-MM-DD para DD/MM/AAAA
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Formatar valores para Reais (R$)
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Atualizar tabela na tela
function renderTable() {
    debtTableBody.innerHTML = '';
    let totalGeral = 0;

    dividas.forEach((divida) => {
        totalGeral += divida.value;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(divida.name)}</td>
            <td>${formatCurrency(divida.value)}</td>
            <td>${formatCurrency(divida.totalValue)}</td>
            <td>${escapeHtml(divida.installment)}</td>
            <td>${divida.date}</td>
            <td class="no-print">
                <button class="btn btn-danger" onclick="removerDivida(${divida.id})">Excluir</button>
            </td>
        `;
        debtTableBody.appendChild(tr);
    });

    totalSummary.innerHTML = `<strong>Total Geral das Parcelas: ${formatCurrency(totalGeral)}</strong>`;
}

// Remover dívida individual
function removerDivida(id) {
    dividas = dividas.filter(divida => divida.id !== id);
    renderTable();
}

// Gerar PDF / Acionar Impressão
btnPdf.addEventListener('click', function() {
    if (dividas.length === 0) {
        alert('Adicione pelo menos uma conta antes de gerar o PDF.');
        return;
    }
    window.print();
});

// Segurança básica contra XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}