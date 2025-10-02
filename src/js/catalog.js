document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.category-tab');
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.querySelector('.section-title');

    // Função principal de filtragem
    function filterProducts(category) {
        // 1. Atualiza o título da seção
        const newTitle = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        sectionTitle.textContent = newTitle;

        // 2. Filtra os cards de produto
        productCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category').split(' ');

            if (category === 'lancamentos') {
                // Para 'Lançamentos', mostramos todos os cards que têm a categoria 'lancamentos'
                if (cardCategories.includes('lancamentos')) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            } else if (category === 'todos') {
                // Caso queiramos uma aba 'Todos', mostramos tudo
                card.style.display = 'flex';
            } else {
                // Para outras categorias, verificamos se a categoria está inclusa
                if (cardCategories.includes(category)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // Event Listener para os cliques nas abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Desativa a aba anterior
            tabs.forEach(t => t.classList.remove('active'));
            
            // 2. Ativa a aba clicada
            tab.classList.add('active');
            
            // 3. Obtém a categoria e filtra
            const category = tab.getAttribute('data-category');
            filterProducts(category);

            // Opcional: Rolagem suave para o topo da lista
            document.querySelector('.products-list-container').scrollTop = 0;
        });
    });

    // Filtra para a categoria 'lancamentos' quando a página carrega
    filterProducts('lancamentos');
});