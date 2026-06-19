const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const addBtn =
    document.getElementById("addBtn");

const transactionList =
    document.getElementById("transactionList");

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

let transactions = [];

function addTransaction() {

    const description =
        descriptionInput.value.trim();

    const amount =
        Number(amountInput.value);

    if (
        description === "" ||
        amountInput.value === ""
    ) {
        alert("Fill all fields");
        return;
    }

    transactions.push({
        description,
        amount
    });

    descriptionInput.value = "";
    amountInput.value = "";

    renderTransactions();

    updateSummary();

    saveTransactions();
}
addBtn.addEventListener(
    "click",
    addTransaction
);

function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {

        const li = document.createElement("li");

        li.classList.add("transaction");

        if (transaction.amount > 0) {
            li.classList.add("income-item");
        } else {
            li.classList.add("expense-item");
        }

        li.innerHTML = `
            <span>
                ${transaction.description}
                (${transaction.amount > 0 ? "+" : ""}₹${transaction.amount})
            </span>

            <button
                class="delete-btn"
                onclick="deleteTransaction(${index})"
            >
                Delete
            </button>
        `;

        transactionList.appendChild(li);

    });

}

function updateSummary() {

    const balance = transactions.reduce(
        (total, transaction) =>
            total + transaction.amount,
        0
    );

    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

    balanceElement.textContent =
        `₹${balance}`;

    incomeElement.textContent =
        `Income: ₹${income}`;

    expenseElement.textContent =
        `Expense: ₹${Math.abs(expense)}`;
}

function deleteTransaction(index) {

    transactions.splice(index, 1);

    renderTransactions();

    updateSummary();

    saveTransactions();
}

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

function loadTransactions() {

    const storedData =
        localStorage.getItem("transactions");

    if (storedData) {

        transactions =
            JSON.parse(storedData);

    }

    renderTransactions();

    updateSummary();
}

transactions.push({
    description,
    amount
});

descriptionInput.value = "";
amountInput.value = "";

renderTransactions();

updateSummary();

saveTransactions();
addBtn.addEventListener(
    "click",
    addTransaction
);

loadTransactions();


