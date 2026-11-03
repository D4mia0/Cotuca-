import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Cadastro.module.css";

const API_URL = "http://localhost:3001/api";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("lab"); // "lab" | "sala"

  const [laboratorios, setLaboratorios] = useState([]);
  const [salas, setSalas] = useState([]);

  // Estados dos formulários mapeados 1:1 com a tabela Recurso
  const [labForm, setLabForm] = useState({
    nome: "",
    capacidade: "",
    localizacao: "",
    equipamentos: "",
  });

  const [salaForm, setSalaForm] = useState({
    nome: "",
    capacidade: "",
    localizacao: "",
    equipamentos: "",
  });

  useEffect(() => {
    carregarRecursos();
  }, []);

  // 1. CARREGAR RECURSOS SEM FALLBACKS
  async function carregarRecursos() {
    try {
      const res = await fetch(`${API_URL}/recursos`);
      if (res.ok) {
        const dados = await res.json();
        setLaboratorios(dados.filter((item) => item.Tipo_Recurso === "Laboratorio"));
        setSalas(dados.filter((item) => item.Tipo_Recurso === "Sala"));
      }
    } catch (error) {
      console.error("Erro ao carregar recursos da API:", error);
    }
  }

  const handleAddLab = async (e) => {
    e.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) {
      alert("Sessão expirada ou não identificada. Por favor, faça login novamente.");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    try {
      const payload = {
        tipoRecurso: "Laboratorio",
        nome: labForm.nome,
        capacidade: parseInt(labForm.capacidade, 10),
        localizacao: labForm.localizacao,
        equipamentos: labForm.equipamentos,
        idStatus: 1, // 1 = Livre
        idUsuario: usuario.ID_Usuario, // ID do professor responsável
      };

      const response = await fetch(`${API_URL}/recursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || `Erro HTTP ${response.status}`);
      }

      alert("Laboratório cadastrado com sucesso!");
      setLabForm({ nome: "", capacidade: "", localizacao: "", equipamentos: "" });
      carregarRecursos();
    } catch (error) {
      console.error(error);
      alert(`Falha ao cadastrar: ${error.message}`);
    }
  };

  const handleAddSala = async (e) => {
    e.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) {
      alert("Sessão expirada ou não identificada. Por favor, faça login novamente.");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    try {
      const payload = {
        tipoRecurso: "Sala",
        nome: salaForm.nome,
        capacidade: parseInt(salaForm.capacidade, 10),
        localizacao: salaForm.localizacao,
        equipamentos: salaForm.equipamentos ? salaForm.equipamentos : "Nenhum",
        idStatus: 1, // 1 = Livre
        idUsuario: usuario.ID_Usuario, // ID do professor responsável
      };

      const response = await fetch(`${API_URL}/recursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || `Erro HTTP ${response.status}`);
      }

      alert("Sala cadastrada com sucesso!");
      setSalaForm({ nome: "", capacidade: "", localizacao: "", equipamentos: "" });
      carregarRecursos();
    } catch (error) {
      console.error(error);
      alert(`Falha ao cadastrar: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro de Espaços - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>ReservaLab</span>
          </div>

          <div className={styles.headerActions}>
            <Link href="/reserva" className={styles.navLink}>
              Ver Reservas →
            </Link>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Painel de Gestão e Cadastros</h1>
            <p className={styles.subtitle}>
              Cadastre e gerencie novos laboratórios e salas no sistema.
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab("lab")}
              className={`${styles.tab} ${activeTab === "lab" ? styles.tabActive : ""}`}
            >
              Cadastrar Laboratórios
            </button>
            <button
              onClick={() => setActiveTab("sala")}
              className={`${styles.tab} ${activeTab === "sala" ? styles.tabActive : ""}`}
            >
              Cadastrar Salas
            </button>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.formCard}>
              {/* 1. FORMULÁRIO DE LABORATÓRIO */}
              {activeTab === "lab" && (
                <form onSubmit={handleAddLab} className={styles.form}>
                  <h2>Novo Laboratório</h2>

                  <div className={styles.field}>
                    <label>Nome do Laboratório</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lab de Informática 01"
                      value={labForm.nome}
                      onChange={(e) => setLabForm({ ...labForm, nome: e.target.value })}
                    />
                  </div>

                  <div className={styles.rowFields}>
                    <div className={styles.field}>
                      <label>Capacidade (Pessoas)</label>
                      <input
                        type="number"
                        required
                        placeholder="30"
                        value={labForm.capacidade}
                        onChange={(e) => setLabForm({ ...labForm, capacidade: e.target.value })}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Localização (Bloco / Sala)</label>
                      <input
                        type="text"
                        required
                        placeholder="Sala 10"
                        value={labForm.localizacao}
                        onChange={(e) => setLabForm({ ...labForm, localizacao: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Equipamentos Disponíveis</label>
                    <textarea
                      required
                      placeholder="Ex: 20 Computadores, 1 Projetor"
                      value={labForm.equipamentos}
                      onChange={(e) => setLabForm({ ...labForm, equipamentos: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.btnSubmit}>
                    Salvar Laboratório
                  </button>
                </form>
              )}

              {activeTab === "sala" && (
                <form onSubmit={handleAddSala} className={styles.form}>
                  <h2>Nova Sala</h2>

                  <div className={styles.field}>
                    <label>Identificação / Nome da Sala</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Sala Dinalva"
                      value={salaForm.nome}
                      onChange={(e) => setSalaForm({ ...salaForm, nome: e.target.value })}
                    />
                  </div>

                  <div className={styles.rowFields}>
                    <div className={styles.field}>
                      <label>Capacidade (Pessoas)</label>
                      <input
                        type="number"
                        required
                        placeholder="45"
                        value={salaForm.capacidade}
                        onChange={(e) => setSalaForm({ ...salaForm, capacidade: e.target.value })}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Localização (Bloco / Prédio)</label>
                      <input
                        type="text"
                        required
                        placeholder="Prédio Central"
                        value={salaForm.localizacao}
                        onChange={(e) => setSalaForm({ ...salaForm, localizacao: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Equipamentos Disponíveis</label>
                    <input
                      type="text"
                      placeholder="Ex: Projetor, Ar Condicionado"
                      value={salaForm.equipamentos}
                      onChange={(e) => setSalaForm({ ...salaForm, equipamentos: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.btnSubmit}>
                    Salvar Sala
                  </button>
                </form>
              )}
            </div>

            <div className={styles.listCard}>
              <h2>
                {activeTab === "lab"
                  ? `Laboratórios Cadastrados (${laboratorios.length})`
                  : `Salas Cadastradas (${salas.length})`}
              </h2>

              {activeTab === "lab" && (
                <ul className={styles.itemList}>
                  {laboratorios.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Nenhum laboratório cadastrado.</p>
                  ) : (
                    laboratorios.map((lab) => (
                      <li key={lab.Codigo_Recurso} className={styles.item}>
                        <strong>{lab.Nome}</strong>
                        <p>{lab.Localizacao} — Cap: {lab.Capacidade} pessoas</p>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                          Equipamentos: {lab.Equipamentos}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              )}

              {activeTab === "sala" && (
                <ul className={styles.itemList}>
                  {salas.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Nenhuma sala cadastrada.</p>
                  ) : (
                    salas.map((sala) => (
                      <li key={sala.Codigo_Recurso} className={styles.item}>
                        <strong>{sala.Nome}</strong>
                        <p>{sala.Localizacao} — Cap: {sala.Capacidade} pessoas</p>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                          Equipamentos: {sala.Equipamentos ? sala.Equipamentos : "Nenhum"}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          &copy; 2026 Reserva Lab. Painel Administrativo.
        </footer>
      </div>
    </>
  );
}