// =====================================
// ExpenseWise - AddExpense.js
// PART 1
// =====================================

// ----------------------------
// Data Structure
// ----------------------------

let expenseData = JSON.parse(localStorage.getItem("expenseData")) || {};

const trackingPeriods = [
    "1 Week",
    "2 Weeks",
    "3 Weeks",
    "1 Month"
];

// Create storage for every tracking period
trackingPeriods.forEach(function (period) {

    if (!expenseData[period]) {

        expenseData[period] = {

            budget: 0,

            expenses: []

        };

    }

});

// ----------------------------
// Current Tracking Period
// ----------------------------

let selectedPeriod =
    localStorage.getItem("selectedPeriod") || "";


// ----------------------------
// Restore Selected Period
// ----------------------------

window.onload = function () {

    if (selectedPeriod !== "") {

        document.querySelectorAll('input[name="time-period"]').forEach(function (radio) {

            if (radio.value === selectedPeriod) {

                radio.checked = true;

                radio.nextElementSibling.classList.add("active");

            }

        });

        document.getElementById("selectedPeriod").style.display = "block";

        document.getElementById("selectedPeriod").innerHTML =
            "📅 Current Tracking Period : <b>" +
            selectedPeriod +
            "</b><br>All expenses will be saved under this tracking period.";

        loadTrackingPeriod();

    }

};


// ----------------------------
// Tracking Period Selection
// ----------------------------

document.querySelectorAll('input[name="time-period"]').forEach(function (radio) {

    radio.addEventListener("change", function () {

        selectedPeriod = this.value;

        localStorage.setItem(
            "selectedPeriod",
            selectedPeriod
        );

        document.querySelectorAll(".time-card").forEach(function (card) {

            card.classList.remove("active");

        });

        this.nextElementSibling.classList.add("active");

        document.getElementById("selectedPeriod").style.display = "block";

        document.getElementById("selectedPeriod").innerHTML =
            "📅 Current Tracking Period : <b>" +
            selectedPeriod +
            "</b><br>All expenses will be saved under this tracking period.";

        loadTrackingPeriod();

    });

});


// ----------------------------
// Load Tracking Period
// ----------------------------

function loadTrackingPeriod() {

    let current = expenseData[selectedPeriod];

    document.getElementById("budget").value =
        current.budget === 0 ? "" : current.budget;

    if (current.budget > 0) {

        document.getElementById("budget").disabled = true;

    }

    else {

        document.getElementById("budget").disabled = false;

    }

    updateSummary();

}

// ----------------------------
// Save Budget
// ----------------------------

function saveBudget() {

    if (selectedPeriod === "") {

        alert("Please select a Tracking Period.");

        return false;

    }

    let budget = Number(document.getElementById("budget").value);

    if (budget <= 0) {

        alert("Please enter a valid Budget.");

        return false;

    }

    if (expenseData[selectedPeriod].budget === 0) {

        expenseData[selectedPeriod].budget = budget;

        localStorage.setItem(
            "expenseData",
            JSON.stringify(expenseData)
        );

        document.getElementById("budget").disabled = true;

    }

    return true;

}


// ----------------------------
// Add Expense
// ----------------------------

function addExpense() {

    if (selectedPeriod === "") {

        alert("Please select a Tracking Period.");

        return;

    }

    if (!saveBudget()) {

        return;

    }

    let title =
        document.getElementById("title").value.trim();

    let category =
        document.getElementById("category").value;

    let amount =
        Number(document.getElementById("amount").value);

    let date =
        document.getElementById("date").value;

    let description =
        document.getElementById("description").value.trim();


    if (title === "") {

        alert("Enter Expense Title.");

        return;

    }

    if (category === "") {

        alert("Select Expense Category.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid Amount.");

        return;

    }

    if (date === "") {

        alert("Select Expense Date.");

        return;

    }


    let expense = {

        title: title,

        category: category,

        amount: amount,

        date: date,

        description: description

    };


    expenseData[selectedPeriod].expenses.push(expense);


    localStorage.setItem(
        "expenseData",
        JSON.stringify(expenseData)
    );


    document.getElementById("title").value = "";

    document.getElementById("category").selectedIndex = 0;

    document.getElementById("amount").value = "";

    document.getElementById("date").value = "";

    document.getElementById("description").value = "";


    updateSummary();

    alert("Expense Added Successfully!");

}

// ----------------------------
// Update Summary
// ----------------------------

function updateSummary() {

    if (selectedPeriod === "") {

        document.getElementById("expenseCount").innerHTML = "0";
        document.getElementById("budgetAmount").innerHTML = "₹0";
        document.getElementById("totalAmount").innerHTML = "₹0";
        document.getElementById("remainingBudget").innerHTML = "₹0";
        document.getElementById("budgetUsed").innerHTML = "0%";

        return;

    }

    let current = expenseData[selectedPeriod];

    let budget = current.budget;

    let total = 0;

    current.expenses.forEach(function (expense) {

        total += expense.amount;

    });

    let remaining = budget - total;

    if (remaining < 0) {

        remaining = 0;

    }

    let percentage = 0;

    if (budget > 0) {

        percentage = (total / budget) * 100;

        if (percentage > 100) {

            percentage = 100;

        }

    }

    document.getElementById("expenseCount").innerHTML =
        current.expenses.length;

    document.getElementById("budgetAmount").innerHTML =
        "₹" + budget;

    document.getElementById("totalAmount").innerHTML =
        "₹" + total;

    document.getElementById("remainingBudget").innerHTML =
        "₹" + remaining;

    document.getElementById("budgetUsed").innerHTML =
        percentage.toFixed(1) + "%";

}


// ----------------------------
// Generate Dashboard
// ----------------------------

function generateDashboard() {

    if (selectedPeriod === "") {

        alert("Please select a Tracking Period.");

        return;

    }

    if (expenseData[selectedPeriod].expenses.length === 0) {

        alert("Please add at least one expense.");

        return;

    }

    localStorage.setItem(
        "selectedPeriod",
        selectedPeriod
    );

    window.location.href = "dashboard.html";

}

// ----------------------------
// Reset Current Tracking Period
// ----------------------------

function resetTrackingPeriod() {

    if (selectedPeriod === "") {

        return;

    }

    let confirmReset = confirm(
        "Are you sure you want to clear all expenses for this tracking period?"
    );

    if (!confirmReset) {

        return;

    }

    expenseData[selectedPeriod] = {

        budget: 0,

        expenses: []

    };

    localStorage.setItem(
        "expenseData",
        JSON.stringify(expenseData)
    );

    document.getElementById("budget").disabled = false;
    document.getElementById("budget").value = "";

    document.getElementById("title").value = "";
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
    document.getElementById("description").value = "";

    updateSummary();

    alert("Tracking Period has been reset.");

}


// ----------------------------
// Utility Functions
// ----------------------------

function getCurrentExpenses() {

    if (selectedPeriod === "") {

        return [];

    }

    return expenseData[selectedPeriod].expenses;

}

function getCurrentBudget() {

    if (selectedPeriod === "") {

        return 0;

    }

    return expenseData[selectedPeriod].budget;

}


// ----------------------------
// Save Before Leaving Page
// ----------------------------

window.addEventListener("beforeunload", function () {

    localStorage.setItem(
        "expenseData",
        JSON.stringify(expenseData)
    );

});