// app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
    redirect('/admin/view?tab=users');
}
