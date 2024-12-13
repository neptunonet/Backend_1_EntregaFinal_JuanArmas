const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
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
        const queryParams = new URLSearchParams();
        queryParams.append('limit', 10);
        queryParams.append('page', page);

        if (sort) queryParams.append('sort', sort);
        if (category) queryParams.append('category', category);
        if (status) queryParams.append('status', status);
        if (priceOrder) queryParams.append('priceOrder', priceOrder);

        const response = await fetch(`/api/products?${queryParams}`, { method: "GET" });
        const data = await response.json();
        const products = data.payload.docs ?? [];

        // Limpiar la grilla antes de agregar nuevos productos
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


async function addToCart(productId) {
    try {
        // Get the current cart ID from localStorage or create a new one
        let cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            // If no cart exists, create a new one
            const createCartResponse = await fetch('/api/carts', { method: 'POST' });
            const createCartData = await createCartResponse.json();
            cartId = createCartData.payload._id;
            localStorage.setItem('cartId', cartId);
        }

        // Make a POST request to add the product to the cart
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const data = await response.json();

        if (data.status === 'success') {
            console.log('Product added to cart successfully:', productId);
            alert('Product added to cart successfully!');
        } else {
            throw new Error(data.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
}
btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList(currentPage, currentSort, currentCategory, currentStatus, currentPriceOrder);
});

btnPrevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        loadProductsList(currentPage - 1, currentSort, currentCategory, currentStatus, currentPriceOrder);
    }
});

btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
        loadProductsList(currentPage + 1, currentSort, currentCategory, currentStatus, currentPriceOrder);
    }
});

sortSelect.addEventListener("change", (event) => {
    currentSort = event.target.value;
    loadProductsList(1, currentSort, currentCategory, currentStatus, currentPriceOrder);
});

categorySelect.addEventListener("change", (event) => {
    currentCategory = event.target.value;
    currentPage = 1;
    loadProductsList(currentPage, currentSort, currentCategory, currentStatus, currentPriceOrder);
  });

statusSelect.addEventListener("change", (event) => {
    currentStatus = event.target.value;
    loadProductsList(1, currentSort, currentCategory, currentStatus, currentPriceOrder);
});

priceOrderSelect.addEventListener("change", (event) => {
    currentPriceOrder = event.target.value;
    loadProductsList(1, currentSort, currentCategory, currentStatus, currentPriceOrder);
});

// Cargar categorías y lista de productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProductsList();
});