const btnPrevPage = document.getElementById("btn-prev-page");
const btnNextPage = document.getElementById("btn-next-page");
const currentPageSpan = document.getElementById("current-page");
const sortSelect = document.getElementById("sort-select");
const productsGrid = document.getElementById("products-grid");
const categorySelect = document.getElementById("category-select");
const statusSelect = document.getElementById("status-select");
const priceOrderSelect = document.getElementById("price-order-select");

let currentPage = 1;
let totalPages = 1;
let currentSort = "";
let currentCategory = "";
let currentStatus = "";
let currentPriceOrder = "";
let cartCount = 0;

async function addToCart(productId) {
    try {
        let cartId = localStorage.getItem('cartId');

        if (!cartId) {
            const createCartResponse = await fetch('/api/carts', { method: 'POST' });
            const createCartData = await createCartResponse.json();
            cartId = createCartData.payload._id;
            localStorage.setItem('cartId', cartId);
        }

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Si el carrito no se encuentra, creamos uno nuevo
                localStorage.removeItem('cartId');
                return addToCart(productId);
            }
            throw new Error('Error al agregar producto al Cart');
        }

        const data = await response.json();

        if (data.status === 'success') {
            updateCartCount(1);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true,
            }).showToast();
        } else {
            throw new Error(data.message || 'Error al agregar producto al Cart');
        }
    } catch (error) {
        Toastify({
            text: "Error al agregar el producto al carrito",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true,
        }).showToast();
    }
}

function updateCartCount(increment) {
    cartCount += increment;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

async function getInitialCartCount() {
    try {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
            updateCartCount(0);
            return;
        }

        const response = await fetch(`/api/carts/${cartId}`);
        if (response.ok) {
            const cart = await response.json();
            if (cart.payload?.products) {
                cartCount = cart.payload.products.reduce((total, product) => total + product.quantity, 0);
                updateCartCount(0);
            }
        }
    } catch (error) {
        console.error('Error al obtener el conteo inicial del carrito:', error);
    }
}

const loadCategories = async () => {
    try {
        const response = await fetch('/api/products/categories', { method: 'GET' });
        const categories = await response.json();

        categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
};

const loadProductsList = async (page = 1, sort = "", category = "", status = "", priceOrder = "") => {
    try {
        const queryParams = new URLSearchParams({
            limit: 10,
            page,
            sort,
            category,
            status,
            priceOrder
        });

        const response = await fetch(`/api/products?${queryParams}`, { method: "GET" });
        const data = await response.json();
        const products = data.payload.docs ?? [];

        productsGrid.innerHTML = "";

        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h4>${product.title}</h4>
                <p>ID: ${product.id}</p>
                <p>Categoría: ${product.category}</p>
                <p>Precio: $${product.price}</p>
                <p>Stock: ${product.stock}</p>
                <p>Estado: ${product.status ? 'Activo' : 'Inactivo'}</p>
                <button onclick="addToCart('${product.id}')">Agregar al Carrito</button>
            `;
            productsGrid.appendChild(productCard);
        });

        currentPage = data.payload.page;
        totalPages = data.payload.totalPages;
        currentPageSpan.textContent = `Página ${currentPage} de ${totalPages}`;

        btnPrevPage.disabled = currentPage === 1;
        btnNextPage.disabled = currentPage === totalPages;
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

function updateProductsList() {
    loadProductsList(currentPage, currentSort, currentCategory, currentStatus, currentPriceOrder);
}

btnPrevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        updateProductsList();
    }
});

btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        updateProductsList();
    }
});

sortSelect.addEventListener("change", (event) => {
    currentSort = event.target.value;
    currentPage = 1;
    updateProductsList();
});

categorySelect.addEventListener("change", (event) => {
    currentCategory = event.target.value;
    currentPage = 1;
    updateProductsList();
});

statusSelect.addEventListener("change", (event) => {
    currentStatus = event.target.value;
    currentPage = 1;
    updateProductsList();
});

priceOrderSelect.addEventListener("change", (event) => {
    currentPriceOrder = event.target.value;
    currentPage = 1;
    updateProductsList();
});

document.addEventListener('DOMContentLoaded', () => {
    getInitialCartCount();
    loadCategories();
    loadProductsList();
});