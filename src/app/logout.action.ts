'use server';

import {
  deleteSessionTokenCookie,
  getSession,
  invalidateSession,
} from '@/lib/auth';

export async function logout(): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  try {
    const session = await getSession();

    if (!session) {
      return { success: false, error: 'No session found' };
    }

    await invalidateSession(session.id);

    await deleteSessionTokenCookie();

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: 'Something went wrong' };
  }
}
