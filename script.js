const STORAGE_CART_KEY = 'carrinho_camisas_venda';
const STORAGE_STOCK_KEY = 'estoque_camisas_venda';
const STORAGE_COUPON_KEY = 'carrinho_cupom_venda';
const SIZE_ORDER = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3'];

const cupons = {
  "mantus10": { desconto: 0.10, tipo: 'geral' },
  "mantusdosantos": { desconto: 0.10, tipo: 'condicional', filtro: (item) => item.nome.toLowerCase().includes('santos') }
};

let activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';

const produtos = [
  { id: 1, nome: 'Camisa do Brasil I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/brasil-1-2627-1.jpg', destaque: '🔥 Mais vendido', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 3, nome: 'Camisa do Real Madrid I 26/27', preco: 139.9, prazo: 'Últimas unidades', imagem: 'img/real-madrid-1-2627.jpg', destaque: 'Últimas unidades', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 4, nome: 'Camisa da Espanha I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/espanha-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 5, nome: 'Camisa da Espanha II 26/27', preco: 149.9, prazo: 'Sob encomenda', imagem: 'img/espanha-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 6, nome: 'Camisa de Portugal I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/portugal-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 7, nome: 'Camisa de Portugal II 26/27', preco: 149.9, prazo: 'Sob encomenda', imagem: 'img/portugal-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 8, nome: 'Camisa da Argentina I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/argentina-1-2627-1.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 9, nome: 'Camisa da Argentina II 26/27', preco: 149.9, prazo: 'Sob encomenda', imagem: 'img/argentina-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 10, nome: 'Camisa da Inglaterra I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/inglaterra-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 11, nome: 'Camisa da França I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/franca-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 12, nome: 'Camisa da França II 26/27', preco: 149.9, prazo: 'Sob encomenda', imagem: 'img/franca-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 13, nome: 'Camisa da Colômbia I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/colombia-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 14, nome: 'Camisa da Holanda I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/holanda-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 15, nome: 'Camisa da Itália I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/italia-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 16, nome: 'Camisa do Brasil II 26/27', preco: 149.9, prazo: 'Sob encomenda', imagem: 'img/brasil-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 17, nome: 'Camisa dos Estados Unidos I 26/27', preco: 149.9, prazo: 'Entrega imediata', imagem: 'img/estados-unidos-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 18, nome: 'Camisa do Corinthians I 26/27 (preta)', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/corinthians-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 19, nome: 'Camisa do Corinthians II 26/27 (laranja)', preco: 139.9, prazo: 'Sob encomenda', imagem: 'img/corinthians-2-2627.jpg', destaque: 'Sob encomenda', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 20, nome: 'Camisa do Barcelona I 26/27', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/barcelona-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 21, nome: 'Camisa do Real Madrid I 26/27', preco: 139.9, prazo: 'Últimas unidades', imagem: 'img/real-madrid-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 22, nome: 'Camisa do PSG I 26/27', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/psg-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 23, nome: 'Camisa do Santos I 26/27', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/santos-1-2627.jpg', destaque: 'Em estoque', estoque: { P: 0, M: 0, G: 0, GG: 0 } },
  { id: 24, nome: 'Camisa do Atlético Mineiro I 24/25', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/atletico-mineiro-1-2526.jpg', destaque: 'Em estoque', estoque: { M: 11, G: 11, GG: 10, G1: 10, G2: 10 } },
  { id: 25, nome: 'Camisa do Barcelona I 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/barcelona-1-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 13, M: 12, G: 11, GG: 11, G1: 10, G2: 10, G3: 10 } },
  { id: 26, nome: 'Camisa do Barcelona III 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/barcelona-2-2526-1.jpg', destaque: 'Em estoque', estoque: { G1: 10, G2: 10 } },
  { id: 27, nome: 'Camisa do Bayern de Munique II 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/bayern-de-munique-2-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 12, G: 11, GG: 10, G1: 10, G2: 10 } },
  { id: 28, nome: 'Camisa do Benfica I 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/benfica-1-2526-1.jpg', destaque: 'Em estoque', estoque: { GG: 11, G1: 10 } },
  { id: 29, nome: 'Camisa do Borussia Dortmund I 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/borussia-dortmund-1-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 12, M: 11, G: 12, GG: 10, G1: 10, G2: 10 } },
  { id: 30, nome: 'Camisa do Botafogo I 24/25', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/botafogo-1-2526-1.jpg', destaque: 'Em estoque', estoque: { M: 12 } },
  { id: 31, nome: 'Camisa do Chelsea I 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/chelsea-1-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 12, M: 12, G: 11, GG: 10, G1: 10, G2: 10 } },
  { id: 32, nome: 'Camisa do Arsenal I 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/arsenal-1-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 12, GG: 11, G1: 10, G2: 10 } },
  { id: 33, nome: 'Camisa do Atlético de Madrid II 25/26', preco: 139.9, prazo: 'Entrega imediata', imagem: 'img/atlético-de-madrid-2-2526-1.jpg', destaque: 'Em estoque', estoque: { P: 11, M: 12, G: 11, GG: 10, G1: 10 } }
];

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
    image: 'img/brasil-1-2627.jpg',
    backgroundImage: 'img/oferta-2.png'
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
    cartSummaryText: document.getElementById('cart-summary-text'),
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

function getBadgeType(produto) {
  return isProductPreorder(produto) ? 'badge-preorder' : 'badge-stock';
}

function isSelecaoProduto(produto) {
  return /\b(Brasil|Argentina|Espanha|Inglaterra|França|Colômbia|Holanda|Itália|Portug(al)?|Estados Unidos)\b/i.test(produto.nome);
}

function getProductCategoryLabel(produto) {
  return isSelecaoProduto(produto) ? 'Seleção' : 'Clube';
}

function getCheckboxValues(ids) {
  return Array.from(document.querySelectorAll(ids.join(',')))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
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
  if (visibleCount === 0) {
    let msg = container?.querySelector('.no-products-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'no-products-message';
      msg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);';
      msg.textContent = 'Nenhum produto encontrado.';
      container?.appendChild(msg);
    }
  } else {
    container?.querySelector('.no-products-message')?.remove();
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinho));
  const stockData = produtos.reduce((acc, p) => { acc[p.id] = p.estoque; return acc; }, {});
  localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(stockData));
  localStorage.setItem(STORAGE_COUPON_KEY, activeCouponCode);
}

function loadCouponState() {
  activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';
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

function loadStockState() {
  const savedStock = JSON.parse(localStorage.getItem(STORAGE_STOCK_KEY));
  if (savedStock) {
    produtos.forEach(p => { if (savedStock[p.id]) p.estoque = savedStock[p.id]; });
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.3s ease';
  document.getElementById('toast-container')?.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  setTimeout(() => { toast.remove(); }, 3300);
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
    if (stock > 0) {
      const opt = document.createElement('option');
      opt.value = tamanho;
      opt.textContent = `${tamanho} (${stock} disponível${stock === 1 ? '' : 'is'})`;
      elementos.sizeSelect.appendChild(opt);
    }
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
  const action = elementos.productForm.dataset.action;
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

  // Detect once on init and cache the result
  detectMax().then(m => {
    maxVariations = m;
    detectionDone = true;
  });

  const changeImg = async (dir) => {
    if (maxVariations <= 1) return;
    // Ensure detection is complete
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
}

function init() {
  elementos = initializeElements();
  // Remove stale localStorage stock data to ensure consistency with hardcoded values
  localStorage.removeItem(STORAGE_STOCK_KEY);
  loadStockState();
  // Save current correct stock data to localStorage
  const stockData = produtos.reduce((acc, p) => { acc[p.id] = p.estoque; return acc; }, {});
  localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(stockData));
  loadCouponState();
  renderOfferCarousel();
  initOfferCarousel();
  renderProdutos();
  renderCarrinho();
  initEvents();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();