import { FarmerRegistryConnect } from '../components';

export function ProfileWebLayout() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Profile (Web)</h1>
      <FarmerRegistryConnect />
    </div>
  );
}
