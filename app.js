let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

let currentCategory = "all";
let currentLang = localStorage.getItem("lang") || "en";

const translations = {
  en: {
    shopInfoTitle: "Shop Information",
    productsTitle: "Products",
    cartTitle: "Cart",
    totalLabel: "Total: ₹ ",
    disclaimer: "Disclaimer: Use pesticides strictly as per label instructions. Consult expert if required.",
    addressLabel: "Address:",
    phoneLabel: "Phone:",
    catAll: "All",
    catPesticides: "Pesticides",
    catFertilizer: "Fertilizer",
    catSeeds: "Seeds",
    catGrapes: "🍇 Grapes Special",
  },
  mr: {
    shopInfoTitle: "दुकान माहिती",
    productsTitle: "उत्पादने",
    cartTitle: "कार्ट",
    totalLabel: "एकूण: ₹ ",
    disclaimer: "सूचना: कीटकनाशके लेबलवरील सूचनांनुसारच वापरा. गरज असल्यास तज्ञांचा सल्ला घ्या.",
    addressLabel: "पत्ता:",
    phoneLabel: "फोन:",
    catAll: "सर्व",
    catPesticides: "कीटकनाशके",
    catFertilizer: "खते",
    catSeeds: "बियाणे",
    catGrapes: "🍇 द्राक्षांसाठी खास",
  }
};

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("orders", JSON.stringify(orders));
}

function initDefaultProducts() {
  if (products.length === 0) {
    products = [
      {
        id: Date.now(),
        name: "Copper Fungicide",
        company: "Generic",
        pack: "500gm",
        price: 450,
        category: "grapes",
        usage: "For grapes fungal disease protection."
      },
      {
        id: Date.now() + 1,
        name: "Urea Fertilizer",
        company: "IFFCO",
        pack: "50kg",
        price: 1400,
        category: "fertilizer",
        usage: "Nitrogen fertilizer for crops."
      },
      {
        id: Date.now() + 2,
        name: "Grape Seed Variety",
        company: "Local",
        pack: "1 pack",
        price: 1200,
        category: "seeds",
        usage: "High yield grape seed variety."
      }
    ];
    saveData();
  }
}

function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  productList.innerHTML = "";

  let filtered = products;

  if (currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  const searchText = document.getElementById("searchInput").value.toLowerCase();
  if (searchText) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchText) ||
      p.company.toLowerCase().includes(searchText)
    );
  }

  if (filtered.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>Company:</b> ${p.company}</p>
      <p><b>Pack:</b> ${p.pack}</p>
      <p><b>Usage:</b> ${p.usage}</p>
      <p class="price">₹ ${p.price}</p>
      <button class="btn" onclick="addToCart(${p.id})">➕ Add to Cart</button>
    `;

    productList.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveData();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveData();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <b>${item.name}</b><br/>
        Qty: ${item.qty} | ₹${item.price}
      </div>
      <button class="btn danger-btn" onclick="removeFromCart(${item.id})">Remove</button>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.innerText = total;
}

function placeOrder() {
  const name = document.getElementById("custName").value.trim();
  const mobile = document.getElementById("custMobile").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  if (!name || !mobile || !address) {
    alert("Please fill Name, Mobile and Address!");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const orderId = "ORD" + Date.now();

  let total = 0;
  cart.forEach(i => total += i.price * i.qty);

  const order = {
    orderId: orderId,
    customerName: name,
    mobile: mobile,
    address: address,
    items: cart,
    total: total,
    status: "Pending",
    dateTime: new Date().toLocaleString()
  };

  orders.push(order);

  // WhatsApp message
  let msg = `New Order - Mauli Agro Chemicals%0A`;
  msg += `Order ID: ${orderId}%0A`;
  msg += `Name: ${name}%0A`;
  msg += `Mobile: ${mobile}%0A`;
  msg += `Address: ${address}%0A%0A`;

  msg += `Items:%0A`;
  cart.forEach(i => {
    msg += `- ${i.name} (${i.pack}) Qty:${i.qty} Price:${i.price}%0A`;
  });

  msg += `%0ATotal: ₹${total}%0A`;

  saveData();

  cart = [];
  saveData();
  renderCart();

  alert("Order placed successfully!");

  window.open("https://wa.me/918149693191?text=" + msg, "_blank");
}

function filterCategory(cat) {
  currentCategory = cat;
  renderProducts();
}

function searchProducts() {
  renderProducts();
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "mr" : "en";
  localStorage.setItem("lang", currentLang);
  applyLanguage();
}

function applyLanguage() {
  const t = translations[currentLang];

  document.getElementById("shopInfoTitle").innerText = t.shopInfoTitle;
  document.getElementById("productsTitle").innerText = t.productsTitle;
  document.getElementById("cartTitle").innerText = t.cartTitle;
  document.getElementById("disclaimer").innerText = t.disclaimer;

  document.getElementById("addressLabel").innerText = t.addressLabel;
  document.getElementById("phoneLabel").innerText = t.phoneLabel;

  document.getElementById("catAll").innerText = t.catAll;
  document.getElementById("catPesticides").innerText = t.catPesticides;
  document.getElementById("catFertilizer").innerText = t.catFertilizer;
  document.getElementById("catSeeds").innerText = t.catSeeds;
  document.getElementById("catGrapes").innerText = t.catGrapes;
}

initDefaultProducts();
applyLanguage();
renderProducts();
renderCart();

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function openOrdersPopup() {
  const popup = document.getElementById("ordersPopup");
  popup.style.display = "block";
  renderCustomerOrders();
}

function closeOrdersPopup() {
  document.getElementById("ordersPopup").style.display = "none";
}

function renderCustomerOrders() {
  const box = document.getElementById("customerOrders");
  if (!box) return;

  if (orders.length === 0) {
    box.innerHTML = "<p>No orders placed yet.</p>";
    return;
  }

  let html = "";

  orders.slice().reverse().forEach(o => {
    html += `
      <div class="product-card">
        <h4>Order ID: ${o.orderId}</h4>
        <p><b>Date:</b> ${o.dateTime}</p>
        <p><b>Status:</b> ${o.status}</p>
        <p><b>Total:</b> ₹${o.total}</p>
      </div>
    `;
  });

  box.innerHTML = html;
}
