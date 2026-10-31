import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Cadastro.module.css";

const API_URL = "http://localhost:3001/api";

export default function AdminPage() {
  const [isProfessor, setIsProfessor] = useState(false);
  const [activeTab, setActiveTab] = useState("lab"); // "lab" | "sala"

  // Listas vindas do Banco de Dados
  const [laboratorios, setLaboratorios] = useState([]);
  const [salas, setSalas] = useState([]);

  // Formulários com Status integrado
  const [labForm, setLabForm] = useState({
    nome: "",
    capacidade: "",
    bloco: "",
    equipamentos: "",
    status: "Disponível",
  });

  const [salaForm, setSalaForm] = useState({
    nome: "",
    capacidade: "",
    bloco: "",
    tipo: "Teórica",
    status: "Disponível",
  });

  // 1. CARREGAR DADOS DA API
  useEffect(() => {
    carregarRecursos();
  }, []);

  async function carregarRecursos() {
    try {
      const res = await fetch(`${API_URL}/recursos`);
      if (res.ok) {
        const dados = await res.json();
        // Filtra considerando nomenclaturas do SQL Server (Tipo_Recurso ou Tipo)
        setLaboratorios(
          dados.filter(
            (item) => item.Tipo_Recurso === "Laboratorio" || item.tipo === "Laboratorio" || item.Tipo === "Laboratorio"
          )
        );
        setSalas(
          dados.filter(
            (item) => item.Tipo_Recurso === "Sala" || item.tipo === "Sala" || item.Tipo === "Sala"
          )
        );
      }
    } catch (error) {
      console.error("Erro ao carregar recursos da API:", error);
    }
  }

  // 2. CADASTRO DE LABORATÓRIO (POST)
  const handleAddLab = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/recursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...labForm, tipo: "Laboratorio" }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || resultado.mensagem || `Erro HTTP ${response.status}`);
      }

      alert("Laboratório cadastrado com sucesso!");
      setLabForm({ nome: "", capacidade: "", bloco: "", equipamentos: "", status: "Disponível" });
      carregarRecursos();
    } catch (error) {
      console.error(error);
      alert(`Falha ao cadastrar: ${error.message}`);
    }
  };

  // 3. CADASTRO DE SALA (POST)
  const handleAddSala = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/recursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...salaForm, tipo: "Sala" }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || resultado.mensagem || `Erro HTTP ${response.status}`);
      }

      alert("Sala cadastrada com sucesso!");
      setSalaForm({ nome: "", capacidade: "", bloco: "", tipo: "Teórica", status: "Disponível" });
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
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>ReservaLab</span>
            <span className={styles.badgeRole}>
              {isProfessor ? "Acesso Professor" : "Sem Login"}
            </span>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={() => setIsProfessor(!isProfessor)}
              className={isProfessor ? styles.btnTestActive : styles.btnTestInactive}
            >
              {isProfessor ? "Sair do Modo Professor" : "Entrar sem Login (Modo Professor)"}
            </button>

            <Link href="/reserva" className={styles.navLink}>
              Ver Reservas →
            </Link>
          </div>
        </header>

        {/* Bloqueio de Acesso */}
        {!isProfessor ? (
          <main className={styles.lockContainer}>
            <div className={styles.lockCard}>
              <div className={styles.lockIcon}></div>
              <h1>Acesso Restrito a Professores</h1>
              <p>
                Esta página é destinada apenas para <strong>docentes e administradores</strong> para
                o cadastro de novos laboratórios e salas.
              </p>

              <button onClick={() => setIsProfessor(true)} className={styles.btnBypass}>
                Entrar sem login como Professor (Modo de Teste)
              </button>

              <div className={styles.lockFooter}>
                <Link href="/" className={styles.backLink}>
                  ← Voltar para a Tela Inicial
                </Link>
              </div>
            </div>
          </main>
        ) : (
          /* Painel Administrativo */
          <main className={styles.main}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Painel de Gestão e Cadastros</h1>
              <p className={styles.subtitle}>
                Cadastre e gerencie novos laboratórios e salas no sistema.
              </p>
            </div>

            {/* Abas Apenas para Espaços */}
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
                        <label>Bloco / Prédio</label>
                        <input
                          type="text"
                          required
                          placeholder="Bloco C - Sala 12"
                          value={labForm.bloco}
                          onChange={(e) => setLabForm({ ...labForm, bloco: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label>Equipamentos Disponíveis</label>
                      <textarea
                        placeholder="Ex: 20 Kits Arduino, Projetor 4K, Impressora 3D"
                        value={labForm.equipamentos}
                        onChange={(e) => setLabForm({ ...labForm, equipamentos: e.target.value })}
                      />
                    </div>

                    {/* CAMPO DE STATUS INTEGRADO */}
                    <div className={styles.field}>
                      <label>Status Inicial do Espaço</label>
                      <select
                        value={labForm.status}
                        onChange={(e) => setLabForm({ ...labForm, status: e.target.value })}
                      >
                        <option value="Disponível">Disponível</option>
                        <option value="Em Manutenção">Em Manutenção</option>
                        <option value="Interditado">Interditado</option>
                      </select>
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                      Salvar Laboratório
                    </button>
                  </form>
                )}

                {/* 2. FORMULÁRIO DE SALA */}
                {activeTab === "sala" && (
                  <form onSubmit={handleAddSala} className={styles.form}>
                    <h2>Nova Sala</h2>
                    
                    <div className={styles.field}>
                      <label>Identificação / Nome da Sala</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sala 304 - Bloco A"
                        value={salaForm.nome}
                        onChange={(e) => setSalaForm({ ...salaForm, nome: e.target.value })}
                      />
                    </div>

                    <div className={styles.rowFields}>
                      <div className={styles.field}>
                        <label>Capacidade</label>
                        <input
                          type="number"
                          required
                          placeholder="45"
                          value={salaForm.capacidade}
                          onChange={(e) => setSalaForm({ ...salaForm, capacidade: e.target.value })}
                        />
                      </div>

                      <div className={styles.field}>
                        <label>Bloco / Local</label>
                        <input
                          type="text"
                          required
                          placeholder="Prédio Central"
                          value={salaForm.bloco}
                          onChange={(e) => setSalaForm({ ...salaForm, bloco: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.rowFields}>
                      <div className={styles.field}>
                        <label>Tipo de Sala</label>
                        <select
                          value={salaForm.tipo}
                          onChange={(e) => setSalaForm({ ...salaForm, tipo: e.target.value })}
                        >
                          <option value="Teórica">Aula Teórica</option>
                          <option value="Reunião">Estudo / Reunião</option>
                          <option value="Auditório">Auditório</option>
                          <option value="Videoconferência">Videoconferência</option>
                        </select>
                      </div>

                      {/* CAMPO DE STATUS INTEGRADO */}
                      <div className={styles.field}>
                        <label>Status Inicial</label>
                        <select
                          value={salaForm.status}
                          onChange={(e) => setSalaForm({ ...salaForm, status: e.target.value })}
                        >
                          <option value="Disponível">Disponível</option>
                          <option value="Em Manutenção">Em Manutenção</option>
                          <option value="Interditado">Interditado</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                      Salvar Sala
                    </button>
                  </form>
                )}
              </div>

              {/* LISTAGEM DOS ITENS CADASTRADOS */}
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
                      laboratorios.map((lab) => {
                        const id = lab.Codigo_Recurso || lab.ID_Recurso || lab.id;
                        const nome = lab.Nome || lab.Nome_Recurso || lab.nome;
                        const cap = lab.Capacidade || lab.capacidade;
                        const loc = lab.Localizacao || lab.Bloco || lab.bloco;

                        return (
                          <li key={id} className={styles.item}>
                            <strong>{nome}</strong>
                            <p>{loc} - Cap: {cap} pessoas</p>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}

                {activeTab === "sala" && (
                  <ul className={styles.itemList}>
                    {salas.length === 0 ? (
                      <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Nenhuma sala cadastrada.</p>
                    ) : (
                      salas.map((s) => {
                        const id = s.Codigo_Recurso || s.ID_Recurso || s.id;
                        const nome = s.Nome || s.Nome_Recurso || s.nome;
                        const cap = s.Capacidade || s.capacidade;
                        const loc = s.Localizacao || s.Bloco || s.bloco;

                        return (
                          <li key={id} className={styles.item}>
                            <strong>{nome}</strong>
                            <p>{loc} - Cap: {cap} pessoas</p>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </div>
            </div>
          </main>
        )}

        <footer className={styles.footer}>
          &copy; 2026 Reserva Lab. Painel Administrativo.
        </footer>
      </div>
    </>
  );
}