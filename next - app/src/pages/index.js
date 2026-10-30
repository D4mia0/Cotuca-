import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "aluno",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Realizando Login com:", {
        email: formData.email,
        senha: formData.senha,
      });
    } else {
      console.log("Realizando Cadastro com:", formData);
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
            Área do Professor
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
                <div className={styles.field}>
                  <label className={styles.label}>Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Ana Souza"
                    className={styles.input}
                  />
                </div>
              )}

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
                  <label className={styles.label}>Vínculo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="aluno">Aluno / Estudante</option>
                    <option value="professor">Professor / Docente</option>
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