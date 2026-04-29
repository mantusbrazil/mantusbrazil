// ============================================
// PÁGINA DE PRODUTO - LÓGICA
// ============================================

const STORAGE_CART_KEY = 'carrinho_camisas_venda';

// Elementos do DOM
const elementos = {
  erroProduto: document.getElementById('erro-produto'),
  conteudoProduto: document.getElementById('conteudo-produto'),
  imgPrincipal: document.getElementById('img-principal'),
  miniaturaContainer: document.getElementById('miniaturas-container'),
  produtoNome: document.getElementById('produto-nome'),
  produtoDescricao: document.getElementById('produto-descricao'),
  precoValor: document.getElementById('preco-valor'),
  statusBadge: document.getElementById('status-badge'),
  tamanhosContainer: document.getElementById('tamanhos-container'),
  tamanhoErro: document.getElementById('tamanho-erro'),
  customNome: document.getElementById('custom-nome'),
  customNumero: document.getElementById('custom-numero'),
  customizeCheckbox: document.getElementById('customize-checkbox'),
  personalizacaoFields: document.getElementById('personalizacao-fields'),
  btnComprar: document.getElementById('btn-comprar'),
  btnVoltar: document.getElementById('btn-voltar'),
  btnVerCarrinho: document.getElementById('btn-ver-carrinho'),
  drawerOverlay: document.getElementById('drawer-overlay'),
  btnCloseCart: document.getElementById('close-cart'),
  carrinhoDrawer: document.getElementById('carrinho'),
  listaCarrinho: document.getElementById('lista-carrinho'),
  totalPedido: document.getElementById('total-pedido'),
  cartSummaryText: document.getElementById('cart-summary-text'),
  btnFinalizar: document.getElementById('finalizar'),
  toastContainer: document.getElementById('toast-container')
};

const carrinho = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');

// Estado
let produtoAtual = null;
let tamanhoSelecionado = null;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalStock(estoque) {
  return Object.values(estoque).reduce((sum, value) => sum + value, 0);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  elementos.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
  }, 3000);

  setTimeout(() => {
    toast.remove();
  }, 3300);
}

// ============================================
// CARREGAR PRODUTO
// ============================================

function carregarProduto() {
  // Capturar ID da URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    exibirErro();
    return;
  }

  // Buscar produto
  const produto = PRODUTOS_DB.find(p => p.id === parseInt(id));

  if (!produto) {
    exibirErro();
    return;
  }

  produtoAtual = produto;
  preencherPagina();
}

function exibirErro() {
  elementos.conteudoProduto.style.display = 'none';
  elementos.erroProduto.style.display = 'block';
}

// ============================================
// PREENCHER PÁGINA
// ============================================

function preencherPagina() {
  const produto = produtoAtual;

  // Nome e descrição
  elementos.produtoNome.textContent = produto.nome;
  elementos.produtoDescricao.textContent = produto.descricao;

  // Preço
  elementos.precoValor.textContent = formatPrice(produto.preco);

  // Status (estoque)
  atualizarStatusBadge();

  // Galeria de imagens
  criarGaleria();

  // Tamanhos
  criarBotoesTamanho();
}

function getSizeStock(tamanho) {
  return produtoAtual.estoque[tamanho] || 0;
}

function isPrecoEncomenda() {
  const totalEstoque = getTotalStock(produtoAtual.estoque);
  return elementos.customizeCheckbox.checked || (tamanhoSelecionado && getSizeStock(tamanhoSelecionado) === 0) || totalEstoque === 0;
}

function atualizarStatusBadge() {
  const isEncomenda = isPrecoEncomenda();
  if (isEncomenda) {
    elementos.statusBadge.textContent = 'Sob encomenda';
    elementos.statusBadge.className = 'badge badge-preorder';
  } else {
    elementos.statusBadge.textContent = 'Em estoque';
    elementos.statusBadge.className = 'badge badge-estoque';
  }
}

// ============================================
// GALERIA DE IMAGENS
// ============================================

function criarGaleria() {
  const produto = produtoAtual;
  const imagens = produto.imagens || [produto.imagem];

  // Imagem principal
  if (imagens.length > 0) {
    elementos.imgPrincipal.src = imagens[0];
    elementos.imgPrincipal.alt = produto.nome;
  }

  // Miniaturas
  elementos.miniaturaContainer.innerHTML = '';
  imagens.forEach((imagem, index) => {
    const miniatura = document.createElement('div');
    miniatura.className = 'miniatura' + (index === 0 ? ' ativa' : '');
    miniatura.innerHTML = `<img src="${imagem}" alt="Imagem ${index + 1}">`;
    
    miniatura.addEventListener('click', () => {
      // Atualizar imagem principal
      elementos.imgPrincipal.src = imagem;
      
      // Atualizar miniatura ativa
      document.querySelectorAll('.miniatura').forEach(m => {
        m.classList.remove('ativa');
      });
      miniatura.classList.add('ativa');
    });

    elementos.miniaturaContainer.appendChild(miniatura);
  });
}

// ============================================
// SELEÇÃO DE TAMANHO
// ============================================

function criarBotoesTamanho() {
  const produto = produtoAtual;
  elementos.tamanhosContainer.innerHTML = '';

  produto.tamanhos.forEach(tamanho => {
    const stock = getSizeStock(tamanho);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-tamanho';
    btn.textContent = tamanho;
    btn.dataset.stock = stock;

    if (stock === 0) {
      btn.classList.add('btn-sob-encomenda');
      btn.title = 'Entrega sob encomenda';
    }

    btn.addEventListener('click', () => {
      // Desselecionar anterior
      document.querySelectorAll('.btn-tamanho').forEach(b => {
        b.classList.remove('selecionado');
      });
      
      btn.classList.add('selecionado');
      tamanhoSelecionado = tamanho;
      elementos.tamanhoErro.style.display = 'none';
      atualizarStatusBadge();
    });

    elementos.tamanhosContainer.appendChild(btn);
  });
}

// ============================================
// VALIDAÇÃO E COMPRA
// ============================================

function validarCompra() {
  if (!tamanhoSelecionado) {
    elementos.tamanhoErro.style.display = 'block';
    return false;
  }
  return true;
}

function adicionarAoCarrinho() {
  if (!validarCompra()) {
    showToast('Selecione um tamanho', 'error');
    return;
  }

  const nome = elementos.customNome.value.trim();
  const numero = elementos.customNumero.value.trim();
  const personalizacaoAtiva = elementos.customizeCheckbox.checked;

  const item = {
    id: produtoAtual.id,
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    tamanho: tamanhoSelecionado,
    personalizado: {
      ativa: personalizacaoAtiva,
      nome: nome || '',
      numero: numero || ''
    },
    imagem: produtoAtual.imagens?.[0] || ''
  };

  // Salvar no localStorage
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  carrinhoLocal.push(item);
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinhoLocal));

  renderCart();
  showToast('Produto adicionado ao carrinho!', 'success');

  // Limpar campos
  elementos.customNome.value = '';
  elementos.customNumero.value = '';
  elementos.customizeCheckbox.checked = false;
  elementos.personalizacaoFields.classList.add('hidden');
  tamanhoSelecionado = null;
  document.querySelectorAll('.btn-tamanho').forEach(b => {
    b.classList.remove('selecionado');
  });
  atualizarStatusBadge();
}

// ============================================
// CARRINHO E INTERAÇÃO
// ============================================

function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinho));
}

function renderCart() {
  elementos.listaCarrinho.innerHTML = '';

  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');

  if (carrinhoLocal.length === 0) {
    elementos.listaCarrinho.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Adicione uma camisa para começar o pedido.</div>';
    elementos.totalPedido.textContent = formatPrice(0);
    elementos.cartSummaryText.textContent = 'Nenhum item no carrinho';
    return;
  }

  let total = 0;
  carrinhoLocal.forEach((item, index) => {
    total += item.preco;
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item';
    itemCard.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <div class="cart-item-meta">
          <span>Tamanho: ${item.tamanho}</span>
          ${item.personalizado.ativa ? `<span>Personalizado</span>` : ''}
        </div>
        ${item.personalizado.ativa ? `<div class="cart-item-meta"><span>${item.personalizado.nome} #${item.personalizado.numero}</span></div>` : ''}
      </div>
    `;
    elementos.listaCarrinho.appendChild(itemCard);
  });

  elementos.totalPedido.textContent = formatPrice(total);
  elementos.cartSummaryText.textContent = `${carrinhoLocal.length} item${carrinhoLocal.length === 1 ? '' : 's'} no carrinho`;
}

function openCart() {
  elementos.carrinhoDrawer.classList.add('open');
  elementos.carrinhoDrawer.setAttribute('aria-hidden', 'false');
  elementos.drawerOverlay.classList.add('visible');
  renderCart();
}

function closeCart() {
  elementos.carrinhoDrawer.classList.remove('open');
  elementos.carrinhoDrawer.setAttribute('aria-hidden', 'true');
  elementos.drawerOverlay.classList.remove('visible');
}

function togglePersonalizacaoFields() {
  if (elementos.customizeCheckbox.checked) {
    elementos.personalizacaoFields.classList.remove('hidden');
  } else {
    elementos.personalizacaoFields.classList.add('hidden');
    elementos.customNome.value = '';
    elementos.customNumero.value = '';
  }
  atualizarStatusBadge();
}

function finalizarPedido() {
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  if (!carrinhoLocal.length) {
    showToast('Adicione itens ao carrinho antes de finalizar.', 'error');
    return;
  }
  const mensagem = encodeURIComponent(`Olá! Gostaria de fazer um pedido. Total: R$ ${formatPrice(carrinhoLocal.reduce((sum, item) => sum + item.preco, 0))}`);
  window.open(`https://wa.me/5513991827915?text=${mensagem}`, '_blank');
}

// ============================================
// EVENT LISTENERS
// ============================================

elementos.btnComprar.addEventListener('click', adicionarAoCarrinho);
elementos.btnVoltar.addEventListener('click', () => {
  window.location.href = 'index.html';
});
elementos.btnVerCarrinho.addEventListener('click', openCart);
elementos.btnCloseCart.addEventListener('click', closeCart);
elementos.drawerOverlay.addEventListener('click', closeCart);
elementos.customizeCheckbox.addEventListener('change', togglePersonalizacaoFields);
elementos.btnFinalizar.addEventListener('click', finalizarPedido);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeCart();
  }
});

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  carregarProduto();
  renderCart();
});
