// =====================================
// ExpenseWise - dashboard.js
// PART 1
// =====================================

// ----------------------------
// Logged In User
// ----------------------------
let userName = localStorage.getItem("userName") || "User";

document.getElementById("userName").innerHTML = userName;


// ----------------------------
// Today's Date
// ----------------------------

let today = new Date();

document.getElementById("todayDate").innerHTML =
    today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

document.getElementById("todayDay").innerHTML =
    today.toLocaleDateString("en-US", {
        weekday: "long"
    });


// ----------------------------
// Load Expense Data
// ----------------------------

let expenseData =
    JSON.parse(localStorage.getItem("expenseData")) || {};


// ----------------------------
// Selected Tracking Period
// ----------------------------

let selectedPeriod =
    localStorage.getItem("selectedPeriod") || "";


// ----------------------------
// Current Tracking Data
// ----------------------------

let currentData = expenseData[selectedPeriod];

if (!currentData) {

    currentData = {

        budget: 0,

        expenses: []

    };

}


// ----------------------------
// Calculate Overview
// ----------------------------

let totalExpense = 0;

let highestExpense = 0;

let categoryList = [];

currentData.expenses.forEach(function (expense) {

    totalExpense += expense.amount;

    if (expense.amount > highestExpense) {

        highestExpense = expense.amount;

    }

    if (!categoryList.includes(expense.category)) {

        categoryList.push(expense.category);

    }

});


// ----------------------------
// Update Overview Cards
// ----------------------------

document.getElementById("totalExpense").innerHTML =
    "₹" + totalExpense;

document.getElementById("transactionCount").innerHTML =
    currentData.expenses.length;

document.getElementById("categoryCount").innerHTML =
    categoryList.length;

document.getElementById("highestExpense").innerHTML =
    "₹" + highestExpense;

// ----------------------------
// Expense History Table
// ----------------------------

let tableBody = document.getElementById("expenseTable");

if(tableBody){

    tableBody.innerHTML = "";

}

if (currentData.expenses.length === 0) {

    tableBody.innerHTML =
        "<tr><td colspan='4'>No expenses added for this tracking period.</td></tr>";

}

else {

    currentData.expenses.forEach(function (expense) {

        tableBody.innerHTML +=

            "<tr>" +

            "<td>" + expense.date + "</td>" +

            "<td>" + expense.category + "</td>" +

            "<td>" + expense.title + "</td>" +

            "<td>₹" + expense.amount + "</td>" +

            "</tr>";

    });

}


// ----------------------------
// Quick Statistics
// ----------------------------

let highestDay = "-";

let highestDayAmount = 0;

let averageExpense = 0;

let dateTotals = {};

currentData.expenses.forEach(function (expense) {

    if (!dateTotals[expense.date]) {

        dateTotals[expense.date] = 0;

    }

    dateTotals[expense.date] += expense.amount;

});

for (let date in dateTotals) {

    if (dateTotals[date] > highestDayAmount) {

        highestDayAmount = dateTotals[date];

        highestDay = date;

    }

}

if (currentData.expenses.length > 0) {

    averageExpense =
        totalExpense / currentData.expenses.length;

}

document.querySelectorAll(".quick-card h2")[0].innerHTML =
    highestDay;

document.querySelectorAll(".quick-card p")[0].innerHTML =
    "₹" + highestDayAmount;

document.querySelectorAll(".quick-card h2")[1].innerHTML =
    "UPI";

document.querySelectorAll(".quick-card p")[1].innerHTML =
    "Most Used Payment";

document.querySelectorAll(".quick-card h2")[2].innerHTML =
    "₹" + averageExpense.toFixed(2);

document.querySelectorAll(".quick-card p")[2].innerHTML =
    "Per Transaction";

// ----------------------------
// Expense Insights
// ----------------------------

let insightList =
    document.getElementById("insightList");

let categoryTotals = {};

let highestCategory = "";

let highestCategoryAmount = 0;

currentData.expenses.forEach(function (expense) {

    if (!categoryTotals[expense.category]) {

        categoryTotals[expense.category] = 0;

    }

    categoryTotals[expense.category] += expense.amount;

});

for (let category in categoryTotals) {

    if (categoryTotals[category] > highestCategoryAmount) {

        highestCategoryAmount = categoryTotals[category];

        highestCategory = category;

    }

}

let budget = currentData.budget;

let remainingBudget = budget - totalExpense;

if (remainingBudget < 0) {

    remainingBudget = 0;

}

let budgetUsed = 0;

if (budget > 0) {

    budgetUsed = ((totalExpense / budget) * 100).toFixed(1);

}

let highestTitle = "";

currentData.expenses.forEach(function (expense) {

    if (expense.amount === highestExpense) {

        highestTitle = expense.title;

    }

});

insightList.innerHTML = "";

insightList.innerHTML +=
"<li>Total spending recorded: <strong>₹" +
totalExpense +
"</strong> across <strong>" +
currentData.expenses.length +
"</strong> transactions.</li>";

insightList.innerHTML +=
"<li>Budget allocated: <strong>₹" +
budget +
"</strong>.</li>";

insightList.innerHTML +=
"<li>Remaining budget: <strong>₹" +
remainingBudget +
"</strong>.</li>";

insightList.innerHTML +=
"<li>Budget used: <strong>" +
budgetUsed +
"%</strong>.</li>";

if (highestCategory !== "") {

    insightList.innerHTML +=
    "<li>Highest spending category: <strong>" +
    highestCategory +
    "</strong> with <strong>₹" +
    highestCategoryAmount +
    "</strong>.</li>";

}

if (highestTitle !== "") {

    insightList.innerHTML +=
    "<li>Highest single expense: <strong>" +
    highestTitle +
    "</strong> costing <strong>₹" +
    highestExpense +
    "</strong>.</li>";

}

insightList.innerHTML +=
"<li>Current tracking period: <strong>" +
selectedPeriod +
"</strong>.</li>";

// =====================================
// CHARTS
// =====================================


// Category Wise Expense Data

let chartCategories = {};

currentData.expenses.forEach(function(expense){

    if(!chartCategories[expense.category]){

        chartCategories[expense.category] = 0;

    }

    chartCategories[expense.category] += expense.amount;

});


let categoryNames = Object.keys(chartCategories);

let categoryAmounts = Object.values(chartCategories);



// ----------------------------
// Pie Chart
// ----------------------------


new Chart(
document.getElementById("categoryPieChart"),
{

type:"pie",

data:{

labels:categoryNames,

datasets:[{

data:categoryAmounts

}]

},

options:{

responsive:true

}

});



// ----------------------------
// Bar Chart
// ----------------------------


new Chart(
document.getElementById("categoryBarChart"),
{

type:"bar",

data:{

labels:categoryNames,

datasets:[{

label:"Amount Spent",

data:categoryAmounts

}]

},

options:{

responsive:true,

scales:{

y:{

beginAtZero:true

}

}

}

});



// ----------------------------
// Line Chart
// ----------------------------


let dateExpense={};


currentData.expenses.forEach(function(expense){

if(!dateExpense[expense.date]){

dateExpense[expense.date]=0;

}

dateExpense[expense.date]+=expense.amount;


});


new Chart(

document.getElementById("expenseLineChart"),

{

type:"line",

data:{

labels:Object.keys(dateExpense),

datasets:[{

label:"Daily Expense",

data:Object.values(dateExpense),

tension:0.3

}]

},

options:{

    responsive:true,

    maintainAspectRatio:true,

}

});