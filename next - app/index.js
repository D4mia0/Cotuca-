const aplicacao = require("./src/config/express");

// inicialiação da API no SERVIDOR
aplicacao.listen(8081, () => {
   console.log("API NODEJS rodando na porta 8081");
});