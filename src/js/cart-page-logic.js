// src/js/cart-page-logic.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM (atualizados para as novas classes/IDs)
    const cartList = document.getElementById('cart-list');
    const subtotalAmountSpan = document.getElementById('subtotal-amount'); // Novo
    const deliveryAmountSpan = document.getElementById('delivery-amount'); // Novo
    const totalAmountSpan = document.getElementById('total-amount');
    const emptyMessage = document.getElementById('empty-cart-message');
    const continueButton = document.getElementById('continue-button'); // Renomeado

    const DELIVERY_FEE = 5.00; // Taxa de entrega fixa

    // Auxiliares de formato
    function priceToNumber(priceString) {
        if (typeof priceString === 'number') return priceString;
        return parseFloat(priceString.toString().replace('R$', '').replace('.', '').replace(',', '.'));
    }
    
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 2. Função Principal de Renderização
    function renderCart() {
        if (typeof window.getCart !== 'function') return; 
        
        const cart = window.getCart(); 
        cartList.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            continueButton.disabled = true;
            subtotalAmountSpan.textContent = 'R$ 0,00';
            deliveryAmountSpan.textContent = '+ R$ 0,00';
            totalAmountSpan.textContent = 'R$ 0,00';
            return;
        }

        emptyMessage.style.display = 'none';
        continueButton.disabled = false;

        cart.forEach(item => {
            const itemPriceNum = priceToNumber(item.preco); 
            const itemTotal = itemPriceNum * item.quantidade;
            subtotal += itemTotal;

            // Cria o card visual do item com as NOVAS CLASSES
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item-card-cloned');
            
            itemDiv.innerHTML = `
                <div class="item-thumb-name-cloned">
                    <img src="${item.imagem || 'https://via.placeholder.com/70x70?text=PROD'}" alt="${item.nome}" class="item-image-cloned">
                    <span class="item-name-cloned">${item.nome}</span>
                </div>
                
                <span class="item-price-cloned">${formatCurrency(itemPriceNum * item.quantidade)}</span> <div class="item-controls-actions-cloned">
                    <div class="qty-control-box-cloned">
                        <button class="qty-btn-cloned" data-action="decrement" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display-cloned">${item.quantidade}</span>
                        <button class="qty-btn-cloned" data-action="increment" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item-x-cloned" data-action="remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            cartList.appendChild(itemDiv);
        });

        const totalWithDelivery = subtotal + DELIVERY_FEE;

        // Atualiza os totais
        subtotalAmountSpan.textContent = formatCurrency(subtotal);
        deliveryAmountSpan.textContent = `+ ${formatCurrency(DELIVERY_FEE)}`;
        totalAmountSpan.textContent = formatCurrency(totalWithDelivery);
    }
    
    // 3. Gerenciamento de Eventos (Interação dos Botões)
    cartList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const productId = target.getAttribute('data-id');
        
        if (!productId || !action || !window.updateItemQuantity) return;

        const currentCart = window.getCart();
        const currentItem = currentCart.find(item => item.id === productId);
        let newQty = currentItem ? currentItem.quantidade : 0;

        if (action === 'increment') {
            newQty++;
            window.updateItemQuantity(productId, newQty);
        } else if (action === 'decrement') {
            newQty--;
            window.updateItemQuantity(productId, newQty); 
        } else if (action === 'remove') {
            window.removeFromCart(productId);
        }
        
        renderCart(); // Recarrega a lista após a mudança
    });

    // 4. Botão "Continuar" (Renomeado)
    continueButton.addEventListener('click', () => {
        if (window.getCart().length > 0) {
            alert(`✅ Pedido Confirmado! Total: ${totalAmountSpan.textContent}. Prosseguindo para o pagamento...`);
            // Aqui você adicionaria a lógica para a próxima etapa (Ex: redirecionar)
            // window.location.href = 'pagina-pagamento.html'; 
            window.clearCart(); // Limpa o carrinho após "finalizar"
            renderCart(); // Renderiza para mostrar o carrinho vazio
        }
    });

    // Chamada inicial
    renderCart(); 
    window.addEventListener('storage', renderCart);
});