
const productForm = document.getElementById("productForm");
const billItems = document.getElementById("billItems");
const grandTotal = document.getElementById("grandTotal");

let products = [];

// Date show
document.getElementById("billDate").textContent =
    new Date().toLocaleDateString("en-IN");

// Add Product
productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const rate = Number(document.getElementById("productRate").value);
    const qty = Number(document.getElementById("productQty").value);

    if (!name || !Number.isFinite(rate) || rate <= 0 ||
        !Number.isInteger(qty) || qty <= 0) {
        alert("Please enter valid product details!");
        return;
    }

    products.push({
        name: name,
        rate: rate,
        qty: qty
    });

    displayProducts();
    productForm.reset();
    document.getElementById("productQty").value = 1;
    document.getElementById("productName").focus();
});

// Display Products and Calculate Total
function displayProducts() {
    billItems.innerHTML = "";
    let total = 0;

    if (products.length === 0) {
        billItems.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No products added yet.
                </td>
            </tr>
        `;
    }

    products.forEach(function (product, index) {
        const amount = product.rate * product.qty;
        total += amount;

        billItems.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(product.name)}</td>
                <td>₹ ${product.rate.toFixed(2)}</td>
                <td>${product.qty}</td>
                <td>₹ ${amount.toFixed(2)}</td>
                <td class="no-print">
                    <button type="button"
                        class="btn btn-danger"
                        onclick="deleteProduct(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    grandTotal.textContent = "₹ " + total.toFixed(2);
}

// Product Name safe display
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Delete Single Product
function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

// Clear All Products
document.getElementById("clearBtn").addEventListener("click", function () {
    if (products.length === 0) {
        alert("No products to clear!");
        return;
    }

    if (confirm("Are you sure you want to clear all products?")) {
        products = [];
        displayProducts();
    }
});

// Print Bill
document.getElementById("printBtn").addEventListener("click", function () {
    if (products.length === 0) {
        alert("Please add at least one product before printing!");
        return;
    }

    window.print();
});

// New Bill
document.getElementById("resetBtn").addEventListener("click", function () {
    if (confirm("Do you want to start a new bill?")) {
        products = [];
        displayProducts();
        productForm.reset();

        document.getElementById("productQty").value = 1;
        document.getElementById("customerName").value = "";
        document.getElementById("customerMobile").value = "";
        document.getElementById("customerAddress").value = "";
        document.getElementById("Branch").value = "";
    }
});

// Initial display
displayProducts();
