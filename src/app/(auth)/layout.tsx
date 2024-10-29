import Image from 'next/image';

import loginImage from './pexels-cottonbro-4778404.jpg';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    redirect('/app');
  }

  return (
    <div className="grid h-screen w-screen grid-cols-2">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">¿Listo para aprobar tu examen?</h1>
        <p className="text-sm text-muted-foreground">
          Con ManejaPe, podrás estudiar y aprobar tu examen de conducir en
          cuestión de días.
        </p>

        {children}
      </div>
      <div className="relative">
        <Image
          src={loginImage}
          alt="Login"
          className="object-cover"
          fill
          placeholder="blur"
        />
      </div>
    </div>
  );
}
