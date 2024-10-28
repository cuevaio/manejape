import { auth } from '@/lib/auth';

import { Pricing } from './pricing';
import { UserMenu } from './user-menu';

export default async function Home() {
  const user = await auth();

  return (
    <div>
      <div className="sticky top-0 flex w-full items-center justify-center bg-foreground py-2 font-bold text-background">
        50% de descuento por lanzamiento 
      </div>
      <div className="container mx-auto">
        <nav className="my-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold">ManejaPe</h1>
          <UserMenu />
        </nav>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <Pricing />
      </div>
    </div>
  );
}
