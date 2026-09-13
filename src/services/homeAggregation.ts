import type { Pet } from '../interfaces/pet';
import type { VacinaAplicacao } from '../interfaces/vacina';
import type { Medicamento } from '../interfaces/medicamento';
import type { UpcomingDose, CicloItem } from '../interfaces/home';

export function buildUpcomingDoses(
  pets: Pet[],
  vacinasPorPet: VacinaAplicacao[][]
): UpcomingDose[] {
  const now = Date.now();

  return pets
    .flatMap((pet, index) =>
      vacinasPorPet[index]
        .filter((aplicacao) => aplicacao.proximaDose && new Date(aplicacao.proximaDose).getTime() >= now)
        .map((aplicacao) => ({
          id: aplicacao.idAplicacaoVacina,
          vacinaNome: aplicacao.vacina.nome,
          petNome: pet.nome,
          proximaDose: aplicacao.proximaDose as string,
        }))
    )
    .sort((a, b) => new Date(a.proximaDose).getTime() - new Date(b.proximaDose).getTime());
}

// Sem um contador de doses semanais na API, o progresso é estimado a partir da
// janela dataInicio -> dataTermino do medicamento em uso.
export function buildCicloItems(pets: Pet[], medicamentosPorPet: Medicamento[][]): CicloItem[] {
  const now = Date.now();

  return pets.flatMap((pet, index) =>
    medicamentosPorPet[index]
      .filter((medicamento) => medicamento.status === 'EM_USO')
      .map((medicamento) => {
        const start = new Date(medicamento.dataInicio).getTime();
        const end = medicamento.dataTermino ? new Date(medicamento.dataTermino).getTime() : null;

        const percent = end && end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0;
        const overdue = end !== null && now > end;

        return {
          id: medicamento.idRegistroMedicamento,
          petNome: pet.nome,
          medicamentoNome: medicamento.nome,
          percent,
          overdue,
        };
      })
  );
}
