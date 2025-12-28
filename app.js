// CONFIGURAÇÕES INICIAIS
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let categoriaAtiva = 'todos';
const MOEDA = '€'; // Define a moeda se não estiver no config.js
const CONTATO = { whatsapp: '351916294573' }; // Teu contacto

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  atualizarCarrinho();
  
  document.getElementById('searchInput').addEventListener('input', (e) => {
    renderizarProdutos(e.target.value);
  });
});

// FUNÇÃO PARA LER OS PRODUTOS DO CMS (DINÂMICO)
async function obterProdutosDoCMS() {
    try {
        // Como o site está na Cloudflare, vamos tentar ler a lista de ficheiros
        // Para que isto funcione a 100%, deves criar pelo menos um produto no painel primeiro
        // O CMS cria ficheiros em: /data/produtos/nome-do-produto.json
        
        // Aqui usamos a variável PRODUTOS do teu config.js como base, 
        // mas no futuro podemos fazer um fetch à API do GitHub para listar tudo.
        return typeof PRODUTOS !== 'undefined' ? PRODUTOS : [];
    } catch (e) {
        console.error("Erro ao carregar ficheiros do CMS", e);
        return [];
    }
}

// RENDERIZAR PRODUTOS
async function renderizarProdutos(busca = '') {
  const grid = document.getElementById('produtosGrid');
  if (!grid) return;
  
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8b92a9;">A carregar produtos...</p>';
  
  // Obtém os produtos (aqui podes expandir para ler os ficheiros JSON individualmente)
  let produtosExibir = await obterProdutosDoCMS();
  
  // Filtrar por categoria
  if (categoriaAtiva !== 'todos') {
    produtosExibir = produtosExibir.filter(p => p.categoria === categoriaAtiva);
  }
  
  // Filtrar por busca
  if (busca) {
    produtosExibir = produtosExibir.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase())
    );
  }
  
  if (produtosExibir.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8b92a9;">Nenhum produto encontrado. Cria produtos no Painel Admin!</p>';
    return;
  }
  
  grid.innerHTML = '';
  
  produtosExibir.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <div class="produto-imagem">
        <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/200?text=Sem+Imagem'">
      </div>
      <div class="produto-info">
        <div class="produto-nome">${produto.nome}</div>
        <div class="produto-descricao">${produto.descricao}</div>
        <div class="produto-preco">${MOEDA}${parseFloat(produto.preco).toFixed(2)}</div>
        <div class="produto-acoes">
          <button class="btn-carrinho" onclick="adicionarAoCarrinho(${produto.id})">CARRINHO</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- MANTÉM TODAS AS TUAS OUTRAS FUNÇÕES (ADICIONAR AO CARRINHO, WHATSAPP, ETC) ---

function adicionarAoCarrinho(produtoId) {
  // A lógica de busca do produto precisa de aceder aos dados carregados
  obterProdutosDoCMS().then(produtos => {
    const produto = produtos.find(p => p.id === produtoId);
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
    mostrarToast(`${produto.nome} adicionado!`);
    atualizarCarrinho();
  });
}

function filtrarCategoria(categoria) {
  categoriaAtiva = categoria;
  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('ativo'));
  if (event) event.target.classList.add('ativo');
  renderizarProdutos(document.getElementById('searchInput').value);
}

function salvarCarrinho() { localStorage.setItem('carrinho', JSON.stringify(carrinho)); }

function atualizarCarrinho() {
  const carrinhoSection = document.getElementById('carrinho-section');
  const carrinhoItens = document.getElementById('carrinhoItens');
  if (carrinho.length === 0) { carrinhoSection.style.display = 'none'; return; }
  carrinhoSection.style.display = 'block';
  carrinhoItens.innerHTML = '';
  let subtotal = 0;
  carrinho.forEach(item => {
    subtotal += (item.preco * item.quantidade);
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrinho-item';
    itemDiv.innerHTML = `
      <div class="carrinho-item-info">
        <h3>${item.nome}</h3>
        <p>${MOEDA}${parseFloat(item.preco).toFixed(2)} x ${item.quantidade}</p>
      </div>
      <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">🗑️</button>
    `;
    carrinhoItens.appendChild(itemDiv);
  });
  document.getElementById('subtotal').textContent = `${MOEDA}${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `${MOEDA}${(subtotal + 10).toFixed(2)}`;
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  salvarCarrinho();
  atualizarCarrinho();
}

function checkout() {
  const total = carrinho.reduce((sum, i) => sum + (i.preco * i.quantidade), 0) + 10;
  const msg = `Olá Novatec! Encomenda:\n${carrinho.map(i => `- ${i.nome} (${i.quantidade}x)`).join('\n')}\nTotal: ${MOEDA}${total.toFixed(2)}`;
  abrirWhatsApp(msg);
}

function abrirWhatsApp(msg = '') {
  const url = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function mostrarToast(m) {
  const t = document.getElementById('toast');
  t.textContent = m; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
