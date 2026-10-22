// ============================================================
//  E-Millennial Store — script.js
//  Handles: products list, rendering products, 
//           toggling products in/out of cart
// ============================================================

// ---- PRODUCTS DATA ----
const products = [
  { id: 1, name: "Samsung TV",  price: 2999, image: "./product1.png", desc: "4K UHD, built-in streaming apps, Dolby Atmos sound." },
  { id: 2, name: "Pixel 4a",    price: 1599, image: "./product2.png", desc: "5G, 6GB RAM, 128GB storage, 24hr battery life." },
  { id: 3, name: "PS 5",        price: 3499, image: "./product3.png", desc: "Next-gen gaming, 4K 120fps, ultra-fast SSD." },
  { id: 4, name: "MacBook Air", price: 5999, image: "./product4.png", desc: "M2 chip, 8GB RAM, 256GB SSD, 18hr battery." },
  { id: 5, name: "Apple Watch", price: 899,  image: "./product5.png", desc: "Health tracking, GPS, AMOLED display, 7-day battery." },
  { id: 6, name: "Air Pods",    price: 599,  image: "./product6.png", desc: "ANC, 30hr battery, IPX5 water-resistant." },
];

// ---- RENDER ALL PRODUCTS INTO THE GRID ----
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const inCart = cart.some((item) => item.id === p.id);

    const card = document.createElement("div");
    card.className = "product-card";
    card.id = `product-card-${p.id}`;
    card.innerHTML = `
      <img class="product-img" src="${p.image}" alt="${p.name}" />
      <div class="product-name">${p.name}</div> <div class="product-price">GH₵ ${p.price.toFixed(2)}</div>
      <button
        class="add-btn ${inCart ? "in-cart" : ""}"
        id="addBtn-${p.id}"
        onclick="toggleCart(${p.id})">
        ${inCart ? "REMOVE FROM CART" : "ADD TO CART"}
      </button>
    `;
    grid.appendChild(card);
  });
}

// ---- TOGGLE A PRODUCT IN / OUT OF CART ----
function toggleCart(productId) {
  const alreadyInCart = cart.some((item) => item.id === productId);

  if (alreadyInCart) {
    // Remove from cart
    removeFromCart(productId);
  } else {
    // Add to cart
    const product = products.find((p) => p.id === productId);
    addToCart(product);
  }

  updateProductButton(productId);
}

// ---- UPDATE A SINGLE PRODUCT'S BUTTON ON THE LANDING PAGE ----
function updateProductButton(productId) {
  const btn = document.getElementById(`addBtn-${productId}`);
  if (!btn) return;

  const inCart = cart.some((item) => item.id === productId);
  btn.textContent = inCart ? "REMOVE FROM CART" : "ADD TO CART";
  btn.classList.toggle("in-cart", inCart);
}

// ---- INITIALISE — render products when page loads ----
renderProducts();
