import type { Compartilhamento, VeterinarioPublico } from '../interfaces/veterinario';

export function isShareActive(share: Compartilhamento): boolean {
  return share.status === 'ATIVO';
}

// Quem já tem acesso ativo fica fora da busca; um vínculo revogado pode ser reativado.
export function availableToShare(
  results: VeterinarioPublico[],
  shares: Compartilhamento[]
): VeterinarioPublico[] {
  const withAccess = new Set(shares.filter(isShareActive).map((share) => share.idVeterinario));
  return results.filter((vet) => !withAccess.has(vet.idVeterinario));
}

export function sortShares(shares: Compartilhamento[]): Compartilhamento[] {
  return [...shares].sort((a, b) => {
    if (isShareActive(a) !== isShareActive(b)) return isShareActive(a) ? -1 : 1;
    return b.dataCompartilhamento.localeCompare(a.dataCompartilhamento);
  });
}
