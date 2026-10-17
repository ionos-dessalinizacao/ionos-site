
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function obterCredenciaisFirebase() {
    if (
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_PROJECT_ID
    ) {
        return {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        };
    }

    return require("./serviceAccountKey.json");
}

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(obterCredenciaisFirebase())
    });

const db = getFirestore(app);

module.exports = {
    app,
    db
};
