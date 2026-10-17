
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function obterCredenciaisFirebase() {
    // No Render, as credenciais serão carregadas pelas variáveis de ambiente.
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (erro) {
            throw new Error(
                "A variável FIREBASE_SERVICE_ACCOUNT não contém um JSON válido."
            );
        }
    }

    // Localmente, continua usando o arquivo ignorado pelo Git.
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
