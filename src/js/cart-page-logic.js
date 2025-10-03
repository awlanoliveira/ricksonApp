document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const cartList = document.getElementById('cart-list');
    const subtotalAmountSpan = document.getElementById('subtotal-amount'); 
    const deliveryAmountSpan = document.getElementById('delivery-amount'); 
    const totalAmountSpan = document.getElementById('total-amount');
    const emptyMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('continue-button'); 

    // Configuração do WhatsApp e Taxa (Ajuste o NÚMERO e a TAXA)
    const STORE_WHATSAPP_NUMBER = '5586995602574'; // Seu número de telefone (Ex: 5511999998888)
    const DELIVERY_FEE = 5.00;

    // Auxiliares de formato
    function priceToNumber(priceString) {
        if (typeof priceString === 'number') return priceString;
        return parseFloat(priceString.toString().replace('R$', '').replace('.', '').replace(',', '.'));
    }
    
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 2. Função Principal de Renderização (Para exibir os dados e o total)
    function renderCart() {
        if (typeof window.getCart !== 'function') return; 
        
        const cart = window.getCart(); 
        cartList.innerHTML = '';
        let subtotal = 0;

        // Lógica de Vazio/Desabilitar Botão
        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            checkoutButton.disabled = true;
            subtotalAmountSpan.textContent = 'R$ 0,00';
            deliveryAmountSpan.textContent = '+ R$ 0,00';
            totalAmountSpan.textContent = 'R$ 0,00';
            return;
        }

        emptyMessage.style.display = 'none';
        checkoutButton.disabled = false;

        cart.forEach(item => {
            const itemPriceNum = priceToNumber(item.preco); 
            const itemTotal = itemPriceNum * item.quantidade;
            subtotal += itemTotal;

            // ESTA É A PARTE ONDE VOCÊ CRIA O HTML DO CARD (MANTIDA)
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item-card');
            
            const minusButtonHtml = item.quantidade === 1 ?
                `<button class="remove-btn" data-action="remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>` :
                `<button class="qty-btn-cloned minus" data-action="decrement" data-id="${item.id}"><i class="fas fa-minus"></i></button>`;

            itemDiv.innerHTML = `
                <img src="${item.imagem || 'https://via.placeholder.com/60x60?text=PROD'}" alt="${item.nome}" class="item-thumbnail">
                
                <div class="item-info">
                    <span class="item-name">${item.nome}</span>
                    <span class="item-price-unit">${formatCurrency(itemPriceNum)} un.</span>
                </div>

                <div class="item-controls">
                    ${minusButtonHtml}
                    <span class="item-qty-display">${item.quantidade}</span>
                    <button class="qty-btn-cloned plus" data-action="increment" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
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
    
    // 3. FINALIZAR PEDIDO (FUNÇÃO CRÍTICA)
    checkoutButton.addEventListener('click', () => {
        const cart = window.getCart();
        
        if (cart.length === 0) {
            alert("Carrinho vazio! Adicione itens antes de finalizar.");
            return;
        }

        // --- CONSTRUÇÃO DA MENSAGEM FORMATADA PARA O WHATSAPP ---
        
        let message = "🛒 *NOVO PEDIDO - RICKSON SUPLEMENTOS*\n\n";
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemPriceNum = priceToNumber(item.preco);
            const itemTotal = itemPriceNum * item.quantidade;
            subtotal += itemTotal;
            
            // Item: 1. 2x Whey Pro Max (R$ 279,80)
            message += `${index + 1}. ${item.quantidade}x ${item.nome} (${formatCurrency(itemPriceNum)} un.)\n`;
        });
        
        const totalValue = subtotal + DELIVERY_FEE;
        
        message += "\n--------------------------------------\n";
        message += `Subtotal: ${formatCurrency(subtotal)}\n`;
        message += `Entrega: ${formatCurrency(DELIVERY_FEE)}\n`;
        message += `*TOTAL GERAL: ${formatCurrency(totalValue)}*\n`;
        message += "--------------------------------------\n";
        message += "\nOlá, por favor, confirme os detalhes de entrega e pagamento. Obrigado!";

        // Codifica a mensagem para ser segura na URL
        const encodedMessage = encodeURIComponent(message);
        
        // Constrói a URL final do WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodedMessage}`;

        // 4. Limpa o carrinho e redireciona (a ação final)
        window.clearCart(); 
        window.open(whatsappUrl, '_blank'); // Abre em nova aba

        // Feedback
        alert("✅ Pedido enviado! Verifique o WhatsApp para finalizar a compra.");
        renderCart(); 
    });

    // 5. Gerenciamento de Eventos (Botões de + / - / Lixeira)
    cartList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const productId = target.getAttribute('data-id');
        
        if (!productId || !action || typeof window.updateItemQuantity !== 'function') return;

        const currentCart = window.getCart();
        const currentItem = currentCart.find(item => item.id === productId);

        if (!currentItem) return;

        let newQty = currentItem.quantidade;

        if (action === 'increment') {
            newQty++;
            window.updateItemQuantity(productId, newQty);
        } else if (action === 'decrement') {
            newQty--;
            window.updateItemQuantity(productId, newQty); 
        } else if (action === 'remove') {
            window.removeFromCart(productId);
        }
        
        renderCart(); 
    });

    // Chamada inicial
    renderCart(); 
    window.addEventListener('storage', renderCart);
});
