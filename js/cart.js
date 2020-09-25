/**
 * 1. We want to save the data with localstorage
 * 2. When we click on a button, we want to add the pizza or deal to the cart
 * 3. When we click the cart, we want to open checkout
 */

const data = {
  "deal-2-for-1": {
    name: "2 for 1 Large pizzas",
    price: 25
  },
  "deal-event": {
    name: "200 pizzas for an event",
    price: 200
  },
  "deal-drink-small": {
    name: "2L Coke + Small Pizza",
    price: 25
  },
  "pepperoni": {
    name: "Pepperoni",
    price: 20
  },
  "bacon-and-bbq-chicken": {
    name: "Bacon and BBQ chicken",
    price: 20
  },
  "hawaiian": {
    name: "Hawaiian",
    price: 20
  },
  "chicago-style-deep-dish": {
    name: "Chicago style deep dish",
    price: 20
  },
  "firey": {
    name: "Firey",
    price: 20
  },
  "suprise-delux": {
    name: "Suprise Delux",
    price: 20
  },
}

class Cart {
  constructor() {
    // Retrieve the saved cart
    const saved = localStorage.getItem('cart');
    this.items = saved ? JSON.parse(saved) : [];
    this.cartSpan = document.querySelector("#cart span");
    this.orderUL = document.querySelector("#order");


    document.querySelectorAll('.cart-button').forEach(b => {
      const id = b.getAttribute('data-id');
      b.addEventListener('click', () => {
        this.addItem(id);
      });
    });

    this.save();
  }

  get size() {
    return this.items.reduce(
      (num, cur) => num + cur.quantity,
      0
    );
  }

  _lookupItem(id, throwError = true) {
    const item = this.items.find(i => i.id == id);
    if (!item && throwError) throw new Error(`CART: Could not find item with id ${id}`);
    return item;
  }

  // Plus 1, or add new product
  addItem(id) {
    // Check if product is already in the cart
    const existing = this._lookupItem(id, false);

    if (existing) existing.quantity += 1; // Add another of the same item
    // Otherwise, add a new item to the cart (just 1)
    else this.items.push({ id, quantity: 1 });

    this.save();
  }

  // Minus 1, and remove if none left
  removeItem(id) {
    const item = this._lookupItem(id, false);
    item.quantity -= 1;

    // Remove the item if it has no quantity
    if (item.quantity <= 0) this.removeItemFromCart(id);

    this.save();
  }

  // Entirely remove product from cart
  removeItemFromCart(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }


  setQuantity(id, quantity) {
    const item = this._lookupItem(id);
    item.quantity = quantity;

    this.save();
  }


  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.cartSpan.innerHTML = this.size;
    this._render();
  }


  _render() {
    this.orderUL.innerHTML = "";
    this.items.forEach(i => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${data[i.id].name}</span>
        <span>${i.quantity}</span>
        <span>$${data[i.id].price * i.quantity}</span>
      `;
      this.orderUL.appendChild(li);
    })
  }

}

window.cart = new Cart();
