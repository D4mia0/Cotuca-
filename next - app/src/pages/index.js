import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const API_URL = "http://localhost:3001/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Estado contendo todos os campos exigidos pela tabela Usuario
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    dataAniversario: "",
    celular: "",
    email: "",
    loginUsuario: "",
    senha: "",
    eProfessor: "0", // "0" = Aluno, "1" = Professor
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // 1. LOGIN NA API
      try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            senha: formData.senha,
          }),
        });

        const usuario = await response.json();

        if (!response.ok) {
          throw new Error(usuario.erro || "Falha na autenticação.");
        }

        localStorage.setItem("usuario", JSON.stringify(usuario));
        alert(`Bem-vindo(a), ${usuario.Nome_Completo}!`);

        if (usuario.E_Professor === 1) {
          router.push("/cadastro");
        } else {
          router.push("/reserva");
        }
      } catch (error) {
        alert(`Erro de Acesso: ${error.message}`);
      }
    } else {
      try {
        const payload = {
          cpf: formData.cpf,
          nomeCompleto: formData.nomeCompleto,
          dataAniversario: formData.dataAniversario || null,
          celular: formData.celular || "",
          email: formData.email,
          loginUsuario: formData.loginUsuario,
          senha: formData.senha,
          eProfessor: parseInt(formData.eProfessor, 10),
        };

        const response = await fetch(`${API_URL}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const resultado = await response.json();

        if (!response.ok) {
          throw new Error(resultado.erro || "Erro ao cadastrar conta.");
        }

        alert("Conta criada com sucesso! Você já pode realizar seu login.");
        setIsLogin(true);
      } catch (error) {
        alert(`Falha no cadastro: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Reserva Lab - Agendamento de Salas e Laboratórios</title>
        <meta
          name="description"
          content="Sistema de reserva de laboratórios e salas acadêmicas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>ReservaLab</span>
          </div>

          <Link href="/reserva" className={styles.headerQuickBtn}>
            Área de Reservas
          </Link>
        </header>

        <main className={styles.main}>
          <div className={styles.authCard}>
            <div className={styles.tabs}>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`${styles.tab} ${isLogin ? styles.tabActive : ""}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`${styles.tab} ${!isLogin ? styles.tabActive : ""}`}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {!isLogin && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label}>Nome Completo</label>
                    <input
                      type="text"
                      name="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Ana Souza"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      placeholder="12345678900"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Data de Aniversário</label>
                    <input
                      type="date"
                      name="dataAniversario"
                      value={formData.dataAniversario}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Celular</label>
                    <input
                      type="text"
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                      placeholder="(19) 99999-9999"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Login do Usuário</label>
                    <input
                      type="text"
                      name="loginUsuario"
                      value={formData.loginUsuario}
                      onChange={handleChange}
                      required
                      placeholder="ex: ana.souza"
                      className={styles.input}
                    />
                  </div>
                </>
              )}

              {/* CAMPOS COMUNS (E-MAIL E SENHA) */}
              <div className={styles.field}>
                <label className={styles.label}>E-mail Institucional</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu.email@instituicao.edu.br"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={styles.input}
                />
              </div>

              {!isLogin && (
                <div className={styles.field}>
                  <label className={styles.label}>Vínculo / Perfil</label>
                  <select
                    name="eProfessor"
                    value={formData.eProfessor}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="0">Aluno / Estudante</option>
                    <option value="1">Professor / Docente</option>
                  </select>
                </div>
              )}

              <button type="submit" className={styles.submitBtn}>
                {isLogin ? "Acessar Sistema" : "Cadastrar Conta"}
              </button>
            </form>

            <p className={styles.footerText}>
              {isLogin ? "Ainda não tem acesso? " : "Já tem uma conta? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className={styles.toggleLink}
              >
                {isLogin ? "Cadastre-se aqui" : "Faça login"}
              </button>
            </p>
          </div>

          <div className={styles.guestBox}>
            <Link href="/reserva" className={styles.directBtn}>
              Entrar sem login (Ver Reservas) →
            </Link>
          </div>
        </main>

        <footer className={styles.footer}>
          &copy; 2026 Reserva Lab. Sistema de Agendamento.
        </footer>
      </div>
    </>
  );
}