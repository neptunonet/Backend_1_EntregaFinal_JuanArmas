// const productsList = document.getElementById("products-list");
// const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");

// const loadProductsList = async () => {
//     const response = await fetch("/api/products", { method: "GET" });
//     const data = await response.json();
//     const products = data.payload.docs ?? [];

//     productsList.innerText = "";

//     products.forEach((product) => {
//         productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
//     });
// };

// btnRefreshProductsList.addEventListener("click", () => {
//     loadProductsList();
//     console.log("¡Lista recargada!");
// });

// // Se ejecuta para cargar la lista de productes al ingresar o refrescar
// loadProductsList();
const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const btnPrevPage = document.getElementById("btn-prev-page");
const btnNextPage = document.getElementById("btn-next-page");
const currentPageSpan = document.getElementById("current-page");
const sortSelect = document.getElementById("sort-select");

let currentPage = 1;
let totalPages = 1;
let currentSort = "";

// const loadProductsList = async (page = 1, sort = "") => {
//     try {
//         const response = await fetch(`/api/products?limit=10&page=${page}&sort=${sort}`, { method: "GET" });
//         const data = await response.json();
//         const products = data.payload.docs ?? [];
//         totalPages = data.payload.totalPages;

//         // Limpiar la lista de productos antes de agregar los nuevos
//         productsList.innerHTML = "";

//         products.forEach((product) => {
//             const li = document.createElement('li');
//             li.textContent = `Id: ${product.id} - Nombre: ${product.title}`;
//             productsList.appendChild(li);
//         });

//         currentPageSpan.textContent = `Página ${page} de ${totalPages}`;
//         btnPrevPage.disabled = page <= 1;
//         btnNextPage.disabled = page >= totalPages;
//     } catch (error) {
//         console.error("Error al cargar los productos:", error);
//     }
// };

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

        // ... (resto del código)
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};


btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList(currentPage, currentSort);
});

btnPrevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadProductsList(currentPage, currentSort);
    }
});

btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadProductsList(currentPage, currentSort);
    }
});

sortSelect.addEventListener("change", (event) => {
    currentSort = event.target.value;
    currentPage = 1; // Reset to first page when changing sort
    loadProductsList(currentPage, currentSort);
});

// Se ejecuta para cargar la lista de productos al ingresar o refrescar
loadProductsList();