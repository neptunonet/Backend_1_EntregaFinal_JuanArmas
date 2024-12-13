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
        const response = await fetch('/api/categories', { method: 'GET' });
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
            `;
            productsGrid.appendChild(productCard);
        });

        // Actualizar la información de paginación
        currentPage = data.payload.page;
        totalPages = data.payload.totalPages;
        currentPageSpan.textContent = `Página ${currentPage} de ${totalPages}`;

        // Habilitar o deshabilitar botones de paginación
        btnPrevPage.disabled = currentPage === 1;
        btnNextPage.disabled = currentPage === totalPages;
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

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