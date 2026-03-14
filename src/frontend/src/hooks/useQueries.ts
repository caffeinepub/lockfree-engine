import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BillingEvent,
  DistributeResult,
  Engine,
  MigrationRecord,
  SeatMember,
} from "../backend.d.ts";
import { useActor } from "./useActor";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const queryKeys = {
  engines: ["engines"] as const,
  costSummary: ["costSummary"] as const,
  engine: (id: bigint) => ["engine", id.toString()] as const,
  subscription: ["subscription"] as const,
  billingEvents: ["billingEvents"] as const,
  usageSummary: ["usageSummary"] as const,
  seats: ["seats"] as const,
  migrationHistory: ["migrationHistory"] as const,
};

// ─── Read Queries ─────────────────────────────────────────────────────────────

export function useListEngines() {
  const { actor, isFetching } = useActor();
  return useQuery<Engine[]>({
    queryKey: queryKeys.engines,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEngines();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useCostSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalCost: number; engineCosts: Array<[bigint, number]> }>({
    queryKey: queryKeys.costSummary,
    queryFn: async () => {
      if (!actor) return { totalCost: 0, engineCosts: [] };
      return actor.getCostSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateEngine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      provider: string;
      cpu: number;
      ram: number;
      storage: number;
      costPerHour: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEngine(
        params.name,
        params.provider,
        BigInt(params.cpu),
        BigInt(params.ram),
        BigInt(params.storage),
        params.costPerHour,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
      void qc.invalidateQueries({ queryKey: queryKeys.costSummary });
    },
  });
}

export function useDeleteEngine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEngine(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
      void qc.invalidateQueries({ queryKey: queryKeys.costSummary });
    },
  });
}

export function useMigrateEngine() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: bigint; targetProvider: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.migrateEngine(params.id, params.targetProvider);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
    },
  });
}

export function useMigrateEngineWithDetails() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    MigrationRecord,
    Error,
    { id: bigint; targetProvider: string }
  >({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Not connected");
      return actor.migrateEngineWithDetails(params.id, params.targetProvider);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
      void qc.invalidateQueries({ queryKey: queryKeys.migrationHistory });
    },
  });
}

export function useGetMigrationHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<MigrationRecord[]>({
    queryKey: queryKeys.migrationHistory,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMigrationHistory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useDistributeAndGetScore() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<DistributeResult, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.distributeAndGetScore();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
    },
  });
}

export function useDeployApp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: { engineId: bigint; prompt: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deployApp(params.engineId, params.prompt);
    },
  });
}

export function useDistributeAcrossProviders() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.distributeAcrossProviders();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
    },
  });
}

export function usePopulateDemoData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.populateDemoData();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.engines });
      void qc.invalidateQueries({ queryKey: queryKeys.costSummary });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      content: string;
      engineId: bigint | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(params.content, params.engineId);
    },
  });
}

// ─── Subscription / Billing Queries ──────────────────────────────────────────

export function useGetMySubscription() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: queryKeys.subscription,
    queryFn: async () => {
      if (!actor) return "free";
      return actor.getMySubscription();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetBillingEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<BillingEvent[]>({
    queryKey: queryKeys.billingEvents,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBillingEvents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetUsageSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    enginesCount: bigint;
    deploymentsThisMonth: bigint;
    migrationsThisMonth: bigint;
  }>({
    queryKey: queryKeys.usageSummary,
    queryFn: async () => {
      if (!actor)
        return {
          enginesCount: 0n,
          deploymentsThisMonth: 0n,
          migrationsThisMonth: 0n,
        };
      return actor.getUsageSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}

export function useListSeats() {
  const { actor, isFetching } = useActor();
  return useQuery<SeatMember[]>({
    queryKey: queryKeys.seats,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSeats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUpgradeSubscription() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { tier: string; paymentMethod: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.upgradeSubscription(params.tier, params.paymentMethod);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.subscription });
      void qc.invalidateQueries({ queryKey: queryKeys.billingEvents });
      void qc.invalidateQueries({ queryKey: queryKeys.usageSummary });
    },
  });
}

export function useInviteSeat() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { member: string; role: string }) => {
      if (!actor) throw new Error("Not connected");
      // Convert string to Principal
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.inviteSeat(Principal.fromText(params.member), params.role);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.seats });
    },
  });
}

export function useRemoveSeat() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.removeSeat(Principal.fromText(principalId));
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.seats });
    },
  });
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

const WAITLIST_KEY = "lockfree_waitlist_entries";

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (params: { email: string; name: string }) => {
      // Persist locally (client-side waitlist for demo/launch)
      const existing = JSON.parse(localStorage.getItem(WAITLIST_KEY) ?? "[]");
      existing.push({ ...params, submittedAt: Date.now() });
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(existing));
      // Small artificial delay for UX
      await new Promise((r) => setTimeout(r, 600));
      return true;
    },
  });
}
