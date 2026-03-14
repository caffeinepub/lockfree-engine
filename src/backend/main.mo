import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


// Migration pattern: We now always specify that migration should be run on upgrade.

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Subscription Tier Type
  public type SubscriptionTier = {
    #free;
    #pro;
    #enterprise;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  type BillingEvent = {
    id : Nat;
    userId : Principal;
    eventType : Text; // "plan_change", "payment_attempt"
    tier : Text;
    amount : Float;
    currency : Text; // "USD", "ICP"
    timestamp : Int;
    note : Text;
  };

  type SeatMember = {
    principalId : Principal;
    role : Text; // "admin", "editor", "viewer"
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

  // Join waitlist — public, no auth required
  public shared func joinWaitlist(email : Text, name : Text) : async Bool {
    // Basic validation
    if (email.size() == 0 or name.size() == 0) {
      return false;
    };
    // Prevent duplicates
    let existing = waitlistEntries.filter(func(e) { e.email == email });
    if (existing.size() > 0) {
      return true; // Already on the list, silently succeed
    };
    let entry : WaitlistEntry = {
      id = waitlistCounter;
      email;
      name;
      submittedAt = Time.now();
    };
    waitlistEntries.add(entry);
    waitlistCounter += 1;
    true;
  };

  // Get waitlist entries — admin only
  public query ({ caller }) func getWaitlistEntries() : async [WaitlistEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    waitlistEntries.toArray();
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let subscriptions = Map.empty<Principal, SubscriptionTier>();
  let billingEvents = List.empty<BillingEvent>();
  let seats = Map.empty<Principal, List.List<SeatMember>>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  let engineCounter = List.empty<Nat>();
  let appCounter = List.empty<Nat>();
  let chatCounter = List.empty<Nat>();

  // Engine Types
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

  // Engine CRUD Functions
  public shared ({ caller }) func createEngine(name : Text, provider : Text, cpu : Nat, ram : Nat, storage : Nat, costPerHour : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create engines");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list engines");
    };

    let filteredEngines = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        filteredEngines.add(engine);
      };
    };
    filteredEngines.toArray().sort();
  };

  public query ({ caller }) func getEngine(id : Nat) : async Engine {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view engines");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete engines");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update engine status");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deploy apps");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can migrate engines");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can distribute engines");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cost summary");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can populate demo data");
    };

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

  // Subscription and Billing Functions
  public query ({ caller }) func getMySubscription() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscription");
    };

    switch (subscriptions.get(caller)) {
      case (null) { "free" };
      case (?tier) {
        switch (tier) {
          case (#free) { "free" };
          case (#pro) { "pro" };
          case (#enterprise) { "enterprise" };
        };
      };
    };
  };

  public shared ({ caller }) func upgradeSubscription(tier : Text, paymentMethod : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade subscription");
    };

    let newTier : SubscriptionTier = switch (tier) {
      case ("free") { #free };
      case ("pro") { #pro };
      case ("enterprise") { #enterprise };
      case (_) { Runtime.trap("Invalid tier") };
    };

    let amount : Float = switch (newTier) {
      case (#free) { 0.0 };
      case (#pro) { 199.0 };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view billing events");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view usage summary");
    };

    // Count caller's engines
    let userEnginesList = List.empty<Engine>();
    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEnginesList.add(engine);
      };
    };
    let enginesCount = userEnginesList.size();

    // Count caller's deployments this month
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

    // Migrations are not tracked per-user in current implementation
    let migrationsThisMonth = 0;

    {
      enginesCount;
      deploymentsThisMonth;
      migrationsThisMonth;
    };
  };

  // Seat Management Functions
  public shared ({ caller }) func inviteSeat(member : Principal, role : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can invite seats");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove seats");
    };

    let userSeats = switch (seats.get(caller)) {
      case (null) { List.empty<SeatMember>() };
      case (?s) { s };
    };

    let filteredSeats = userSeats.filter(func(s) { s.principalId != member });
    seats.add(caller, filteredSeats);
  };

  public query ({ caller }) func listSeats() : async [SeatMember] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list seats");
    };

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

  /**
  * Returns all migration records for the caller, newest first (descending by id).
  */
  public query ({ caller }) func getMigrationHistory() : async [MigrationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view migration history");
    };

    switch (migrationHistory.get(caller)) {
      case (null) {
        [];
      };
      case (?history) {
        // Sort descending by id
        let records = history.toArray();
        let sorted = records.sort(
          func(a, b) { Nat.compare(b.id, a.id) }
        );
        sorted;
      };
    };
  };

  /**
  * Migrates an engine to a new provider and returns the migration record.
  * Computes mock savings and updates the engine state.
  */
  public shared ({ caller }) func migrateEngineWithDetails(id : Nat, targetProvider : Text) : async MigrationRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can migrate engines");
    };

    switch (engines.get(id)) {
      case (null) { Runtime.trap("Engine not found") };
      case (?engine) {
        if (engine.ownerId != caller) {
          Runtime.trap("Unauthorized: Only owner can migrate this engine");
        };

        // Compute mock savings based on provider
        let savingsPerMonth = switch (targetProvider) {
          case ("GCP") { 73.0 };
          case ("AWS") { 45.0 };
          case ("Azure") { 58.0 };
          case (_) { 50.0 };
        };

        // Count apps on this engine
        var appCount = 0;
        for ((_, app) in deployedApps.entries()) {
          if (app.engineId == engine.id) { appCount += 1 };
        };

        // Update engine with new provider and resilience score
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

        // Create migration record
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

        // Update migration history
        let userHistory = switch (migrationHistory.get(caller)) {
          case (null) { List.empty<MigrationRecord>() };
          case (?history) { history };
        };
        userHistory.add(migrationRecord);
        migrationHistory.add(caller, userHistory);

        // Increment migration counter
        migrationCounter += 1;

        // Return migration record
        migrationRecord;
      };
    };
  };

  /**
  * Distributes all caller's engines across providers and computes overall resilience score.
  */
  public shared ({ caller }) func distributeAndGetScore() : async DistributeResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can distribute engines");
    };

    // Get all caller's engines
    let userEngines = List.empty<Engine>();

    for ((_, engine) in engines.entries()) {
      if (engine.ownerId == caller) {
        userEngines.add(engine);
      };
    };

    let enginesArray = userEngines.toArray();
    let engineCount = enginesArray.size();

    let providers = ["AWS", "GCP", "Azure"];

    // Round-robin distribution across providers
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view migration history");
    };

    switch (migrationHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.toArray() };
    };
  };
};
