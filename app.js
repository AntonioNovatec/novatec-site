// APP.JS - NOVATEC.PC.SOLUTION
// Lógica da aplicação

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let categoriaAtiva = 'todos';

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  atualizarCarrinho();
  
  // Busca em tempo real
  document.getElementById('searchInput').addEventListener('input', (e) => {
    renderizarProdutos(e.target.value);
  });
});

// RENDERIZAR PRODUTOS
function renderizarProdutos(busca = '') {
  const grid = document.getElementById('produtosGrid');
  grid.innerHTML = '';
  
  let produtosFiltrados = PRODUTOS;
  
  // Filtrar por categoria
  if (categoriaAtiva !== 'todos') {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaAtiva);
  }
  
  // Filtrar por busca
  if (busca) {
    produtosFiltrados = produtosFiltrados.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase())
    );
  }
  
  if (produtosFiltrados.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8b92a9;">Nenhum produto encontrado</p>';
    return;
  }
  
  produtosFiltrados.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <div class="produto-imagem">
        <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1f3a%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%238b92a9%22%3E${produto.nome}%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="produto-info">
        <div class="produto-nome">${produto.nome}</div>
        <div class="produto-descricao">${produto.descricao}</div>
        <div class="produto-preco">${MOEDA}${produto.preco.toFixed(2)}</div>
        <div class="produto-acoes">
          <button class="btn-carrinho" onclick="adicionarAoCarrinho(${produto.id})">CARRINHO</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// FILTRAR CATEGORIA
function filtrarCategoria(categoria) {
  categoriaAtiva = categoria;
  
  // Atualizar botões ativos
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('ativo');
  });
  event.target.classList.add('ativo');
  
  renderizarProdutos(document.getElementById('searchInput').value);
}

// ADICIONAR AO CARRINHO
function adicionarAoCarrinho(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;
  
  const itemExistente = carrinho.find(item => item.id === produtoId);
  
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1
    });
  }
  
  salvarCarrinho();
  mostrarToast(`${produto.nome} adicionado ao carrinho!`);
  atualizarCarrinho();
}

// REMOVER DO CARRINHO
function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter(item => item.id !== produtoId);
  salvarCarrinho();
  atualizarCarrinho();
  mostrarToast('Produto removido do carrinho');
}

// ATUALIZAR QUANTIDADE
function atualizarQuantidade(produtoId, novaQuantidade) {
  const item = carrinho.find(i => i.id === produtoId);
  if (item) {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      item.quantidade = parseInt(novaQuantidade);
      salvarCarrinho();
      atualizarCarrinho();
    }
  }
}

// ATUALIZAR EXIBIÇÃO DO CARRINHO
function atualizarCarrinho() {
  const carrinhoSection = document.getElementById('carrinho-section');
  const carrinhoItens = document.getElementById('carrinhoItens');
  
  if (carrinho.length === 0) {
    carrinhoSection.style.display = 'none';
    carrinhoItens.innerHTML = '';
    return;
  }
  
  carrinhoSection.style.display = 'block';
  carrinhoItens.innerHTML = '';
  
  let subtotal = 0;
  
  carrinho.forEach(item => {
    const total = item.preco * item.quantidade;
    subtotal += total;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrinho-item';
    itemDiv.innerHTML = `
      <div class="carrinho-item-imagem">
        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%231a1f3a%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
      </div>
      <div class="carrinho-item-info">
        <h3>${item.nome}</h3>
        <p>${MOEDA}${item.preco.toFixed(2)} x ${item.quantidade}</p>
      </div>
      <div class="carrinho-item-acoes">
        <input type="number" min="1" value="${item.quantidade}" class="quantidade-input" onchange="atualizarQuantidade(${item.id}, this.value)">
        <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">🗑️</button>
      </div>
    `;
    carrinhoItens.appendChild(itemDiv);
  });
  
  const envio = 10;
  const total = subtotal + envio;
  
  document.getElementById('subtotal').textContent = `${MOEDA}${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `${MOEDA}${total.toFixed(2)}`;
}

// SALVAR CARRINHO NO LOCALSTORAGE
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// CHECKOUT
function checkout() {
  if (carrinho.length === 0) {
    mostrarToast('Carrinho vazio!', true);
    return;
  }
  
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0) + 10;
  const mensagem = `Olá! Gostaria de comprar os seguintes produtos:\n\n${carrinho.map(item => `- ${item.nome} (${item.quantidade}x ${MOEDA}${item.preco.toFixed(2)})`).join('\n')}\n\nTotal: ${MOEDA}${total.toFixed(2)}`;
  
  abrirWhatsApp(mensagem);
}

// VOLTAR À LOJA
function voltarLoja() {
  document.getElementById('carrinho-section').style.display = 'none';
  document.getElementById('loja').scrollIntoView({ behavior: 'smooth' });
}

// ABRIR WHATSAPP
function abrirWhatsApp(mensagem = '') {
  const msg = mensagem || 'Olá! Gostaria de mais informações sobre os vossos serviços.';
  const url = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// SCROLL PARA CONTATO
function scrollToContato() {
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
}

// MOSTRAR NOTIFICAÇÃO
function mostrarToast(mensagem, erro = false) {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('show');
  if (erro) toast.classList.add('erro');
  
  setTimeout(() => {
    toast.classList.remove('show', 'erro');
  }, 3000);
}
