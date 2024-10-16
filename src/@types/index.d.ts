declare module '*.png';

declare interface CreateUserParams {
    email: string;
    password: string;
    username: string;
    phone: string;
}

// Definição de tipos para o usuário e contexto global
declare interface User {
    id: string;
    email: string;
    username: string;
    phone: string;
    // Adicione outros campos conforme necessário
  };
  
declare interface GlobalContextType{
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
  };