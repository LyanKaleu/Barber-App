import { ID, Query } from "react-native-appwrite";
import { account, appwriteConfig, avatars, databases } from "../appwrite.config";

export async function createUser(user: CreateUserParams) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    if (!newAccount) throw Error;

    await signIn(user.email, user.password);

    const avatarUrl = avatars.getInitials(user.username);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: 'client',
        avatar: avatarUrl
      }
    );

    return newUser;
  } catch (error: any) {
    let mensagemErro = "Ocorreu um erro ao tentar criar a conta."; 

    if (error.code) {
      switch (error.code) {
        case 400: // Bad request (ex: e-mail inválido ou outro campo com problema)
          mensagemErro = "Dados inválidos. Verifique as informações inseridas.";
          break;
        case 409: // Conflito (ex: e-mail já existente)
          mensagemErro = "Este e-mail já está cadastrado.";
          break;
        case 500: // Internal server error
          mensagemErro = "Erro no servidor. Tente novamente mais tarde.";
          break;
        default:
          mensagemErro = "Erro desconhecido. Tente novamente.";
          break;
      }
    }

    throw new Error(mensagemErro);
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    let mensagemErro = "Ocorreu um erro ao tentar fazer login.";

    if (error.code) {
      switch (error.code) {
        case 401: // Unauthorized
          mensagemErro = "Credenciais inválidas. Verifique seu email e senha.";
          break;
        case 404: // User not found
          mensagemErro = "Usuário não encontrado. Verifique o email digitado.";
          break;
        case 500: // Internal server error
          mensagemErro = "Erro no servidor. Tente novamente mais tarde.";
          break;
        default:
          mensagemErro = "Erro desconhecido. Tente novamente.";
          break;
      }
    }

    throw new Error(mensagemErro);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Sign Out
export async function passwordRecovery(email: string) {
    const promise = account.createRecovery(email, 'https://example.com');

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  });

}