const aplicacao = require("./src/config/express");

// inicialiação da API no SERVIDOR
aplicacao.listen(3000, () => {
   console.log("API NODEJS rodando na porta 3000");
});