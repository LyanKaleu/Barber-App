import {
    Account,
    Client,
    ID,
    Databases,
    Avatars,
    Storage,
    Functions
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "",
    projectId: "66f809da000a980bacff",
    storageId: "66f80b59000e103637dc",
    databaseId: "66fd8e00003adfe554bf",
    userCollectionId: "66fd8e2f000daf3bf263",
    schedulingCollectionId: "6717ad14001aaf52e7f8"
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export const functions = new Functions(client);