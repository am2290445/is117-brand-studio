const productForm = document.querySelector("#product-form");
const sizeError = document.querySelector("#size-error");

const bagCount = document.querySelector("#bag-count");
const bagStatus = document.querySelector("#bag-status");
const bagItems = document.querySelector("#bag-items");
const clearBagButton = document.querySelector("#clear-bag");

const shoppingBag = [];
let nextItemId = 1;

// Add a product to the shopping bag
productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedSize = document.querySelector('input[name="size"]:checked');

  if (!selectedSize) {
    sizeError.hidden = false;
    return;
  }

  sizeError.hidden = true;

  const newItem = {
    id: nextItemId,
    name: "Elsewhere White T-shirt",
    size: selectedSize.value,
    price: 15,
  };

  nextItemId++;

  shoppingBag.push(newItem);

  renderShoppingBag();

  productForm.reset();
});

// Display the shopping bag
function renderShoppingBag() {
  bagItems.innerHTML = "";

  shoppingBag.forEach(function (item) {
    const listItem = document.createElement("li");
    listItem.classList.add("bag-item");

    const itemInformation = document.createElement("div");

    const itemName = document.createElement("strong");
    itemName.textContent = item.name;

    const itemDetails = document.createElement("p");
    itemDetails.textContent =
      "Size: " + item.size + " | $" + item.price.toFixed(2);

    itemInformation.appendChild(itemName);
    itemInformation.appendChild(itemDetails);

    // Create a button to remove only this item
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.classList.add("text-button", "remove-item");

    removeButton.addEventListener("click", function () {
      removeItem(item.id);
    });

    listItem.appendChild(itemInformation);
    listItem.appendChild(removeButton);

    bagItems.appendChild(listItem);
  });

  // Update the number of items
  bagCount.textContent = shoppingBag.length;

  // Update the shopping bag message
  if (shoppingBag.length === 0) {
    bagStatus.textContent =
      "Your shopping bag is empty. Find something that feels like you.";
  } else {
    bagStatus.textContent =
      "You have " +
      shoppingBag.length +
      (shoppingBag.length === 1
        ? " item in your shopping bag."
        : " items in your shopping bag.");
  }

  // Enable or disable the clear bag button
  clearBagButton.disabled = shoppingBag.length === 0;
}

// Remove one individual item
function removeItem(itemId) {
  const itemIndex = shoppingBag.findIndex(function (item) {
    return item.id === itemId;
  });

  if (itemIndex !== -1) {
    shoppingBag.splice(itemIndex, 1);
    renderShoppingBag();
  }
}

// Clear the entire shopping bag
clearBagButton.addEventListener("click", function () {
  shoppingBag.length = 0;
  renderShoppingBag();
});
