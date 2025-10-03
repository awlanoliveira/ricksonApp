// src/js/screenProduct.js

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // AUXILIARES
    // ----------------------------------------------------
    function priceToNumber(priceString) {
        // Converte string (R$ 79,90) para número (79.90)
        return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.'));
    }

    // Função para obter dados diretamente do DOM, como contingência
    const getProductDataFromDOM = () => {
        // Assume que os IDs e classes estão corretos no HTML do produto.
        const id = new URLSearchParams(window.location.search).get('id') || 'produto-sem-id';
        const nome = document.querySelector('.product-title')?.textContent || 'Produto Desconhecido';
        const precoElement = document.querySelector('.detail-price');
        
        return {
            id: id,
            nome: nome,
            // Pega o texto do preço e converte para número imediatamente
            preco: priceToNumber(precoElement?.textContent || 'R$ 0,00'), 
            // Você precisará definir a URL da imagem aqui
            imagem: document.querySelector('.detail-product-image')?.src || 'placeholder.jpg' 
        };
    };

    // ----------------------------------------------------
    // LÓGICA PRINCIPAL
    // ----------------------------------------------------
    
    const btnAddToCart = document.getElementById('btn-add-to-cart'); // Botão Adicionar à Sacola
    const qtyInput = document.getElementById('current-qty'); // Onde está o número (1)
    const qtyPlus = document.getElementById('plus-qty');
    const qtyMinus = document.getElementById('minus-qty');
    
    // 1. Lógica do Contador
    if (qtyPlus && qtyMinus && qtyInput) {
        let currentQuantity = parseInt(qtyInput.textContent) || 1; 

        const updateQuantity = (newQuantity) => {
            if (newQuantity >= 1) {
                currentQuantity = newQuantity;
                qtyInput.textContent = currentQuantity;
            }
        };

        qtyPlus.addEventListener('click', () => updateQuantity(currentQuantity + 1));
        qtyMinus.addEventListener('click', () => updateQuantity(currentQuantity - 1));
    }


    // 2. Lógica de Adicionar ao Carrinho
    if (btnAddToCart && typeof window.addToCart === 'function') {
        btnAddToCart.addEventListener('click', () => {
            const productData = getProductDataFromDOM();
            const quantityToAdd = parseInt(qtyInput.textContent) || 1;
            
            // Verifica se o preço é um número válido (para evitar erros de cálculo)
            if (isNaN(productData.preco) || productData.preco <= 0) {
                alert("ERRO: Preço inválido! O item não pode ser adicionado.");
                console.error("Erro no preço:", productData.preco);
                return;
            }

            // A variável 'productData.preco' JÁ É UM NÚMERO
            window.addToCart(productData, quantityToAdd);

            // 3. Atualiza o contador de itens na sacola (se a função existir)
            if (typeof window.updateCartBadge === 'function') {
                window.updateCartBadge();
            }

            alert(`✅ SUCESSO! Adicionado ${quantityToAdd}x ${productData.nome} à sacola.`);
        });
    } else {
        console.warn("Botão 'Adicionar à Sacola' ou função 'addToCart' não encontrado. Verifique seu HTML e o cart-module.js.");
    }
});