// chamar o pacote do BD sqlserver
const mssql = require("mssql");

// Configuração da conexão com o SQL Server
const configuracao = {
    user    : "BD26641",
    password: "BD26641",
    server  : "regulus.cotuca.unicamp.br",
    database: "BD26641",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Executar a conexão com o BD SQLSERVER
mssql.connect(configuracao)
    .then(() => {
        console.log("CONEXÃO com o BD SQLSERVER realizada com SUCESSO!");
    })
    .catch((erro) => {
        console.log("ERRO na CONEXÃO com o BD SQLSERVER");
        console.log("\nErro = " + erro);
    });

module.exports = mssql;