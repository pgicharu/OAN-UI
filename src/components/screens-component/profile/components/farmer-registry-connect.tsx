import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/shared/components/phone-input';
import apiService from '@/lib/api-service';

export function FarmerRegistryConnect() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [farmerId, setFarmerId] = useState<string | null>(() => {
    // Not stored locally today — only farmer_token is. If already connected
    // from a previous session, we know a token exists but not which farmer
    // it belongs to until the user reconnects.
    return apiService.getFarmerToken() ? 'connected' : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connected = Boolean(apiService.getFarmerToken());

  const handleConnect = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await apiService.loginFarmerRegistry(phone, password);
      setFarmerId(result.farmer_id);
      setPassword('');
    } catch (err) {
      console.error('Farmer registry login failed:', err);
      setError('Could not connect. Check the phone number and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    apiService.clearFarmerToken();
    setFarmerId(null);
    setPhone('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Registry</CardTitle>
        <CardDescription>
          Connect your farmer registry account so advice is tailored to your
          county, crops, and farming conditions on file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {connected ? (
          <p className="text-sm text-muted-foreground">
            Connected{farmerId && farmerId !== 'connected' ? ` as ${farmerId}` : ''}.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="farmer-registry-phone">Phone number</Label>
              <PhoneInput
                id="farmer-registry-phone"
                value={phone}
                onChange={(value) => setPhone(value ?? '')}
                defaultCountry="KE"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="farmer-registry-password">Password</Label>
              <Input
                id="farmer-registry-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Farmer registry password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={loading || !phone || !password}>
            {loading ? 'Connecting…' : 'Connect'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default FarmerRegistryConnect;
