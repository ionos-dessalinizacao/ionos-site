const {
    getAuth
} = require("firebase-admin/auth");


// ==========================================
// VERIFICAR TOKEN DO FIREBASE
// ==========================================

async function verificarToken(idToken) {

    if (!idToken) {
        throw new Error("Token de autenticação não informado.");
    }

    const usuario = await getAuth().verifyIdToken(idToken);

    return usuario;
}


module.exports = {
    verificarToken
};