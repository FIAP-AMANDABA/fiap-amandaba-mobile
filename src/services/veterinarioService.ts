import type { SpringPage, VeterinarioPublico } from '../interfaces/veterinario';
import { httpRequest } from './http';
import { JAVA_API_BASE_URL } from './javaApi';

const SEARCH_PAGE_SIZE = 20;

export type VeterinarioSearchField = 'nome' | 'crmv';

export async function searchVeterinarios(
  field: VeterinarioSearchField,
  text: string
): Promise<VeterinarioPublico[]> {
  const query = new URLSearchParams({ pagina: '0', tamanho: String(SEARCH_PAGE_SIZE) });
  if (text.trim()) query.set(field, text.trim());

  const page = await httpRequest<SpringPage<VeterinarioPublico>>(
    JAVA_API_BASE_URL,
    'GET',
    `/api/veterinarios?${query.toString()}`
  );
  return page.content;
}

export function getVeterinario(idVeterinario: number): Promise<VeterinarioPublico> {
  return httpRequest<VeterinarioPublico>(JAVA_API_BASE_URL, 'GET', `/api/veterinarios/${idVeterinario}`);
}
