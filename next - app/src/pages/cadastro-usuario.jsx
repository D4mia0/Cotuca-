import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Cadastro.module.css";

const API_URL = "http://localhost:3001/api";

export default function CadastroUsuarioPage() {
  const [form, setForm] = useState({
    cpf: "",
    nomeCompleto: "",
    dataAniversario: "",
    celular: "",
    email: "",
    loginUsuario: "",
    senha: "",
    eProfessor: "0" // "0" = Aluno, "1" = Professor
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Monta o payload estrito correspondente ao contrato do Usuario Model
    const payload = {
      cpf: form.cpf,
      nomeCompleto: form.nomeCompleto,
      dataAniversario: form.dataAniversario || null,
      celular: form.celular || "",
      email: form.email,
      loginUsuario: form.loginUsuario,
      senha: form.senha,
      eProfessor: parseInt(form.eProfessor, 10)
    };

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || "Erro ao criar conta de usuário.");
      }

      alert(`Usuário "${resultado.Nome_Completo}" cadastrado com sucesso!`);
      
      // Reseta o formulário
      setForm({
        cpf: "",
        nomeCompleto: "",
        dataAniversario: "",
        celular: "",
        email: "",
        loginUsuario: "",
        senha: "",
        eProfessor: "0"
      });
    } catch (error) {
      alert(`Falha no cadastro: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro de Usuário - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.logo}>ReservaLab</span>
          <Link href="/reserva" className={styles.navLink}>
            Ver Reservas →
          </Link>
        </header>

        <main className={styles.main}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Criar Conta de Usuário</h1>
            <p className={styles.subtitle}>
              Cadastre contas para alunos ou professores vinculados ao sistema.
            </p>
          </div>

          <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Informações Pessoais</h2>

                <div className={styles.field}>
                  <label>Tipo de Perfil</label>
                  <select
                    value={form.eProfessor}
                    onChange={(e) => setForm({ ...form, eProfessor: e.target.value })}
                  >
                    <option value="0">Aluno</option>
                    <option value="1">Professor / Docente</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={form.nomeCompleto}
                    onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })}
                  />
                </div>

                <div className={styles.rowFields}>
                  <div className={styles.field}>
                    <label>CPF</label>
                    <input
                      type="text"
                      required
                      placeholder="12345678900"
                      value={form.cpf}
                      onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Data de Aniversário</label>
                    <input
                      type="date"
                      value={form.dataAniversario}
                      onChange={(e) => setForm({ ...form, dataAniversario: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.rowFields}>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="usuario@institucional.br"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Celular</label>
                    <input
                      type="text"
                      placeholder="(19) 99999-9999"
                      value={form.celular}
                      onChange={(e) => setForm({ ...form, celular: e.target.value })}
                    />
                  </div>
                </div>

                <h2>Credenciais de Acesso</h2>

                <div className={styles.rowFields}>
                  <div className={styles.field}>
                    <label>Login de Usuário</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: c.eduardo"
                      value={form.loginUsuario}
                      onChange={(e) => setForm({ ...form, loginUsuario: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Senha</label>
                    <input
                      type="password"
                      required
                      placeholder="******"
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.btnSubmit}>
                  Cadastrar Conta
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}