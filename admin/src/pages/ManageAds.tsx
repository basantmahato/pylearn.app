import { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
    Megaphone, 
    Save, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2 
} from 'lucide-react';

interface AdConfigData {
    adsEnabled: boolean;
    androidAppId: string;
    bannerId: string;
    interstitialId: string;
    rewardedId: string;
    rewardedInterstitialId: string;
    appOpenId: string;
}

const ManageAds = () => {
    const [config, setConfig] = useState<AdConfigData>({
        adsEnabled: false,
        androidAppId: '',
        bannerId: '',
        interstitialId: '',
        rewardedId: '',
        rewardedInterstitialId: '',
        appOpenId: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<AdConfigData>('/admin/ads/config');
            if (response.data) {
                setConfig(response.data);
            }
        } catch (err: any) {
            console.error('Error fetching ads config:', err);
            setError(err.response?.data?.msg || 'Failed to fetch Ads Configuration from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            await api.post('/admin/ads/config', config);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err: any) {
            console.error('Error saving ads config:', err);
            setError(err.response?.data?.msg || 'Failed to save Ads Configuration.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = () => {
        setConfig(prev => ({
            ...prev,
            adsEnabled: !prev.adsEnabled
        }));
    };

    const handleInputChange = (field: keyof AdConfigData, value: string) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Loading Ads Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header section */}
            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Monetization & Ads Settings</h2>
                    <p className="text-muted-foreground text-sm mt-1">Configure global advertising switches and Android AdMob production keys dynamically.</p>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>Ads configuration saved and synchronized successfully!</p>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Global Toggle Card */}
                <Card className="shadow-sm border-muted/30 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Megaphone className={`h-5 w-5 ${config.adsEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                    Global In-App Advertisements
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    When toggled off, ads will be immediately disabled for all client users without requiring an app store update.
                                </p>
                            </div>

                            {/* Beautiful Custom Tailwind Switch Toggle */}
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className={`text-sm font-bold ${config.adsEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {config.adsEnabled ? 'Active / Serving' : 'Inactive / Disabled'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleToggle}
                                    className={`${
                                        config.adsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                                    } relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                >
                                    <span
                                        className={`${
                                            config.adsEnabled ? 'translate-x-7' : 'translate-x-0'
                                        } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                                    />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ad unit configurations card */}
                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="border-b bg-muted/10 p-5">
                        <CardTitle className="text-lg font-bold">Production AdMob IDs (Android)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            {/* Removed App ID input as it must be hardcoded in app.json */}

                            {/* Banner ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Banner Ad Unit ID</label>
                                <Input 
                                    value={config.bannerId}
                                    onChange={(e) => handleInputChange('bannerId', e.target.value)}
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    className="font-mono text-xs"
                                    required
                                />
                            </div>

                            {/* Interstitial ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Interstitial Ad Unit ID</label>
                                <Input 
                                    value={config.interstitialId}
                                    onChange={(e) => handleInputChange('interstitialId', e.target.value)}
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    className="font-mono text-xs"
                                    required
                                />
                            </div>

                            {/* Rewarded ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rewarded Ad Unit ID</label>
                                <Input 
                                    value={config.rewardedId}
                                    onChange={(e) => handleInputChange('rewardedId', e.target.value)}
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    className="font-mono text-xs"
                                    required
                                />
                            </div>

                            {/* Rewarded Interstitial ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rewarded Interstitial ID</label>
                                <Input 
                                    value={config.rewardedInterstitialId}
                                    onChange={(e) => handleInputChange('rewardedInterstitialId', e.target.value)}
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    className="font-mono text-xs"
                                    required
                                />
                            </div>

                            {/* App Open ID */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">App Open Ad Unit ID</label>
                                <Input 
                                    value={config.appOpenId}
                                    onChange={(e) => handleInputChange('appOpenId', e.target.value)}
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    className="font-mono text-xs"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save controls */}
                <div className="flex justify-end items-center gap-4">
                    <Button
                        type="button"
                        onClick={fetchConfig}
                        variant="outline"
                        disabled={saving}
                        className="font-semibold shadow-sm"
                    >
                        Reset Changes
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 font-semibold shadow-md px-6 bg-primary hover:bg-primary/95 text-white"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Saving Config...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save & Synchronize
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ManageAds;
