
import { User } from '@/hooks/useAuth';

interface ReportsModuleProps {
  user: User;
}

export const ReportsModule = ({ user }: ReportsModuleProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-white text-2xl font-bold mb-4">Reports & Analytics</h2>
      <p className="text-gray-300">Reports features coming soon...</p>
      <p className="text-gray-400 text-sm mt-2">User: {user.name} ({user.role})</p>
    </div>
  );
};
