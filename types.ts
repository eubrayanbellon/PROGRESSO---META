export enum Vendedora {
  BEA_LADY = 'BEA E LADY',
  SABRINA = 'SABRINA',
  GRAZIELE = 'GRAZIELE'
}

export interface SalesData {
  vendedora: string;
  agendamentos: number;
  meta: number;
}