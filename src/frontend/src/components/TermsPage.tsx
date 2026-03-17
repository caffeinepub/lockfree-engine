import { ArrowLeft, Shield } from "lucide-react";

interface TermsPageProps {
  onBack?: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: "oklch(0.82 0.22 195 / 0.12)",
                border: "1px solid oklch(0.82 0.22 195 / 0.3)",
              }}
            >
              <Shield
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.82 0.22 195)" }}
              />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              LockFreeEngine
            </span>
          </div>
          <button
            type="button"
            onClick={onBack ?? (() => window.history.back())}
            data-ocid="terms.back_button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
        {/* Title */}
        <div className="mb-12">
          <p className="text-xs font-mono text-primary mb-3 tracking-wider uppercase">
            Legal
          </p>
          <h1
            className="font-display font-bold tracking-tight text-foreground mb-3"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Terms of Service &amp; Acceptable Use Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective date: March 17, 2026 &nbsp;·&nbsp; Last updated: March 17,
            2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          {/* 1. Introduction */}
          <section data-ocid="terms.intro.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              1. Introduction
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                Welcome to{" "}
                <strong className="text-foreground">LockFree Engine</strong>, a
                multi-cloud management dashboard built on the Internet Computer
                Protocol (ICP) by DFINITY. LockFree Engine (referred to as "the
                Service", "we", or "us") enables users to provision, deploy,
                migrate, and manage cloud engine workloads across AWS, Google
                Cloud Platform, and Microsoft Azure through a unified interface.
              </p>
              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms of Service and Acceptable Use Policy ("Terms"). If
                you do not agree, do not use the Service.
              </p>
              <p>
                The Service is currently in{" "}
                <strong className="text-foreground">
                  demo and early-access phase
                </strong>
                . All cloud engine provisioning and migration logic is simulated
                pending the public release of the ICP Cloud Engines API. No real
                workloads are deployed; no real payments are processed unless
                explicitly stated.
              </p>
            </div>
          </section>

          {/* 2. Acceptable Use */}
          <section data-ocid="terms.acceptable_use.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              2. Acceptable Use
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                You agree to use the Service only for lawful purposes and in a
                manner consistent with these Terms. Specifically, you must not:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  "Use the Service to transmit, distribute, or store material that infringes any intellectual property right or contains unlawful content.",
                  "Attempt to gain unauthorised access to any part of the Service, its servers, or any networks connected to it.",
                  "Interfere with the security, integrity, or performance of the Service or its underlying ICP canisters.",
                  "Reverse engineer, decompile, or attempt to extract source code from the Service.",
                  "Create accounts for the purpose of abuse, spam, or circumventing rate limits or program caps (see Section 3).",
                  "Use automated scripts, bots, or tools to interact with the Service in a manner not permitted by these Terms.",
                ].map((item) => (
                  <li
                    key={item.slice(0, 30)}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Referral & Affiliate Fair Use */}
          <section data-ocid="terms.referral.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              3. Referral &amp; Affiliate Program Fair Use Policy
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                LockFree Engine operates a referral and affiliate programme that
                rewards users for genuinely introducing new customers to the
                platform. This section governs your participation in those
                programmes.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                3.1 Referral Cap
              </h3>
              <p>
                Each affiliate account is subject to a{" "}
                <strong className="text-foreground">
                  maximum of 50 qualifying referrals
                </strong>{" "}
                that count toward payout. Referrals beyond this cap will not
                generate earnings unless the cap is explicitly raised by
                LockFree Engine following a manual review of your account.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                3.2 Activity Requirement
              </h3>
              <p>
                A referral only qualifies for payout once the referred user has:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                  <span>
                    Created a verified account using your referral code, and
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                  <span>
                    Provisioned at least one cloud engine within 30 days of
                    signup — demonstrating genuine platform engagement rather
                    than passive account creation.
                  </span>
                </li>
              </ul>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                3.3 Payout Review
              </h3>
              <p>
                All referral and affiliate payouts are{" "}
                <strong className="text-foreground">
                  reviewed manually before processing
                </strong>
                . We reserve the right to withhold or reverse payouts where we
                have reasonable grounds to suspect abuse, misrepresentation, or
                violation of these Terms. Disputed payouts may be subject to a
                30-day hold pending investigation.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                3.4 Prohibited Referral Activities
              </h3>
              <p>
                The following activities constitute abuse of the referral and
                affiliate programme and may result in immediate account
                suspension and forfeiture of accrued earnings:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  "Creating multiple Internet Identity accounts for the purpose of self-referral.",
                  "Using synthetic, bot-generated, or otherwise fraudulent signups as referrals.",
                  "Colluding with other parties to generate artificial referral activity.",
                  "Misrepresenting the nature or features of LockFree Engine in referral materials.",
                  "Using paid advertising that violates our brand guidelines or impersonates LockFree Engine.",
                ].map((item) => (
                  <li
                    key={item.slice(0, 30)}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-destructive/60 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                3.5 Monitoring &amp; Flagging
              </h3>
              <p>
                Affiliate accounts that generate referral activity consistent
                with the prohibited activities listed above — including
                unusually high referral rates, multiple signups from the same IP
                address or device fingerprint, or referrals that do not
                demonstrate meaningful platform engagement — will be
                automatically flagged for manual review. Flagged accounts are
                suspended from payout processing until the review is complete.
              </p>
            </div>
          </section>

          {/* 4. Data Handling */}
          <section data-ocid="terms.data.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              4. Data Handling &amp; Storage
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                LockFree Engine is built on the{" "}
                <strong className="text-foreground">
                  Internet Computer Protocol (ICP)
                </strong>
                , developed by DFINITY Foundation. Unlike traditional SaaS
                applications, there is no centralised server that we operate.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                4.1 Canister Storage
              </h3>
              <p>
                All application data — including user profiles, engine
                configurations, billing events, and referral records — is stored
                within{" "}
                <strong className="text-foreground">Motoko canisters</strong>{" "}
                running on the ICP network. Canisters are tamper-proof,
                replicated across independent node providers worldwide, and
                governed by the Network Nervous System (NNS). We do not have
                unilateral access to modify or delete your data outside normal
                application flows.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                4.2 Authentication
              </h3>
              <p>
                Authentication uses{" "}
                <strong className="text-foreground">
                  DFINITY Internet Identity
                </strong>
                , a cryptographic key-based system. No passwords are stored by
                LockFree Engine or any third party. Your identity is controlled
                by hardware-backed keys under your direct control. We do not
                have access to your private keys.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                4.3 Data Sovereignty &amp; Export
              </h3>
              <p>
                In keeping with our no-lock-in principle, you may export a full
                copy of your data at any time from the{" "}
                <strong className="text-foreground">Account Settings</strong>{" "}
                page in JSON or CSV format. This includes engine configurations,
                migration history, billing events, and account settings.
              </p>

              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide mt-4">
                4.4 What We Collect
              </h3>
              <p>
                We collect only what is necessary to operate the Service: your
                ICP principal identifier, engine and deployment data you create,
                billing and subscription records, referral activity associated
                with your account, and waitlist signup information you
                voluntarily provide. We do not sell, rent, or share your
                personal data with third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* 5. Subscription & Payments */}
          <section data-ocid="terms.payments.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              5. Subscription &amp; Payments
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                LockFree Engine offers four subscription tiers: Free, Pro,
                Business, and Enterprise. Pricing and features are described on
                the Billing page and are subject to change with reasonable
                notice.
              </p>
              <p>
                All payment processing in the current demo phase is{" "}
                <strong className="text-foreground">simulated</strong>. No real
                charges are made. When real billing is enabled, payments will be
                processed via Stripe (card) or ICP token transfer. You will be
                notified before any billing goes live.
              </p>
              <p>
                Subscription fees are non-refundable except where required by
                applicable law. Annual billing offers a discount equivalent to
                approximately two months free compared to monthly billing.
              </p>
            </div>
          </section>

          {/* 6. Intellectual Property */}
          <section data-ocid="terms.ip.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              6. Intellectual Property
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                The LockFree Engine name, logo, visual design, and all software
                code are owned by or licensed to us. You may not reproduce,
                distribute, or create derivative works without express written
                permission.
              </p>
              <p>
                You retain all rights to data and content you create using the
                Service. By using the Service, you grant us a limited licence to
                process that data solely to provide the Service.
              </p>
            </div>
          </section>

          {/* 7. Disclaimers */}
          <section data-ocid="terms.disclaimers.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              7. Disclaimers &amp; Limitation of Liability
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT
                THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE
                SERVICE.
              </p>
              <p>
                LockFree Engine is a demonstration application. The ICP Cloud
                Engines API that it is designed around has not yet been publicly
                released by DFINITY. All cloud engine provisioning and migration
                functionality is simulated and does not represent actual compute
                resource management.
              </p>
            </div>
          </section>

          {/* 8. Governing Law */}
          <section data-ocid="terms.governing_law.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              8. Governing Law
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                These Terms are governed by and construed in accordance with the
                laws of England and Wales, without regard to its conflict of law
                provisions. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts of England
                and Wales.
              </p>
              <p>
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will continue in full force and effect.
              </p>
            </div>
          </section>

          {/* 9. Changes */}
          <section data-ocid="terms.changes.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              9. Changes to These Terms
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                We reserve the right to update these Terms at any time. Material
                changes will be communicated via an in-app announcement banner
                at least 14 days before they take effect. Continued use of the
                Service after the effective date constitutes acceptance of the
                revised Terms.
              </p>
            </div>
          </section>

          {/* 10. Contact */}
          <section data-ocid="terms.contact.section">
            <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border/50">
              10. Contact
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                If you have questions about these Terms, wish to report a
                suspected violation, or need to contact us about a referral or
                affiliate dispute, please reach out via:
              </p>
              <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 font-mono text-xs space-y-1">
                <p>
                  <span className="text-primary">Product:</span> LockFree Engine
                </p>
                <p>
                  <span className="text-primary">Platform:</span> caffeine.ai
                </p>
                <p>
                  <span className="text-primary">Network:</span> Internet
                  Computer Protocol (ICP)
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-border/40 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LockFree Engine. Built on ICP.
          </p>
          <button
            type="button"
            onClick={onBack ?? (() => window.history.back())}
            data-ocid="terms.back_button.bottom"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to app
          </button>
        </div>
      </main>
    </div>
  );
}
