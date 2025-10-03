// src/js/cart-module.js

const CART_STORAGE_KEY = 'rickson_suplementos_cart';

/** * Obtém o carrinho do localStorage. 
 * Garante que 'item.preco' seja uma string formatada (ex: 'R$ 139,90') para consistência.
 */
function getCart() {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/** * Salva o estado do carrinho e dispara um evento de atualização.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispara evento para atualizar o contador de sacola em outras abas/telas
    window.dispatchEvent(new Event('storage')); 
}

/** * Adiciona um produto ao carrinho.
 */
function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantidade += quantity;
    } else {
        // Garantindo que a unidade de preço seja uma string (R$ XX,XX)
        cart.push({ ...product, quantidade: quantity });
    }

    saveCart(cart);
}

/** * Remove um item completamente.
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

/** * Atualiza a quantidade ou remove o item se a nova quantidade for <= 0.
 */
function updateItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantidade = newQuantity;
        saveCart(cart);
    }
}

/**
 * Limpa o carrinho após a finalização do pedido.
 */
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
}


// Exporta funções para acesso global
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateItemQuantity = updateItemQuantity;
window.clearCart = clearCart;