import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
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
    const storage = new Storage(client);

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
    
    export const searchPosts = async ( query ) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.search('title', query)]
            )
            return posts.documents;
        } catch( error ) {
            throw new Error(error);
        }
    }

    export const getUserPosts = async ( userId ) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.equal('creator', userId)]
            )
            return posts.documents;
        } catch( error ) {
            throw new Error(error);
        }
    }

    export const signOut = async () => {
        try {
            const session = await account.deleteSession("current");
           return session;
        } catch ( error ){
            throw new Error(error)
        }
    }

    export const getFilePreview = async (fileId, type) => {
        let fileUrl;

        try {
            if(type === 'video') {
                fileUrl = storage.getFileView(storageId, fileId)
            } else if (type === 'image') {
                fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
            } else {
                throw new Error('Invalid file type')
            }

            if(!fileUrl) throw Error;

            return fileUrl;
        } catch (error) {
            throw new Error(error);
        }
    }

    export const uploadFile = async (file, type) => {
        if(!file) return;

        const { mimeType, ...rest } = file;
        const asset = { type: mimeType, ...rest };

        try {
            const uploadedFile = await storage.createFile(
                storageId,
                ID.unique(),
                asset
            );

            const fileUrl = await getFilePreview(uploadedFile.$id, type);

        } catch (error) {
            throw new Error(error);
        }
    }

    export const createVideo = async (form) => {
        try {
            const [thumbnailUrl, videoUrl] = await Promise.all(
                [
                    uploadFile(form.thumbnail, 'image'),
                    uploadFile(form.video, 'video'),
                ]
            )
            const newPost = await databases.createDocument(
                databaseId, 
                videoCollectionId,
                ID.unique(),
                {
                    title: form.title,
                    thumbnail: form.thumbnailUrl,
                    video: form.videoUrl,
                    prompt: form.prompt,
                    creator: form.userId
                }
            )
            return newPost;
        } catch (error) {
            throw new Error(error);
        }
    }