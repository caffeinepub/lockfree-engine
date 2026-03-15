import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminUserRecord,
  ContentSettings,
  WaitlistEntry,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export const adminQueryKeys = {
  isAdmin: ["isAdmin"] as const,
  analytics: ["adminAnalytics"] as const,
  users: ["adminUsers"] as const,
  waitlist: ["adminWaitlist"] as const,
  contentSettings: ["adminContentSettings"] as const,
};

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: adminQueryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAdminAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    freeCount: bigint;
    businessCount: bigint;
    totalWaitlist: bigint;
    totalEngines: bigint;
    totalUsers: bigint;
    proCount: bigint;
    enterpriseCount: bigint;
  }>({
    queryKey: adminQueryKeys.analytics,
    queryFn: async () => {
      if (!actor)
        return {
          freeCount: 0n,
          businessCount: 0n,
          totalWaitlist: 0n,
          totalEngines: 0n,
          totalUsers: 0n,
          proCount: 0n,
          enterpriseCount: 0n,
        };
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useListAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<AdminUserRecord[]>({
    queryKey: adminQueryKeys.users,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useWaitlistEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<WaitlistEntry[]>({
    queryKey: adminQueryKeys.waitlist,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWaitlistEntries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useContentSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentSettings>({
    queryKey: adminQueryKeys.contentSettings,
    queryFn: async () => {
      if (!actor)
        return {
          demoModeEnabled: true,
          announcementBanner: "",
          affiliateEnabled: true,
        };
      return actor.getContentSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSaveContentSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: ContentSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveContentSettings(settings);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.contentSettings });
    },
  });
}

export function useSetUserTier() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { principalId: string; tier: string }) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.setUserTier(
        Principal.fromText(params.principalId),
        params.tier,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.users });
      void qc.invalidateQueries({ queryKey: adminQueryKeys.analytics });
    },
  });
}
