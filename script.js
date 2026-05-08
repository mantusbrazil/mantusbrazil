const STORAGE_CART_KEY = 'carrinho_camisas_venda';
const STORAGE_STOCK_KEY = 'estoque_camisas_venda';
const STORAGE_COUPON_KEY = 'carrinho_cupom_venda';
const SIZE_ORDER = ['P', 'M', 'G', 'GG'];

const cupons = {
  "mantus10": 0.10
};

let activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';

const produtos = [
  {
    id: 1,
    nome: 'Camisa do Brasil I 26/27',
    preco: 199.9,
    prazo: 'Entrega imediata',
    imagem: 'img/brasil-1-2627-1.jpg',
    destaque: '🔥 Mais vendido',
    estoque: { P: 4, M: 2, G: 0, GG: 1 }
  },
  {
    id: 2,
    nome: 'Camisa da Argentina I 26/27',
    preco: 189.9,
    prazo: 'Entrega em até 20 dias',
    imagem: 'img/argentina-1-2627.jpg',
    destaque: 'Pré-venda exclusiva',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 3,
    nome: 'Camisa do Real Madrid I 26/27',
    preco: 249.9,
    prazo: 'Últimas unidades',
    imagem: 'img/real-madrid-1-2627.jpg',
    destaque: 'Últimas unidades',
    estoque: { P: 1, M: 3, G: 2, GG: 0 }
  },
  {
    id: 4,
    nome: 'Camisa da Espanha I 26/27',
    preco: 179.9,
    prazo: 'Entrega imediata',
    imagem: 'img/espanha-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 3, M: 2, G: 1, GG: 2 }
  },
  {
    id: 5,
    nome: 'Camisa da Espanha II 26/27',
    preco: 179.9,
    prazo: 'Sob encomenda',
    imagem: 'img/espanha-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 6,
    nome: 'Camisa de Portugal I 26/27',
    preco: 169.9,
    prazo: 'Entrega imediata',
    imagem: 'img/portugal-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 2, G: 2, GG: 1 }
  },
  {
    id: 7,
    nome: 'Camisa de Portugal II 26/27',
    preco: 169.9,
    prazo: 'Sob encomenda',
    imagem: 'img/portugal-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 8,
    nome: 'Camisa da Argentina I 26/27',
    preco: 189.9,
    prazo: 'Entrega imediata',
    imagem: 'img/argentina-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 3, M: 1, G: 2, GG: 0 }
  },
  {
    id: 9,
    nome: 'Camisa da Argentina II 26/27',
    preco: 189.9,
    prazo: 'Sob encomenda',
    imagem: 'img/argentina-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 10,
    nome: 'Camisa da Inglaterra I 26/27',
    preco: 209.9,
    prazo: 'Entrega imediata',
    imagem: 'img/inglaterra-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 3, G: 1, GG: 1 }
  },
  {
    id: 11,
    nome: 'Camisa da França I 26/27',
    preco: 199.9,
    prazo: 'Entrega imediata',
    imagem: 'img/franca-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 1, M: 2, G: 1, GG: 0 }
  },
  {
    id: 12,
    nome: 'Camisa da França II 26/27',
    preco: 199.9,
    prazo: 'Sob encomenda',
    imagem: 'img/franca-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 13,
    nome: 'Camisa da Colômbia I 26/27',
    preco: 159.9,
    prazo: 'Entrega imediata',
    imagem: 'img/colombia-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 2, G: 0, GG: 1 }
  },
  {
    id: 14,
    nome: 'Camisa da Holanda I 26/27',
    preco: 159.9,
    prazo: 'Entrega imediata',
    imagem: 'img/holanda-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 1, M: 1, G: 1, GG: 1 }
  },
  {
    id: 15,
    nome: 'Camisa da Itália I 26/27',
    preco: 179.9,
    prazo: 'Entrega imediata',
    imagem: 'img/italia-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 1, G: 1, GG: 0 }
  },
  {
    id: 16,
    nome: 'Camisa do Brasil II 26/27',
    preco: 189.9,
    prazo: 'Sob encomenda',
    imagem: 'img/brasil-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 17,
    nome: 'Camisa dos Estados Unidos I 26/27',
    preco: 179.9,
    prazo: 'Entrega imediata',
    imagem: 'img/estados-unidos-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 2, G: 1, GG: 0 }
  },
  {
    id: 18,
    nome: 'Camisa do Corinthians I 26/27 (preta)',
    preco: 149.9,
    prazo: 'Entrega imediata',
    imagem: 'img/corinthians-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 1, M: 2, G: 1, GG: 0 }
  },
  {
    id: 19,
    nome: 'Camisa do Corinthians II 26/27 (laranja)',
    preco: 149.9,
    prazo: 'Sob encomenda',
    imagem: 'img/corinthians-2-2627.jpg',
    destaque: 'Sob encomenda',
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 20,
    nome: 'Camisa do Barcelona I 26/27',
    preco: 229.9,
    prazo: 'Entrega imediata',
    imagem: 'img/barcelona-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 2, G: 1, GG: 1 }
  },
  {
    id: 21,
    nome: 'Camisa do Real Madrid I 26/27',
    preco: 249.9,
    prazo: 'Últimas unidades',
    imagem: 'img/real-madrid-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 1, M: 1, G: 2, GG: 0 }
  },
  {
    id: 22,
    nome: 'Camisa do PSG I 26/27',
    preco: 219.9,
    prazo: 'Entrega imediata',
    imagem: 'img/psg-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 1, M: 2, G: 1, GG: 0 }
  },
  {
    id: 23,
    nome: 'Camisa do Santos I 26/27',
    preco: 159.9,
    prazo: 'Entrega imediata',
    imagem: 'img/santos-1-2627.jpg',
    destaque: 'Em estoque',
    estoque: { P: 2, M: 1, G: 0, GG: 0 }
  }
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

// Inicializar elementos após DOM estar pronto
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
  const selected = Array.from(document.querySelectorAll(ids.join(',')))
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  return selected.length ? selected : ['all'];
}

function filterProdutos() {
  const searchInput = document.getElementById('product-search');
  const busca = (searchInput?.value || '').toLowerCase();
  const filterTipo = Array.from(document.querySelectorAll('input[id^="filter-cat-"]:checked')).map(el => el.value);
  const filterDisp = Array.from(document.querySelectorAll('input[id^="filter-"]:not([id^="filter-cat-"]):checked')).map(el => el.value);

  const produtos = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  produtos.forEach(prod => {
    const nome = prod.getAttribute('data-nome') || '';
    const tipo = prod.getAttribute('data-tipo') || '';
    const disp = prod.getAttribute('data-disponibilidade') || '';

    // Busca
    const matchBusca = busca === '' || nome.includes(busca);

    // Tipo (seleção/clube)
    let matchTipo = true;
    if (filterTipo.length > 0 && !filterTipo.includes('all')) {
      matchTipo = filterTipo.includes(tipo);
    }

    // Disponibilidade (estoque/encomenda)
    let matchDisp = true;
    if (filterDisp.length > 0 && !filterDisp.includes('all')) {
      const filterDispNorm = filterDisp.map(f => f === 'instock' ? 'estoque' : f === 'preorder' ? 'encomenda' : f);
      matchDisp = filterDispNorm.includes(disp);
    }

    // Mostrar/ocultar produto
    if (matchBusca && matchTipo && matchDisp) {
      prod.style.display = 'block';
      visibleCount++;
    } else {
      prod.style.display = 'none';
    }
  });

  // Mostrar mensagem se nenhum encontrado
  if (visibleCount === 0) {
    const produtosContainer = document.getElementById('produtos');
    let msg = produtosContainer?.querySelector('.no-products-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'no-products-message';
      msg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);';
      msg.textContent = 'Nenhum produto encontrado.';
      produtosContainer?.appendChild(msg);
    }
  } else {
    const produtosContainer = document.getElementById('produtos');
    const msg = produtosContainer?.querySelector('.no-products-message');
    if (msg) msg.remove();
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinho));
  const stockData = produtos.reduce((acc, produto) => {
    acc[produto.id] = produto.estoque;
    return acc;
  }, {});
  localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(stockData));
  localStorage.setItem(STORAGE_COUPON_KEY, activeCouponCode);
}

function loadCouponState() {
  activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || '';
}

function getCoupon(code) {
  return cupons[code.toLowerCase()] || null;
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

  const desconto = getCoupon(code);
  if (!desconto) {
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
    produtos.forEach(produto => {
      if (savedStock[produto.id]) {
        produto.estoque = savedStock[produto.id];
      }
    });
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.3s ease';

  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.appendChild(toast);
  }

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);

  setTimeout(() => {
    toast.remove();
  }, 3300);
}

function openCart() {
  const carrinhoDrawer = document.getElementById('carrinho');
  const drawerOverlay = document.getElementById('drawer-overlay');
  
  if (carrinhoDrawer) {
    carrinhoDrawer.classList.add('open');
    carrinhoDrawer.setAttribute('aria-hidden', 'false');
  }
  if (drawerOverlay) {
    drawerOverlay.classList.add('visible');
  }
  document.body.classList.add('cart-open');
}

function closeCart() {
  const carrinhoDrawer = document.getElementById('carrinho');
  const drawerOverlay = document.getElementById('drawer-overlay');
  
  if (carrinhoDrawer) {
    carrinhoDrawer.classList.remove('open');
    carrinhoDrawer.setAttribute('aria-hidden', 'true');
  }
  if (drawerOverlay) {
    drawerOverlay.classList.remove('visible');
  }
  document.body.classList.remove('cart-open');
}

function openProductModal(produto, action = 'buy') {
  // Preencher dados do produto
  elementos.modalProductImage.src = produto.imagem;
  elementos.modalProductImage.alt = produto.nome;
  elementos.modalProductName.textContent = produto.nome;
  elementos.modalProductPrice.textContent = formatPrice(produto.preco);
  elementos.modalTitle.textContent = action === 'buy' ? 'Comprar Produto' : 'Personalizar Produto';

  // Preencher opções de tamanho
  elementos.sizeSelect.innerHTML = '<option value="">Selecione um tamanho</option>';
  SIZE_ORDER.forEach(tamanho => {
    const stock = getSizeStock(produto, tamanho);
    if (stock > 0) {
      const option = document.createElement('option');
      option.value = tamanho;
      option.textContent = `${tamanho} (${stock} disponível${stock === 1 ? '' : 'is'})`;
      elementos.sizeSelect.appendChild(option);
    }
  });

  // Limpar campos de personalização
  elementos.customName.value = '';
  elementos.customNumber.value = '';

  // Armazenar dados do produto e ação no formulário
  elementos.productForm.dataset.productId = produto.id;
  elementos.productForm.dataset.action = action;

  // Abrir modal
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

  // Validação: tamanho obrigatório
  if (!tamanho) {
    showToast('Selecione um tamanho antes de continuar.', 'error');
    return;
  }

  const personalizacao = {
    ativa: !!(nome || numero),
    nome: nome,
    numero: numero
  };

  adicionarAoCarrinho(productId, tamanho, personalizacao);
  closeProductModal();
}

function animateAddButton(id) {
  const button = document.querySelector(`.add-button[data-add='${id}']`);
  if (!button) return;

  const label = button.textContent;
  button.textContent = 'Adicionado!';
  button.disabled = true;

  setTimeout(() => {
    button.textContent = label;
    button.disabled = false;
  }, 1400);
}

function atualizarResumoDoCarrinho() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const badgeTotalItens = document.getElementById('badge-total-itens');
  if (badgeTotalItens) {
    badgeTotalItens.textContent = String(totalItens);
  }
}

function initializeImageGallery(card, imagemBase, produtoId) {
  const imageWrap = card.querySelector('.image-wrap');
  const productImageWrapper = card.querySelector('.product-image-wrapper');
  
  let currentImageIndex = 1;
  let maxImageVariations = 1;
  
  const getImageBasePath = (imagePath) => {
    return imagePath.replace(/-\d+(\.\w+)$/, '$1');
  };
  
  const buildImagePath = (basePath, index) => {
    if (index === 1) return basePath;
    return basePath.replace(/(\.\w+)$/, `-${index}$1`);
  };
  
  const checkImageExists = (imagePath) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  };
  
  const detectMaxVariations = async () => {
    const baseImagePath = getImageBasePath(imagemBase);
    let max = 1;
    
    for (let i = 2; i <= 5; i++) {
      const testPath = buildImagePath(baseImagePath, i);
      const exists = await checkImageExists(testPath);
      if (exists) {
        max = i;
      } else {
        break;
      }
    }
    
    return max;
  };
  
  const changeImage = async (direction) => {
    const baseImagePath = getImageBasePath(imagemBase);
    
    if (maxImageVariations === 1 && currentImageIndex === 1) {
      maxImageVariations = await detectMaxVariations();
      if (maxImageVariations === 1) {
        return;
      }
    }
    
    if (maxImageVariations <= 1) {
      return;
    }
    
    let newImageIndex;
    if (direction === 'next') {
      newImageIndex = currentImageIndex >= maxImageVariations ? 1 : currentImageIndex + 1;
    } else {
      newImageIndex = currentImageIndex <= 1 ? maxImageVariations : currentImageIndex - 1;
    }
    
    const newImagePath = buildImagePath(baseImagePath, newImageIndex);
    
    try {
      const exists = await checkImageExists(newImagePath);
      if (exists) {
        imgElement.src = newImagePath;
        currentImageIndex = newImageIndex;
      }
    } catch (error) {
      console.error(`Erro ao carregar imagem: ${error}`);
    }
  };
  
  imageWrap.innerHTML = `
    <button type="button" class="image-nav image-nav-prev" data-product-id="${produtoId}" title="Imagem anterior" style="opacity: 0; transition: opacity 0.3s ease;">❮</button>
    <img src="${imagemBase}" alt="Imagem do produto" class="product-image" style="width: 100%; height: 100%; object-fit: cover;" />
    <button type="button" class="image-nav image-nav-next" data-product-id="${produtoId}" title="Próxima imagem" style="opacity: 0; transition: opacity 0.3s ease;">❯</button>
  `;
  
  const prevBtn = imageWrap.querySelector('.image-nav-prev');
  const nextBtn = imageWrap.querySelector('.image-nav-next');
  const imgElement = imageWrap.querySelector('.product-image');
  
  detectMaxVariations().then((max) => {
    maxImageVariations = max;
  });
  
  // Mostrar botões no hover do wrapper
  productImageWrapper.addEventListener('mouseenter', async () => {
    const baseImagePath = getImageBasePath(imagemBase);
    maxImageVariations = await detectMaxVariations();
    
    if (maxImageVariations > 1) {
      prevBtn.style.opacity = '1';
      nextBtn.style.opacity = '1';
    }
  });
  
  productImageWrapper.addEventListener('mouseleave', () => {
    prevBtn.style.opacity = '0';
    nextBtn.style.opacity = '0';
  });
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    changeImage('prev');
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    changeImage('next');
  });
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
    
    // Definir badge baseado em estoque
    let badgeClass = '';
    let badgeText = '';
    if (totalEstoque > 0) {
      badgeClass = 'badge-stock';
      badgeText = 'Em estoque';
    } else {
      badgeClass = 'badge-preorder';
      badgeText = 'Sob encomenda';
    }

    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', produto.id);
    card.setAttribute('data-nome', produto.nome.toLowerCase());
    card.setAttribute('data-tipo', tipo);
    card.setAttribute('data-disponibilidade', disponibilidade);
    
    card.innerHTML = `
      <div class="product-image-wrapper">
        ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
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
      </div>
    `;

    elementos.produtos.appendChild(card);

    // Inicializar galeria de imagens
    initializeImageGallery(card, produto.imagem, produto.id);
  });
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
      </div>
    `;

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

  const totalOffers = ofertas.length;
  let currentIndex = 0;
  let intervalId = null;

  const updateSlide = index => {
    currentIndex = (index + totalOffers) % totalOffers;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  const startAutoSlide = () => {
    if (totalOffers <= 1) return;
    clearInterval(intervalId);
    intervalId = setInterval(() => updateSlide(currentIndex + 1), 6000);
  };

  if (totalOffers <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    return;
  }

  prevBtn.addEventListener('click', () => {
    updateSlide(currentIndex - 1);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    updateSlide(currentIndex + 1);
    startAutoSlide();
  });

  track.addEventListener('mouseenter', () => clearInterval(intervalId));
  track.addEventListener('mouseleave', startAutoSlide);

  updateSlide(0);
  startAutoSlide();
}

function adicionarAoCarrinho(id, tamanho = null, personalizacao = { ativa: false, nome: '', numero: '' }) {
  const produto = produtos.find(item => item.id === id);
  if (!produto) return;

  // Bloquear adição sem tamanho
  if (!tamanho) {
    showToast('Selecione um tamanho antes de continuar.', 'error');
    return;
  }

  const quantidade = 1;
  const tipo = getTipoPorTamanho(produto, tamanho);
  
  // Se em estoque, descontar do estoque
  if (tipo === 'Em estoque') {
    const stockAvailable = getSizeStock(produto, tamanho);
    if (stockAvailable > 0) {
      produto.estoque[tamanho] -= 1;
    }
  }

  carrinho.push({
    id: `${id}-${Date.now()}`,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem,
    tamanho: tamanho,
    quantidade: quantidade,
    personalizacao: {
      nome: personalizacao.nome || null,
      numero: personalizacao.numero || null
    }
  });

  saveCart();
  renderProdutos();
  renderCarrinho();
  atualizarResumoDoCarrinho();
  showToast('Produto adicionado ao carrinho!', 'success');
  openCart();
}

function alterarQuantidade(index, delta) {
  const item = carrinho[index];
  const produto = produtos.find(prod => prod.id === parseInt(item.id.split('-')[0]));
  if (!produto) return;

  const novaQuantidade = Math.max(1, item.quantidade + delta);

  if (novaQuantidade === item.quantidade) return; // Não mudou

  // Se for em estoque, verificar limite
  if (getTipoPorTamanho(produto, item.tamanho) === 'Em estoque') {
    const estoqueAtual = getSizeStock(produto, item.tamanho);
    const maxDisponivel = estoqueAtual + item.quantidade;

    if (novaQuantidade > maxDisponivel) {
      showToast(`Máximo permitido: ${maxDisponivel} unidade${maxDisponivel === 1 ? '' : 's'}.`, 'info');
      return;
    }
    produto.estoque[item.tamanho] = estoqueAtual + item.quantidade - novaQuantidade;
  }

  item.quantidade = novaQuantidade;

  if (novaQuantidade <= 0) {
    removerItem(index);
  } else {
    saveCart();
    renderCarrinho();
  }
}

function removerItem(index) {
  const item = carrinho[index];
  const produto = produtos.find(prod => prod.id === parseInt(item.id.split('-')[0]));
  if (produto && getTipoPorTamanho(produto, item.tamanho) === 'Em estoque') {
    produto.estoque[item.tamanho] += item.quantidade;
  }
  carrinho.splice(index, 1);
  saveCart();
  renderProdutos();
  renderCarrinho();
  showToast('Item removido do carrinho.', 'info');
}

function gerarMensagemWhatsApp() {
  const total = calcularTotal(carrinho);
  const linhas = ['Olá! Quero fazer um pedido de camisas:', '-----------------------------'];

  carrinho.forEach(item => {
    linhas.push(`Produto: ${item.nome}`);
    linhas.push(`Tamanho: ${item.tamanho}`);
    linhas.push(`Quantidade: ${item.quantidade}`);
    if (item.personalizacao && (item.personalizacao.nome || item.personalizacao.numero)) {
      linhas.push(`Personalização: ${item.personalizacao.nome || ''} ${item.personalizacao.numero ? '#' + item.personalizacao.numero : ''}`);
    }
    linhas.push('-----------------------------');
  });

  linhas.push(`TOTAL: ${formatPrice(total)}`);
  return encodeURIComponent(linhas.join('\n'));
}

function renderCarrinho() {
  carrinho = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];
  activeCouponCode = localStorage.getItem(STORAGE_COUPON_KEY) || activeCouponCode;
  elementos.listaCarrinho.innerHTML = '';

  const cartEmptyState = document.getElementById('cart-empty-state');
  if (carrinho.length === 0) {
    elementos.listaCarrinho.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Adicione uma camisa para começar o pedido.</div>';
    if (cartEmptyState) cartEmptyState.style.display = 'block';
    elementos.totalPedido.textContent = formatPrice(0);
    if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
    if (elementos.couponMessage) elementos.couponMessage.textContent = '';
    atualizarResumoDoCarrinho();
    return;
  }
  if (cartEmptyState) cartEmptyState.style.display = 'none';

  carrinho.forEach((item, index) => {
    const produto = produtos.find(prod => prod.id === parseInt(item.id.split('-')[0]));
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
            <span class="quantity-display">${item.quantidade}</span>
            <button type="button" class="quantity-btn" data-action="increase" data-index="${index}">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-index="${index}">Remover</button>
        </div>
      </div>
    `;

    // Botões de quantidade
    const decreaseBtn = itemCard.querySelector('[data-action="decrease"]');
    const increaseBtn = itemCard.querySelector('[data-action="increase"]');
    const removeButton = itemCard.querySelector('.cart-item-remove');

    decreaseBtn.addEventListener('click', () => alterarQuantidade(index, -1));
    increaseBtn.addEventListener('click', () => alterarQuantidade(index, 1));
    removeButton.addEventListener('click', () => removerItem(index));

    elementos.listaCarrinho.appendChild(itemCard);
  });

  const subtotal = calcularTotal(carrinho);
  let discount = 0;
  let couponMessage = '';

  if (activeCouponCode) {
    const desconto = getCoupon(activeCouponCode);
    if (desconto) {
      discount = subtotal * desconto;
      couponMessage = `Cupom ${activeCouponCode} aplicado: ${Math.round(desconto * 100)}% de desconto`;
    } else {
      couponMessage = 'Cupom inválido.';
    }
  }

  elementos.totalPedido.textContent = formatPrice(subtotal - discount);
  if (elementos.couponInput) elementos.couponInput.value = activeCouponCode;
  if (elementos.couponMessage) elementos.couponMessage.textContent = couponMessage;
  atualizarResumoDoCarrinho();
}

function finalizarPedido() {
  if (!carrinho.length) {
    showToast('Adicione itens ao carrinho antes de finalizar.', 'error');
    return;
  }
  const mensagem = gerarMensagemWhatsApp();
  const numeroWhatsApp = '5513991827915';
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
  window.open(url, '_blank');
}

let eventsInitialized = false;

function initEvents() {
  if (eventsInitialized) return;
  eventsInitialized = true;

  // Search - usar input para tempo real
  const productSearch = document.getElementById('product-search');
  if (productSearch) {
    productSearch.addEventListener('input', filterProdutos);
  }

  // Filter dropdown toggle
  const filterBtn = document.getElementById('filter-btn');
  const filterMenu = document.getElementById('filter-menu');
  if (filterBtn && filterMenu) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = filterMenu.getAttribute('aria-hidden') === 'false';
      filterMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      filterBtn.setAttribute('aria-expanded', !isOpen);
    });

    // Close filter menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        filterMenu.setAttribute('aria-hidden', 'true');
        filterBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Add change listeners to all filter checkboxes
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="filter-"]');
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Handle availability filter group
        if (checkbox.id.startsWith('filter-') && !checkbox.id.startsWith('filter-cat-')) {
          if (checkbox.id === 'filter-all' && checkbox.checked) {
            document.getElementById('filter-instock').checked = false;
            document.getElementById('filter-preorder').checked = false;
          } else if (checkbox.checked && checkbox.id !== 'filter-all') {
            document.getElementById('filter-all').checked = false;
          }
        }
        // Handle category filter group
        if (checkbox.id.startsWith('filter-cat-')) {
          if (checkbox.id === 'filter-cat-all' && checkbox.checked) {
            document.getElementById('filter-cat-selecoes').checked = false;
            document.getElementById('filter-cat-clubes').checked = false;
          } else if (checkbox.checked && checkbox.id !== 'filter-cat-all') {
            document.getElementById('filter-cat-all').checked = false;
          }
        }
        filterProdutos();
      });
    });
  }

  const btnVerCarrinho = document.getElementById('btn-ver-carrinho');
  const cartButtons = [btnVerCarrinho, document.querySelector('.btn-cart')].filter(Boolean);
  const uniqueCartButtons = [...new Set(cartButtons)];
  uniqueCartButtons.forEach(button => button.addEventListener('click', openCart));

  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeCart);
  }
  const btnFinalizar = document.getElementById('finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarPedido);
  }

  const btnApplyCoupon = document.getElementById('apply-coupon');
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener('click', applyCoupon);
  }

  const couponInput = document.getElementById('coupon-code');
  if (couponInput) {
    couponInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyCoupon();
      }
    });
  }

  const offerCtas = document.querySelectorAll('.offer-cta');
  offerCtas.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById('lancamentos');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      showToast('Use o cupom exibido no banner ao finalizar a compra.', 'success');
    });
  });

  // Modal events
  const closeModal = document.getElementById('close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const productModal = document.getElementById('product-modal');
  const productForm = document.getElementById('product-form');
  
  if (closeModal) closeModal.addEventListener('click', closeProductModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeProductModal);
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }
  if (productForm) productForm.addEventListener('submit', handleProductFormSubmit);

  // Botão "Comprar agora" no banner
  const btnComprarAgora = document.querySelector('.hero .btn-primary');
  if (btnComprarAgora) {
    btnComprarAgora.addEventListener('click', () => {
      document.getElementById('lancamentos').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Menu header links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCart();
      closeProductModal();
    }
  });
}

function init() {
  // Inicializar elemento após DOM estar pronto
  elementos = initializeElements();
  
  loadStockState();
  loadCouponState();
  renderOfferCarousel();
  initOfferCarousel();
  renderProdutos();
  renderCarrinho();
  initEvents();
}

// Inicializar imediatamente se o DOM já estiver pronto, senão esperar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM já está pronto, inicializar imediatamente
  init();
}
