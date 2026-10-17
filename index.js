require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const carregarConfiguracoes =
  require("./middlewares/configMiddleware");

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

// Arquivos públicos: CSS, JS, imagens etc.
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// Leitura de JSON
app.use(express.json());

// Leitura de formulários
app.use(
  express.urlencoded({
    extended: true
  })
);

// ==========================================
// SESSÃO
// ==========================================

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

// Equipe: páginas pública e administrativa
app.use("/", equipeRoutes);

// Demais seções
app.use("/aplicacoes", aplicacoesRoutes);
app.use("/noticias", noticiasRoutes);
app.use("/sobre", sobreRoutes);
app.use("/contato", contatoRoutes);

// Login e administração
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
