declare global {

  interface ResetTokenPayload {
    sub: string;
    ref?: string;
    expAt?: number;
    proof?: string;
    type: string;
  }

}

export {};

