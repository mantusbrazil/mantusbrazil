// ============================================
// SCRIPT PRINCIPAL - PÁGINA INICIAL
// ============================================

const STORAGE_CART_KEY = 'carrinho_camisas_venda';
const STORAGE_COUPON_KEY = 'carrinho_cupom_venda';

const cupons = {
  "mantus10": { desconto: 0.10, tipo: 'geral' },
  "mantusdosantos": { desconto: 0.10, tipo: 'condicional', filtro: (item) => item.nome.toLowerCase().includes('santos') }
};

let activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';

// Usa a base centralizada de produtos (produtos-db.js)
const produtos = PRODUTOS_DB;

const ofertas = [
  {
    id: 'mantus-santos',
    title: 'Mantus do Santos',
    subtitle: 'Compre duas e ganhe 10% de desconto',
    coupon: 'mantusdosantos',
    price: 269.9,
    extra: 'Por apenas',
    badge: 'Oferta especial',
    description: 'Camisa com visual premium e preço promocional por tempo limitado.',
    image: 'img/santos-1-2627.jpg',
    backgroundImage: 'img/oferta-1.png'
  },
  {
    id: 'combo-camisas',
    title: 'Combo de Camisas',
    subtitle: 'Leve 2 camisas e pague menos',
    coupon: 'mantuscombo',
    price: 399.9,
    extra: 'Só essa semana',
    badge: 'Desconto progressivo',
    description: 'Escolha o kit perfeito para colecionar ou presentear quem ama futebol.',
    image: 'img/santos-1-2627.jpg',
    backgroundImage: 'img/oferta-1.png'
  }
];

let carrinho = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];

function initializeElements() {
  return {
    produtos: document.getElementById('produtos'),
    productSearch: document.getElementById('product-search'),
    filterBtn: document.getElementById('filter-btn'),
    filterMenu: document.getElementById('filter-menu'),
    listaCarrinho: document.getElementById('lista-carrinho'),
    totalPedido: document.getElementById('total-pedido'),
    badgeTotalItens: document.getElementById('badge-total-itens'),
    drawerOverlay: document.getElementById('drawer-overlay'),
    btnVerCarrinho: document.getElementById('btn-ver-carrinho'),
    btnFinalizar: document.getElementById('finalizar'),
    btnCloseCart: document.getElementById('close-cart'),
    carrinhoDrawer: document.getElementById('carrinho'),
    couponInput: document.getElementById('coupon-code'),
    btnApplyCoupon: document.getElementById('apply-coupon'),
    couponMessage: document.getElementById('coupon-message'),
    toastContainer: document.getElementById('toast-container'),
    productModal: document.getElementById('product-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalProductImage: document.getElementById('modal-product-image'),
    modalProductName: document.getElementById('modal-product-name'),
    modalProductPrice: document.getElementById('modal-product-price'),
    sizeSelect: document.getElementById('size-select'),
    customName: document.getElementById('custom-name'),
    customNumber: document.getElementById('custom-number'),
    productForm: document.getElementById('product-form'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    btnConfirmModal: document.getElementById('btn-confirm-modal'),
    closeModal: document.getElementById('close-modal')
  };
}

let elementos = {};

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getSizeStock(produto, tamanho) {
  return produto.estoque?.[tamanho] ?? 0;
}

function getTotalStock(estoque) {
  return Object.values(estoque).reduce((sum, value) => sum + value, 0);
}

function isProductPreorder(produto) {
  return getTotalStock(produto.estoque) === 0;
}

function calcularTotal(carrinho) {
  return carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

function getTipoPorTamanho(produto, tamanho) {
  const stock = getSizeStock(produto, tamanho);
  return stock > 0 ? 'Em estoque' : 'Sob encomenda';
}

function isSelecaoProduto(produto) {
  return /\b(Brasil|Argentina|Espanha|Inglaterra|França|Colômbia|Holanda|Itália|Portug(al)?|Estados Unidos)\b/i.test(produto.nome);
}

function getProductCategoryLabel(produto) {
  return isSelecaoProduto(produto) ? 'Seleção' : 'Clube';
}

function filterProdutos() {
  const busca = (document.getElementById('product-search')?.value || '').toLowerCase();
  const filterTipo = Array.from(document.querySelectorAll('input[id^="filter-cat-"]:checked')).map(el => el.value);
  const filterDisp = Array.from(document.querySelectorAll('input[id^="filter-"]:not([id^="filter-cat-"]):checked')).map(el => el.value);
  const cards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach(prod => {
    const nome = prod.getAttribute('data-nome') || '';
    const tipo = prod.getAttribute('data-tipo') || '';
    const disp = prod.getAttribute('data-disponibilidade') || '';
    const matchBusca = busca === '' || nome.includes(busca);

    let matchTipo = true;
    if (filterTipo.length > 0) {
      const mapped = filterTipo.map(f => f === 'selecoes' ? 'selecao' : f === 'clubes' ? 'clube' : f);
      matchTipo = mapped.includes(tipo);
    }

    let matchDisp = true;
    if (filterDisp.length > 0) {
      const mapped = filterDisp.map(f => f === 'instock' ? 'estoque' : f === 'preorder' ? 'encomenda' : f);
      matchDisp = mapped.includes(disp);
    }

    if (matchBusca && matchTipo && matchDisp) {
      prod.style.display = 'block';
      visibleCount++;
    } else {
      prod.style.display = 'none';
    }
  });

  const container = document.getElementById('produtos');
  const existingMsg = container?.querySelector('.no-products-message');
  if (visibleCount === 0) {
    if (!existingMsg) {
      const msg = document.createElement('div');
      msg.className = 'no-products-message';
      msg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);';
      msg.textContent = 'Nenhum produto encontrado.';
      container?.appendChild(msg);
    }
  } else {
    existingMsg?.remove();
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinho));
  localStorage.setItem(STORAGE_COUPON_KEY, activeCouponCode);
}

function getCoupon(code) {
  const info = cupons[code.toLowerCase()];
  return info || null;
}

function applyCoupon() {
  if (!elementos.couponInput) return;
  const code = elementos.couponInput.value.trim().toLowerCase();

  if (!code) {
    activeCouponCode = '';
    saveCart();
    renderCarrinho();
    showToast('Cupom removido.', 'success');
    return;
  }

  const cupomInfo = getCoupon(code);
  if (!cupomInfo) {
    const cuponsDisponiveis = Object.keys(cupons).join(', ');
    if (elementos.couponMessage) {
      elementos.couponMessage.textContent = `Cupom "${code}" não encontrado. Cupons disponíveis: ${cuponsDisponiveis}`;
      elementos.couponMessage.style.color = 'var(--color-error)';
    }
    showToast('Cupom inválido.', 'error');
    return;
  }

  activeCouponCode = code;
  saveCart();
  renderCarrinho();
  showToast(`Cupom "${code}" aplicado!`, 'success');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.3s ease';
  document.getElementById('toast-container')?.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  setTimeout(() => { toast.remove(); }, 2800);
}

function openCart() {
  const drawer = document.getElementById('carrinho');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  if (overlay) overlay.classList.add('visible');
  document.body.classList.add('cart-open');
}

function closeCart() {
  const drawer = document.getElementById('carrinho');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (overlay) overlay.classList.remove('visible');
  document.body.classList.remove('cart-open');
}

function openProductModal(produto, action = 'buy') {
  elementos.modalProductImage.src = produto.imagem;
  elementos.modalProductImage.alt = produto.nome;
  elementos.modalProductName.textContent = produto.nome;
  elementos.modalProductPrice.textContent = formatPrice(produto.preco);
  elementos.modalTitle.textContent = action === 'buy' ? 'Comprar Produto' : 'Personalizar Produto';

  elementos.sizeSelect.innerHTML = '<option value="">Selecione um tamanho</option>';
  SIZE_ORDER.forEach(tamanho => {
    const stock = getSizeStock(produto, tamanho);
    const opt = document.createElement('option');
    opt.value = tamanho;
    if (stock > 0) {
      opt.textContent = `${tamanho} (${stock} disponível${stock === 1 ? '' : 'is'})`;
    } else {
      opt.textContent = `${tamanho} (sob encomenda)`;
    }
    elementos.sizeSelect.appendChild(opt);
  });

  elementos.customName.value = '';
  elementos.customNumber.value = '';
  elementos.productForm.dataset.productId = produto.id;
  elementos.productForm.dataset.action = action;
  elementos.productModal.classList.add('visible');
  document.body.classList.add('modal-open');
}

function closeProductModal() {
  elementos.productModal.classList.remove('visible');
  document.body.classList.remove('modal-open');
  elementos.productForm.reset();
}

function handleProductFormSubmit(event) {
  event.preventDefault();
  const productId = parseInt(elementos.productForm.dataset.productId, 10);
  const tamanho = elementos.sizeSelect.value;
  const nome = elementos.customName.value.trim();
  const numero = elementos.customNumber.value.trim();

  if (!tamanho) {
    showToast('Selecione um tamanho antes de continuar.', 'error');
    return;
  }

  adicionarAoCarrinho(productId, tamanho, { ativa: !!(nome || numero), nome, numero });
  closeProductModal();
}

function atualizarResumoDoCarrinho() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const badge = document.getElementById('badge-total-itens');
  if (badge) badge.textContent = String(totalItens);
}

function renderProdutos(listaProdutos = produtos) {
  elementos.produtos.innerHTML = '';
  if (listaProdutos.length === 0) {
    elementos.produtos.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);">Nenhum produto encontrado.</div>';
    return;
  }

  listaProdutos.forEach(produto => {
    const totalEstoque = getTotalStock(produto.estoque);
    const inStock = totalEstoque > 0;
    const precoFormatado = formatPrice(produto.preco);
    const tipo = isSelecaoProduto(produto) ? 'selecao' : 'clube';
    const disponibilidade = inStock ? 'estoque' : 'encomenda';
    const badgeClass = inStock ? 'badge-stock' : 'badge-preorder';
    const badgeText = inStock ? 'Em estoque' : 'Sob encomenda';

    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', produto.id);
    card.setAttribute('data-nome', produto.nome.toLowerCase());
    card.setAttribute('data-tipo', tipo);
    card.setAttribute('data-disponibilidade', disponibilidade);
    card.innerHTML = `
      <div class="product-image-wrapper">
        <span class="product-badge ${badgeClass}">${badgeText}</span>
        <div class="image-wrap" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
          <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" />
        </div>
      </div>
      <div class="product-content">
        <span class="product-category-tag">${getProductCategoryLabel(produto)}</span>
        <h3 class="product-name">${produto.nome}</h3>
        <div class="product-pricing">
          <span class="price-current">${precoFormatado}</span>
        </div>
        <div class="product-actions">
          <a href="produto.html?id=${produto.id}" class="btn-personalize">Ver Produto</a>
        </div>
      </div>`;
    elementos.produtos.appendChild(card);
    initializeImageGallery(card, produto.imagem, produto.id);
  });
}

function initializeImageGallery(card, imagemBase, produtoId) {
  const imageWrap = card.querySelector('.image-wrap');
  const wrapper = card.querySelector('.product-image-wrapper');

  const getBase = (path) => path.replace(/-\d+(\.\w+)$/, '$1');
  const buildPath = (base, idx) => base.replace(/(\.\w+)$/, `-${idx}$1`);

  const checkExists = (path) => new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = path; });

  imageWrap.innerHTML = `
    <button type="button" class="image-nav image-nav-prev" data-product-id="${produtoId}" style="opacity:0;transition:opacity .3s ease;">❮</button>
    <img src="${imagemBase}" alt="Imagem do produto" class="product-image" style="width:100%;height:100%;object-fit:cover;" />
    <button type="button" class="image-nav image-nav-next" data-product-id="${produtoId}" style="opacity:0;transition:opacity .3s ease;">❯</button>`;

  const prevBtn = imageWrap.querySelector('.image-nav-prev');
  const nextBtn = imageWrap.querySelector('.image-nav-next');
  const imgElement = imageWrap.querySelector('.product-image');
  let currentIndex = 1;
  let maxVariations = 1;
  let detectionDone = false;

  const detectMax = async () => {
    const base = getBase(imagemBase);
    let max = 1;
    for (let i = 2; i <= 5; i++) {
      if (await checkExists(buildPath(base, i))) max = i; else break;
    }
    return max;
  };

  detectMax().then(m => {
    maxVariations = m;
    detectionDone = true;
  });

  const changeImg = async (dir) => {
    if (maxVariations <= 1) return;
    if (!detectionDone) {
      maxVariations = await detectMax();
      detectionDone = true;
    }
    if (maxVariations <= 1) return;
    const base = getBase(imagemBase);
    const newIdx = dir === 'next' ? (currentIndex >= maxVariations ? 1 : currentIndex + 1) : (currentIndex <= 1 ? maxVariations : currentIndex - 1);
    const path = buildPath(base, newIdx);
    const exists = await checkExists(path);
    if (exists) { imgElement.src = path; currentIndex = newIdx; }
  };

  wrapper.addEventListener('mouseenter', () => {
    if (maxVariations > 1) { prevBtn.style.opacity = '1'; nextBtn.style.opacity = '1'; }
  });
  wrapper.addEventListener('mouseleave', () => { prevBtn.style.opacity = '0'; nextBtn.style.opacity = '0'; });
  prevBtn.addEventListener('click', e => { e.stopPropagation(); changeImg('prev'); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); changeImg('next'); });
}

function renderOfferCarousel() {
  const track = document.getElementById('offers-track');
  if (!track) return;
  track.innerHTML = '';
  ofertas.forEach(oferta => {
    const card = document.createElement('article');
    card.className = 'offer-card';
    card.innerHTML = `
      <div class="offer-card-content">
        <span class="offer-badge">${oferta.badge}</span>
        <h3 class="offer-title">${oferta.title}</h3>
        <div class="offer-subtitle">${oferta.subtitle}</div>
        ${oferta.coupon ? `<div class="offer-coupon">Cupom: <strong>${oferta.coupon}</strong></div>` : ''}
        <div class="offer-price"><span>${formatPrice(oferta.price)}</span></div>
        <div class="offer-extra">${oferta.extra}</div>
        <div class="offer-desc">${oferta.description}</div>
        <button type="button" class="btn-primary offer-cta">Ver ofertas</button>
      </div>`;
    if (oferta.backgroundImage) {
      card.style.backgroundImage = `url(${oferta.backgroundImage})`;
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';
      card.style.backgroundRepeat = 'no-repeat';
    }
    track.appendChild(card);
  });
}

function initOfferCarousel() {
  const track = document.getElementById('offers-track');
  const prevBtn = document.querySelector('.offer-nav.prev');
  const nextBtn = document.querySelector('.offer-nav.next');
  if (!track || !prevBtn || !nextBtn) return;
  const total = ofertas.length;
  let current = 0;
  let interval = null;
  const update = idx => { current = (idx + total) % total; track.style.transform = `translateX(-${current * 100}%)`; };
  const start = () => { if (total <= 1) return; clearInterval(interval); interval = setInterval(() => update(current + 1), 6000); };
  if (total <= 1) { prevBtn.style.display = 'none'; nextBtn.style.display = 'none'; return; }
  prevBtn.addEventListener('click', () => { update(current - 1); start(); });
  nextBtn.addEventListener('click', () => { update(current + 1); start(); });
  track.addEventListener('mouseenter', () => clearInterval(interval));
  track.addEventListener('mouseleave', start);
  update(0);
  start();
}

function adicionarAoCarrinho(id, tamanho, personalizacao = {}) {
  const produto = produtos.find(i => i.id === id);
  if (!produto || !tamanho) { showToast('Selecione um tamanho.', 'error'); return; }
  const tipo = getTipoPorTamanho(produto, tamanho);
  if (tipo === 'Em estoque' && getSizeStock(produto, tamanho) > 0) produto.estoque[tamanho] -= 1;
  carrinho.push({ id: `${id}-${Date.now()}`, nome: produto.nome, preco: produto.preco, imagem: produto.imagem, tamanho, quantidade: 1, personalizacao: { nome: personalizacao.nome || null, numero: personalizacao.numero || null } });
  saveCart();
  renderProdutos();
  renderCarrinho();
  atualizarResumoDoCarrinho();
  showToast('Produto adicionado ao carrinho!', 'success');
  openCart();
}

function alterarQuantidade(index, delta) {
  const item = carrinho[index];
  const produto = produtos.find(p => p.id === parseInt(item.id.split('-')[0]));
  if (!produto) return;
  const nova = Math.max(1, item.quantidade + delta);
  if (nova === item.quantidade) return;
  if (getTipoPorTamanho(produto, item.tamanho) === 'Em estoque') {
    const atual = getSizeStock(produto, item.tamanho);
    if (nova > atual + item.quantidade) { showToast(`Máximo: ${atual + item.quantidade} un.`, 'info'); return; }
    produto.estoque[item.tamanho] = atual + item.quantidade - nova;
  }
  item.quantidade = nova;
  if (nova <= 0) { removerItem(index); } else { saveCart(); renderCarrinho(); }
}

function removerItem(index) {
  const item = carrinho[index];
  const produto = produtos.find(p => p.id === parseInt(item.id.split('-')[0]));
  if (produto && getTipoPorTamanho(produto, item.tamanho) === 'Em estoque') produto.estoque[item.tamanho] += item.quantidade;
  carrinho.splice(index, 1);
  saveCart();
  renderProdutos();
  renderCarrinho();
  showToast('Item removido.', 'info');
}

function gerarMensagemWhatsApp() {
  const total = calcularTotal(carrinho);
  const linhas = ['Olá! Quero fazer um pedido de camisas:', '-----------------------------'];
  carrinho.forEach(item => {
    linhas.push(`Produto: ${item.nome}`, `Tamanho: ${item.tamanho}`, `Quantidade: ${item.quantidade}`);
    if (item.personalizacao?.nome || item.personalizacao?.numero) linhas.push(`Personalização: ${item.personalizacao.nome || ''} ${item.personalizacao.numero ? '#' + item.personalizacao.numero : ''}`);
    linhas.push('-----------------------------');
  });
  linhas.push(`TOTAL: ${formatPrice(total)}`);
  return encodeURIComponent(linhas.join('\n'));
}

function renderCarrinho() {
  carrinho = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];
  activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || activeCouponCode;
  elementos.listaCarrinho.innerHTML = '';
  const empty = document.getElementById('cart-empty-state');

  if (carrinho.length === 0) {
    elementos.listaCarrinho.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    if (empty) empty.style.display = 'block';
    elementos.totalPedido.textContent = formatPrice(0);
    if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
    if (elementos.couponMessage) elementos.couponMessage.textContent = '';
    atualizarResumoDoCarrinho();
    return;
  }
  if (empty) empty.style.display = 'none';

  carrinho.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'cart-item';
    const label = item.personalizacao?.nome || item.personalizacao?.numero ? `${item.personalizacao.nome || ''} ${item.personalizacao.numero ? '#' + item.personalizacao.numero : ''}` : '';
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <span class="cart-item-price">${formatPrice(item.preco)}</span>
        <div class="cart-item-meta">
          <span>Tam: ${item.tamanho}</span>
          ${label ? `<span>${label}</span>` : ''}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button type="button" class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
            <span class="quantity-display">${item.quantidade}</span>
            <button type="button" class="quantity-btn" data-action="increase" data-index="${index}">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-index="${index}">Remover</button>
        </div>
      </div>`;
    card.querySelector('[data-action="decrease"]')?.addEventListener('click', () => alterarQuantidade(index, -1));
    card.querySelector('[data-action="increase"]')?.addEventListener('click', () => alterarQuantidade(index, 1));
    card.querySelector('.cart-item-remove')?.addEventListener('click', () => removerItem(index));
    elementos.listaCarrinho.appendChild(card);
  });

  const subtotal = calcularTotal(carrinho);
  let discount = 0;
  let msg = '';

  if (activeCouponCode) {
    const info = getCoupon(activeCouponCode);
    if (info) {
      if (info.tipo === 'condicional' && info.filtro) {
        const filtered = carrinho.filter(i => info.filtro(i));
        const ft = filtered.reduce((s, i) => s + i.preco * i.quantidade, 0);
        discount = ft * info.desconto;
        const names = [...new Set(filtered.map(i => i.nome))];
        msg = `Cupom ${activeCouponCode} aplicado: ${Math.round(info.desconto * 100)}% em: ${names.join(', ')}`;
      } else {
        discount = subtotal * info.desconto;
        msg = `Cupom ${activeCouponCode} aplicado: ${Math.round(info.desconto * 100)}% de desconto`;
      }
    } else { msg = 'Cupom inválido.'; }
  }

  elementos.totalPedido.textContent = formatPrice(subtotal - discount);
  if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
  if (elementos.couponMessage) {
    elementos.couponMessage.textContent = msg;
    elementos.couponMessage.style.color = msg ? 'var(--color-success)' : '';
  }
  atualizarResumoDoCarrinho();
}

function finalizarPedido() {
  if (!carrinho.length) { showToast('Adicione itens ao carrinho.', 'error'); return; }
  window.open(`https://wa.me/5513991827915?text=${gerarMensagemWhatsApp()}`, '_blank');
}

let eventsInitialized = false;

function initEvents() {
  if (eventsInitialized) return;
  eventsInitialized = true;

  document.getElementById('product-search')?.addEventListener('input', filterProdutos);

  const filterBtn = document.getElementById('filter-btn');
  const filterMenu = document.getElementById('filter-menu');
  if (filterBtn && filterMenu) {
    filterBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = filterMenu.getAttribute('aria-hidden') === 'false';
      filterMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
      filterBtn.setAttribute('aria-expanded', !open);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.filter-dropdown')) {
        filterMenu.setAttribute('aria-hidden', 'true');
        filterBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.querySelectorAll('input[type="checkbox"][id^="filter-"]').forEach(cb => cb.addEventListener('change', filterProdutos));
  }

  document.querySelectorAll('.btn-cart, #btn-ver-carrinho').forEach(b => b?.addEventListener('click', openCart));
  document.getElementById('drawer-overlay')?.addEventListener('click', closeCart);
  document.getElementById('finalizar')?.addEventListener('click', finalizarPedido);
  document.getElementById('apply-coupon')?.addEventListener('click', applyCoupon);
  document.getElementById('coupon-code')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
  document.querySelectorAll('.offer-cta').forEach(b => b.addEventListener('click', () => { document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' }); showToast('Use o cupom exibido no banner!', 'success'); }));
  document.getElementById('close-modal')?.addEventListener('click', closeProductModal);
  document.getElementById('btn-cancel-modal')?.addEventListener('click', closeProductModal);
  document.getElementById('product-modal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeProductModal(); });
  document.getElementById('product-form')?.addEventListener('submit', handleProductFormSubmit);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    const id = l.getAttribute('href')?.substring(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeProductModal(); } });

  // Mobile menu toggle
  const toggleBtn = document.getElementById('navbar-toggle');
  const navMenu = document.getElementById('navbar-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function init() {
  elementos = initializeElements();
  renderOfferCarousel();
  initOfferCarousel();
  renderProdutos();
  renderCarrinho();
  initEvents();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();