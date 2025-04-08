lucide.createIcons();
const expenseList = document.getElementById("expenseList");
const theme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", theme);

// Restore from localStorage
const stored = JSON.parse(localStorage.getItem("expenses")) || [];
stored.forEach(item => renderExpense(item));

function toggleTheme() {
  const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  lucide.createIcons();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!title || isNaN(amount)) {
    Toastify({ text: "Please fill all fields", style: { background: "red" }}).showToast();
    return;
  }

  const expense = { title, amount, category };
  renderExpense(expense);
  saveExpense(expense);

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  Toastify({ text: "Expense added", style: { background: "green" }}).showToast();
}

function renderExpense({ title, amount, category }) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${title} - ${category} - ${formatCurrency(amount)}</span>
    <button onclick="deleteExpense(this)">
      <i data-lucide="trash-2"></i>
    </button>
  `;
  expenseList.appendChild(li);
  lucide.createIcons();
}

function deleteExpense(btn) {
  const li = btn.parentElement;
  const text = li.querySelector("span").textContent;
  li.remove();
  removeFromStorage(text);
  Toastify({ text: "Deleted", style: { background: "gray" }}).showToast();
}

function saveExpense(expense) {
  const all = JSON.parse(localStorage.getItem("expenses")) || [];
  all.push(expense);
  localStorage.setItem("expenses", JSON.stringify(all));
}

function removeFromStorage(text) {
  const all = JSON.parse(localStorage.getItem("expenses")) || [];
  const updated = all.filter(item => `${item.title} - ${item.category} - ${formatCurrency(item.amount)}` !== text);
  localStorage.setItem("expenses", JSON.stringify(updated));
}

function clearAllExpenses() {
  localStorage.removeItem("expenses");
  expenseList.innerHTML = "";
  Toastify({ text: "All expenses cleared", style: { background: "orange" }}).showToast();
}

function exportExpenses() {
  const all = JSON.parse(localStorage.getItem("expenses")) || [];
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.json";
  a.click();
  Toastify({ text: "Exported", style: { background: "blue" }}).showToast();
}

// Register service worker for offline support (optional)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(err => console.error("SW error", err));
                                                  }
