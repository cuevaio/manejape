'use server';

import { z } from 'zod';

import { id } from '@/lib/nanoid/id';
import { otp } from '@/lib/nanoid/otp';
import { redis } from '@/lib/redis';
import { resend } from '@/lib/resend';
import { User } from '@/lib/types';

export async function login(formData: FormData): Promise<
  | {
      success: true;
      data: { email: string };
    }
  | { success: false; error: string }
> {
  try {
    const rawEmail = formData.get('email');

    const parsedEmail = z.string().email().safeParse(rawEmail);

    if (!parsedEmail.success) {
      throw new Error('Invalid email');
    }
    const email = parsedEmail.data.toLowerCase();

    let userId: string | null = null;

    const existingUserId = await redis.get<string>(`userIdByEmail:${email}`);

    if (existingUserId) {
      userId = existingUserId;
    } else {
      userId = id();

      const user: User = {
        email,
        plan: 'free',
        createdAt: new Date().toISOString(),
      };

      await redis.set(`userIdByEmail:${email}`, userId);
      await redis.hset(`user:${userId}`, user);
    }

    const oneTimePassword = otp();

    await resend.emails.send({
      from: 'onboarding@updates.cueva.io',
      to: parsedEmail.data,
      subject: 'Your one-time password for maneja.pe',
      text: `Your one-time password for maneja.pe is ${oneTimePassword}`,
    });

    await redis.set(`otpByUserId:${userId}`, oneTimePassword);
    await redis.expire(`otpByUserId:${userId}`, 60 * 15); // 15 minutes

    return { success: true, data: { email } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    console.error(error);
    return { success: false, error: 'Something went wrong' };
  }
}
