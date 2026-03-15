import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Engine {
    id: bigint;
    cpu: bigint;
    ram: bigint;
    status: string;
    costPerHour: number;
    provider: string;
    ownerId: Principal;
    storage: bigint;
    name: string;
    createdAt: bigint;
    resilienceScore: bigint;
}
export interface AdminUserRecord {
    tier: string;
    principalId: Principal;
}
export interface WaitlistEntry {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
}
export interface DistributeResult {
    updatedEngines: Array<Engine>;
    overallResilienceScore: bigint;
}
export interface SeatMember {
    role: string;
    invitedAt: bigint;
    principalId: Principal;
}
export interface BillingEvent {
    id: bigint;
    userId: Principal;
    note: string;
    tier: string;
    currency: string;
    timestamp: bigint;
    amount: number;
    eventType: string;
}
export interface MigrationRecord {
    id: bigint;
    status: string;
    engineId: bigint;
    savedPerMonth: number;
    appCount: bigint;
    toProvider: string;
    timestamp: bigint;
    fromProvider: string;
    engineName: string;
}
export interface UserProfile {
    name: string;
}
export interface ContentSettings {
    demoModeEnabled: boolean;
    announcementBanner: string;
    affiliateEnabled: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimInitialAdmin(): Promise<boolean>;
    createEngine(name: string, provider: string, cpu: bigint, ram: bigint, storage: bigint, costPerHour: number): Promise<bigint>;
    deleteEngine(id: bigint): Promise<void>;
    deployApp(engineId: bigint, _prompt: string): Promise<string>;
    distributeAcrossProviders(): Promise<void>;
    distributeAndGetScore(): Promise<DistributeResult>;
    getAdminAnalytics(): Promise<{
        freeCount: bigint;
        businessCount: bigint;
        totalWaitlist: bigint;
        totalEngines: bigint;
        totalUsers: bigint;
        proCount: bigint;
        enterpriseCount: bigint;
    }>;
    getBillingEvents(): Promise<Array<BillingEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContentSettings(): Promise<ContentSettings>;
    getCostSummary(): Promise<{
        totalCost: number;
        engineCosts: Array<[bigint, number]>;
    }>;
    getEngine(id: bigint): Promise<Engine>;
    getMigrationHistory(): Promise<Array<MigrationRecord>>;
    getMySubscription(): Promise<string>;
    getPublicContentSettings(): Promise<ContentSettings>;
    getUsageSummary(): Promise<{
        enginesCount: bigint;
        deploymentsThisMonth: bigint;
        migrationsThisMonth: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWaitlistEntries(): Promise<Array<WaitlistEntry>>;
    inviteSeat(member: Principal, role: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    joinWaitlist(email: string, name: string): Promise<boolean>;
    listAllUsers(): Promise<Array<AdminUserRecord>>;
    listEngines(): Promise<Array<Engine>>;
    listSeats(): Promise<Array<SeatMember>>;
    migrateEngine(id: bigint, targetProvider: string): Promise<void>;
    migrateEngineWithDetails(id: bigint, targetProvider: string): Promise<MigrationRecord>;
    populateDemoData(): Promise<void>;
    removeSeat(member: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveContentSettings(settings: ContentSettings): Promise<void>;
    sendMessage(content: string, _engineId: bigint | null): Promise<string>;
    setUserTier(user: Principal, tier: string): Promise<void>;
    updateEngineStatus(id: bigint, status: string): Promise<void>;
    upgradeSubscription(tier: string, paymentMethod: string): Promise<void>;
}
