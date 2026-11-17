const productForm = document.querySelector("#product-form");
const sizeError = document.querySelector("#size-error");
const quantityInput = document.querySelector("#shirt-quantity");
const quantityError = document.querySelector("#quantity-error");
const defaultQuantityError = quantityError.textContent;
const bagCount = document.querySelector("#bag-count");
const bagStatus = document.querySelector("#bag-status");
const bagItems = document.querySelector("#bag-items");
const clearBagButton = document.querySelector("#clear-bag");
const bagTotal = document.querySelector("#bag-total");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutError = document.querySelector("#checkout-error");
const confirmation = document.querySelector("#order-confirmation");
const orderHistoryList = document.querySelector("#order-history-list");
const storageModeMessage = document.querySelector("#storage-mode");
const styleChoice = document.querySelector("#style-choice");
const styleRecommendation = document.querySelector("#style-recommendation");

const productPriceCents = 1500;
const localOrdersKey = "elsewhere-demo-orders";
const shoppingBag = [];
let nextItemId = 1;
let storageMode = "checking";
let savingOrder = false;

const approach = new URLSearchParams(window.location.search).get("approach");
document.body.dataset.approach = approach === "a" ? "a" : "b";
document.querySelectorAll("[data-approach-link]").forEach((link) => {
  if (link.dataset.approachLink === document.body.dataset.approach) {
    link.setAttribute("aria-current", "page");
  }
});

const money = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

function itemCount() {
  return shoppingBag.reduce((sum, item) => sum + item.quantity, 0);
}

function orderTotalCents() {
  return shoppingBag.reduce(
    (sum, item) => sum + productPriceCents * item.quantity,
    0,
  );
}

function renderShoppingBag() {
  bagItems.replaceChildren();

  for (const item of shoppingBag) {
    const listItem = document.createElement("li");
    listItem.classList.add("bag-item");

    const itemInformation = document.createElement("div");
    const itemName = document.createElement("strong");
    itemName.textContent = item.name;

    const itemDetails = document.createElement("p");
    itemDetails.classList.add("bag-item-detail");
    itemDetails.textContent =
      `Size: ${item.size} · Quantity: ${item.quantity} · ` +
      money(productPriceCents * item.quantity);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.classList.add("text-button", "remove-item");
    removeButton.setAttribute(
      "aria-label",
      `Remove size ${item.size} from bag`,
    );
    removeButton.addEventListener("click", () => removeItem(item.id));

    itemInformation.append(itemName, itemDetails);
    listItem.append(itemInformation, removeButton);
    bagItems.append(listItem);
  }

  const count = itemCount();
  bagCount.textContent = count;
  bagStatus.textContent =
    count === 0
      ? "Your shopping bag is empty. Find something that feels like you."
      : `You have ${count} ${count === 1 ? "shirt" : "shirts"} in your demo bag.`;
  bagTotal.textContent = money(orderTotalCents());
  clearBagButton.disabled = count === 0;
  checkoutButton.disabled =
    count === 0 || storageMode === "checking" || savingOrder;
}

function removeItem(itemId) {
  const index = shoppingBag.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    shoppingBag.splice(index, 1);
    renderShoppingBag();
  }
}

function readBrowserOrders() {
  try {
    const records = JSON.parse(localStorage.getItem(localOrdersKey) ?? "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

async function getSavedOrders() {
  if (storageMode === "sqlite") {
    const response = await fetch("/api/orders", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load SQLite order history.");
    return response.json();
  }
  return readBrowserOrders();
}

function renderOrderHistory(orders) {
  orderHistoryList.replaceChildren();
  if (orders.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No saved demo orders yet.";
    orderHistoryList.append(emptyItem);
    return;
  }

  for (const order of orders) {
    const historyItem = document.createElement("li");
    const summary = document.createElement("strong");
    summary.textContent = `${order.reference} · ${money(order.totalCents)}`;
    const details = document.createElement("p");
    details.classList.add("order-history-detail");
    details.textContent = order.items
      .map((item) => `${item.size} × ${item.quantity}`)
      .join(", ");
    historyItem.append(summary, details);
    orderHistoryList.append(historyItem);
  }
}

async function refreshOrderHistory() {
  try {
    renderOrderHistory(await getSavedOrders());
  } catch {
    const errorItem = document.createElement("li");
    errorItem.textContent = "Order history is temporarily unavailable.";
    orderHistoryList.replaceChildren(errorItem);
  }
}

async function detectStorageMode() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const result = response.ok ? await response.json() : null;
    storageMode = result?.storage === "sqlite" ? "sqlite" : "browser";
  } catch {
    storageMode = "browser";
  }

  storageModeMessage.textContent =
    storageMode === "sqlite"
      ? "Local server mode: demo orders are stored in SQLite on this computer."
      : "Public preview mode: demo orders are stored in this browser only; there is no SQLite connection.";
  renderShoppingBag();
  await refreshOrderHistory();
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedSize = productForm.querySelector('input[name="size"]:checked');
  const quantity = Number(quantityInput.value);
  const validQuantity =
    Number.isInteger(quantity) && quantity >= 1 && quantity <= 5;

  sizeError.hidden = Boolean(selectedSize);
  quantityError.textContent = defaultQuantityError;
  quantityError.hidden = validQuantity;
  if (!selectedSize || !validQuantity) return;

  const existingItem = shoppingBag.find(
    (item) => item.size === selectedSize.value,
  );
  if (existingItem && existingItem.quantity + quantity > 5) {
    quantityError.textContent = "Keep each size at 5 shirts or fewer.";
    quantityError.hidden = false;
    return;
  }

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    shoppingBag.push({
      id: nextItemId,
      name: "Elsewhere White T-shirt",
      size: selectedSize.value,
      quantity,
    });
    nextItemId += 1;
  }

  confirmation.hidden = true;
  checkoutError.hidden = true;
  quantityInput.value = "1";
  productForm.querySelectorAll('input[name="size"]').forEach((input) => {
    input.checked = false;
  });
  renderShoppingBag();
});

const styleSuggestions = {
  relaxed: "Try wearing it loose or with an easy half tuck.",
  layered: "Add an open shirt, cardigan, or jacket you already own.",
  color: "Bring a favorite color with an accessory from your closet.",
};

styleChoice.addEventListener("change", () => {
  const suggestion = styleSuggestions[styleChoice.value];
  styleRecommendation.textContent = suggestion
    ? `Your optional ${styleChoice.options[styleChoice.selectedIndex].text.toLowerCase()} idea: ${suggestion}`
    : "";
  styleRecommendation.hidden = !suggestion;
});

quantityInput.addEventListener("input", () => {
  quantityError.hidden = true;
});

clearBagButton.addEventListener("click", () => {
  shoppingBag.length = 0;
  confirmation.hidden = true;
  renderShoppingBag();
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  checkoutError.hidden = true;
  confirmation.hidden = true;

  if (shoppingBag.length === 0 || !checkoutForm.reportValidity()) return;

  savingOrder = true;
  checkoutButton.disabled = true;
  const orderDetails = {
    email: checkoutForm.elements.email.value.trim(),
    items: shoppingBag.map(({ size, quantity }) => ({ size, quantity })),
  };

  try {
    let order;
    if (storageMode === "sqlite") {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not save the demo order.");
      order = result;
    } else {
      order = {
        reference: `DEMO-${(
          globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`
        )
          .slice(0, 8)
          .toUpperCase()}`,
        items: orderDetails.items.map((item) => ({
          ...item,
          unitPriceCents: productPriceCents,
        })),
        totalCents: orderTotalCents(),
        createdAt: new Date().toISOString(),
      };
      const records = [order, ...readBrowserOrders()].slice(0, 30);
      localStorage.setItem(localOrdersKey, JSON.stringify(records));
    }

    confirmation.textContent =
      `${order.reference} saved ${storageMode === "sqlite" ? "in the local SQLite database" : "in this browser"}. ` +
      `This is a simulated order only; no payment was taken.`;
    confirmation.hidden = false;
    shoppingBag.length = 0;
    renderShoppingBag();
    await refreshOrderHistory();
  } catch (error) {
    checkoutError.textContent =
      error instanceof Error
        ? error.message
        : "The demo order could not be saved. Please try again.";
    checkoutError.hidden = false;
  } finally {
    savingOrder = false;
    renderShoppingBag();
  }
});

await detectStorageMode();
