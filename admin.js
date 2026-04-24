let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const ADMIN_PIN = "1411";

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("orders", JSON.stringify(orders));
}

function adminLogin() {
  const pin = document.getElementById("adminPin").value.trim();

  if (pin === ADMIN_PIN) {
    localStorage.setItem("adminLoggedIn", "yes");
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    renderAdminProducts();
    renderAdminOrders();
  } else {
    alert("Wrong PIN!");
  }
}

function checkAdminLogin() {
  if (localStorage.getItem("adminLoggedIn") === "yes") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    renderAdminProducts();
    renderAdminOrders();
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  location.reload();
}

function addProduct() {
  const name = document.getElementById("prodName").value.trim();
  const company = document.getElementById("prodCompany").value.trim();
  const pack = document.getElementById("prodPack").value.trim();
  const price = parseFloat(document.getElementById("prodPrice").value.trim());
  const category = document.getElementById("prodCategory").value;
  const usage = document.getElementById("prodUsage").value.trim();

  if (!name || !company || !pack || !price || !usage) {
    alert("Please fill all fields!");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    company,
    pack,
    price,
    category,
    usage
  };

  products.push(newProduct);
  saveData();
  renderAdminProducts();

  document.getElementById("prodName").value = "";
  document.getElementById("prodCompany").value = "";
  document.getElementById("prodPack").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodUsage").value = "";

  alert("Product added successfully!");
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  products = products.filter(p => p.id !== id);
  saveData();
  renderAdminProducts();
}

function renderAdminProducts() {
  const list = document.getElementById("adminProductList");
  list.innerHTML = "";

  if (products.length === 0) {
    list.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>Company:</b> ${p.company}</p>
      <p><b>Pack:</b> ${p.pack}</p>
      <p><b>Category:</b> ${p.category}</p>
      <p><b>Usage:</b> ${p.usage}</p>
      <p class="price">₹ ${p.price}</p>
      <button class="btn danger-btn" onclick="deleteProduct(${p.id})">🗑 Delete</button>
    `;

    list.appendChild(div);
  });
}

function renderAdminOrders() {
  const orderBox = document.getElementById("adminOrders");
  orderBox.innerHTML = "";

  if (orders.length === 0) {
    orderBox.innerHTML = "<p>No orders received.</p>";
    return;
  }

  orders.slice().reverse().forEach(order => {
    let itemsHtml = "";
    order.items.forEach(i => {
      itemsHtml += `<li>${i.name} (${i.pack}) Qty:${i.qty} - ₹${i.price}</li>`;
    });

    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <h3>Order: ${order.orderId}</h3>
      <p><b>Name:</b> ${order.customerName}</p>
      <p><b>Mobile:</b> ${order.mobile}</p>
      <p><b>Address:</b> ${order.address}</p>
      <p><b>Date:</b> ${order.dateTime}</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Total:</b> ₹${order.total}</p>
      <ul>${itemsHtml}</ul>

      <button class="btn" onclick="updateOrderStatus('${order.orderId}','Delivered')">✅ Delivered</button>
      <button class="btn danger-btn" onclick="deleteOrder('${order.orderId}')">🗑 Delete</button>
    `;

    orderBox.appendChild(div);
  });
}

function updateOrderStatus(orderId, status) {
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  order.status = status;
  saveData();
  renderAdminOrders();
}

function deleteOrder(orderId) {
  if (!confirm("Delete this order?")) return;

  orders = orders.filter(o => o.orderId !== orderId);
  saveData();
  renderAdminOrders();
}

checkAdminLogin();
