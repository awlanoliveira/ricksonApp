// src/js/product-loader.js

document.addEventListener('DOMContentLoaded', () => {
    // A. Função para obter o ID do produto na URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Pega o valor do 'id' (ex: 'whey101')
    
    // Se não houver ID, podemos mostrar uma mensagem de erro ou redirecionar
    if (!productId || !productDatabase[productId]) {
        console.error("Produto não encontrado ou ID ausente.");
        // Opcional: Redirecionar para o catálogo
        // window.location.href = 'catalogo.html'; 
        return;
    }
    
    // B. Carregar os dados do produto
    const produto = productDatabase[productId];

    // C. Mapear e preencher os elementos do HTML
    
    // Cabeçalho e Títulos

    
    document.title = produto.nome + " | Rickson Suplementos";
    document.querySelector('.product-title').textContent = produto.nome;
    document.querySelector('.detail-price').textContent = produto.preco;
    
    // Imagem
    document.querySelector('.detail-product-image').src = produto.imagem;
    document.querySelector('.detail-product-image').alt = produto.nome;

    // Seção Sobre
    document.querySelector('.section-text').textContent = produto.sobre;
    
    // Seção Ingredientes (Lógica OTIMIZADA para Esconder/Mostrar)
const ingredientsSection = document.getElementById('ingredients-section');
const ingredientsList = document.querySelector('.ingredients-list');

// Verifica se a lista de ingredientes existe no banco de dados E tem itens
if (produto.ingredientes && produto.ingredientes.length > 0) {
    // Produto TEM ingredientes: preenche e garante visibilidade
    ingredientsSection.style.display = 'block'; 
    ingredientsList.innerHTML = ''; 

    produto.ingredientes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ingredientsList.appendChild(li);
    });
} else {
    // Produto NÃO TEM ingredientes (acessório, etc.): esconde a seção
    // Você precisa ter o ID "ingredients-section" no seu HTML (<section id="ingredients-section">)
    ingredientsSection.style.display = 'none';
}

    // D. Iniciar o contador (do seu product-detail.js)
    // Se a lógica do contador estiver separada, certifique-se de que ela é chamada aqui,
    // ou combine os dois arquivos JS em um só. (O recomendado é combinar)

});