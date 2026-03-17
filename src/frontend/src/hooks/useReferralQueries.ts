import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FlaggedAffiliate } from "../backend.d.ts";
import { useActor } from "./useActor";

export const referralQueryKeys = {
  count: (code: string) => ["referralCount", code] as const,
  flagged: ["flaggedAffiliates"] as const,
};

export function useGetReferralCount(code: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: referralQueryKeys.count(code),
    queryFn: async () => {
      if (!actor || !code) return 0n;
      return actor.getReferralCount(code);
    },
    enabled: !!actor && !isFetching && !!code,
    staleTime: 30_000,
  });
}

export function useReportReferral() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.reportReferral(code);
    },
    onSuccess: (_result, code) => {
      void qc.invalidateQueries({ queryKey: referralQueryKeys.count(code) });
    },
  });
}

export function useGetFlaggedAffiliates() {
  const { actor, isFetching } = useActor();
  return useQuery<FlaggedAffiliate[]>({
    queryKey: referralQueryKeys.flagged,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFlaggedAffiliates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useClearFlaggedAffiliate() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.clearFlaggedAffiliate(code);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: referralQueryKeys.flagged });
    },
  });
}
