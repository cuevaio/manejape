export type User = {
  email: string;
  plan: string;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
