async function updateQuantity(cartId, productId, currentQuantity, change) {
    try {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            return;  // No permitir cantidades menores a 1
        }

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la cantidad del producto');
        }

        const data = await response.json();

        if (data.status === 'success') {
            document.getElementById(`quantity-${cartId}-${productId}`).textContent = newQuantity;
        } else {
            throw new Error(data.message || 'Error al actualizar la cantidad del producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update product quantity. Please try again.');
    }
}

async function removeProduct(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
        }

        const data = await response.json();

        if (data.status === 'success') {
            location.reload();  // Recargar la página para reflejar los cambios
        } else {
            throw new Error(data.message || 'Error al eliminar el producto del carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to remove product from cart. Please try again.');
    }
}

async function emptyCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al vaciar el carrito');
        }

        const data = await response.json();

        if (data.status === 'success') {
            location.reload();  // Recargar la página para reflejar los cambios
        } else {
            throw new Error(data.message || 'Error al vaciar el carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to empty the cart. Please try again.');
    }
}