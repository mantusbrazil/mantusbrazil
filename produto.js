// ============================================
// PÁGINA DE PRODUTO - LÓGICA
// ============================================

const STORAGE_CART_KEY = 'carrinho_camisas_venda';
const STORAGE_COUPON_KEY = 'carrinho_cupom_venda';
const cupons = {
  "mantus10": 0.10
};
let activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';

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
  detalhesGrid: document.getElementById('detalhes-grid'),
  tabelaMedidasBody: document.getElementById('tabela-medidas-body'),
  descricaoCompleta: document.getElementById('descricao-completa'),
  caracteristicasGrid: document.getElementById('caracteristicas-grid'),
  tamanhoErro: document.getElementById('tamanho-erro'),
  customNome: document.getElementById('custom-nome'),
  customNumero: document.getElementById('custom-numero'),
  customizeCheckbox: document.getElementById('customize-checkbox'),
  personalizacaoFields: document.getElementById('personalizacao-fields'),
  btnComprar: document.getElementById('btn-comprar'),
  btnVoltar: document.getElementById('btn-voltar'),
  btnVerCarrinho: document.getElementById('btn-ver-carrinho'),
  badgeTotalItens: document.getElementById('badge-total-itens'),
  drawerOverlay: document.getElementById('drawer-overlay'),
  btnCloseCart: document.getElementById('close-cart'),
  carrinhoDrawer: document.getElementById('carrinho'),
  listaCarrinho: document.getElementById('lista-carrinho'),
  totalPedido: document.getElementById('total-pedido'),
  cartSummaryText: document.getElementById('cart-summary-text'),
  couponInput: document.getElementById('coupon-code'),
  btnApplyCoupon: document.getElementById('apply-coupon'),
  couponMessage: document.getElementById('coupon-message'),
  btnFinalizar: document.getElementById('finalizar'),
  toastContainer: document.getElementById('toast-container')
};

// Estado
let produtoAtual = null;
let tamanhoSelecionado = null;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

function atualizarResumoDoCarrinho() {
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  const totalItens = carrinhoLocal.reduce((sum, item) => sum + (item.quantidade || 1), 0);
  if (elementos.badgeTotalItens) elementos.badgeTotalItens.textContent = String(totalItens);
  if (elementos.cartSummaryText) {
    elementos.cartSummaryText.textContent = totalItens === 0 ? 'Nenhum item no carrinho' : `${totalItens} item${totalItens === 1 ? '' : 's'} no carrinho`;
  }
}

function extrairClube(nome) {
  const match = nome.match(/Camisa (?:do|da|de) ([A-Za-zÀ-ú ]+?)\s+(?:I|II)\b/);
  if (match) return match[1].trim();
  const fallback = nome.replace(/Camisa\s+(?:do|da|de)\s+/i, '').replace(/\s+I{1,2}\s+26\/27/i, '').trim();
  return fallback || 'Brasil';
}

function enriquecerProduto(produto) {
  return {
    ...produto,
    marca: produto.marca || 'Nike',
    clube: produto.clube || extrairClube(produto.nome),
    tipo: produto.tipo || 'Torcedor',
    temporada: produto.temporada || '26/27',
    material: produto.material || 'Poliéster leve',
    cor: produto.cor || 'Amarelo',
    escudo: produto.escudo || 'Bordado',
    origem: produto.origem || 'Importado'
  };
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

  produtoAtual = enriquecerProduto(produto);
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

  // Seções extras
  gerarDetalhesDoProduto();
  gerarTabelaMedidas();
  gerarDescricaoCompleta();
  gerarCaracteristicas();
}

function gerarDetalhesDoProduto() {
  const produto = produtoAtual;
  const detalhes = [
    { label: 'Marca', valor: produto.marca },
    { label: 'Clube/Seleção', valor: produto.clube },
    { label: 'Tipo', valor: produto.tipo },
    { label: 'Temporada', valor: produto.temporada },
    { label: 'Material', valor: produto.material },
    { label: 'Cor principal', valor: produto.cor },
    { label: 'Escudo', valor: produto.escudo },
    { label: 'Origem', valor: produto.origem }
  ];

  elementos.detalhesGrid.innerHTML = detalhes.map(item => `
    <div class="detalhes-item">
      <span class="detalhes-label">${item.label}</span>
      <span class="detalhes-valor">${item.valor}</span>
    </div>
  `).join('');
}

function gerarTabelaMedidas() {
  elementos.tabelaMedidasBody.innerHTML = `
    <tr><td>P</td><td>50cm</td><td>70cm</td></tr>
    <tr><td>M</td><td>52cm</td><td>72cm</td></tr>
    <tr><td>G</td><td>54cm</td><td>74cm</td></tr>
    <tr><td>GG</td><td>56cm</td><td>76cm</td></tr>
  `;
}

function gerarDescricaoCompleta() {
  const produto = produtoAtual;
  const descricaoBase = produto.descricao ? produto.descricao.replace(/\.*$/, '') : '';
  elementos.descricaoCompleta.textContent = `${descricaoBase}. A camisa ${produto.clube} ${produto.temporada} versão ${produto.tipo.toLowerCase()} combina conforto e estilo com tecido ${produto.material.toLowerCase()}, alta respirabilidade e acabamento premium para uso casual ou jogos.`;
}

function gerarCaracteristicas() {
  const itens = ['Tecido leve', 'Alta respirabilidade', 'Escudo premium', 'Ideal para uso casual'];
  elementos.caracteristicasGrid.innerHTML = itens.map(item => `
    <div class="caracteristica-item">
      <span class="caracteristica-icone">✓</span>
      <span>${item}</span>
    </div>
  `).join('');
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

function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}

function buildVariationPath(basePath, index) {
  // Append -N before extension: "img/nome.jpg" → "img/nome-2.jpg"
  return basePath.replace(/\.(\w+)$/, `-${index}.$1`);
}

function getBaseWithoutNumber(path) {
  // Remove trailing -NUMBER before extension: "img/brasil-2-2627-1.jpg" → "img/brasil-2-2627"
  // Also handles: "img/brasil-2-2627.jpg" → "img/brasil-2-2627" (no change if no -N suffix)
  const match = path.match(/^(.+?)(?:-\d+)?(\.\w+)$/);
  if (!match) return path;
  // Be careful: only strip if the last group before extension is -\d+
  // "img/x-1.jpg" → return "img/x" + ".jpg", then rebuild
  const basename = match[1];
  const ext = match[2];
  // But we need to know if the original had a -N suffix already
  const originalHadSuffix = path.match(/-\d+\.\w+$/);
  if (originalHadSuffix) {
    return path.replace(/-\d+(\.\w+)$/, '$1');
  }
  return path;
}

async function criarGaleria() {
  const produto = produtoAtual;

  // Get base images from data
  const imagensBase = Array.isArray(produto.imagens) && produto.imagens.length > 0
    ? produto.imagens
    : produto.imagem
      ? [produto.imagem]
      : [];

  const firstImage = imagensBase[0];
  if (!firstImage) return;

  const imagensDetectadas = [];

  // Step 1: Check if the first image path exists as-is
  let mainImage = firstImage;
  const firstExists = await checkImageExists(firstImage);
  if (!firstExists) {
    // Try with -1 suffix: "img/x.jpg" → "img/x-1.jpg"
    const with1 = firstImage.replace(/\.(\w+)$/, '-1.$1');
    if (await checkImageExists(with1)) mainImage = with1;
  }

  imagensDetectadas.push(mainImage);

  // Step 2: Determine the base name to search for variations
  // Get the part before any -\d+\.ext at the end
  const mainBase = mainImage.replace(/-\d+(\.\w+)$/, '$1');

  // Try variations 1 through 5 (skip the index we already have)
  for (let i = 1; i <= 5; i++) {
    const testPath = mainBase.replace(/\.(\w+)$/, `-${i}.$1`);
    if (testPath === mainImage) continue; // skip the one we already have
    if (await checkImageExists(testPath)) {
      imagensDetectadas.push(testPath);
    }
  }

  // Step 3: Add any extra images from the data that weren't detected
  for (const img of imagensBase) {
    if (!imagensDetectadas.includes(img) && await checkImageExists(img)) {
      imagensDetectadas.push(img);
    }
  }

  // Imagem principal
  elementos.imgPrincipal.src = imagensDetectadas[0];
  elementos.imgPrincipal.alt = produto.nome;

  // Miniaturas
  elementos.miniaturaContainer.innerHTML = '';
  imagensDetectadas.forEach((imagem, index) => {
    const miniatura = document.createElement('div');
    miniatura.className = 'miniatura' + (index === 0 ? ' ativa' : '');
    miniatura.innerHTML = `<img src="${imagem}" alt="Imagem ${index + 1}">`;
    
    miniatura.addEventListener('click', () => {
      elementos.imgPrincipal.src = imagem;
      
      document.querySelectorAll('.miniatura').forEach(m => {
        m.classList.remove('ativa');
      });
      miniatura.classList.add('ativa');
    });

    elementos.miniaturaContainer.appendChild(miniatura);
  });
  
  // Hide thumbnail container if only 1 image
  const thumbnailsWrapper = document.querySelector('.miniaturas');
  if (thumbnailsWrapper) {
    thumbnailsWrapper.style.display = imagensDetectadas.length <= 1 ? 'none' : '';
  }
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
    id: `${produtoAtual.id}-${Date.now()}`,
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    imagem: produtoAtual.imagens?.[0] || produtoAtual.imagem || '',
    tamanho: tamanhoSelecionado,
    quantidade: 1,
    personalizacao: {
      nome: personalizacaoAtiva ? nome : null,
      numero: personalizacaoAtiva ? numero : null
    }
  };

  // Salvar no localStorage
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  carrinhoLocal.push(item);
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinhoLocal));
  localStorage.setItem(STORAGE_COUPON_KEY, activeCouponCode);

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

function saveCartState() {
  localStorage.setItem(STORAGE_COUPON_KEY, activeCouponCode);
}

function removerItem(index) {
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  carrinhoLocal.splice(index, 1);
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinhoLocal));
  renderCart();
  showToast('Item removido do carrinho.', 'info');
}

function alterarQuantidade(index, delta) {
  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
  const item = carrinhoLocal[index];
  if (!item) return;

  const novaQuantidade = Math.max(1, (item.quantidade || 1) + delta);

  if (novaQuantidade === (item.quantidade || 1)) return; // Não mudou

  item.quantidade = novaQuantidade;

  if (novaQuantidade <= 0) {
    carrinhoLocal.splice(index, 1);
  }

  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinhoLocal));
  renderCart();
}

function getCoupon(code) {
  return cupons[code.toLowerCase()] || null;
}

function applyCoupon() {
  if (!elementos.couponInput) return;
  const code = elementos.couponInput.value.trim().toLowerCase();

  if (!code) {
    activeCouponCode = '';
    saveCartState();
    renderCart();
    showToast('Cupom removido.', 'success');
    return;
  }

  const desconto = getCoupon(code);
  if (!desconto) {
    showToast('Cupom inválido.', 'error');
    return;
  }

  activeCouponCode = code;
  saveCartState();
  renderCart();
  showToast(`Cupom "${code}" aplicado!`, 'success');
}

function renderCart() {
  elementos.listaCarrinho.innerHTML = '';

  const carrinhoLocal = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');

  const cartEmptyState = document.getElementById('cart-empty-state');
  if (carrinhoLocal.length === 0) {
    elementos.listaCarrinho.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Adicione uma camisa para começar o pedido.</div>';
    if (cartEmptyState) cartEmptyState.style.display = 'block';
    elementos.totalPedido.textContent = formatPrice(0);
    elementos.cartSummaryText.textContent = 'Nenhum item no carrinho';
    if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
    if (elementos.couponMessage) elementos.couponMessage.textContent = '';
    return;
  }
  if (cartEmptyState) cartEmptyState.style.display = 'none';

  let total = 0;
  carrinhoLocal.forEach((item, index) => {
    total += item.preco * (item.quantidade || 1);
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item';
    itemCard.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <div class="cart-item-meta">
          <span>Tamanho: ${item.tamanho}</span>
          ${item.personalizacao && (item.personalizacao.nome || item.personalizacao.numero) ? `<span>${item.personalizacao.nome || ''} ${item.personalizacao.numero ? '#' + item.personalizacao.numero : ''}</span>` : ''}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button type="button" class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
            <span class="quantity-display">${item.quantidade || 1}</span>
            <button type="button" class="quantity-btn" data-action="increase" data-index="${index}">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-index="${index}">Remover</button>
        </div>
      </div>
    `;
    const decreaseBtn = itemCard.querySelector('[data-action="decrease"]');
    const increaseBtn = itemCard.querySelector('[data-action="increase"]');
    const removeButton = itemCard.querySelector('.cart-item-remove');
    
    if (decreaseBtn) decreaseBtn.addEventListener('click', () => alterarQuantidade(index, -1));
    if (increaseBtn) increaseBtn.addEventListener('click', () => alterarQuantidade(index, 1));
    if (removeButton) removeButton.addEventListener('click', () => removerItem(index));
    
    elementos.listaCarrinho.appendChild(itemCard);
  });

  let discount = 0;
  let cupomMensagem = '';
  if (activeCouponCode) {
    const desconto = getCoupon(activeCouponCode);
    if (desconto) {
      discount = total * desconto;
      cupomMensagem = `Cupom ${activeCouponCode} aplicado: ${Math.round(desconto * 100)}% de desconto`;
    } else {
      cupomMensagem = 'Cupom inválido.';
    }
  }

  elementos.totalPedido.textContent = formatPrice(total - discount);
  atualizarResumoDoCarrinho();
  if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
  if (elementos.couponMessage) elementos.couponMessage.textContent = cupomMensagem;
}

function openCart() {
  elementos.carrinhoDrawer.classList.add('open');
  elementos.carrinhoDrawer.setAttribute('aria-hidden', 'false');
  elementos.drawerOverlay.classList.add('visible');
  renderCart();
}

function closeCart() {
  try {
    elementos.carrinhoDrawer.classList.remove('open');
    elementos.carrinhoDrawer.setAttribute('aria-hidden', 'true');
    elementos.drawerOverlay.classList.remove('visible');
    document.body.classList.remove('cart-open');
  } catch (error) {
    console.error('Erro ao fechar carrinho:', error);
  }
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
  
  const total = carrinhoLocal.reduce((sum, item) => sum + item.preco * (item.quantidade || 1), 0);
  const linhas = ['Olá! Quero fazer um pedido de camisas:', '-----------------------------'];

  carrinhoLocal.forEach(item => {
    linhas.push(`Produto: ${item.nome}`);
    linhas.push(`Tamanho: ${item.tamanho}`);
    linhas.push(`Quantidade: ${item.quantidade || 1}`);
    if (item.personalizacao && (item.personalizacao.nome || item.personalizacao.numero)) {
      linhas.push(`Personalização: ${item.personalizacao.nome || ''} ${item.personalizacao.numero ? '#' + item.personalizacao.numero : ''}`);
    }
    linhas.push('-----------------------------');
  });

  linhas.push(`TOTAL: ${formatPrice(total)}`);
  const mensagem = encodeURIComponent(linhas.join('\n'));
  window.open(`https://wa.me/5513991827915?text=${mensagem}`, '_blank');
}

// ============================================
// EVENT LISTENERS
// ============================================

let eventsInitialized = false;

// ============================================
// EVENT LISTENERS
// ============================================

if (!eventsInitialized) {
  eventsInitialized = true;

  elementos.btnComprar.addEventListener('click', adicionarAoCarrinho);
  elementos.btnVoltar.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  elementos.btnVerCarrinho.addEventListener('click', openCart);
  if (elementos.drawerOverlay) {
    elementos.drawerOverlay.addEventListener('click', closeCart);
  }
  elementos.customizeCheckbox.addEventListener('change', togglePersonalizacaoFields);
  elementos.btnFinalizar.addEventListener('click', finalizarPedido);

  if (elementos.btnApplyCoupon) {
    elementos.btnApplyCoupon.addEventListener('click', applyCoupon);
  }

  if (elementos.couponInput) {
    elementos.couponInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyCoupon();
      }
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCart();
    }
  });

  // Event delegation para garantir que o botão de fechar funcione
  document.addEventListener('click', event => {
    if (event.target.id === 'close-cart' || event.target.closest('#close-cart')) {
      closeCart();
    }
  });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  carregarProduto();
  activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';
  renderCart();
});
