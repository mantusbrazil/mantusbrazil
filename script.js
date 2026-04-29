const STORAGE_CART_KEY = 'carrinho_camisas_venda';
const STORAGE_STOCK_KEY = 'estoque_camisas_venda';
const SIZE_ORDER = ['P', 'M', 'G', 'GG'];

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
    price: 269.9,
    extra: 'Por apenas',
    badge: 'Oferta especial',
    description: 'Camisa com visual premium e preço promocional por tempo limitado.',
    image: 'img/santos-1-2627.jpg'
  },
  {
    id: 'combo-camisas',
    title: 'Combo de Camisas',
    subtitle: 'Leve 2 camisas e pague menos',
    price: 399.9,
    extra: 'Só essa semana',
    badge: 'Desconto progressivo',
    description: 'Escolha o kit perfeito para colecionar ou presentear quem ama futebol.',
    image: 'img/brasil-1-2627.jpg'
  }
];

const elementos = {
  produtos: document.getElementById('produtos'),
  productSearch: document.getElementById('product-search'),
  productFilter: document.getElementById('product-filter'),
  listaCarrinho: document.getElementById('lista-carrinho'),
  totalPedido: document.getElementById('total-pedido'),
  badgeTotalItens: document.getElementById('badge-total-itens'),
  cartSummaryText: document.getElementById('cart-summary-text'),
  drawerOverlay: document.getElementById('drawer-overlay'),
  btnVerCarrinho: document.getElementById('btn-ver-carrinho'),
  btnFinalizar: document.getElementById('finalizar'),
  btnCloseCart: document.getElementById('close-cart'),
  carrinhoDrawer: document.getElementById('carrinho'),
  toastContainer: document.getElementById('toast-container'),
  // Modal elements
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

let carrinho = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];

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

function getProductTypeForSelection(produto, tamanho) {
  return getTipoPorTamanho(produto, tamanho);
}

function getTipoPorTamanho(produto, tamanho) {
  const stock = getSizeStock(produto, tamanho);
  return stock > 0 ? 'Em estoque' : 'Sob encomenda';
}

function getBadgeType(produto) {
  return isProductPreorder(produto) ? 'badge-preorder' : 'badge-stock';
}

function filterProdutos() {
  const termo = elementos.productSearch.value.trim().toLowerCase();
  const filtro = elementos.productFilter.value;

  return produtos.filter(produto => {
    const nomeMatch = produto.nome.toLowerCase().includes(termo);
    if (!nomeMatch) return false;

    if (filtro === 'instock') {
      return getTotalStock(produto.estoque) > 0;
    }

    if (filtro === 'preorder') {
      return getTotalStock(produto.estoque) === 0;
    }

    return true;
  });
}

function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(carrinho));
  const stockData = produtos.reduce((acc, produto) => {
    acc[produto.id] = produto.estoque;
    return acc;
  }, {});
  localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(stockData));
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

  elementos.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);

  setTimeout(() => {
    toast.remove();
  }, 3300);
}

function openCart() {
  elementos.carrinhoDrawer.classList.add('open');
  elementos.drawerOverlay.classList.add('visible');
  elementos.carrinhoDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-open');
}

function closeCart() {
  elementos.carrinhoDrawer.classList.remove('open');
  elementos.drawerOverlay.classList.remove('visible');
  elementos.carrinhoDrawer.setAttribute('aria-hidden', 'true');
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
  
  const productId = elementos.productForm.dataset.productId;
  const action = elementos.productForm.dataset.action;
  const tamanho = elementos.sizeSelect.value;
  const nome = elementos.customName.value.trim();
  const numero = elementos.customNumber.value.trim();

  // Validação: tamanho obrigatório para "Comprar"
  if (action === 'buy' && !tamanho) {
    showToast('Selecione um tamanho antes de continuar', 'error');
    return;
  }

  // Se não selecionou tamanho, usar o primeiro disponível
  const tamanhoFinal = tamanho || SIZE_ORDER.find(t => getSizeStock(produtos.find(p => p.id === productId), t));

  const personalizacao = {
    ativa: !!(nome || numero),
    nome: nome,
    numero: numero
  };

  adicionarAoCarrinho(productId, tamanhoFinal, personalizacao);
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
  elementos.badgeTotalItens.textContent = String(totalItens);
  elementos.cartSummaryText.textContent = totalItens === 0 ? 'Nenhum item no carrinho' : `${totalItens} item${totalItens === 1 ? '' : 's'} no carrinho`;
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

function renderProdutos(listaProdutos = filterProdutos()) {
  elementos.produtos.innerHTML = '';

  if (listaProdutos.length === 0) {
    elementos.produtos.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);">Nenhum produto encontrado.</div>';
    return;
  }

  listaProdutos.forEach(produto => {
    const totalEstoque = getTotalStock(produto.estoque);
    const inStock = totalEstoque > 0;
    const precoFormatado = formatPrice(produto.preco);
    
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
    card.innerHTML = `
      <div class="product-image-wrapper">
        ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
        <div class="image-wrap" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
          <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" />
        </div>
      </div>
      <div class="product-content">
        <div class="product-brand">Seleção ${new Date().getFullYear()}</div>
        <h3 class="product-name">${produto.nome}</h3>
        <p class="product-description">Versão torcedor com tecido leve e respirável</p>
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
        <div class="offer-price"><span>${formatPrice(oferta.price)}</span></div>
        <div class="offer-extra">${oferta.extra}</div>
        <div class="offer-desc">${oferta.description}</div>
        <button type="button" class="btn-primary offer-cta">Ver ofertas</button>
      </div>
      <img class="offer-image" src="${oferta.image}" alt="${oferta.title}" />
    `;

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

  // Se tamanho não foi fornecido, usar o primeiro disponível
  if (!tamanho) {
    tamanho = SIZE_ORDER.find(t => getSizeStock(produto, t)) || 'M';
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
    produtoId: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    tamanho: tamanho,
    quantidade: quantidade,
    tipo: tipo,
    personalizacao: personalizacao
  });

  saveCart();
  renderProdutos();
  renderCarrinho();
  atualizarResumoDoCarrinho();
  showToast('Produto adicionado ao carrinho!', 'success');
  openCart();
}

function atualizarQuantidade(index, quantidade) {
  const item = carrinho[index];
  const produto = produtos.find(prod => prod.id === item.produtoId);
  if (!produto) return;

  const novaQuantidade = Math.max(1, Number(quantidade));

  if (item.tipo === 'Em estoque') {
    const estoqueAtual = getSizeStock(produto, item.tamanho);
    const maxDisponivel = estoqueAtual + item.quantidade;

    if (novaQuantidade > maxDisponivel) {
      item.quantidade = maxDisponivel;
      showToast(`Máximo permitido: ${maxDisponivel} unidade${maxDisponivel === 1 ? '' : 's'}.`, 'info');
    } else {
      produto.estoque[item.tamanho] = estoqueAtual + item.quantidade - novaQuantidade;
      item.quantidade = novaQuantidade;
    }
  } else {
    item.quantidade = novaQuantidade;
  }

  saveCart();
  renderProdutos();
  renderCarrinho();
}

function removerItem(index) {
  const item = carrinho[index];
  if (item.tipo === 'Em estoque') {
    const produto = produtos.find(prod => prod.id === item.produtoId);
    if (produto) {
      produto.estoque[item.tamanho] += item.quantidade;
    }
  }
  carrinho.splice(index, 1);
  saveCart();
  renderProdutos();
  renderCarrinho();
  showToast('Item removido do carrinho.', 'info');
}

function gerarMensagemWhatsApp() {
  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const linhas = ['Olá! Quero fazer um pedido de camisas:', '-----------------------------'];

  carrinho.forEach(item => {
    linhas.push(`Produto: ${item.nome}`);
    linhas.push(`Tamanho: ${item.tamanho}`);
    linhas.push(`Quantidade: ${item.quantidade}`);
    linhas.push(`Tipo: ${item.tipo}`);
    if (item.personalizacao.ativa) {
      linhas.push(`Personalização: ${item.personalizacao.nome} #${item.personalizacao.numero}`);
    }
    linhas.push('-----------------------------');
  });

  linhas.push(`TOTAL: ${formatPrice(total)}`);
  return encodeURIComponent(linhas.join('\n'));
}

function renderCarrinho() {
  elementos.listaCarrinho.innerHTML = '';

  if (carrinho.length === 0) {
    elementos.listaCarrinho.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Adicione uma camisa para começar o pedido.</div>';
    elementos.totalPedido.textContent = formatPrice(0);
    atualizarResumoDoCarrinho();
    return;
  }

  carrinho.forEach((item, index) => {
    const produto = produtos.find(prod => prod.id === item.produtoId);
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item';
    itemCard.innerHTML = `
      <img src="${produto.imagem}" alt="${item.nome}" />
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <div class="cart-item-meta">
          <span>Tamanho: ${item.tamanho}</span>
          <span>${item.tipo}</span>
          ${item.personalizacao.ativa ? `<span>${item.personalizacao.nome} #${item.personalizacao.numero}</span>` : ''}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <label for="cart-quantidade-${index}">Quantidade</label>
            <input id="cart-quantidade-${index}" type="number" min="1" value="${item.quantidade}" data-index="${index}" class="quantity-input" />
          </div>
          <button type="button" class="cart-item-remove" data-index="${index}">Remover</button>
        </div>
      </div>
    `;

    const quantityInput = itemCard.querySelector('input[type="number"]');
    const removeButton = itemCard.querySelector('.cart-item-remove');

    quantityInput.addEventListener('change', event => {
      const value = Number(event.target.value);
      if (Number.isNaN(value) || value < 1) {
        event.target.value = item.quantidade;
        return;
      }
      atualizarQuantidade(index, value);
    });

    removeButton.addEventListener('click', () => removerItem(index));
    elementos.listaCarrinho.appendChild(itemCard);
  });

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  elementos.totalPedido.textContent = formatPrice(total);
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

function initEvents() {
  elementos.productSearch.addEventListener('input', () => renderProdutos());
  elementos.productFilter.addEventListener('change', () => renderProdutos());
  elementos.btnVerCarrinho.addEventListener('click', openCart);
  elementos.btnCloseCart.addEventListener('click', closeCart);
  elementos.drawerOverlay.addEventListener('click', closeCart);
  elementos.btnFinalizar.addEventListener('click', finalizarPedido);

  // Modal events
  elementos.closeModal.addEventListener('click', closeProductModal);
  elementos.btnCancelModal.addEventListener('click', closeProductModal);
  elementos.productModal.addEventListener('click', (e) => {
    if (e.target === elementos.productModal) {
      closeProductModal();
    }
  });
  elementos.productForm.addEventListener('submit', handleProductFormSubmit);

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
  loadStockState();
  renderOfferCarousel();
  initOfferCarousel();
  renderProdutos();
  renderCarrinho();
  initEvents();
}

init();
