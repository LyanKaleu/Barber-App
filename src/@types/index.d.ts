import React from "react";

declare module '*.png';

declare type Status = "Agendado" | "Cancelado" | "Concluido";

declare interface CreateUserParams {
    email: string;
    password: string;
    username: string;
    phone: string;
}

declare interface User {
  accountId: string;
    email: string;
    username?: string;
    phone: string;
    avatar_url?: string;
  }
  
declare interface GlobalContextType{
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
  }

  export interface Barber {
    accountId: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    avatar_url: string | null;
}

  export interface Services {
    id: string,
    name: string,
    duration: number,
    price: number,
    description: string
}
// types.ts
export interface CreateAppointmentParams {
  barberId: string;
  schedule: string;
  clientId?: string; // Torna clientId opcional
  status: string;
  service: string;
  note: string;
}

export type UpdateProfileParams = {
  username?: string;
  password: string;
  email?: string;
  phone?: string;
};
