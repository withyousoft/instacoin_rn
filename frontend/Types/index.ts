export interface InstagramShortToken {
  accessToken: string;
  userId: number;
}

export interface InstagramLongToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  createdAt: number;
}
