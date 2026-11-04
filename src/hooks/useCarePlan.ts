import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { validateCarePlanText } from '../domain/carePlan';
import { gerarPlanoCuidados } from '../services/cuidadosService';
import { loadCarePlan, saveCarePlan, type SavedCarePlan } from '../services/carePlanStorage';

const carePlanKey = (petId: number) => ['pet', petId, 'plano-cuidados'] as const;

export function useSavedCarePlan(petId: number) {
  return useQuery({
    queryKey: carePlanKey(petId),
    queryFn: () => loadCarePlan(petId),
    staleTime: Infinity,
  });
}

export function useGenerateCarePlan(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SavedCarePlan> => {
      const response = await gerarPlanoCuidados(petId);

      const checked = validateCarePlanText(response.planoGerado);
      if (!checked.ok) throw new Error(checked.error);

      const saved = { plan: checked.input, generatedAt: new Date().toISOString() };
      await saveCarePlan(petId, saved);
      return saved;
    },
    onSuccess: (saved) => queryClient.setQueryData(carePlanKey(petId), saved),
  });
}
