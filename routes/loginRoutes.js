const express = require("express");

const {
    verificarToken
} = require("../services/authService");

const router = express.Router();


// ==========================================
// TELA DE LOGIN
// ==========================================

router.get("/", (req, res) => {

    // Se já estiver logado
    if (req.session.usuario) {

        return res.redirect("/admin");

    }


    res.render("login", {

        title: "Login | Ionos"

    });

});


// ==========================================
// LOGIN
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            idToken
        } = req.body;


        if (!idToken) {

            return res.status(400).json({

                erro:
                    "Token de autenticação não informado."

            });

        }


        // ==========================================
        // VERIFICAR TOKEN NO FIREBASE
        // ==========================================

        const usuario =
            await verificarToken(idToken);


        // ==========================================
        // CRIAR SESSÃO
        // ==========================================

        req.session.usuario = {

            uid: usuario.uid,

            email: usuario.email

        };


        return res.json({

            sucesso: true,

            usuario: {

                uid: usuario.uid,

                email: usuario.email

            }

        });


    } catch (error) {

        console.error(
            "Erro ao realizar login:",
            error
        );


        return res.status(401).json({

            erro:
                "Não foi possível autenticar o usuário."

        });

    }

});


// ==========================================
// LOGOUT
// ==========================================

router.get("/sair", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Erro ao encerrar sessão:",
                error
            );

            return res.status(500).send(
                "Erro ao sair."
            );

        }


        res.redirect("/login");

    });

});


module.exports = router;