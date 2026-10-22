// ============================================================
//  E-Millennial Store — cart.js
// ============================================================

let cart = [];
let user = {};

// ============================================================
//  A — RENDER CART ITEMS (builds entire table from scratch)
// ============================================================

function renderCartItems() {
  const container = document.getElementById("cartItemsContainer");

  // Safety check
  if (!container) return;

  // Empty cart state
  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Your cart is empty. Go grab something!</p>`;
    return;
  }

  // Build the full table as one HTML string
  let html = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>S/N</th>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, index) => {
    html += `
      <tr id="cart-row-${item.id}">
        <td data-label="Number">${index + 1}</td>
        <td data-label="Item">${item.name}</td>
        <td data-label="Price" class="price-cell">GH₵ ${(item.price * item.quantity).toFixed(2)}</td>
        <td data-label="Quantity">
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </td>
        <td data-label="Action">
          <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ============================================================
//  CART OPERATIONS
// ============================================================

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (!existing) {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  renderCartItems();
  updateTotal();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateProductButton(productId);
  updateCartCount();
  renderCartItems();
  updateTotal();
}

function changeQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  renderCartItems();
  updateTotal();
}

// ============================================================
//  CART COUNT & TOTAL
// ============================================================

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartTotal").textContent = `GH₵ ${total.toFixed(2)}`;
}

// ============================================================
//  CART MODAL — OPEN / CLOSE
// ============================================================

function openCart() {
  renderCartItems();
  updateTotal();
  document.getElementById("cartOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById("cartOverlay")) {
    closeCart();
  }
}

// ============================================================
//  B — FORM VALIDATION
// ============================================================

function validateField(fieldId) {
  const input   = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  const value   = input.value.trim();
  let message   = "";

  if (fieldId === "userName") {
    if (!value)                message = "Please enter your full name.";
    else if (value.length < 2) message = "Name must be at least 2 characters.";
  }
  if (fieldId === "userEmail") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value)                       message = "Please enter your email address.";
    else if (!emailRegex.test(value)) message = "Please enter a valid email address.";
  }
  if (fieldId === "userPhone") {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!value)                       message = "Please enter your phone number.";
    else if (!phoneRegex.test(value)) message = "Enter a valid phone number (10–15 digits).";
  }

  errorEl.textContent = message;
  input.classList.toggle("error-input", !!message);
  return message === "";
}

function validateAllFields() {
  const nameOk  = validateField("userName");
  const emailOk = validateField("userEmail");
  const phoneOk = validateField("userPhone");
  return nameOk && emailOk && phoneOk;
}

// ============================================================
//  D — CHECKOUT
// ============================================================

function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some products first.");
    return;
  }
  if (!validateAllFields()) return;

  user = {
    name:  document.getElementById("userName").value.trim(),
    email: document.getElementById("userEmail").value.trim(),
    phone: document.getElementById("userPhone").value.trim(),
  };

  const total      = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountKobo = Math.round(total * 100);

  closeCart();

  const handler = PaystackPop.setup({
    key: "YOUR_PAYSTACK_TEST_PUBLIC_KEY",
    email:     user.email,
    amount:    amountKobo,
    currency:  "GHS",
    ref:       "EMS_" + Date.now(),
    firstname: user.name.split(" ")[0],
    lastname:  user.name.split(" ").slice(1).join(" ") || "",
    phone:     user.phone,
    callback:  function (response) { showSummary(response); },
    onClose:   function () { openCart(); },
  });

  handler.openIframe();
}

// ============================================================
//  SUMMARY MODAL
// ============================================================

function showSummary(paystackResponse) {
  const heading = document.getElementById("summaryMessage");
  heading.replaceChildren(
    document.createTextNode("Thank you, "),
    Object.assign(document.createElement("span"), { textContent: user.name }),
    document.createTextNode(". Your order has been received.")
  );

  const tbody = document.getElementById("summaryItems");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryReference = document.getElementById("summaryReference");
  tbody.innerHTML = "";

  let orderTotal = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    orderTotal += subtotal;

    const row = document.createElement("tr");
    const values = [
      index + 1,
      item.name,
      `GH₵ ${item.price.toFixed(2)}`,
      item.quantity,
      `GH₵ ${subtotal.toFixed(2)}`,
    ];
    const labels = ["Number", "Item", "Unit price", "Quantity", "Subtotal"];

    values.forEach((value, columnIndex) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      cell.dataset.label = labels[columnIndex];
      if (columnIndex >= 2) cell.classList.add("numeric-column");
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  summaryTotal.textContent = `GH₵ ${orderTotal.toFixed(2)}`;
  summaryReference.textContent = paystackResponse?.reference
    ? `Payment reference: ${paystackResponse.reference}`
    : "";

  document.getElementById("summaryOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeSummary() {
  document.getElementById("summaryOverlay").classList.remove("active");
  document.body.style.overflow = "";
  cart = [];
  user = {};
  document.getElementById("userName").value  = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPhone").value = "";
  updateCartCount();
  window.location.reload();
}
