import { customAlphabet } from 'nanoid';

const otpAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const otpAlphabetRegex = '^[A-Z0-9]+$';

export const otp = customAlphabet(otpAlphabet, 6);
