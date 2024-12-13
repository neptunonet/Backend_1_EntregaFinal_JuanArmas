function emptyCart(cartId) {
    if (confirm('¿Estás seguro de que quieres vaciar este carrito?')) {
        fetch(`/api/carts/${cartId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Carrito vaciado con éxito');
                    location.reload();
                } else {
                    alert('Error al vaciar el carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al vaciar el carrito');
            });
    }
}