import { FarmerRegistryConnect } from '../components';

export function ProfileMobileLayout() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Profile (Mobile)</h1>
      <FarmerRegistryConnect />
    </div>
  );
}
