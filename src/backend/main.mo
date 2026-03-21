import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Stable admin principal — survives canister upgrades
  var stableAdminPrincipal : ?Principal = null;

  // Restore admin into accessControlState after every upgrade
  system func postupgrade() {
    switch (stableAdminPrincipal) {
      case (?admin) {
        accessControlState.userRoles.add(admin, #admin);
        accessControlState.adminAssigned := true;
      };
      case (null) {};
    };
  };

  // Subscription tier
  public type SubscriptionTier = {
    #free;
    #pro;
    #business;
    #enterprise;
  };

  public type UserProfile = {
    name : Text;
  };

  type BillingEvent = {
    id : Nat;
    userId : Principal;
    eventType : Text;
    tier : Text;
    amount : Float;
    currency : Text;
    timestamp : Int;
    note : Text;
  };

  type SeatMember = {
    principalId : Principal;
    role : Text;
    invitedAt : Int;
  };

  // Waitlist
  public type WaitlistEntry = {
    id : Nat;
    email : Text;
    name : Text;
    submittedAt : Int;
  };

  let waitlistEntries = List.empty<WaitlistEntry>();
  var waitlistCounter = 0;

  // Rate limiting storage
  let joinWaitlistAttempts = Map.empty<Principal, List.List<Int>>();

  // Join waitlist with rate limiting
  public shared ({ caller }) func joinWaitlist(email : Text, name : Text) : async Bool {
    if (email.size() == 0 or name.size() == 0) {
      return false;
    };

    let existing = waitlistEntries.filter(func(e) { e.email == email });
    if (existing.size() > 0) { return true };

    let now = Time.now();
    let dayInNanos = 24 * 60 * 60 * 1_000_000_000;

    let attempts = switch (joinWaitlistAttempts.get(caller)) {
      case (null) { List.empty<Int>() };
      case (?attempts) {
        let filteredAttempts = attempts.filter(
          func(ts) { now - ts <= dayInNanos }
        );
        filteredAttempts;
      };
    };

    if (attempts.size() >= 3) { return false };

    let entry : WaitlistEntry = {
      id = waitlistCounter;
      email;
      name;
      submittedAt = now;
    };

    waitlistEntries.add(entry);
    waitlistCounter += 1;

    attempts.add(now);
    joinWaitlistAttempts.add(caller, attempts);

    true;
  };

  public query ({ caller }) func getWaitlistEntries() : async [WaitlistEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    waitlistEntries.toArray();
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let subscriptions = Map.empty<Principal, SubscriptionTier>();
  let billingEvents = List.empty<BillingEvent>();
  let seats = Map.empty<Principal, List.List<SeatMember>>();

  // User Profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  let engineCounter = List.empty<Nat>();
  let appCounter = List.empty<Nat>();
  let chatCounter = List.empty<Nat>();

  // Engine
  public type Engine = {
    id : Nat;
    name : Text;
    provider : Text;
    cpu : Nat;
    ram : Nat;
    storage : Nat;
    status : Text;
    createdAt : Int;
    costPerHour : Float;
    resilienceScore : Nat;
    ownerId : Principal;
  };

  module Engine {
    public func compare(e1 : Engine, e2 : Engine) : Order.Order {
      Nat.compare(e1.id, e2.id);
    };
  };

  type DeployedApp = {
    id : Nat;
    engineId : Nat;
    name : Text;
    appType : Text;
    status : Text;
    deployedAt : Int;
  };

  type ChatMessage = {
    id : Nat;
    role : Text;
    content : Text;
    timestamp : Int;
  };

  let engines = Map.empty<Nat, Engine>();
  let deployedApps = Map.empty<Nat, DeployedApp>();
  let chatMessages = Map.empty<Nat, ChatMessage>();

  // Engine CRUD
  public shared ({ caller }) func createEngine(name : Text, provider : Text, cpu : Nat, ram : Nat, storage : Nat, costPerHour : Float) : async Nat {
    let userTier = switch (subscriptions.get(caller)) {
      case (null) { #free };
      case (?tier) { tier };
    };

    if (userTier == #free) {
      let userEngineCount = List.empty<Nat>();
      for ((_, engine) in engines.entries()) {
        if (engine.ownerId == caller) {
          userEngineCount.add(engine.id);
        };
      };

      if (userEngineCount.size() >= 1) {
        Runtime.trap("Free tier limit: upgrade to Pro for unlimited engines");
      };
    };

    let currentId = engineCounter.size();
    engineCounter.add(0);

    let engine : Engine = {
      id = currentId;
      name;
      provider;
      cpu;
      ram;
      storage;
      status = "provisioning";
      createdAt = Time.now();
      costPerHour;
      resilienceScore = 0;
      ownerId = caller;
    };

    engines.add(currentId, engine);
    currentId;
  };

  public query ({ caller }) func listEngines() : async [Engine] {
    let filteredEngines = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        filteredEngines.add(engine);
      };
    };
    filteredEngines.toArray().sort();
  };

  public query ({ caller }) func getEngine(id : Nat) : async Engine {
    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can view this engine");
        };
        engine;
      };
    };
  };

  public shared ({ caller }) func deleteEngine(id : Nat) : async () {
    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can delete this engine");
        };
        engines.remove(id);
      };
    };
  };

  public shared ({ caller }) func updateEngineStatus(id : Nat, status : Text) : async () {
    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can update this engine");
        };
        let updatedEngine : Engine = { engine with status };
        engines.add(id, updatedEngine);
      };
    };
  };

  // App Deployment
  public shared ({ caller }) func deployApp(engineId : Nat, _prompt : Text) : async Text {
    let userTier = switch (subscriptions.get(caller)) {
      case (null) { #free };
      case (?tier) { tier };
    };

    if (userTier == #free) {
      let userAppCount = List.empty<Nat>();
      for ((_, app) in deployedApps.entries()) {
        switch (engines.get(app.engineId)) {
          case (null) {};
          case (?engine) {
            if (engine.ownerId == caller and app.deployedAt >= (Time.now() - (30 * 24 * 60 * 60 * 1_000_000_000))) {
              userAppCount.add(app.id);
            };
          };
        };
      };

      if (userAppCount.size() >= 5) {
        Runtime.trap("Free tier limit: 5 deployments/month on Free plan");
      };
    };

    switch (engines.get(engineId)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can deploy apps on this engine");
        };

        let currentId = appCounter.size();
        appCounter.add(0);

        let app : DeployedApp = {
          id = currentId;
          engineId;
          name = "CRM App";
          appType = "CRM";
          status = "deployed";
          deployedAt = Time.now();
        };

        deployedApps.add(currentId, app);
        "App successfully deployed! You can now access your CRM dashboard.";
      };
    };
  };

  // Chat
  public shared ({ caller }) func sendMessage(content : Text, _engineId : ?Nat) : async Text {
    let currentId = chatCounter.size();
    chatCounter.add(0);

    let message : ChatMessage = {
      id = currentId;
      role = "user";
      content;
      timestamp = Time.now();
    };

    chatMessages.add(currentId, message);

    let response : ChatMessage = {
      id = currentId + 1;
      role = "assistant";
      content = "Sure! I can help you with that. Just let me know what you need.";
      timestamp = Time.now();
    };

    chatMessages.add(currentId + 1, response);
    response.content;
  };

  // Migration
  public shared ({ caller }) func migrateEngine(id : Nat, targetProvider : Text) : async () {
    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can migrate this engine");
        };
        let updatedEngine : Engine = { engine with provider = targetProvider; status = "migrating" };
        engines.add(id, updatedEngine);
      };
    };
  };

  // Distribution
  public shared ({ caller }) func distributeAcrossProviders() : async () {
    let userEnginesList = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEnginesList.add(engine);
      };
    };

    let providers = ["AWS_", "GCP_", "Azure_"];
    let userEngines = userEnginesList.toArray();

    var i = 0;
    for (engine in userEngines.values()) {
      let updatedEngine : Engine = { engine with provider = providers[i % 3]; status = "running" };
      engines.add(engine.id, updatedEngine);
      i += 1;
    };
  };

  // Cost Summary
  public query ({ caller }) func getCostSummary() : async {
    engineCosts : [(Nat, Float)];
    totalCost : Float;
  } {
    let userEnginesList = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEnginesList.add(engine);
      };
    };

    let engineCosts = userEnginesList.toArray().map(
      func(e) { (e.id, e.costPerHour) }
    );

    let totalCost = userEnginesList.toArray().foldLeft(
      0.0,
      func(acc, e) { acc + e.costPerHour },
    );

    {
      engineCosts;
      totalCost;
    };
  };

  // Demo Data
  public shared ({ caller }) func populateDemoData() : async () {
    let existingEngines = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        existingEngines.add(engine);
      };
    };

    if (existingEngines.isEmpty()) {
      ignore await createEngine("LockFree", "AWS_", 4, 16, 100, 0.25);
      ignore await createEngine("GravityLock", "GCP_", 8, 32, 250, 0.40);
      ignore await createEngine("HydraDNS", "Azure_", 16, 64, 500, 0.75);

      switch (engines.get(0)) {
        case (?e) {
          ignore await deployApp(e.id, "CRM");
          ignore await deployApp(e.id, "Analytics");
        };
        case (null) {};
      };
    };
  };

  // Subscription and Billing
  public query ({ caller }) func getMySubscription() : async Text {
    switch (subscriptions.get(caller)) {
      case (null) { "free" };
      case (?tier) {
        switch (tier) {
          case (#free) { "free" };
          case (#pro) { "pro" };
          case (#business) { "business" };
          case (#enterprise) { "enterprise" };
        };
      };
    };
  };

  public shared ({ caller }) func upgradeSubscription(tier : Text, paymentMethod : Text) : async () {
    let newTier : SubscriptionTier = switch (tier) {
      case ("free") { #free };
      case ("pro") { #pro };
      case ("business") { #business };
      case ("enterprise") { #enterprise };
      case (_) { Runtime.trap("Invalid tier") };
    };

    let amount : Float = switch (newTier) {
      case (#free) { 0.0 };
      case (#pro) { 199.0 };
      case (#business) { 199.0 };
      case (#enterprise) { 999.0 };
    };

    subscriptions.add(caller, newTier);

    let eventId = billingEvents.size();
    let event : BillingEvent = {
      id = eventId;
      userId = caller;
      eventType = "plan_change";
      tier;
      amount;
      currency = paymentMethod;
      timestamp = Time.now();
      note = "Subscription upgrade";
    };

    billingEvents.add(event);
  };

  public query ({ caller }) func getBillingEvents() : async [BillingEvent] {
    let filteredEvents = billingEvents.filter(
      func(e) {
        e.userId == caller;
      }
    );
    filteredEvents.toArray();
  };

  public query ({ caller }) func getUsageSummary() : async {
    enginesCount : Nat;
    deploymentsThisMonth : Nat;
    migrationsThisMonth : Nat;
  } {
    let userEnginesList = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEnginesList.add(engine);
      };
    };
    let enginesCount = userEnginesList.size();

    let currentTime = Time.now();
    let monthAgo = currentTime - 30 * 24 * 60 * 60 * 1_000_000_000;

    let userDeploymentsList = List.empty<DeployedApp>();
    for ((_, app) in deployedApps.entries()) {
      if (app.deployedAt >= monthAgo) {
        switch (engines.get(app.engineId)) {
          case (null) {};
          case (?engine) {
            if (engine.ownerId == caller) {
              userDeploymentsList.add(app);
            };
          };
        };
      };
    };
    let deploymentsThisMonth = userDeploymentsList.size();

    let migrationsThisMonth = 0;

    {
      enginesCount;
      deploymentsThisMonth;
      migrationsThisMonth;
    };
  };

  // Seat Management
  public shared ({ caller }) func inviteSeat(member : Principal, role : Text) : async () {
    let userTier = switch (subscriptions.get(caller)) {
      case (null) { #free };
      case (?tier) { tier };
    };

    if (userTier != #enterprise) {
      Runtime.trap("Only enterprise accounts can invite seats");
    };

    let seat : SeatMember = {
      principalId = member;
      role;
      invitedAt = Time.now();
    };

    let existingSeats = switch (seats.get(caller)) {
      case (null) { List.empty<SeatMember>() };
      case (?s) { s };
    };
    existingSeats.add(seat);

    if (existingSeats.size() > 10) {
      Runtime.trap("Enterprise accounts can have up to 10 seats");
    };

    seats.add(caller, existingSeats);
  };

  public shared ({ caller }) func removeSeat(member : Principal) : async () {
    let userSeats = switch (seats.get(caller)) {
      case (null) { List.empty<SeatMember>() };
      case (?s) { s };
    };

    let filteredSeats = userSeats.filter(func(s) { s.principalId != member });
    seats.add(caller, filteredSeats);
  };

  public query ({ caller }) func listSeats() : async [SeatMember] {
    switch (seats.get(caller)) {
      case (null) { [] };
      case (?s) { s.toArray() };
    };
  };

  //////////////////////////////////
  // New Migration Functionality  //
  //////////////////////////////////

  type MigrationRecord = {
    id : Nat;
    engineId : Nat;
    engineName : Text;
    fromProvider : Text;
    toProvider : Text;
    timestamp : Int;
    savedPerMonth : Float;
    appCount : Nat;
    status : Text;
  };

  type DistributeResult = {
    updatedEngines : [Engine];
    overallResilienceScore : Nat;
  };

  var migrationCounter = 0;
  let migrationHistory = Map.empty<Principal, List.List<MigrationRecord>>();

  public query ({ caller }) func getMigrationHistory() : async [MigrationRecord] {
    switch (migrationHistory.get(caller)) {
      case (null) { [] };
      case (?history) {
        let records = history.toArray();
        let sorted = records.sort(
          func(a, b) { Nat.compare(b.id, a.id) }
        );
        sorted;
      };
    };
  };

  public shared ({ caller }) func migrateEngineWithDetails(id : Nat, targetProvider : Text) : async MigrationRecord {
    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can migrate this engine");
        };

        let savingsPerMonth = switch (targetProvider) {
          case ("GCP") { 73.0 };
          case ("AWS") { 45.0 };
          case ("Azure") { 58.0 };
          case (_) { 50.0 };
        };

        var appCount = 0;
        for ((_, app) in deployedApps.entries()) {
          if (app.engineId == engine.id) { appCount += 1 };
        };

        let updatedEngine : Engine = {
          engine with provider = targetProvider;
          status = "running";
          resilienceScore = switch (targetProvider) {
            case ("AWS") { 55 };
            case ("GCP") { 72 };
            case ("Azure") { 61 };
            case (_) { 50 };
          };
        };
        engines.add(id, updatedEngine);

        let migrationRecord : MigrationRecord = {
          id = migrationCounter;
          engineId = engine.id;
          engineName = engine.name;
          fromProvider = engine.provider;
          toProvider = targetProvider;
          timestamp = Time.now();
          savedPerMonth = savingsPerMonth;
          appCount;
          status = "completed";
        };

        let userHistory = switch (migrationHistory.get(caller)) {
          case (null) { List.empty<MigrationRecord>() };
          case (?history) { history };
        };
        userHistory.add(migrationRecord);
        migrationHistory.add(caller, userHistory);

        migrationCounter += 1;

        migrationRecord;
      };
    };
  };

  public shared ({ caller }) func distributeAndGetScore() : async DistributeResult {
    let userEngines = List.empty<Engine>();

    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEngines.add(engine);
      };
    };

    let enginesArray = userEngines.toArray();
    let engineCount = enginesArray.size();

    let providers = ["AWS", "GCP", "Azure"];

    let updatedEngines = List.empty<Engine>();

    var totalScore = 0;
    var i = 0;
    for (engine in enginesArray.values()) {
      let assignedProvider = providers[i % 3];

      let resilienceScore = switch (assignedProvider) {
        case ("AWS") { 55 };
        case ("GCP") { 72 };
        case ("Azure") { 61 };
        case (_) { 50 };
      };

      let updatedEngine : Engine = { engine with provider = assignedProvider; status = "running"; resilienceScore };
      updatedEngines.add(updatedEngine);

      engines.add(engine.id, updatedEngine);

      totalScore += resilienceScore;
      i += 1;
    };

    let overallResilienceScore = if (engineCount == 0) { 0 } else {
      let avgScore = totalScore / engineCount;
      if (avgScore > 100) { 100 } else { avgScore };
    };

    let updatedEnginesArray = updatedEngines.toArray();

    {
      updatedEngines = updatedEnginesArray;
      overallResilienceScore;
    };
  };

  public query ({ caller }) func _getMigrationHistoryForTests() : async [MigrationRecord] {
    switch (migrationHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.toArray() };
    };
  };

  /////////////////////////
  // Admin API           //
  /////////////////////////

  type ContentSettings = {
    announcementBanner : Text;
    demoModeEnabled : Bool;
    affiliateEnabled : Bool;
  };

  var contentSettings : ContentSettings = {
    announcementBanner = "";
    demoModeEnabled = true;
    affiliateEnabled = true;
  };

  type AdminUserRecord = {
    principalId : Principal;
    tier : Text;
  };

  /*
  * Claim initial admin — the first non-anonymous caller becomes admin.
  * Saves to a stable variable so it survives canister upgrades.
  * If an admin is already assigned, returns whether the caller is that admin.
  */
  public shared ({ caller }) func claimInitialAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };

    // Restore stable admin into accessControlState if it was wiped by an upgrade
    switch (stableAdminPrincipal) {
      case (?admin) {
        // Ensure the admin role is active in the in-memory state
        accessControlState.userRoles.add(admin, #admin);
        accessControlState.adminAssigned := true;
        return admin == caller;
      };
      case (null) {
        // No admin yet — this caller becomes admin
        stableAdminPrincipal := ?caller;
        accessControlState.userRoles.add(caller, #admin);
        accessControlState.adminAssigned := true;
        return true;
      };
    };
  };


  public query ({ caller }) func listAllUsers() : async [AdminUserRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let adminRecords = List.empty<AdminUserRecord>();

    for ((principal, tier) in subscriptions.entries()) {
      let tierText = switch (tier) {
        case (#free) { "free" };
        case (#pro) { "pro" };
        case (#business) { "business" };
        case (#enterprise) { "enterprise" };
      };

      let record : AdminUserRecord = {
        principalId = principal;
        tier = tierText;
      };
      adminRecords.add(record);
    };

    adminRecords.toArray();
  };

  public shared ({ caller }) func setUserTier(user : Principal, tier : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let newTier : SubscriptionTier = switch (tier) {
      case ("free") { #free };
      case ("pro") { #pro };
      case ("business") { #business };
      case ("enterprise") { #enterprise };
      case (_) { Runtime.trap("Invalid tier") };
    };

    subscriptions.add(user, newTier);
  };

  // Admin: delete all data for a given user (GDPR erasure)
  public shared ({ caller }) func deleteUserData(user : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    // Remove engines owned by the user
    let engineIdsToRemove = List.empty<Nat>();
    for ((id, engine) in engines.entries()) {
      if (engine.ownerId == user) {
        engineIdsToRemove.add(id);
      };
    };
    for (id in engineIdsToRemove.values()) {
      engines.remove(id);
    };

    // Remove migration history
    migrationHistory.remove(user);

    // Remove billing events for the user
    let remainingBilling = billingEvents.filter(func(e) { e.userId != user });
    billingEvents.clear();
    for (e in remainingBilling.values()) {
      billingEvents.add(e);
    };

    // Remove profile and subscription
    userProfiles.remove(user);
    subscriptions.remove(user);
    seats.remove(user);

    true;
  };

  public query ({ caller }) func getAdminAnalytics() : async {
    totalWaitlist : Nat;
    totalUsers : Nat;
    freeCount : Nat;
    proCount : Nat;
    businessCount : Nat;
    enterpriseCount : Nat;
    totalEngines : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    var freeCount = 0;
    var proCount = 0;
    var businessCount = 0;
    var enterpriseCount = 0;

    for ((_, tier) in subscriptions.entries()) {
      switch (tier) {
        case (#free) { freeCount += 1 };
        case (#pro) { proCount += 1 };
        case (#business) { businessCount += 1 };
        case (#enterprise) { enterpriseCount += 1 };
      };
    };

    {
      totalWaitlist = waitlistCounter;
      totalUsers = subscriptions.size();
      freeCount;
      proCount;
      businessCount;
      enterpriseCount;
      totalEngines = engines.size();
    };
  };

  public query ({ caller }) func getContentSettings() : async ContentSettings {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    contentSettings;
  };

  public shared ({ caller }) func saveContentSettings(settings : ContentSettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    contentSettings := settings;
  };

  public query ({ caller }) func getPublicContentSettings() : async ContentSettings {
    contentSettings;
  };

  /////////////////////////////
  // Referral Tracking      //
  /////////////////////////////

  let referralCounts = Map.empty<Text, Nat>();
  let referralTimestamps = Map.empty<Text, List.List<Int>>();
  let flaggedAffiliates = List.empty<(Text, Text, Text, Int)>();

  public type ReferralStatus = {
    #ok : Nat;
    #capReached;
    #flagged;
  };

  public type FlaggedAffiliate = {
    id : Nat;
    code : Text;
    principal : Text;
    reason : Text;
    flaggedAt : Int;
  };

  public shared ({ caller }) func reportReferral(code : Text) : async {
    #ok : Nat;
    #capReached;
    #flagged;
  } {
    let count = switch (referralCounts.get(code)) {
      case (null) { 0 };
      case (?c) { c };
    };

    if (count > 50) { return #capReached };

    let now = Time.now();
    let dayInNanos = 24 * 60 * 60 * 1_000_000_000;

    // Filter timestamps to last 24h
    let timestamps = switch (referralTimestamps.get(code)) {
      case (null) { List.empty<Int>() };
      case (?ts) {
        let filtered = ts.filter(func(t) { now - t <= dayInNanos });
        filtered;
      };
    };
    referralTimestamps.add(code, timestamps);

    if (timestamps.size() > 10) {
      let flaggedIds = flaggedAffiliates.filter(func(f) { f.0 == code and f.0 != "" });
      if (flaggedIds.isEmpty()) {
        flaggedAffiliates.add((code, "", "Too many referrals in 24h", now));
        return #flagged;
      };
    };

    if (count >= 50) { return #capReached };

    let newCount = count + 1;
    referralCounts.add(code, newCount);

    timestamps.add(now);
    referralTimestamps.add(code, timestamps);

    #ok(newCount);
  };

  public query ({ caller }) func getReferralCount(code : Text) : async Nat {
    switch (referralCounts.get(code)) {
      case (null) { 0 };
      case (?count) { count };
    };
  };

  public query ({ caller }) func getFlaggedAffiliates() : async [FlaggedAffiliate] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let flagged = List.empty<FlaggedAffiliate>();
    var i = 0;
    for (entry in flaggedAffiliates.values()) {
      flagged.add({
        id = i;
        code = entry.0;
        principal = entry.1;
        reason = entry.2;
        flaggedAt = entry.3;
      });
      i += 1;
    };
    flagged.toArray();
  };

  public shared ({ caller }) func clearFlaggedAffiliate(code : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let originalSize = flaggedAffiliates.size();
    let filtered = flaggedAffiliates.filter(func(f) { f.0 != code });
    flaggedAffiliates.clear();
    for (entry in filtered.values()) {
      flaggedAffiliates.add(entry);
    };
    filtered.size() < originalSize;
  };
};
