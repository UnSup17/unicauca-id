'use client';

import {
  createContext
} from 'react';

export interface IUserData {
  token: string;
  name: string;
  lastName: string;
  id: string;
  typeId: string;
  bloodType: string;
  gender: string;
}

export const UserContext = createContext<any>(null);
