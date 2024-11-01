import { ID, Models, Query } from "react-native-appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "../appwrite.config";
import { CreateUserParams, UpdateProfileParams, User } from "../../@types";

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

export async function updateUserProfile(user: UpdateProfileParams): Promise<User | null> {
  try {
    let perfilAtualizado: Models.User<Models.Preferences> | undefined;

    // Atualizar somente os dados que estão presentes em user
    if (user.username) {
      perfilAtualizado = await account.updateName(user.username);
    }
    if (user.email && user.password) {
      perfilAtualizado = await account.updateEmail(user.email, user.password);
    }
    if (user.phone && user.password) {
      perfilAtualizado = await account.updatePhone(user.phone, user.password);
    }

    if (!perfilAtualizado) {
      throw new Error("Nenhuma atualização foi realizada.");
      return null;
    }

    const result = await getCurrentUser();
    if (!result || !result.$id) {
      throw new Error("ID do usuário atual não encontrado.");
    }
    const currentUserId = result.$id; // ID da conta do usuário
    
    const updates: Record<string, any> = {}; // Objeto para armazenar os atributos a serem atualizados

    // Adicionar propriedades ao objeto de atualizações apenas se elas forem diferentes
    if (user.username && user.username !== result.name) {
      updates.username = user.username; // Adiciona username ao objeto se for diferente
    }
    if (user.email && user.email !== result.email) {
      updates.email = user.email; // Adiciona email ao objeto se for diferente
    }
    if (user.phone && user.phone !== result.phone) {
      updates.phone = user.phone; // Adiciona phone ao objeto se for diferente
    }

    // Se não houver atualizações a serem feitas, não chamar updateDocument
    if (Object.keys(updates).length === 0) {
      console.log("Nenhuma atualização necessária.");
      return result;
    }

    // Atualizar dados na tabela 'users' apenas com os atributos alterados
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUserId,
      updates // Passar apenas as atualizações
    );

    // Retornar os dados atualizados do usuário após update
    return await getCurrentUser();

  } catch (error: any) {
    console.error("Erro na atualização:", error.message);

    // Tratamento de mensagens de erro específicas
    let mensagemErro = "Ocorreu um erro.";
    if (error.message.includes("Invalid credentials. Please check the email and password.")) {
      mensagemErro = "A senha está incorreta.";
    } else if (error.message.includes("A target with the same ID already exists.")) {
      mensagemErro = "Essas credenciais já existem.";
    }

    throw new Error(mensagemErro);
  }
}


export async function getBarbers() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("role", "barber")] // Filtra usuários onde o campo "role" é "barber"
    );

    if (!response || response.documents.length === 0) {
      throw new Error("No barbers found");
    }

    return response.documents;
  } catch (error) {
    console.error("Error fetching barbers:", error);
    return [];
  }
}

export async function updateUserProfileAvatar(file: File): Promise<string | null> {
  try {
    // Upload do arquivo para o Appwrite Storage
      const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file // Passando o blob ou o objeto File diretamente
    );

    // Obter a URL do arquivo para visualização
    const fileUrl = storage.getFileView(appwriteConfig.storageId, uploadedFile.$id);

    console.log(file);

    return fileUrl.href;
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
    return null; // Retornar null em caso de erro
  }
}