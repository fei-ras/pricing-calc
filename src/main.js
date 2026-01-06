import './style.css'

const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;

const tableBody = document.getElementById('partsTableBody');

/**
 * Creates a new empty row
 */
 const createRow = () => {
    const row = document.createElement('tr');
    row.className = "border-b border-base-200";
    row.innerHTML = `
        <td><input type="text" placeholder="Item/Part Name" class="input input-bordered input-md w-full part-name" /></td>
        <td>
            <div class="join w-full justify-end">
                <span class="join-item btn btn-md no-animation bg-base-200 border-base-300 pointer-events-none">$</span>
                <input type="number" step="0.01" placeholder="0.00" class="join-item input input-bordered input-md w-32 text-right part-cost" />
            </div>
        </td>
        <td class="text-center">
            <button class="btn btn-ghost btn-sm text-error p-2 remove-btn">${trashIcon}</button>
        </td>
    `;
    tableBody.appendChild(row);
};

/**
 * Calculation Logic
 */
window.calculate = () => {
    const partsTotal = Array.from(document.querySelectorAll('.part-cost'))
        .reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);

    const rate = parseFloat(document.getElementById('hourlyRate')?.value) || 0;
    const hours = parseFloat(document.getElementById('hours')?.value) || 0;
    const laborTotal = rate * hours;

    const markupPercent = parseFloat(document.getElementById('markup')?.value) || 0;
    const totalCogs = partsTotal + laborTotal;
    const finalPrice = totalCogs * (1 + (markupPercent / 100));

    document.getElementById('totalLaborDisplay').innerText = laborTotal.toFixed(2);
    document.getElementById('totalCogs').innerText = totalCogs.toFixed(2);
    document.getElementById('finalPrice').innerText = finalPrice.toFixed(2);
};

/**
 * Event Delegation: Handle inputs and Row Auto-generation
 */
tableBody.addEventListener('input', (e) => {
    // 1. Trigger calculation
    window.calculate();

    // 2. Check if we should add a new row
    const rows = tableBody.querySelectorAll('tr');
    const lastRow = rows[rows.length - 1];
    const inputsInLastRow = lastRow.querySelectorAll('input');

    // If user typed in any input of the VERY last row, add a new one
    const hasValue = Array.from(inputsInLastRow).some(input => input.value.trim() !== "");
    if (hasValue && e.target.closest('tr') === lastRow) {
        createRow();
    }
});

/**
 * Handle Deletion
 */
tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-btn');
    if (btn) {
        btn.closest('tr').remove();
        window.calculate();
    }
});

// Watch labor/markup inputs
document.querySelectorAll('#hourlyRate, #hours, #markup').forEach(el => {
    el.addEventListener('input', window.calculate);
});

// Init
window.calculate();
