import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useContentSettings,
  useSaveContentSettings,
} from "../../hooks/useAdminQueries";

export function AdminContentTab() {
  const { data: settings, isLoading } = useContentSettings();
  const { mutateAsync: saveSettings, isPending } = useSaveContentSettings();

  const [banner, setBanner] = useState("");
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [demoModeEnabled, setDemoModeEnabled] = useState(true);

  useEffect(() => {
    if (settings) {
      setBanner(settings.announcementBanner);
      setAffiliateEnabled(settings.affiliateEnabled);
      setDemoModeEnabled(settings.demoModeEnabled);
    }
  }, [settings]);

  async function handleSave() {
    try {
      await saveSettings({
        announcementBanner: banner,
        affiliateEnabled,
        demoModeEnabled,
      });
      toast.success("Content settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  return (
    <div className="max-w-xl">
      <div className="rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/6 bg-background/30 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Content Settings
          </h3>
        </div>

        {/* Form sections */}
        <div className="p-5 space-y-6">
          {/* Announcement Banner */}
          <div className="rounded-xl border border-white/8 bg-background/40 p-4 space-y-3">
            <div>
              <Label
                htmlFor="banner"
                className="text-sm font-semibold text-foreground"
              >
                Announcement Banner
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displayed to all users at the top of the dashboard. Leave empty
                to hide.
              </p>
            </div>
            <Input
              id="banner"
              data-ocid="admin.content.banner.input"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="e.g. 🚀 Cloud Engines API launching soon — stay tuned!"
              className="bg-background/60 border-white/10 rounded-xl focus:border-primary/40 text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {/* Affiliate toggle */}
            <div className="rounded-xl border border-white/8 bg-background/40 p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <Label className="text-sm font-semibold text-foreground">
                  Affiliate Dashboard
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show affiliate referral tools in the dashboard.
                </p>
              </div>
              <Switch
                data-ocid="admin.content.affiliate.switch"
                checked={affiliateEnabled}
                onCheckedChange={setAffiliateEnabled}
                disabled={isLoading}
                className="data-[state=checked]:bg-primary flex-shrink-0"
              />
            </div>

            {/* Demo Mode toggle */}
            <div className="rounded-xl border border-white/8 bg-background/40 p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <Label className="text-sm font-semibold text-foreground">
                  Demo Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow public demo data injection without authentication.
                </p>
              </div>
              <Switch
                data-ocid="admin.content.demo.switch"
                checked={demoModeEnabled}
                onCheckedChange={setDemoModeEnabled}
                disabled={isLoading}
                className="data-[state=checked]:bg-primary flex-shrink-0"
              />
            </div>
          </div>

          {/* Save */}
          <Button
            data-ocid="admin.content.save.button"
            onClick={handleSave}
            disabled={isPending || isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
