export interface UpcomingDose {
  id: number;
  vacinaNome: string;
  petNome: string;
  proximaDose: string;
}

export interface CicloItem {
  id: number;
  petNome: string;
  medicamentoNome: string;
  percent: number;
  overdue: boolean;
}
