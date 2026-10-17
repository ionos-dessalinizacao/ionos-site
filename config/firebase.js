
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function obterCredenciaisFirebase() {
    const credenciais = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (credenciais) {
        try {
            return JSON.parse(credenciais);
        } catch (erro) {
            throw new Error(
                "A variável FIREBASE_SERVICE_ACCOUNT não contém um JSON válido."
            );
        }
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
