const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');
const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header p span');
const expensesTotal = document.querySelector('aside header h2');

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, '');
    value = Number(value) / 100;
    amount.value = formatCurrency(value);
};

function formatCurrency(value) {
    value = value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return value;
}

form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    };

    expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', `${newExpense.category_name}`);

        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');

        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;

        const expenseCategory = document.createElement('span');
        expenseCategory.textContent = newExpense.category_name;

        expenseInfo.append(expenseName, expenseCategory);

        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>$</small>${newExpense.amount.replace('$', '')}`;

        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', './img/remove.svg');
        removeIcon.setAttribute('alt', 'Remove');

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        expenseList.append(expenseItem);

        updateTotals();

        formClear();
    } catch (error) {
        alert('Could not update the expense list.');
        console.log(error);
    }
}

function updateTotals() {
    try {
        const items = expenseList.children;
        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? 'expenses' : 'expense'
        }`;

        let total = 0;
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount');

            let value = itemAmount.textContent.replace(/[^\d.]/g, '');
            value = parseFloat(value);

            if (isNaN(value)) {
                alert('Unable to update the total. The value does not appear to be a number.');
            }

            total += value;
        }

        expensesTotal.textContent = formatCurrency(total);

        const dollarSymbol = document.createElement('small');
        dollarSymbol.textContent = '$';

        total = formatCurrency(total).replace('$', '');

        expensesTotal.innerHTML = '';
        expensesTotal.append(dollarSymbol, total);
    } catch (error) {
        console.log(error);
        alert('Unable to update the total.');
    }
}

expenseList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-icon')) {
        const item = event.target.closest('.expense');
        item.remove();
    }

    updateTotals();
});

function formClear() {
    expense.value = '';
    category.value = '';
    amount.value = '';

    expense.focus();
}
