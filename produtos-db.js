// Base de dados de produtos
const PRODUTOS_DB = [
  {
    id: 1,
    nome: 'Camisa do Brasil I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/brasil-1-2627-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 3,
    nome: 'Camisa do Real Madrid I 26/27',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/real-madrid-1-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 4,
    nome: 'Camisa da Espanha I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/espanha-1-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 5,
    nome: 'Camisa da Espanha II 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/espanha-2-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 6,
    nome: 'Camisa de Portugal I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/portugal-1-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 7,
    nome: 'Camisa de Portugal II 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/portugal-2-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 8,
    nome: 'Camisa da Argentina I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/argentina-1-2627-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 9,
    nome: 'Camisa da Argentina II 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/argentina-2-2627.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 10,
    nome: 'Camisa da Inglaterra I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/inglaterra-1-2627.jpg', 'img/inglaterra-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 11,
    nome: 'Camisa da França I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/franca-1-2627.jpg', 'img/franca-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 12,
    nome: 'Camisa da França II 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/franca-2-2627.jpg', 'img/franca-2-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 13,
    nome: 'Camisa da Colômbia I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/colombia-1-2627.jpg', 'img/colombia-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 14,
    nome: 'Camisa da Holanda I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/holanda-1-2627.jpg', 'img/holanda-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 15,
    nome: 'Camisa da Itália I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/italia-1-2627.jpg', 'img/italia-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 16,
    nome: 'Camisa do Brasil II 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/brasil-2-2627.jpg', 'img/brasil-2-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 17,
    nome: 'Camisa dos Estados Unidos I 26/27',
    preco: 149.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/estados-unidos-1-2627.jpg', 'img/estados-unidos-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 18,
    nome: 'Camisa do Corinthians I 26/27 (preta)',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/corinthians-1-2627.jpg', 'img/corinthians-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 19,
    nome: 'Camisa do Corinthians II 26/27 (laranja)',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/corinthians-2-2627.jpg', 'img/corinthians-2-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 20,
    nome: 'Camisa do Barcelona I 26/27',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/barcelona-1-2627.jpg', 'img/barcelona-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 21,
    nome: 'Camisa do Real Madrid I 26/27',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/real-madrid-1-2627.jpg', 'img/real-madrid-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 22,
    nome: 'Camisa do PSG I 26/27',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/psg-1-2627.jpg', 'img/psg-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 23,
    nome: 'Camisa do Santos I 26/27',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/santos-1-2627.jpg', 'img/santos-1-2627-2.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: { P: 0, M: 0, G: 0, GG: 0 }
  },
  {
    id: 24,
    nome: 'Camisa do Atlético Mineiro I 24/25',
    preco: 139.9,
    descricao: 'Versão torcedor com tecido leve e respirável',
    imagens: ['img/atletico-mineiro-1-2526.jpg'],
    tamanhos: ['M', 'G', 'GG', 'G1', 'G2'],
    estoque: { M: 11, G: 11, GG: 10, G1: 10, G2: 10 }
  },
  {
    id: 25,
    nome: 'Camisa do Barcelona I 25/26',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 25/26',
    imagens: ['img/barcelona-1-2526-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3'],
    estoque: { P: 13, M: 12, G: 11, GG: 11, G1: 10, G2: 10, G3: 10 }
  },
  {
    id: 26,
    nome: 'Camisa do Barcelona III 25/26',
    preco: 139.9,
    descricao: 'Terceira camisa - temporada 25/26',
    imagens: ['img/barcelona-2-2526-1.jpg'],
    tamanhos: ['G1', 'G2'],
    estoque: { G1: 10, G2: 10 }
  },
  {
    id: 27,
    nome: 'Camisa do Bayern de Munique II 25/26',
    preco: 139.9,
    descricao: 'Segunda camisa - temporada 25/26',
    imagens: ['img/bayern-de-munique-2-2526-1.jpg'],
    tamanhos: ['P', 'G', 'GG', 'G1', 'G2'],
    estoque: { P: 12, G: 11, GG: 10, G1: 10, G2: 10 }
  },
  {
    id: 28,
    nome: 'Camisa do Benfica I 25/26',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 25/26',
    imagens: ['img/benfica-1-2526-1.jpg'],
    tamanhos: ['GG', 'G1'],
    estoque: { GG: 11, G1: 10 }
  },
  {
    id: 29,
    nome: 'Camisa do Borussia Dortmund I 25/26',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 25/26',
    imagens: ['img/borussia-dortmund-1-2526-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'G1', 'G2'],
    estoque: { P: 12, M: 11, G: 12, GG: 10, G1: 10, G2: 10 }
  },
  {
    id: 30,
    nome: 'Camisa do Botafogo I 24/25',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 24/25',
    imagens: ['img/botafogo-1-2526-1.jpg'],
    tamanhos: ['M'],
    estoque: { M: 12 }
  },
  {
    id: 31,
    nome: 'Camisa do Chelsea I 25/26',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 25/26',
    imagens: ['img/chelsea-1-2526-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'G1', 'G2'],
    estoque: { P: 12, M: 12, G: 11, GG: 10, G1: 10, G2: 10 }
  },
  {
    id: 32,
    nome: 'Camisa do Arsenal I 25/26',
    preco: 139.9,
    descricao: 'Versão torcedor - temporada 25/26',
    imagens: ['img/arsenal-1-2526-1.jpg'],
    tamanhos: ['P', 'GG', 'G1', 'G2'],
    estoque: { P: 12, GG: 11, G1: 10, G2: 10 }
  },
  {
    id: 33,
    nome: 'Camisa do Atlético de Madrid II 25/26',
    preco: 139.9,
    descricao: 'Segunda camisa - temporada 25/26',
    imagens: ['img/atlético-de-madrid-2-2526-1.jpg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'G1'],
    estoque: { P: 11, M: 12, G: 11, GG: 10, G1: 10 }
  }
];