/** Opção para digitação livre; o valor salvo no banco é sempre a string (marca/modelo/cor). */
export const OUTROS = 'Outros';

export const coresUsadas = [
  'Prata',
  'Preto',
  'Cinza',
  'Branco',
  'Vermelho',
  'Azul',
  'Verde',
  'Amarelo',
  'Rosa',
  'Marrom',
  'Bege',
];

export const marcasModelos: { marca: string; modelos: string[] }[] = [
  { marca: 'Chevrolet', modelos: ['Onix', 'Onix Plus', 'Prisma', 'Celta', 'Tracker', 'Spin', 'Cruze', 'Montana', 'S10', 'Trailblazer', 'Cobalt'] },
  { marca: 'Volkswagen', modelos: ['Gol', 'Fox', 'Polo', 'Virtus', 'Golf', 'T-Cross', 'Nivus', 'Taos', 'Saveiro', 'Amarok', 'Jetta'] },
  { marca: 'Fiat', modelos: ['Uno', 'Mobi', 'Palio', 'Argo', 'Cronos', 'Siena', 'Strada', 'Toro', 'Fastback', 'Pulse', 'Fiorino'] },
  { marca: 'Toyota', modelos: ['Corolla', 'Corolla Cross', 'Yaris', 'Etios', 'Hilux', 'SW4', 'RAV4'] },
  { marca: 'Honda', modelos: ['Civic', 'City', 'Fit', 'HR-V', 'WR-V', 'CR-V'] },
  { marca: 'Hyundai', modelos: ['HB20', 'HB20S', 'Creta', 'Tucson', 'Santa Fe', 'Azera'] },
  { marca: 'Renault', modelos: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch'] },
  { marca: 'Ford', modelos: ['Ka', 'Fiesta', 'Focus', 'EcoSport', 'Territory', 'Ranger', 'Maverick'] },
  { marca: 'Jeep', modelos: ['Renegade', 'Compass', 'Commander', 'Wrangler'] },
  { marca: 'Nissan', modelos: ['March', 'Versa', 'Sentra', 'Kicks', 'Frontier'] },
  { marca: 'BYD', modelos: ['Dolphin', 'Dolphin Mini', 'Seal', 'Song Plus'] },
  { marca: 'Peugeot', modelos: ['208', '2008', '308'] },
  { marca: 'Citroen', modelos: ['C3', 'C4 Cactus'] },
  { marca: 'Mitsubishi', modelos: ['L200', 'Pajero', 'Outlander'] },
  { marca: 'BMW', modelos: ['320i', 'X1', 'X3', 'X5'] },
  { marca: 'Mercedes-Benz', modelos: ['Classe A', 'Classe C', 'GLA', 'GLC'] },
  { marca: 'Audi', modelos: ['A3', 'A4', 'Q3', 'Q5'] },
];

export const opcoesCores = [...coresUsadas, OUTROS];

export function opcoesMarcas(): string[] {
  return [...marcasModelos.map((m) => m.marca), OUTROS];
}

export function opcoesModelosPorMarca(marca: string): string[] {
  if (!marca || marca === OUTROS) return [OUTROS];
  const item = marcasModelos.find((m) => m.marca.toLowerCase() === marca.toLowerCase());
  if (!item) return [OUTROS];
  return [...item.modelos, OUTROS];
}
