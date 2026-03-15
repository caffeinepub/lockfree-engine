import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="bg-card border-border max-w-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Content Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Announcement Banner */}
        <div className="space-y-2">
          <Label
            htmlFor="banner"
            className="text-sm font-medium text-foreground"
          >
            Announcement Banner
          </Label>
          <p className="text-xs text-muted-foreground">
            Displayed to all users at the top of the dashboard. Leave empty to
            hide.
          </p>
          <Input
            id="banner"
            data-ocid="admin.content.banner.input"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="e.g. 🚀 Cloud Engines API launching soon — stay tuned!"
            className="bg-muted border-border text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Affiliate toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-foreground">
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
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Demo Mode toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-foreground">
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
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Save */}
        <Button
          data-ocid="admin.content.save.button"
          onClick={handleSave}
          disabled={isPending || isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
      </CardContent>
    </Card>
  );
}
