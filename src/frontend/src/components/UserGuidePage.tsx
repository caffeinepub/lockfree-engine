import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Code2,
  Cpu,
  CreditCard,
  Database,
  Download,
  Globe,
  HardDrive,
  Key,
  LayoutDashboard,
  ListChecks,
  LogIn,
  MessageSquare,
  Moon,
  Navigation,
  Network,
  Package,
  Rocket,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Shuffle,
  Star,
  Sun,
  ToggleLeft,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

// ─── Business Owners Sections ────────────────────────────────────────────────

const businessSections: GuideSection[] = [
  {
    id: "what-is",
    title: "What is LockFree Engine?",
    icon: BookOpen,
    content: (
      <div className="space-y-3">
        <p>
          LockFree Engine is a cloud management dashboard that gives you
          complete freedom to run your business apps on{" "}
          <strong>AWS, Google Cloud, or Azure</strong> — and switch between them
          anytime, without disruption.
        </p>
        <p>
          Most businesses get "locked in" to a single cloud provider. Switching
          later is painful, expensive, and risky. LockFree Engine solves this by
          making your cloud environment <em>portable by design</em>.
        </p>
        <p>
          Under the hood, it's built on the{" "}
          <strong>Internet Computer Protocol (ICP)</strong> — a next-generation
          decentralized cloud developed by DFINITY. ICP provides tamper-proof,
          serverless infrastructure that operates independently of any single
          company or data center.
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>No vendor lock-in — move between cloud providers in one click</li>
          <li>Demand-driven compute that scales with your business</li>
          <li>On-chain audit trail — every action is logged and verifiable</li>
          <li>
            Built for the Mission 70 / Cloud Engines era of the Internet
            Computer
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "account-settings",
    title: "Account Settings & Data Export",
    icon: Download,
    content: (
      <div className="space-y-3">
        <p>
          The <strong>Account Settings</strong> page is accessible from two
          places: the <strong>sidebar</strong> (look for "Account Settings" in
          the navigation) and the <strong>profile dropdown</strong> in the
          top-right corner of the top bar.
        </p>
        <p className="font-semibold text-sm">What's inside:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Profile info</strong> — your principal ID and member since
            date
          </li>
          <li>
            <strong>Current plan</strong> — your active subscription tier with
            an upgrade link
          </li>
          <li>
            <strong>Data Portability</strong> — export all your data as JSON or
            CSV
          </li>
        </ul>
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 mt-2">
          <p className="text-sm font-medium text-primary mb-1">
            No Lock-In Promise
          </p>
          <p className="text-xs text-muted-foreground">
            LockFree Engine practices what it preaches. Your engine
            configurations, migration history, cost data, and settings can be
            exported at any time. Your data belongs to you — take it anywhere.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "theme-toggle",
    title: "Dark Mode & Light Mode",
    icon: Sun,
    content: (
      <div className="space-y-3">
        <p>
          LockFree Engine defaults to <strong>dark mode</strong>, which is
          standard for cloud and developer tools. If you prefer a lighter
          interface, you can switch at any time.
        </p>
        <p>
          Look for the <strong>sun/moon icon</strong> in the top-right corner of
          the top bar, next to the notifications bell. Click it to toggle
          between dark and light mode.
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>Your preference is saved automatically</li>
          <li>It persists across browser sessions and refreshes</li>
          <li>
            Toast notifications and dialogs also adapt to your selected theme
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "demo-data-toggle",
    title: "Demo Data Toggle",
    icon: ToggleLeft,
    content: (
      <div className="space-y-3">
        <p>
          Not ready to connect real engines yet? The{" "}
          <strong>Demo Data toggle</strong> lets you explore the full dashboard
          with simulated engine data — no sign-up required.
        </p>
        <p className="font-semibold text-sm">How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            On the <strong>login page</strong> and{" "}
            <strong>empty dashboard</strong>, you'll see a "Demo Data" toggle
            switch
          </li>
          <li>
            Turn it <strong>on</strong> to load three simulated engines (AWS,
            GCP, Azure) with realistic cost and resilience data
          </li>
          <li>
            Turn it <strong>off</strong> to clear the demo data and see the true
            empty state
          </li>
          <li>
            In demo mode, a blue banner appears at the top — click{" "}
            <strong>Exit Demo</strong> to return to the clean state
          </li>
          <li>Your toggle preference is remembered across refreshes</li>
        </ul>
      </div>
    ),
  },
  {
    id: "landing-page",
    title: "Getting Started — The Landing Page",
    icon: Globe,
    content: (
      <div className="space-y-3">
        <p>
          When you first visit LockFree Engine, you'll land on the public
          homepage. This page explains what the platform does and gives you two
          paths forward:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="font-semibold text-sm mb-1 flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Sign In
            </div>
            <p className="text-sm text-muted-foreground">
              Connects you via Internet Identity — a secure, passwordless login.
              After signing in, your engines and data are tied to your unique
              on-chain identity.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="font-semibold text-sm mb-1 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" /> Explore Demo
            </div>
            <p className="text-sm text-muted-foreground">
              Takes you straight into the app with pre-loaded sample data — no
              account required. Perfect for exploring the full feature set
              before committing.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You can also join the waitlist on the landing page to stay informed
          about new features and the official launch of the ICP Cloud Engines
          API.
        </p>
      </div>
    ),
  },
  {
    id: "demo-mode",
    title: "Demo Mode — Explore Without Signing Up",
    icon: Zap,
    content: (
      <div className="space-y-3">
        <p>
          Demo Mode lets you experience the full LockFree Engine dashboard
          without creating an account or logging in. It's ideal for evaluating
          the platform before committing.
        </p>
        <p className="font-semibold text-sm">How to activate Demo Mode:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
          <li>Click "Explore Demo" on the landing page, or</li>
          <li>On the Login page, click the "Load Demo Data" button</li>
          <li>
            Four sample engines appear instantly — no waiting, no backend
            required
          </li>
        </ol>
        <p className="font-semibold text-sm mt-2">
          What you'll see in Demo Mode:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Demo — CRM Platform (AWS) — a running customer relationship
            management app
          </li>
          <li>
            Demo — Analytics Engine (GCP) — a Google Cloud analytics workload
          </li>
          <li>
            Demo — Storage Cluster (Azure) — an Azure-based storage system
          </li>
          <li>
            Demo — Dev/Staging (AWS) — a development environment in provisioning
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          All demo data is entirely simulated. No real cloud resources are used.
          You can explore migrations, cost tracking, and AI chat freely.
        </p>
      </div>
    ),
  },
  {
    id: "internet-identity",
    title: "Logging In with Internet Identity",
    icon: LogIn,
    content: (
      <div className="space-y-3">
        <p>
          Internet Identity is a secure, passwordless authentication system
          built into the Internet Computer. There is no username, no password,
          and no third-party service involved.
        </p>
        <p className="font-semibold text-sm">How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Your device (phone, laptop, hardware key) acts as your credential —
            using Face ID, fingerprint, or a USB security key
          </li>
          <li>A unique identity anchor number is assigned to you</li>
          <li>
            Every app you use with Internet Identity gets a different derived
            principal — your data on LockFree Engine is never linked to your
            identity on other apps
          </li>
        </ul>
        <p className="font-semibold text-sm mt-2">
          Creating your Internet Identity:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Visit{" "}
            <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              identity.ic0.app
            </span>
          </li>
          <li>Follow the prompts to register your device</li>
          <li>Save your anchor number in a safe place</li>
          <li>Return to LockFree Engine and click "Sign In"</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Internet Identity is free to create and use. It is maintained by the
          DFINITY Foundation and runs fully on-chain.
        </p>
      </div>
    ),
  },
  {
    id: "dashboard-overview",
    title: "The Dashboard — Your Command Center",
    icon: LayoutDashboard,
    content: (
      <div className="space-y-3">
        <p>
          The main dashboard is the first page you see after logging in. It
          gives you an at-a-glance view of your entire cloud infrastructure.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <Cpu className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-xs font-semibold">Total Engines</div>
            <div className="text-xs text-muted-foreground">
              Count of all your provisioned engines
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-xs font-semibold">Monthly Cost</div>
            <div className="text-xs text-muted-foreground">
              Estimated total spend this month
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-xs font-semibold">Resilience Score</div>
            <div className="text-xs text-muted-foreground">
              How distributed your infrastructure is
            </div>
          </div>
        </div>
        <p className="text-sm">
          Below the summary cards you'll find a{" "}
          <strong>7-day cost trend chart</strong>, a{" "}
          <strong>per-engine cost breakdown</strong>, and your{" "}
          <strong>recent migration history</strong>. Quick action buttons let
          you provision a new engine, launch the AI chat, or optimize costs from
          a single click.
        </p>
      </div>
    ),
  },
  {
    id: "cloud-engines-what",
    title: "Cloud Engines — What Are They?",
    icon: Server,
    content: (
      <div className="space-y-3">
        <p>
          A Cloud Engine is a dedicated computing environment hosted on a
          specific cloud provider. Think of it like renting a powerful server —
          but one that you can move to another provider instantly, without
          downtime.
        </p>
        <p>
          Each engine runs independently and has its own CPU, RAM, and storage
          allocation. You can run any business application inside an engine: a
          CRM, an e-commerce backend, a database, a data analytics workload, and
          more.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border p-3 text-sm">
            <div className="font-semibold text-orange-400 mb-1">☁ AWS</div>
            <p className="text-xs text-muted-foreground">
              Amazon Web Services — the world's largest cloud. Excellent breadth
              of services.
            </p>
          </div>
          <div className="rounded-md border border-border p-3 text-sm">
            <div className="font-semibold text-blue-400 mb-1">
              ☁ Google Cloud
            </div>
            <p className="text-xs text-muted-foreground">
              GCP — known for data analytics, ML infrastructure, and global
              network quality.
            </p>
          </div>
          <div className="rounded-md border border-border p-3 text-sm">
            <div className="font-semibold text-sky-400 mb-1">☁ Azure</div>
            <p className="text-xs text-muted-foreground">
              Microsoft Azure — preferred for enterprise and Microsoft 365
              integrations.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Cloud Engines on LockFree Engine are currently simulated, pending the
          public release of DFINITY's ICP Cloud Engines API from Mission 70. The
          interface and flows mirror exactly how the real API will behave.
        </p>
      </div>
    ),
  },
  {
    id: "provisioning",
    title: "Provisioning a New Engine",
    icon: Package,
    content: (
      <div className="space-y-3">
        <p>
          Creating a new Cloud Engine takes less than a minute. Here's exactly
          how to do it:
        </p>
        <ol className="space-y-2">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>
              Click the <strong>"New Engine"</strong> button on the dashboard or
              Engines page.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>
              Choose your cloud provider: <strong>AWS</strong>,{" "}
              <strong>Google Cloud</strong>, or <strong>Azure</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              3
            </span>
            <span>
              Use the sliders to set <strong>CPU cores</strong>,{" "}
              <strong>RAM (GB)</strong>, and <strong>Storage (GB)</strong>. The
              estimated hourly cost updates in real time.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>
              Give your engine a name and click{" "}
              <strong>"Provision Engine"</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              5
            </span>
            <span>
              Your engine appears in the list with a{" "}
              <strong>Provisioning</strong> status, then switches to{" "}
              <strong>Running</strong> within seconds.
            </span>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "migration",
    title: "Migrating an Engine to Another Provider",
    icon: ArrowLeftRight,
    content: (
      <div className="space-y-3">
        <p>
          Migration is the core power of LockFree Engine — you can move any
          engine from one cloud provider to another without downtime or data
          loss.
        </p>
        <p className="font-semibold text-sm">Why would I migrate?</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            AWS raised prices — migrate to GCP or Azure and save money
            immediately
          </li>
          <li>
            Your users are in a new region — move closer to them for better
            performance
          </li>
          <li>
            Diversify your infrastructure to reduce risk of a single provider
            outage
          </li>
        </ul>
        <p className="font-semibold text-sm mt-2">How to migrate:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
          <li>Find the engine you want to move on the Engines page</li>
          <li>
            Click the <strong>"Migrate"</strong> button on the engine card
          </li>
          <li>Choose your destination provider</li>
          <li>Review the cost estimate and zero-downtime confirmation</li>
          <li>
            Click <strong>"Confirm Migration"</strong>
          </li>
          <li>
            Watch the phased progress animation — your migration runs live
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Every migration is logged in your Migration History, showing the
          origin, destination, date, and estimated monthly savings.
        </p>
        <p className="font-semibold text-sm mt-2">
          Engine card actions (try these in demo mode):
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Stop / Start</strong> — gracefully stops a running engine or
            starts a stopped one, with a progress animation and live status
            badge update
          </li>
          <li>
            <strong>Restart</strong> — cycles the engine through Stopping →
            Stopped → Starting → Running with animated steps
          </li>
          <li>
            <strong>Scale</strong> — simulates resizing the engine's compute
            resources; the card reflects the updated configuration on completion
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "distribute",
    title: "Distributing Across Providers",
    icon: Shuffle,
    content: (
      <div className="space-y-3">
        <p>
          Distribution is the next level of resilience: instead of running your
          workload on a single provider, you spread it across{" "}
          <strong>multiple providers simultaneously</strong>.
        </p>
        <p>
          Click the <strong>"Distribute"</strong> button on any engine card to
          trigger an automatic distribution across all available providers. The
          system allocates compute across AWS, GCP, and Azure proportionally.
        </p>
        <p className="font-semibold text-sm">
          What happens after distribution:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>Your Resilience Score increases — often significantly</li>
          <li>A single provider going down no longer affects your workload</li>
          <li>
            Cost is distributed across providers (may be slightly higher, but
            more stable)
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Distribution is available on Pro and Enterprise plans. Free tier users
          can simulate it to see the resilience score impact.
        </p>
      </div>
    ),
  },
  {
    id: "resilience-score",
    title: "Understanding the Resilience Score",
    icon: Shield,
    content: (
      <div className="space-y-3">
        <p>
          The Resilience Score is a number from <strong>0 to 100</strong> that
          measures how well protected your infrastructure is against outages.
        </p>
        <div className="grid gap-2 grid-cols-3">
          <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-center">
            <div className="font-bold text-red-400 text-lg">0–40</div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 text-center">
            <div className="font-bold text-yellow-400 text-lg">41–70</div>
            <div className="text-xs text-muted-foreground">Moderate</div>
          </div>
          <div className="rounded-md bg-green-500/10 border border-green-500/30 p-3 text-center">
            <div className="font-bold text-green-400 text-lg">71–100</div>
            <div className="text-xs text-muted-foreground">Well Protected</div>
          </div>
        </div>
        <p className="font-semibold text-sm">How it's calculated:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>Provider diversity — more providers = higher score</li>
          <li>
            Engine health — running engines score higher than stopped ones
          </li>
          <li>
            Workload distribution — even spread across providers scores highest
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          An engine running entirely on a single provider will score below 60.
          Distributing across two or more providers brings scores above 80.
        </p>
      </div>
    ),
  },
  {
    id: "cost-tracking",
    title: "Live Cost Tracking",
    icon: BarChart3,
    content: (
      <div className="space-y-3">
        <p>
          The Cost Dashboard gives you real-time visibility into what you're
          spending on cloud infrastructure — broken down by provider and engine.
        </p>
        <p className="font-semibold text-sm">What you can see:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Monthly total</strong> — current estimated spend this
            billing period
          </li>
          <li>
            <strong>Per-engine bar chart</strong> — see which engines cost the
            most at a glance
          </li>
          <li>
            <strong>7-day trend chart</strong> — spot unexpected cost spikes
            quickly
          </li>
          <li>
            <strong>Cost alerts</strong> — automatic warnings when an engine
            exceeds your threshold
          </li>
        </ul>
        <p className="font-semibold text-sm mt-2">How to save money:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Use the AI Optimize button to get provider-specific recommendations
          </li>
          <li>
            Migrate expensive AWS/Azure engines to more cost-effective providers
          </li>
          <li>Shut down Dev/Staging engines when not actively developing</li>
        </ul>
        <p className="font-semibold text-sm mt-2">
          AI Cost Optimisation (demo mode):
        </p>
        <p className="text-sm text-muted-foreground">
          Click the sparkles button on the Live Cost Dashboard to see
          AI-generated recommendations. Each recommendation shows projected
          savings and can be applied individually — or use{" "}
          <strong>&quot;Apply All&quot;</strong> to action everything at once. A
          processing animation confirms each change and the projected cost
          updates on screen.
        </p>
        <p className="font-semibold text-sm mt-2">Live cost animation:</p>
        <p className="text-sm text-muted-foreground">
          In demo mode, cost figures and the 7-day trend chart refresh
          automatically every 8–12 seconds to simulate a live production
          environment.
        </p>
      </div>
    ),
  },
  {
    id: "subscription-plans",
    title: "Subscription Plans — Free, Pro, Business & Enterprise",
    icon: Star,
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Annual billing saves ~20% (2 months free) on all paid plans.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-3">
            <div className="font-bold mb-0.5">Free</div>
            <div className="text-primary font-semibold text-sm mb-2">$0</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 1 engine (small size)</div>
              <div>• 1 user seat</div>
              <div>• Basic AI chat</div>
              <div>• No migration</div>
              <div>• 30-day trial</div>
            </div>
          </div>
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-3">
            <div className="font-bold mb-0.5 flex items-center gap-1">
              Pro{" "}
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            </div>
            <div className="text-primary font-semibold text-sm mb-2">
              $49/mo
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Up to 10 engines</div>
              <div>• 3 user seats</div>
              <div>• Full migration flows</div>
              <div>• Unlimited AI chat</div>
              <div>• Standard support</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-gradient-to-b from-muted/20 to-transparent p-3">
            <div className="font-bold mb-0.5">Business</div>
            <div className="text-primary font-semibold text-sm mb-2">
              $199/mo
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Up to 50 engines</div>
              <div>• 10 user seats</div>
              <div>• Advanced cost optimization</div>
              <div>• Affiliate dashboard</div>
              <div>• Priority support</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-gradient-to-b from-yellow-500/10 to-transparent p-3">
            <div className="font-bold mb-0.5">Enterprise</div>
            <div className="text-primary font-semibold text-sm mb-2">
              $599/mo
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Unlimited engines</div>
              <div>• Unlimited users</div>
              <div>• White-label branding</div>
              <div>• Dedicated onboarding + SLA</div>
              <div>• Direct account manager</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "upgrading",
    title: "Upgrading Your Plan",
    icon: CreditCard,
    content: (
      <div className="space-y-3">
        <p>Upgrading is straightforward and takes less than a minute:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Click <strong>Billing</strong> in the left sidebar
          </li>
          <li>
            Click the <strong>"Upgrade Plan"</strong> button
          </li>
          <li>Choose your desired tier (Pro or Enterprise)</li>
          <li>
            Select your payment method:
            <ul className="list-disc ml-6 mt-1 space-y-0.5">
              <li>
                <strong>Credit/debit card</strong> via Stripe — major cards
                accepted
              </li>
              <li>
                <strong>ICP tokens</strong> via your on-chain wallet
              </li>
            </ul>
          </li>
          <li>Complete payment — your tier upgrades immediately</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Note: Payment flows are currently in demo/mock mode. No real charges
          are made. Live payment integration will be enabled at launch.
        </p>
      </div>
    ),
  },
  {
    id: "referrals",
    title: "Referrals & Affiliate Program",
    icon: Users,
    content: (
      <div className="space-y-3">
        <p>
          Every LockFree Engine user gets a unique affiliate code in the format{" "}
          <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
            LFE-XXXXXX
          </span>
          . Share your code and earn a commission every time someone signs up
          and pays.
        </p>
        <p className="font-semibold text-sm">How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Go to the <strong>Referrals</strong> page in the sidebar
          </li>
          <li>Copy your affiliate code or shareable link</li>
          <li>Share it with developers, businesses, or on social media</li>
          <li>
            When someone uses your code and subscribes, you earn a commission
          </li>
          <li>
            Track earnings, referral count, and payout history in the dashboard
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Commission rates increase with your partner tier. See the Partners
          page for details on Bronze, Silver, and Gold tiers.
        </p>
      </div>
    ),
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    content: (
      <div className="space-y-3">
        <p>
          The bell icon in the top-right corner of the dashboard shows your
          notification count and opens a dropdown when clicked.
        </p>
        <p className="font-semibold text-sm">Types of notifications:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Cost alerts</strong> — when an engine's monthly cost exceeds
            your threshold
          </li>
          <li>
            <strong>Migration updates</strong> — when a migration completes or
            fails
          </li>
          <li>
            <strong>Resilience warnings</strong> — when your overall resilience
            score drops
          </li>
          <li>
            <strong>Billing reminders</strong> — subscription renewal and
            payment alerts
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Click <strong>"Mark all as read"</strong> to clear the unread badge.
          Notifications are stored locally in your session.
        </p>
        <p className="font-semibold text-sm mt-2">Demo mode notifications:</p>
        <p className="text-sm text-muted-foreground">
          In demo mode, realistic notifications arrive automatically every 30–60
          seconds — including cost alerts, engine scaling events, and migration
          completions. Watch the bell badge increment in real time as alerts
          land.
        </p>
      </div>
    ),
  },
  {
    id: "ai-deploy-chat",
    title: "AI Deploy Chat",
    icon: MessageSquare,
    content: (
      <div className="space-y-3">
        <p>
          The <strong>AI Deploy</strong> page gives you an intelligent assistant
          that helps you make decisions about your cloud engines — no technical
          knowledge required.
        </p>
        <p className="font-semibold text-sm">What you can ask the AI:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>"Which provider should I use for my CRM?"</strong> — get a
            recommendation based on cost, resilience, and workload type
          </li>
          <li>
            <strong>"How can I reduce my cloud bill?"</strong> — get
            provider-specific cost optimisation tips
          </li>
          <li>
            <strong>"Is my engine healthy?"</strong> — get a plain-language
            summary of your engine's resilience score and what it means
          </li>
          <li>
            <strong>"Should I migrate to GCP?"</strong> — the AI will weigh up
            cost savings vs. migration effort for your specific setup
          </li>
        </ul>
        <p className="font-semibold text-sm">How to use it:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Click <strong>AI Deploy</strong> in the left sidebar
          </li>
          <li>
            Optionally select a specific engine from the dropdown at the top
          </li>
          <li>Type your question and press Enter or click Send</li>
          <li>The AI responds with context-aware guidance for that engine</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Your conversation history is saved automatically — if you close the
          browser and come back, your previous messages will still be there. The
          Free tier allows up to 10 messages per session; upgrade to Pro or
          Enterprise for unlimited access.
        </p>
      </div>
    ),
  },
  {
    id: "profile-signout",
    title: "Your Profile & Signing Out",
    icon: Settings,
    content: (
      <div className="space-y-3">
        <p>
          Click your <strong>avatar or initials</strong> in the top-right corner
          to open the profile dropdown menu.
        </p>
        <p className="font-semibold text-sm">Profile menu options:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Settings</strong> — display preferences, white-label options
            (Enterprise)
          </li>
          <li>
            <strong>Billing</strong> — manage your subscription and payment
            methods
          </li>
          <li>
            <strong>Sign Out</strong> — ends your session and returns you to the
            landing page
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Signing out clears your session data. Your engines and configuration
          are safely stored on-chain and will be there when you log back in.
        </p>
      </div>
    ),
  },
  {
    id: "settings",
    title: "Account Settings",
    icon: Settings,
    content: (
      <div className="space-y-3">
        <p>
          The <strong>Account Settings</strong> page is your control centre for
          personalisation, plan management, and data export. Find it in the
          sidebar or via the profile dropdown in the top-right corner.
        </p>
        <p className="font-semibold text-sm">Available settings:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>Profile info</strong> — principal ID, current plan tier,
            member since date
          </li>
          <li>
            <strong>Display preferences</strong> — theme, timezone, date format
          </li>
          <li>
            <strong>Notification preferences</strong> — choose which alerts you
            receive
          </li>
          <li>
            <strong>White-label branding</strong> (Enterprise only) — set a
            custom brand name and primary color
          </li>
          <li>
            <strong>Data Portability</strong> — export all your data as JSON or
            CSV at any time
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "partners",
    title: "Partners Program",
    icon: Building2,
    content: (
      <div className="space-y-3">
        <p>
          The Partners Program rewards you for bringing enterprise customers to
          LockFree Engine. There are three tiers, each with increasing revenue
          sharing:
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border p-3">
            <div className="text-amber-600 font-bold text-sm mb-1">
              🥉 Bronze
            </div>
            <div className="text-xs text-muted-foreground">
              Entry tier. Earn a base commission on every referral. Ideal for
              individual developers and consultants.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-slate-300 font-bold text-sm mb-1">
              🥈 Silver
            </div>
            <div className="text-xs text-muted-foreground">
              Mid tier. Higher commission rate, access to partner marketing
              materials and co-selling resources.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-yellow-400 font-bold text-sm mb-1">
              🥇 Gold
            </div>
            <div className="text-xs text-muted-foreground">
              Top tier. Maximum revenue share, dedicated partner manager, early
              access to new features.
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the <strong>Earnings Calculator</strong> on the Partners page to
          estimate your monthly income based on the number of referrals and
          their subscription tier.
        </p>
      </div>
    ),
  },
  {
    id: "whats-coming-biz",
    title: "What's Coming",
    icon: Rocket,
    content: (
      <div className="space-y-3">
        <p>
          LockFree Engine is already built and waiting. When the ICP Cloud
          Engines API (Mission 70) goes public, the simulation becomes reality.
          Here is what unlocks:
        </p>
        <div className="space-y-2">
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              🌐 Real Multi-Cloud Provisioning
            </div>
            <div className="text-xs text-muted-foreground">
              Spin up genuine cloud engines across providers from a single
              dashboard — not simulated, fully live.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              💡 Live AI Cost Optimisation
            </div>
            <div className="text-xs text-muted-foreground">
              Real-time AI recommendations based on actual usage patterns and
              live pricing data from every provider.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              ⚡ One-Click Migration with Zero Downtime
            </div>
            <div className="text-xs text-muted-foreground">
              Move your entire workload between cloud providers without your
              users noticing a thing.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              📈 Automated Demand-Driven Scaling
            </div>
            <div className="text-xs text-muted-foreground">
              Your engines grow and shrink automatically based on real demand —
              no manual intervention required.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              🛡️ Enterprise SLA Guarantees
            </div>
            <div className="text-xs text-muted-foreground">
              Contractual uptime guarantees backed by ICP's decentralised
              infrastructure — not a single provider's promise.
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">
          "LockFree Engine is already built and waiting. When the API goes live,
          the simulation becomes reality."
        </p>
        <p className="text-xs text-muted-foreground">
          Follow the Mission 70 roadmap at{" "}
          <a
            href="https://forum.dfinity.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            forum.dfinity.org
          </a>
          .
        </p>
      </div>
    ),
  },
];

// ─── Developer Sections ───────────────────────────────────────────────────────

const developerSections: GuideSection[] = [
  {
    id: "architecture",
    title: "Architecture Overview",
    icon: Network,
    content: (
      <div className="space-y-3">
        <p>
          LockFree Engine runs entirely on the{" "}
          <strong>Internet Computer Protocol (ICP)</strong>. There is no
          traditional server, no VPS, no load balancer — the entire stack lives
          on-chain.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="font-semibold text-sm mb-1 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" /> Backend
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>
                Language: <strong>Motoko</strong>
              </div>
              <div>Runtime: ICP canister</div>
              <div>Storage: stable var (survives upgrades)</div>
              <div>Auth: Internet Identity principals</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="font-semibold text-sm mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Frontend
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>
                Framework: <strong>React 19 + TypeScript</strong>
              </div>
              <div>Styling: Tailwind CSS</div>
              <div>State: TanStack React Query</div>
              <div>Served: ICP certified asset canister</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The frontend communicates with the backend via the ICP agent
          (@dfinity/agent). All calls are either query calls (fast, read-only)
          or update calls (state-changing, on-chain consensus required).
        </p>
      </div>
    ),
  },
  {
    id: "account-settings-dev",
    title: "Account Settings & Data Export",
    icon: Download,
    content: (
      <div className="space-y-3">
        <p>
          The Account Settings page is a client-side page that assembles export
          data from React Query cache and localStorage — no dedicated backend
          call is required for the export itself.
        </p>
        <p className="font-semibold text-sm">Export format:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <strong>JSON</strong> — a nested object containing engines,
            migrations, cost snapshots, and account settings
          </li>
          <li>
            <strong>CSV</strong> — flat rows for each data type, spreadsheet
            friendly
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Both exports are generated entirely in the browser using{" "}
          <code className="text-xs bg-muted px-1 rounded">Blob</code> +{" "}
          <code className="text-xs bg-muted px-1 rounded">
            URL.createObjectURL
          </code>{" "}
          and trigger an immediate file download. No data leaves the client for
          this operation.
        </p>
        <p className="text-sm text-muted-foreground">
          The page is accessible via sidebar nav item{" "}
          <code className="text-xs bg-muted px-1 rounded">id: "settings"</code>{" "}
          and the profile dropdown &quot;Account Settings&quot; link.
        </p>
      </div>
    ),
  },
  {
    id: "theme-toggle-dev",
    title: "Theme Toggle (Dark / Light Mode)",
    icon: Moon,
    content: (
      <div className="space-y-3">
        <p>
          Theme preference is stored in localStorage under the key{" "}
          <code className="text-xs bg-muted px-1 rounded">lockfree_theme</code>{" "}
          with values{" "}
          <code className="text-xs bg-muted px-1 rounded">"dark"</code> or{" "}
          <code className="text-xs bg-muted px-1 rounded">"light"</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          A blocking{" "}
          <code className="text-xs bg-muted px-1 rounded">&lt;script&gt;</code>{" "}
          tag in{" "}
          <code className="text-xs bg-muted px-1 rounded">index.html</code>{" "}
          reads this key and applies the{" "}
          <code className="text-xs bg-muted px-1 rounded">dark</code> or{" "}
          <code className="text-xs bg-muted px-1 rounded">light</code> class to{" "}
          <code className="text-xs bg-muted px-1 rounded">&lt;html&gt;</code>{" "}
          before React hydrates — preventing any flash of the wrong theme.
        </p>
        <p className="text-sm text-muted-foreground">
          The{" "}
          <code className="text-xs bg-muted px-1 rounded">&lt;Toaster&gt;</code>{" "}
          component in{" "}
          <code className="text-xs bg-muted px-1 rounded">App.tsx</code>{" "}
          receives the{" "}
          <code className="text-xs bg-muted px-1 rounded">theme</code> prop
          dynamically, so toast notifications match the active theme.
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            <code className="text-xs bg-muted px-1 rounded">
              lockfree_theme
            </code>{" "}
            — localStorage key for theme preference
          </li>
          <li>
            Default is{" "}
            <code className="text-xs bg-muted px-1 rounded">"dark"</code> if key
            is absent
          </li>
          <li>
            Theme class applied to{" "}
            <code className="text-xs bg-muted px-1 rounded">
              document.documentElement
            </code>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "demo-data-toggle-dev",
    title: "Demo Data Toggle — Technical Details",
    icon: ToggleLeft,
    content: (
      <div className="space-y-3">
        <p>
          Demo mode preference is persisted in localStorage under the key{" "}
          <code className="text-xs bg-muted px-1 rounded">
            lockfree_demo_pref
          </code>
          .
        </p>
        <p className="font-semibold text-sm">Key implementation details:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>
            Auto-load on{" "}
            <code className="text-xs bg-muted px-1 rounded">LoginPage</code> is
            guarded by a{" "}
            <code className="text-xs bg-muted px-1 rounded">useRef</code> to
            prevent double-firing in React 19 strict mode
          </li>
          <li>
            <code className="text-xs bg-muted px-1 rounded">isDemoMode</code> in{" "}
            <code className="text-xs bg-muted px-1 rounded">App.tsx</code> is
            derived from engine names but respects the user's explicit
            preference from localStorage
          </li>
          <li>
            Both{" "}
            <code className="text-xs bg-muted px-1 rounded">
              handleLoadDemo
            </code>{" "}
            and{" "}
            <code className="text-xs bg-muted px-1 rounded">
              handleClearDemo
            </code>{" "}
            write to localStorage before updating React state
          </li>
          <li>
            In demo mode, a blue banner renders with an "Exit Demo" button wired
            to{" "}
            <code className="text-xs bg-muted px-1 rounded">
              handleClearDemo
            </code>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "internet-identity-tech",
    title: "Internet Identity Authentication",
    icon: Key,
    content: (
      <div className="space-y-3">
        <p>
          Internet Identity uses a <strong>delegated identity model</strong>. No
          passwords, no tokens, no centralized auth server.
        </p>
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-sm">
          <div>
            <span className="text-muted-foreground">Login flow:</span> Device
            authenticates → II canister issues delegation → Frontend agent signs
            all subsequent calls with derived key
          </div>
          <div>
            <span className="text-muted-foreground">Principal derivation:</span>{" "}
            Each (app, device) pair gets a unique <strong>principal ID</strong>{" "}
            — linkability is prevented by design
          </div>
          <div>
            <span className="text-muted-foreground">On-chain identity:</span>{" "}
            All data is keyed by Principal.{" "}
            <code className="text-xs bg-muted px-1 rounded">msg.caller</code> in
            Motoko is the source of truth
          </div>
        </div>
        <p className="text-sm">Hook usage:</p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`import { useInternetIdentity } from "../hooks/useInternetIdentity";

const { login, clear, identity, loginStatus } = useInternetIdentity();
// identity?.getPrincipal().toString() → user's principal`}</pre>
      </div>
    ),
  },
  {
    id: "data-model",
    title: "Cloud Engine Data Model",
    icon: Database,
    content: (
      <div className="space-y-3">
        <p>Each Engine record stored in the Motoko stable HashMap:</p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`type Engine = {
  id           : Nat;
  name         : Text;
  provider     : Text;       // "AWS" | "GCP" | "Azure"
  status       : Text;       // "running" | "provisioning" | "stopped"
  cpu          : Nat;        // cores
  ram          : Nat;        // GB
  storage      : Nat;        // GB
  costPerHour  : Float;
  resilienceScore : Nat;     // 0-100
  ownerId      : Principal;
  createdAt    : Int;        // nanoseconds since epoch
};`}</pre>
        <p className="text-sm text-muted-foreground">
          Stored in a{" "}
          <code className="text-xs bg-muted px-1 rounded">
            stable var HashMap&lt;Nat, Engine&gt;
          </code>
          . The stable var keyword ensures data persists across canister
          upgrades.
        </p>
      </div>
    ),
  },
  {
    id: "demo-mode-tech",
    title: "Demo Mode Implementation",
    icon: Zap,
    content: (
      <div className="space-y-3">
        <p>
          Demo engines are injected client-side into the React Query cache — no
          backend call required.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Synchronous cache write — bypasses fetch lifecycle
queryClient.setQueryData(queryKeys.engines, DEMO_ENGINES);
setDemoEngines(DEMO_ENGINES);
setIsDemoMode(true);`}</pre>
        <p className="text-sm font-semibold">Cache protection strategy:</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
          <li>Background refetch checks for demo engines before overwriting</li>
          <li>
            If{" "}
            <code className="text-xs bg-muted px-1 rounded">
              engines.some(e =&gt; e.name.includes("Demo"))
            </code>{" "}
            is true, refetch is skipped
          </li>
          <li>
            After II login succeeds, a real backend call is attempted;
            client-side data persists on failure
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "provisioning-tech",
    title: "Provisioning an Engine",
    icon: Package,
    content: (
      <div className="space-y-3">
        <p>
          Engine provisioning calls the{" "}
          <code className="text-xs bg-muted px-1 rounded">createEngine</code>{" "}
          update method on the backend canister.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Motoko backend signature
public shared(msg) func createEngine(
  name     : Text,
  provider : Text,
  cpu      : Nat,
  ram      : Nat,
  storage  : Nat
) : async Engine;

// Frontend mutation (useQueries.ts)
export function useCreateEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args) => actor.createEngine(...args),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.engines }),
  });
}`}</pre>
        <p className="text-sm text-muted-foreground">
          The backend validates{" "}
          <code className="text-xs bg-muted px-1 rounded">msg.caller</code> is
          not anonymous before accepting the call. The new Engine is returned
          and the frontend cache is invalidated.
        </p>
      </div>
    ),
  },
  {
    id: "migration-tech",
    title: "Migration Flow",
    icon: ArrowLeftRight,
    content: (
      <div className="space-y-3">
        <p>
          The migration flow is currently simulated — the ICP Cloud Engines API
          (from DFINITY's Mission 70) is not yet publicly available.
        </p>
        <p className="text-sm font-semibold">Current implementation:</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
          <li>UI shows cost estimate modal with zero-downtime badge</li>
          <li>On confirm: animated progress through migration phases</li>
          <li>
            Backend logs migration event to{" "}
            <code className="text-xs bg-muted px-1 rounded">
              migrationHistory
            </code>{" "}
            stable array
          </li>
          <li>
            Frontend updates engine's{" "}
            <code className="text-xs bg-muted px-1 rounded">provider</code>{" "}
            field optimistically
          </li>
          <li>Cache is invalidated after mutation resolves</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          When DFINITY releases the Cloud Engines API, the Motoko backend will
          be updated to call the subnet migration endpoint directly. The UI
          layer requires no changes.
        </p>
      </div>
    ),
  },
  {
    id: "resilience-tech",
    title: "Resilience Score Calculation",
    icon: Shield,
    content: (
      <div className="space-y-3">
        <p>
          Resilience score is computed on the backend and returned per-engine
          and as an aggregate.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Pseudo-code for score calculation
let providers = engines.map(e => e.provider);
let uniqueProviders = Set.fromIter(providers);
let diversityBonus = uniqueProviders.size() * 15;
let healthBonus = engines
  .filter(e => e.status == "running")
  .size() * 10;
let score = min(100, diversityBonus + healthBonus);`}</pre>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
          <li>Single provider: max ~40 (health bonus only)</li>
          <li>Two providers: ~55–75 range</li>
          <li>Three providers: 80–100 achievable</li>
        </ul>
      </div>
    ),
  },
  {
    id: "cost-tracking-tech",
    title: "Cost Tracking & Alerts",
    icon: BarChart3,
    content: (
      <div className="space-y-3">
        <p>
          Monthly cost is estimated client-side from the engine's hourly rate:
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Monthly estimate (730 hours/month average)
const monthly = engine.costPerHour * 730;

// Alert threshold (configurable per tier)
const THRESHOLDS = { free: 50, pro: 200, enterprise: 500 };
if (monthly > THRESHOLDS[subscription]) {
  triggerCostAlert(engine);
}`}</pre>
        <p className="text-sm text-muted-foreground">
          The{" "}
          <code className="text-xs bg-muted px-1 rounded">
            LiveCostDashboard
          </code>{" "}
          component reads from the React Query engines cache and computes all
          charts client-side using Recharts. No additional backend calls are
          made.
        </p>
        <p className="font-semibold text-sm mt-2">Demo mode simulation:</p>
        <p className="text-sm text-muted-foreground">
          In demo mode, cost figures and the 7-day trend chart refresh every
          8–12 seconds via a{" "}
          <code className="text-xs bg-muted px-1 rounded">setInterval</code> in
          the{" "}
          <code className="text-xs bg-muted px-1 rounded">
            LiveCostDashboard
          </code>{" "}
          component. The AI Cost Optimisation modal generates 4 mock
          recommendations with apply/confirm flows — each updates projected
          spend on screen. Use &quot;Apply All&quot; to action all
          recommendations at once.
        </p>
      </div>
    ),
  },
  {
    id: "ai-chat-tech",
    title: "AI Deploy Chat",
    icon: MessageSquare,
    content: (
      <div className="space-y-3">
        <p>
          The chat interface provides context-aware AI deployment assistance. It
          is entirely client-side — no external LLM API is called.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Chat history persisted in localStorage
const CHAT_KEY = "lockfree_chat_history";

// Context injection
const systemContext = engine
  ? \`Currently managing: \${engine.name} on \${engine.provider}\`
  : "No engine selected. Provide general ICP deployment guidance.";`}</pre>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
          <li>Chat history persists across page refreshes via localStorage</li>
          <li>
            Context switches automatically when user selects a different engine
          </li>
          <li>Responses simulate realistic ICP/cloud deployment guidance</li>
          <li>Free tier is rate-limited to 10 messages/session</li>
        </ul>
      </div>
    ),
  },
  {
    id: "billing-tech",
    title: "Subscription & Billing Backend",
    icon: CreditCard,
    content: (
      <div className="space-y-3">
        <p>
          Subscription state is stored per-principal in a stable HashMap on the
          canister.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Motoko types
type Tier = { #free; #pro; #enterprise };
type BillingRecord = {
  tier      : Tier;
  amount    : Float;
  currency  : Text;   // "USD" | "ICP"
  timestamp : Int;
  txId      : Text;
};

// Stable storage
stable var subscriptions : HashMap<Principal, Tier>;
stable var billingHistory : HashMap<Principal, [BillingRecord]>;`}</pre>
        <p className="text-sm text-muted-foreground">
          <code className="text-xs bg-muted px-1 rounded">
            updateSubscription
          </code>{" "}
          is called after mock payment confirmation. In production, this would
          be gated behind a real Stripe webhook or ICP token transfer
          verification.
        </p>
      </div>
    ),
  },
  {
    id: "affiliate-tech",
    title: "Affiliate & Referral System",
    icon: Users,
    content: (
      <div className="space-y-3">
        <p>
          Affiliate codes are derived from the user's principal and stored
          on-chain.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Code format: LFE-XXXXXX
// Derived by hashing principal + salt, taking first 6 hex chars
func generateAffiliateCode(p : Principal) : Text {
  let hash = SHA256.hash(Principal.toBlob(p));
  "LFE-" # Hex.encode(hash).slice(0, 6)
};

type AffiliateStats = {
  code          : Text;
  referralCount : Nat;
  earnings      : Float;
  payoutHistory : [PayoutRecord];
};`}</pre>
      </div>
    ),
  },
  {
    id: "white-label-tech",
    title: "White-Label (Enterprise)",
    icon: Building2,
    content: (
      <div className="space-y-3">
        <p>
          Enterprise users can apply custom branding that overrides the LockFree
          Engine defaults.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Motoko update call
public shared(msg) func updateWhiteLabelSettings(
  brandName    : Text,
  primaryColor : Text  // hex color
) : async ();

// Frontend: applied as CSS variables on login
document.documentElement.style
  .setProperty("--primary", oklchFromHex(settings.primaryColor));`}</pre>
        <p className="text-sm text-muted-foreground">
          White-label settings are gated behind an enterprise tier check. The{" "}
          <code className="text-xs bg-muted px-1 rounded">
            getWhiteLabelSettings
          </code>{" "}
          query is called on initial load and the result is applied to Tailwind
          CSS variables at runtime.
        </p>
      </div>
    ),
  },
  {
    id: "react-query-tech",
    title: "React Query Cache Strategy",
    icon: Boxes,
    content: (
      <div className="space-y-3">
        <p>
          All backend interactions use TanStack React Query with a defined
          queryKeys object.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Query keys registry (src/hooks/useQueries.ts)
export const queryKeys = {
  engines     : ["engines"],
  subscription: ["subscription"],
  billing     : ["billing"],
  affiliate   : ["affiliate"],
  whitlabel   : ["whitelabel"],
};

// Demo data injection (bypasses fetch lifecycle)
queryClient.setQueryData(queryKeys.engines, DEMO_ENGINES);

// Background refetch guard
queryFn: async () => {
  const cached = queryClient.getQueryData(queryKeys.engines);
  if (cached?.some(e => e.name.includes("Demo"))) return cached;
  return actor.listEngines();
}`}</pre>
      </div>
    ),
  },
  {
    id: "billing-log-tech",
    title: "On-Chain Billing Log",
    icon: ListChecks,
    content: (
      <div className="space-y-3">
        <p>
          Every subscription change and payment event is appended to a stable
          Array on-chain.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`// Append-only log per principal
public shared(msg) func getBillingHistory() : async [BillingRecord] {
  switch (billingHistory.get(msg.caller)) {
    case (?records) records;
    case null [];
  }
};

// Frontend usage in BillingPage
const { data: history } = useQuery({
  queryKey: queryKeys.billing,
  queryFn: () => actor.getBillingHistory(),
});`}</pre>
        <p className="text-sm text-muted-foreground">
          The billing log is immutable and tamper-proof — stored in canister
          stable memory. Users can verify their own billing history
          independently.
        </p>
      </div>
    ),
  },
  {
    id: "icp-cloud-engines-api",
    title: "ICP Cloud Engines API (Future)",
    icon: Cpu,
    content: (
      <div className="space-y-3">
        <p>
          The current LockFree Engine implementation simulates the ICP Cloud
          Engines API described in DFINITY's{" "}
          <strong>Mission 70 white paper</strong>. The real API has not yet been
          publicly released.
        </p>
        <p className="text-sm font-semibold">
          From the Mission 70 white paper:
        </p>
        <blockquote className="border-l-2 border-primary/50 pl-3 text-sm text-muted-foreground italic">
          "Cloud engines are configurable, application-specific execution
          environments on the Internet Computer... allowing enterprises and
          developers to deploy workloads with customized security, performance,
          and resilience characteristics."
        </blockquote>
        <p className="text-sm text-muted-foreground">
          When the API is released, the Motoko backend will be updated to call
          the subnet provisioning endpoint directly. The React frontend and all
          UI flows are already designed to the expected API contract and require
          no structural changes.
        </p>
      </div>
    ),
  },
  {
    id: "deploying-canister",
    title: "Deploying & Upgrading the Canister",
    icon: Rocket,
    content: (
      <div className="space-y-3">
        <p>
          The app is deployed to ICP using dfx. Both the backend Motoko canister
          and the frontend asset canister are managed via{" "}
          <code className="text-xs bg-muted px-1 rounded">dfx.json</code>.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">{`# Local development
dfx start --background
dfx deploy

# Production deployment
dfx deploy --network ic

# Upgrade backend only (preserves stable state)
dfx deploy --network ic lockfree_backend

# Check canister IDs
dfx canister --network ic id lockfree_backend
dfx canister --network ic id lockfree_frontend`}</pre>
        <p className="text-sm text-muted-foreground">
          Stable variables survive upgrades. Heap variables are reset. Always
          use <code className="text-xs bg-muted px-1 rounded">stable var</code>{" "}
          for any data you want to preserve across deployments.
        </p>
      </div>
    ),
  },
  {
    id: "contributing",
    title: "Contributing & Extending",
    icon: Code2,
    content: (
      <div className="space-y-3">
        <p>
          The codebase follows a component-per-page pattern. Adding a new
          feature:
        </p>
        <ol className="space-y-2">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>
              <strong>Backend:</strong> Add Motoko function to{" "}
              <code className="text-xs bg-muted px-1 rounded">
                src/backend/main.mo
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>
              <strong>Types:</strong> Update{" "}
              <code className="text-xs bg-muted px-1 rounded">
                src/frontend/src/backend.d.ts
              </code>{" "}
              with the new method signature
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              3
            </span>
            <span>
              <strong>Query/Mutation:</strong> Add hook to{" "}
              <code className="text-xs bg-muted px-1 rounded">
                src/frontend/src/hooks/useQueries.ts
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>
              <strong>Component:</strong> Create{" "}
              <code className="text-xs bg-muted px-1 rounded">
                src/frontend/src/components/MyFeaturePage.tsx
              </code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
              5
            </span>
            <span>
              <strong>Routing:</strong> Add page to the{" "}
              <code className="text-xs bg-muted px-1 rounded">Page</code> type
              in App.tsx, add to{" "}
              <code className="text-xs bg-muted px-1 rounded">PAGE_TITLES</code>
              , add{" "}
              <code className="text-xs bg-muted px-1 rounded">
                &lt;MyFeaturePage /&gt;
              </code>{" "}
              to the render switch, and add nav item to{" "}
              <code className="text-xs bg-muted px-1 rounded">
                AppSidebar.tsx
              </code>
            </span>
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Follow existing patterns in useQueries.ts for React Query setup. Use
          the <code className="text-xs bg-muted px-1 rounded">useActor</code>{" "}
          hook to access the backend actor — do not import it directly.
        </p>
      </div>
    ),
  },
  {
    id: "whats-coming-dev",
    title: "What's Coming",
    icon: Rocket,
    content: (
      <div className="space-y-3">
        <p>
          When the ICP Cloud Engines API (Mission 70) goes public, every
          simulated call in LockFree Engine will be replaced with a real
          endpoint. Here is what the developer surface looks like:
        </p>
        <div className="space-y-2">
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              🔌 Real API Endpoints
            </div>
            <div className="text-xs text-muted-foreground">
              All simulated provisioning and migration calls will map to live
              ICP Cloud Engine RPC methods. Drop-in replacement — no
              architectural changes needed.
            </div>
          </div>
          <div className="rounded-md border border-border p-3 font-mono">
            <div className="font-medium text-sm mb-1 font-sans">
              Subnet Migration
            </div>
            <code className="text-xs text-primary">
              await cloud_engine.migrate(targetSubnet);
            </code>
            <div className="text-xs text-muted-foreground mt-1 font-sans">
              Live cross-subnet migration with automatic state transfer and
              zero-downtime cutover.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              ⚖️ Demand-Driven Scaling via NNS
            </div>
            <div className="text-xs text-muted-foreground">
              NNS governance controls subnet capacity allocation. Your engine
              scales in response to on-chain demand signals — no manual scaling
              policies.
            </div>
          </div>
          <div className="rounded-md border border-border p-3 font-mono">
            <div className="font-medium text-sm mb-1 font-sans">
              WASM Hot-Swap
            </div>
            <code className="text-xs text-primary">
              await cloud_engine.upgradeModule(newWasmBytes);
            </code>
            <div className="text-xs text-muted-foreground mt-1 font-sans">
              Hot-swap your WASM module without downtime. State is preserved
              across the upgrade boundary.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              🌍 Multi-Region Canister Replication
            </div>
            <div className="text-xs text-muted-foreground">
              Replicate your canister state across geographic subnets for
              latency reduction and regional resilience.
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="font-medium text-sm mb-1">
              ⛓️ Chain Fusion Cross-Chain Compute
            </div>
            <div className="text-xs text-muted-foreground">
              Direct integration with ICP Chain Fusion for cross-chain compute
              triggers — your cloud engine can react to events on Ethereum,
              Bitcoin, and other chains natively.
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">
          "LockFree Engine is already built and waiting. When the API goes live,
          the simulation becomes reality."
        </p>
        <p className="text-xs text-muted-foreground">
          Track Mission 70 progress at{" "}
          <a
            href="https://forum.dfinity.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            forum.dfinity.org
          </a>
          .
        </p>
      </div>
    ),
  },
];

// ─── Admin Section (conditional) ─────────────────────────────────────────────

const adminBusinessSection: GuideSection = {
  id: "admin-section-biz",
  title: "Admin Section",
  icon: ShieldCheck,
  content: (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="destructive" className="text-xs">
          Admin Only
        </Badge>
        <span className="text-xs text-muted-foreground">
          Visible only to admin users
        </span>
      </div>
      <p>
        The <strong>Admin Section</strong> is accessible from the{" "}
        <strong>shield icon</strong> at the bottom of the sidebar — it only
        appears for users with admin privileges.
      </p>
      <p className="font-semibold text-sm">Four admin tabs:</p>
      <div className="space-y-2">
        <div className="rounded-md border border-border p-3">
          <div className="font-medium text-sm mb-1">📊 Analytics</div>
          <div className="text-xs text-muted-foreground">
            Total registered users, waitlist signups, active engine counts, and
            a breakdown of users by plan tier (Free / Pro / Business /
            Enterprise).
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="font-medium text-sm mb-1">📋 Waitlist</div>
          <div className="text-xs text-muted-foreground">
            View all landing page signups. Update each entry's status:{" "}
            <strong>New</strong>, <strong>Contacted</strong>,{" "}
            <strong>Approved</strong>, or <strong>Rejected</strong>. Entries are
            stored in the backend so nothing is lost on refresh.
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="font-medium text-sm mb-1">👥 Users</div>
          <div className="text-xs text-muted-foreground">
            View all registered users and their current plan tier. Manually
            upgrade or downgrade any user's plan — useful for onboarding early
            beta testers or handling support requests. Each user row also has an{" "}
            <strong>Export</strong> button — use this to download a copy of that
            user's data as JSON on their behalf.
          </div>
        </div>
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 mt-2">
          <div className="font-medium text-sm mb-1">
            📤 Handling User Data Requests
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              If a user contacts you requesting a copy of their data (e.g. for
              GDPR compliance, account closure, or because they have lost
              access), follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>
                Go to <strong>Admin › Users</strong> and locate the user by
                their Principal ID.
              </li>
              <li>
                Click the <strong>Export</strong> button on their row.
              </li>
              <li>
                A JSON file containing their engine configurations, migration
                history, billing tier, and preferences will download
                automatically.
              </li>
              <li>
                Send the file to the user via your preferred channel (email,
                direct message, etc.).
              </li>
            </ol>
            <p className="mt-1">
              If the user still has access to their account, direct them to{" "}
              <strong>Account Settings › Export My Data</strong> — they can
              download their own data directly without admin involvement.
            </p>
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="font-medium text-sm mb-1">⚙️ Content Settings</div>
          <div className="text-xs text-muted-foreground">
            Edit announcement banners, update pricing copy, and toggle feature
            flags. All changes save to the backend immediately — no rebuild
            required.
          </div>
        </div>
      </div>
    </div>
  ),
};

const adminDeveloperSection: GuideSection = {
  id: "admin-section",
  title: "Admin Section — Technical Details",
  icon: ShieldCheck,
  content: (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="destructive" className="text-xs">
          Admin Only
        </Badge>
        <span className="text-xs text-muted-foreground">
          Visible only to admin users
        </span>
      </div>
      <p>
        The <code className="text-xs bg-muted px-1 rounded">/admin</code> route
        is guarded by an{" "}
        <code className="text-xs bg-muted px-1 rounded">isAdmin</code> check on
        mount — non-admin users who navigate directly to the URL see an "Access
        Denied" state.
      </p>
      <p className="font-semibold text-sm">Access & role management:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
        <li>
          Admin role is claimed on first login via{" "}
          <code className="text-xs bg-muted px-1 rounded">
            claimInitialAdmin()
          </code>{" "}
          — the first Internet Identity principal to sign in becomes the admin
          and the role locks
        </li>
        <li>
          Role stored in the backend via the{" "}
          <code className="text-xs bg-muted px-1 rounded">authorization</code>{" "}
          component
        </li>
        <li>
          <code className="text-xs bg-muted px-1 rounded">
            lockfree_is_admin
          </code>{" "}
          localStorage key caches the admin flag client-side for fast UI
          rendering
        </li>
      </ul>
      <p className="font-semibold text-sm">Backend APIs used:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
        <li>
          <code className="text-xs bg-muted px-1 rounded">
            getAdminAnalytics()
          </code>{" "}
          — returns aggregate stats
        </li>
        <li>
          <code className="text-xs bg-muted px-1 rounded">listAllUsers()</code>{" "}
          — paginated user list with tier info
        </li>
        <li>
          <code className="text-xs bg-muted px-1 rounded">
            setUserTier(principal, tier)
          </code>{" "}
          — manually change a user's plan
        </li>
        <li>
          <code className="text-xs bg-muted px-1 rounded">
            getContentSettings()
          </code>{" "}
          /{" "}
          <code className="text-xs bg-muted px-1 rounded">
            saveContentSettings()
          </code>{" "}
          — read and write announcement banners and feature flags
        </li>
      </ul>
    </div>
  ),
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserGuidePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "business" | "developers" | "migration"
  >("business");
  const [isAdmin] = useState(
    () => localStorage.getItem("lockfree_is_admin") === "true",
  );

  const allBusinessSections = useMemo(() => {
    return isAdmin
      ? [...businessSections, adminBusinessSection]
      : businessSections;
  }, [isAdmin]);

  const allDeveloperSections = useMemo(() => {
    return isAdmin
      ? [...developerSections, adminDeveloperSection]
      : developerSections;
  }, [isAdmin]);

  const filteredBusiness = useMemo(() => {
    if (!search.trim()) return allBusinessSections;
    const q = search.toLowerCase();
    return allBusinessSections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (typeof s.content === "object" &&
          JSON.stringify(s.content).toLowerCase().includes(q)),
    );
  }, [search, allBusinessSections]);

  const filteredDevelopers = useMemo(() => {
    if (!search.trim()) return allDeveloperSections;
    const q = search.toLowerCase();
    return allDeveloperSections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (typeof s.content === "object" &&
          JSON.stringify(s.content).toLowerCase().includes(q)),
    );
  }, [search, allDeveloperSections]);

  return (
    <div data-ocid="user_guide.page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">User Guide</h1>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about LockFree Engine
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          data-ocid="user_guide.search_input"
          placeholder="Search the user guide…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/40 border-border"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "business" | "developers" | "migration")
        }
      >
        <TabsList className="w-full sm:w-auto" data-ocid="user_guide.tab">
          <TabsTrigger value="business" className="flex-1 sm:flex-none gap-2">
            <Users className="w-3.5 h-3.5" />
            For Business Owners
          </TabsTrigger>
          <TabsTrigger value="developers" className="flex-1 sm:flex-none gap-2">
            <Code2 className="w-3.5 h-3.5" />
            For Developers
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex-1 sm:flex-none gap-2">
            <Navigation className="w-3.5 h-3.5" />
            Migration Guide
          </TabsTrigger>
        </TabsList>

        {/* Business Owners Tab */}
        <TabsContent
          value="business"
          data-ocid="user_guide.business_owners.panel"
          className="mt-4"
        >
          {filteredBusiness.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No sections match your search.
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {filteredBusiness.map((section, idx) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  data-ocid={`user_guide.business.item.${idx + 1}`}
                  className="rounded-lg border border-border bg-card overflow-hidden px-0"
                >
                  <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:shrink-0">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="text-sm text-foreground/90 leading-relaxed pl-10">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Developers Tab */}
        <TabsContent
          value="developers"
          data-ocid="user_guide.developers.panel"
          className="mt-4"
        >
          {filteredDevelopers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No sections match your search.
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {filteredDevelopers.map((section, idx) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  data-ocid={`user_guide.developers.item.${idx + 1}`}
                  className="rounded-lg border border-border bg-card overflow-hidden px-0"
                >
                  <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:shrink-0">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="text-sm text-foreground/90 leading-relaxed pl-10">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        {/* Migration Guide Tab */}
        <TabsContent
          value="migration"
          data-ocid="user_guide.migration.panel"
          className="mt-4 space-y-8"
        >
          {/* Business Owners Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  For Business Owners
                </h2>
                <p className="text-xs text-muted-foreground">
                  Plain-language guide to migrating your business to ICP Cloud
                  Engines
                </p>
              </div>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {[
                {
                  id: "mg-biz-1",
                  title: 'What does "migrating to the cloud" mean?',
                  icon: Globe,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Migrating to the cloud means moving your apps, data, and
                        systems from traditional servers — whether on-premise or
                        hosted on AWS, Azure, or Google Cloud — to a new
                        infrastructure.
                      </p>
                      <p>
                        With LockFree Engine and the Internet Computer Protocol
                        (ICP), your data lives on a{" "}
                        <strong>decentralised network</strong> instead of a
                        single provider&apos;s infrastructure. No single company
                        owns the hardware your business runs on.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Your apps run on globally distributed nodes</li>
                        <li>No servers to manage, patch, or worry about</li>
                        <li>Data is tamper-proof and auditable by design</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "mg-biz-2",
                  title: "Why does vendor lock-in matter?",
                  icon: Shield,
                  content: (
                    <div className="space-y-2">
                      <p>
                        With traditional cloud providers, switching vendors
                        means <strong>months of engineering work</strong> —
                        rewriting APIs, migrating databases, retraining your
                        team, and paying expensive data egress fees.
                      </p>
                      <p>
                        ICP Cloud Engines are designed for portability from day
                        one. You can:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>
                          Move between AWS, Google Cloud, and Azure freely
                        </li>
                        <li>Run across all three providers simultaneously</li>
                        <li>
                          Switch providers without rebuilding your systems
                        </li>
                        <li>
                          Negotiate better pricing because you&apos;re never
                          trapped
                        </li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "mg-biz-3",
                  title: "What will my team need to do?",
                  icon: Users,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Your technical team handles the actual migration — we
                        have a detailed step-by-step guide for them in the{" "}
                        <strong>For Developers</strong> section below.
                      </p>
                      <p>As a business owner, your role is to:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>
                          Define which systems to migrate first (start small)
                        </li>
                        <li>
                          Set realistic timelines with your technical lead
                        </li>
                        <li>
                          Approve the new cloud engine configuration before
                          go-live
                        </li>
                        <li>
                          Monitor the LockFree Engine dashboard once it&apos;s
                          running
                        </li>
                      </ul>
                      <p className="text-muted-foreground">
                        LockFree Engine gives you a single dashboard to monitor
                        everything — costs, resilience scores, and migration
                        status — without needing to touch any technical tools
                        yourself.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-biz-4",
                  title: "How does LockFree Engine manage the complexity?",
                  icon: LayoutDashboard,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Instead of juggling the AWS Console, Google Cloud
                        Portal, and Azure Management Center separately — each
                        with their own interfaces, billing systems, and alert
                        setups —{" "}
                        <strong>everything is managed from one place</strong>.
                      </p>
                      <p>From the LockFree Engine dashboard you can:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Provision new cloud engines with a few clicks</li>
                        <li>
                          Track live costs across all providers in one view
                        </li>
                        <li>
                          Trigger migrations between providers without
                          command-line tools
                        </li>
                        <li>
                          Monitor resilience scores and get proactive alerts
                        </li>
                        <li>
                          Manage users and access permissions from one admin
                          panel
                        </li>
                      </ul>
                      <p className="text-muted-foreground">
                        No command line. No cloud certifications required. Just
                        a clean dashboard built for both technical and
                        non-technical teams.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-biz-5",
                  title: "How do I get started?",
                  icon: Rocket,
                  content: (
                    <div className="space-y-2">
                      <p>
                        LockFree Engine is currently in early access, ahead of
                        the public launch of the ICP Cloud Engines API.
                      </p>
                      <p>
                        <strong>To get started:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                        <li>
                          Join the waitlist on the landing page for early access
                          priority
                        </li>
                        <li>
                          When the ICP Cloud Engines API launches publicly,
                          you&apos;ll be onboarded first
                        </li>
                        <li>
                          Enterprise and Business plan users receive dedicated
                          onboarding support and a guided setup session
                        </li>
                      </ol>
                      <p className="text-muted-foreground mt-2">
                        Already signed in? Explore the dashboard in Demo Mode to
                        see exactly how LockFree Engine works before committing
                        to a plan.
                      </p>
                    </div>
                  ),
                },
              ].map((section, idx) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  data-ocid={`user_guide.migration.business.item.${idx + 1}`}
                  className="rounded-lg border border-border bg-card overflow-hidden px-0"
                >
                  <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:shrink-0">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="text-sm text-foreground/90 leading-relaxed pl-10">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Developer Section Separator */}
          <div className="border-t border-border" />

          {/* Developers Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  For Developers — Technical Migration Path
                </h2>
                <p className="text-xs text-muted-foreground">
                  Step-by-step guide with code snippets for migrating Web2
                  systems to ICP Cloud Engines
                </p>
              </div>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {[
                {
                  id: "mg-dev-1",
                  title: "Step 1: Audit Your Existing Stack",
                  icon: ListChecks,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Before writing a single line of migration code, build a
                        complete inventory of your current infrastructure. This
                        drives your entire migration plan.
                      </p>
                      <p>Catalogue the following:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>
                          <strong>Databases:</strong> PostgreSQL, MySQL,
                          MongoDB, Redis — note schemas, sizes, and
                          relationships
                        </li>
                        <li>
                          <strong>APIs:</strong> REST or GraphQL endpoints,
                          their consumers, and SLA requirements
                        </li>
                        <li>
                          <strong>Auth system:</strong> JWT, OAuth2,
                          session-based — note how identity is stored and
                          verified
                        </li>
                        <li>
                          <strong>File storage:</strong> S3 buckets, GCS, Azure
                          Blob — note file types, sizes, and access patterns
                        </li>
                        <li>
                          <strong>Background jobs:</strong> Cron tasks, queues,
                          and event-driven workflows
                        </li>
                      </ul>
                      <p className="text-muted-foreground">
                        Prioritise the smallest, most self-contained service for
                        your first migration. A clean success builds team
                        confidence.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-2",
                  title: "Step 2: Export Your Data",
                  icon: Download,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Export relational data as CSV or JSON. For NoSQL, use
                        native export tools. Clean and normalise your data
                        before import — ICP storage is append-optimised, so
                        clean input saves cycles later.
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`# PostgreSQL export
pg_dump --format=json mydb > export.json

# MongoDB export
mongoexport --db mydb --collection users --out users.json`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        Strip nulls, normalise timestamps to Unix milliseconds,
                        and ensure IDs are strings — Motoko uses{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          Text
                        </code>{" "}
                        not integers as primary keys by convention.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-3",
                  title: "Step 3: Model Your Data in Motoko",
                  icon: Database,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Recreate your schema as Motoko types. Use{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          stable var
                        </code>{" "}
                        declarations for data that must survive canister
                        upgrades.
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`// Stable storage survives canister upgrades
stable var users : [(Text, UserRecord)] = [];

type UserRecord = {
  id: Text;
  email: Text;
  createdAt: Int;
  tier: Text;
};`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        Use{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          HashMap
                        </code>{" "}
                        or{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          TrieMap
                        </code>{" "}
                        for in-memory lookups, and serialize to stable vars in{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          preupgrade
                        </code>{" "}
                        /{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          postupgrade
                        </code>{" "}
                        hooks.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-4",
                  title: "Step 4: Migrate Your Backend Logic",
                  icon: Server,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Replace REST/GraphQL endpoints with canister{" "}
                        <strong>query</strong> and <strong>update</strong>{" "}
                        calls. Queries are read-only and fast (no consensus
                        required); updates write to state and go through
                        consensus.
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`// Query (read-only, fast — no consensus)
public query func getUser(id: Text) : async ?UserRecord {
  HashMap.get(usersMap, Text.equal, Text.hash, id)
};

// Update (writes state — goes through consensus)
public func createUser(record: UserRecord) : async Bool {
  HashMap.put(usersMap, Text.equal, Text.hash, record.id, record);
  true
};`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        Tip: design your data access patterns for queries
                        wherever possible. Updates are ~2-4 seconds due to
                        consensus; queries respond in milliseconds.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-5",
                  title: "Step 5: Update Authentication",
                  icon: Key,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Replace JWT/OAuth with{" "}
                        <strong>Internet Identity</strong>. Use{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          @dfinity/auth-client
                        </code>{" "}
                        in the frontend. No passwords, no tokens — users
                        authenticate with their device (Face ID, Touch ID,
                        hardware key).
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`import { AuthClient } from "@dfinity/auth-client";

const authClient = await AuthClient.create();
await authClient.login({
  identityProvider: "https://identity.ic0.app",
  onSuccess: () => {
    const identity = authClient.getIdentity();
    // use identity to create actor
    const actor = createActor(canisterId, { agentOptions: { identity } });
  },
});`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        Each user gets a unique{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          Principal
                        </code>{" "}
                        — a cryptographic identity that serves as both their
                        user ID and authorization credential in one.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-6",
                  title: "Step 6: Handle File Storage",
                  icon: HardDrive,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Replace S3/GCS with ICP blob storage. The standard
                        canister message limit is 2MB, so use the LockFree
                        Engine blob storage component for larger files. Files
                        are served via HTTP URLs cached at the edge.
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`// Upload a file via blob storage component
const { uploadFile } = useBlobStorage();

const url = await uploadFile(file, {
  contentType: file.type,
  filename: file.name,
});

// url is a permanent HTTP URL you can store in your canister
// e.g. https://<canister-id>.raw.ic0.app/blob/<id>`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        For large media files (video, high-res images), the blob
                        storage component handles chunking automatically — no
                        manual splitting required.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-7",
                  title: "Step 7: Deploy Your Canister on ICP",
                  icon: Rocket,
                  content: (
                    <div className="space-y-2">
                      <p>
                        Use{" "}
                        <code className="text-xs bg-muted px-1 rounded">
                          dfx deploy
                        </code>{" "}
                        to push your Motoko canister to the ICP mainnet. The
                        canister ID becomes your permanent backend address — no
                        servers to manage, no uptime to monitor.
                      </p>
                      <pre className="text-xs bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mt-2">
                        <code>{`# Deploy to ICP mainnet
dfx deploy --network ic

# Your canister is now live at:
# https://<canister-id>.ic0.app

# Check canister status
dfx canister --network ic status <canister-id>`}</code>
                      </pre>
                      <p className="text-muted-foreground">
                        Cycles are ICP&apos;s compute resource. Top up your
                        canister with cycles before deployment — it needs a
                        minimum balance to execute calls. Use the{" "}
                        <a
                          href="https://nns.ic0.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          NNS dapp
                        </a>{" "}
                        to convert ICP to cycles.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "mg-dev-8",
                  title:
                    "Step 8: Provision Your Cloud Engine via LockFree Engine",
                  icon: Zap,
                  content: (
                    <div className="space-y-2">
                      <p>
                        With your canister deployed, return to LockFree Engine
                        and provision a Cloud Engine pointing to your canister
                        ID. From here, all management is handled from the
                        dashboard:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Scaling and performance tuning</li>
                        <li>Migration between providers (AWS → GCP → Azure)</li>
                        <li>
                          Live cost tracking and optimisation recommendations
                        </li>
                        <li>Resilience monitoring and automated failover</li>
                      </ul>
                      <div className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                        <p className="text-sm font-medium text-primary">
                          When the ICP Cloud Engines API launches publicly, your
                          setup will automatically unlock dedicated subnet
                          resources — no reconfiguration required.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ready to provision? Join the waitlist on the landing
                          page for early access priority.
                        </p>
                      </div>
                    </div>
                  ),
                },
              ].map((section, idx) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  data-ocid={`user_guide.migration.developer.item.${idx + 1}`}
                  className="rounded-lg border border-border bg-card overflow-hidden px-0"
                >
                  <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 transition-colors [&>svg]:shrink-0">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="text-sm text-foreground/90 leading-relaxed pl-10">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-muted-foreground border-t border-border">
        LockFree Engine — Built on the Internet Computer Protocol (ICP) ·{" "}
        <a
          href="https://dfinity.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline underline-offset-2"
        >
          Learn about DFINITY Mission 70
        </a>
      </div>
    </div>
  );
}
