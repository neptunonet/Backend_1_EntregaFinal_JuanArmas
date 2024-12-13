const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const btnPrevPage = document.getElementById("btn-prev-page");
const btnNextPage = document.getElementById("btn-next-page");
const currentPageSpan = document.getElementById("current-page");
const sortSelect = document.getElementById("sort-select");

let currentPage = 1;
let totalPages = 1;
let currentSort = "";

const loadProductsList = async (page = 1, sort = "") => {
    try {
        const response = await fetch(`/api/products?limit=10&page=${page}&sort=${sort}`, { method: "GET" });
        const data = await response.json();
        const products = data.payload.docs ?? [];

        // Limpiar la lista antes de agregar nuevos productos
        productsList.innerHTML = "";

        products.forEach((product) => {
            const li = document.createElement('li');
            li.textContent = `Id: ${product.id} - Nombre: ${product.title}`;
            productsList.appendChild(li);
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
    loadProductsList(currentPage, currentSort);
});

btnPrevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        loadProductsList(currentPage - 1, currentSort);
    }
});

btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
        loadProductsList(currentPage + 1, currentSort);
    }
});

sortSelect.addEventListener("change", (event) => {
    currentSort = event.target.value;
    loadProductsList(1, currentSort);
});

// Se ejecuta para cargar la lista de productos al ingresar o refrescar
loadProductsList();