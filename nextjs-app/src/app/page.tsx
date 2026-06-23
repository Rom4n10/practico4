import AdminShell from '@/components/layout/AdminShell';
import EventTypesView from '@/components/admin/EventTypesView';

export default function HomePage() {
  return (
    <AdminShell>
      <EventTypesView />
    </AdminShell>
  );
}
