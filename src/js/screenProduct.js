document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção dos elementos do contador
    const minusBtn = document.getElementById('minus-qty');
    const plusBtn = document.getElementById('plus-qty');
    const currentQtySpan = document.getElementById('current-qty');
    const addToCartBtn = document.getElementById('btn-add-to-cart');
    let currentQuantity = 1; // Começa sempre em 1

    function updateQuantity(newQuantity) {
        // Garante que a quantidade nunca seja menor que 1
        if (newQuantity >= 1) {
            currentQuantity = newQuantity;
            currentQtySpan.textContent = currentQuantity;
        }
    }

    // 2. Event Listeners para os botões
    
    // Botão de Diminuir (-)
    minusBtn.addEventListener('click', () => {
        updateQuantity(currentQuantity - 1);
    });

    // Botão de Aumentar (+)
    plusBtn.addEventListener('click', () => {
        updateQuantity(currentQuantity + 1);
    });
    
    // 3. Lógica do Botão Adicionar à Sacola (Simulação)
    addToCartBtn.addEventListener('click', () => {
        alert(`SUCESSO! Adicionado ${currentQuantity}x Whey Pro Max Duplo à sacola.`);
        
        // Em um projeto real, você enviaria esta informação para um Array de carrinho
        // ou para o Local Storage aqui.
        console.log(`Produto: Whey Pro Max Duplo, Quantidade: ${currentQuantity}`);
    });
});