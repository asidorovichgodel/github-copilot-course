import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { CvExtractionForm } from './_components/CvExtractionForm';

/**
 * CV Extraction page — accessible to admin users only.
 * `requireAdminRole` redirects unauthenticated users to /sign-in
 * and non-admins to / before the page renders.
 */
export default async function CvExtractionPage() {
  await requireAdminRole();

  return <CvExtractionForm />;
}
