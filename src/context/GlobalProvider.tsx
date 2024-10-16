import React, { createContext, FC, useState, useEffect } from "react";
import { PropsWithChildren } from "react";
import { getCurrentUser } from "../lib/actions/client.actions";

// Inicializa o contexto com um valor padrão
export const GlobalContext = createContext<GlobalContextType>({
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: true,
});

// Provedor do contexto
export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          const mappedUser: User = {
            id: res.$id,         
            email: res.email,     
            username: res.name,   
            phone: res.phone,     
          };
          setIsLogged(true);
          setUser(mappedUser);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const defaultValue = {
    isLogged,
    setIsLogged,
    user,
    setUser,
    loading,
  };

  return (
    <GlobalContext.Provider value={defaultValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
