require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();


const carregarConfiguracoes =
  require("./middlewares/configMiddleware");

// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

// Arquivos públicos
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// Ler JSON
app.use(express.json());

// Ler formulários
app.use(express.urlencoded({
  extended: true
}));

// Sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);



// ==========================================
// CONFIGURAÇÕES DO SITE
// ==========================================



app.use(carregarConfiguracoes);


// ==========================================
// ROTAS
// ==========================================

const inicioRoutes = require("./routes/inicioRoutes");
const equipeRoutes = require("./routes/equipeRoutes");
const aplicacoesRoutes = require("./routes/aplicacoesRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");
const sobreRoutes = require("./routes/sobreRoutes");
const contatoRoutes = require("./routes/contatoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Site
app.use("/", inicioRoutes);
app.use("/equipe", equipeRoutes);
app.use("/aplicacoes", aplicacoesRoutes);
app.use("/noticias", noticiasRoutes);
app.use("/sobre", sobreRoutes);
app.use("/contato", contatoRoutes);

// Administração
app.use("/login", loginRoutes);
app.use("/admin", adminRoutes);




// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});