// CONFIGURAÇÃO - NOVATEC.PC.SOLUTION
// Dados de produtos, preços e configurações

const PRODUTOS = [
  // GPUs
  { id: 1, nome: 'RTX 4070 Ti', descricao: 'Placa Gráfica Premium', preco: 0, categoria: 'gpu', imagem: 'assets/images/gpu-rtx4070.jpg' },
  { id: 2, nome: 'RTX 5070', descricao: 'Última Geração', preco: 0, categoria: 'gpu', imagem: 'assets/images/gpu-rtx5070.jpg' },
  { id: 3, nome: 'RTX 4060 Ti', descricao: 'Entrada Gaming', preco: 0, categoria: 'gpu', imagem: 'assets/images/gpu-rtx4060.jpg' },
  
  // CPUs
  { id: 4, nome: 'Intel i9-13900K', descricao: 'Processador Topo', preco: 0, categoria: 'cpu', imagem: 'assets/images/cpu-i9.jpg' },
  { id: 5, nome: 'AMD Ryzen 9 7950X', descricao: 'Workstation Pro', preco: 0, categoria: 'cpu', imagem: 'assets/images/cpu-ryzen.jpg' },
  { id: 6, nome: 'Intel i7-13700K', descricao: 'Gaming Potente', preco: 0, categoria: 'cpu', imagem: 'assets/images/cpu-i7.jpg' },
  
  // RAM
  { id: 7, nome: 'RAM DDR5 32GB', descricao: 'Corsair Vengeance', preco: 0, categoria: 'ram', imagem: 'assets/images/ram-ddr5.jpg' },
  { id: 8, nome: 'RAM DDR4 16GB', descricao: 'Kingston Fury', preco: 0, categoria: 'ram', imagem: 'assets/images/ram-ddr4.jpg' },
  { id: 9, nome: 'RAM DDR5 64GB', descricao: 'Kit Dual Channel', preco: 0, categoria: 'ram', imagem: 'assets/images/ram-64gb.jpg' },
  
  // SSD
  { id: 10, nome: 'SSD 1TB NVMe', descricao: 'WD Black SN850X', preco: 0, categoria: 'ssd', imagem: 'assets/images/ssd-1tb.jpg' },
  { id: 11, nome: 'SSD 2TB NVMe', descricao: 'Samsung 990 Pro', preco: 0, categoria: 'ssd', imagem: 'assets/images/ssd-2tb.jpg' },
  { id: 12, nome: 'HDD 4TB', descricao: 'Seagate Barracuda', preco: 0, categoria: 'ssd', imagem: 'assets/images/hdd-4tb.jpg' },
  
  // REFRIGERAÇÃO
  { id: 13, nome: 'Cooler AIO 360mm', descricao: 'NZXT Kraken X63', preco: 0, categoria: 'cooler', imagem: 'assets/images/cooler-aio.jpg' },
  { id: 14, nome: 'Cooler GPU', descricao: 'Refrigeração Ativa', preco: 0, categoria: 'cooler', imagem: 'assets/images/cooler-gpu.jpg' },
  { id: 15, nome: 'Pasta Térmica', descricao: 'Thermal Grizzly', preco: 0, categoria: 'cooler', imagem: 'assets/images/pasta-termica.jpg' },
  { id: 16, nome: 'Cabo HDMI 2.1', descricao: '8K 60Hz', preco: 0, categoria: 'cooler', imagem: 'assets/images/cabo-hdmi.jpg' },
];

// CONTATO
const CONTATO = {
  whatsapp: '351916294573',
  email: 'novatecpc@gmail.com',
  telefone: '+351 916 294 573',
  nome: 'António Sousa',
};

// MOEDA
const MOEDA = '€';
