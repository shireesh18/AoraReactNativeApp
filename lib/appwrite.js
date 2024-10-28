import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.marla.aora',
    projectId: '671b932a001545cd4f86',
    databaseId: '671b95800027dfe9f6aa',
    userCollectionId: '671b95c00007ac255309',
    videoCollectionId: '671b95eb0039641c7521',
    storageId:'671b98b600243e979ec5'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

   export const createUser = async (email, password, username) => {
       try {
          const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
          )
          if(!newAccount) throw Error;

          const avatarUrl = avatars.getInitials(username)

          await signIn(email, password);

          const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser

       } catch ( error ) {
        console.log(error);
        throw new Error(error);
       }
    }

    export const signIn = async  (email, password) =>  {
        try {
            const session = await account.createEmailPasswordSession(email, password)
            return session;
        } catch ( error ){
            throw new Error(error);
        }
    }
  
    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();

            if(!currentAccount) throw Error;

            const currentUser = await databases.listDocuments(
                config.databaseId, 
                config.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )
            if(!currentUser) throw Error;

            return currentUser.documents[0];

        } catch (error) {
            console.log(error)
        }
    }

    export const getAllPosts = async () => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
            )
            return posts.documents;
        } catch( error ) {
            throw new Error(error);
        }
    }

    export const getLatestPosts = async () => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.orderDesc('$createdAt', Query.limit(7))]
            )
            return posts.documents;
        } catch( error ) {
            throw new Error(error);
        }
    }
    