import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Cadastro.module.css";

export default function AdminPage() {
  // Estado de simulação de acesso (inicia desligado para você testar a trava)
  const [isProfessor, setIsProfessor] = useState(false);
  const [activeTab, setActiveTab] = useState("lab"); // "lab" | "sala" | "status"

  // Listas de dados armazenadas na memória local do navegador para teste
  const [laboratorios, setLaboratorios] = useState([
    {
      id: 1,
      nome: "Lab de Informática 01",
      capacidade: 40,
      bloco: "Bloco A",
      equipamentos: "30 Computadores, Projetor 4K",
    },
  ]);

  const [salas, setSalas] = useState([
    {
      id: 1,
      nome: "Sala de Reunião 202",
      capacidade: 12,
      bloco: "Bloco B",
      tipo: "Reunião",
    },
  ]);

  const [statusList, setStatusList] = useState([
    { id: 1, nome: "Disponível", cor: "#22c55e", descricao: "Liberado para agendamentos" },
    { id: 2, nome: "Em Manutenção", cor: "#f59e0b", descricao: "Indisponível temporariamente" },
    { id: 3, nome: "Interditado", cor: "#ef4444", descricao: "Fora de uso por tempo indeterminado" },
  ]);

  // Formulários
  const [labForm, setLabForm] = useState({ nome: "", capacidade: "", bloco: "", equipamentos: "" });
  const [salaForm, setSalaForm] = useState({ nome: "", capacidade: "", bloco: "", tipo: "Teórica" });
  const [statusForm, setStatusForm] = useState({ nome: "", cor: "#2563eb", descricao: "" });

  // Funções de Cadastro
  const handleAddLab = (e) => {
    e.preventDefault();
    setLaboratorios([...laboratorios, { ...labForm, id: Date.now() }]);
    setLabForm({ nome: "", capacidade: "", bloco: "", equipamentos: "" });
    alert("Laboratório cadastrado com sucesso!");
  };

  const handleAddSala = (e) => {
    e.preventDefault();
    setSalas([...salas, { ...salaForm, id: Date.now() }]);
    setSalaForm({ nome: "", capacidade: "", bloco: "", tipo: "Teórica" });
    alert("Sala cadastrada com sucesso!");
  };

  const handleAddStatus = (e) => {
    e.preventDefault();
    setStatusList([...statusList, { ...statusForm, id: Date.now() }]);
    setStatusForm({ nome: "", cor: "#2563eb", descricao: "" });
    alert("Status cadastrado com sucesso!");
  };

  return (
    <>
      <Head>
        <title>Cadastro de Espaços - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        {/* Topo / Navbar */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>ReservaLab</span>
            <span className={styles.badgeRole}>
              {isProfessor ? "Acesso Professor " : "Sem Login "}
            </span>
          </div>

          <div className={styles.headerActions}>
            {/* Botão de Atalho para Alternar Modo de Teste */}
            <button
              onClick={() => setIsProfessor(!isProfessor)}
              className={isProfessor ? styles.btnTestActive : styles.btnTestInactive}
            >
              {isProfessor ? " Sair do Modo Professor" : " Entrar sem Login (Modo Professor)"}
            </button>

            <Link href="/reserva" className={styles.navLink}>
              Ver Reservas →
            </Link>
          </div>
        </header>

        {/* TELA DE BLOQUEIO (SE NÃO ESTIVER COMO PROFESSOR) */}
        {!isProfessor ? (
          <main className={styles.lockContainer}>
            <div className={styles.lockCard}>
              <div className={styles.lockIcon}></div>
              <h1>Acesso Restrito a Professores</h1>
              <p>
                Esta página é destinada apenas para <strong>docentes e administradores</strong> para
                o cadastro de novos laboratórios, salas e regras de status.
              </p>

              {/* Botão Principal de Teste sem Login */}
              <button
                onClick={() => setIsProfessor(true)}
                className={styles.btnBypass}
              >
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
          /* PAINEL DE CADASTRO (APENAS PROFESSOR) */
          <main className={styles.main}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Painel de Gestão e Cadastros</h1>
              <p className={styles.subtitle}>
                Cadastre novos espaços e atualize os status disponíveis no sistema.
              </p>
            </div>

            {/* Abas de Navegação */}
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
              <button
                onClick={() => setActiveTab("status")}
                className={`${styles.tab} ${activeTab === "status" ? styles.tabActive : ""}`}
              >
                 Cadastrar Status
              </button>
            </div>

            <div className={styles.contentGrid}>
              {/* FORMULÁRIO */}
              <div className={styles.formCard}>
                {/* 1. CADASTRO DE LABORATÓRIO */}
                {activeTab === "lab" && (
                  <form onSubmit={handleAddLab} className={styles.form}>
                    <h2>Novo Laboratório</h2>
                    <div className={styles.field}>
                      <label>Nome do Laboratório</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Lab de Robótica II"
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
                        placeholder="Ex: 20 kits Arduino, Impressora 3D, Osciloscópio"
                        value={labForm.equipamentos}
                        onChange={(e) => setLabForm({ ...labForm, equipamentos: e.target.value })}
                      />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                      Salvar Laboratório
                    </button>
                  </form>
                )}

                {/* 2. CADASTRO DE SALA */}
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

                    <button type="submit" className={styles.btnSubmit}>
                      Salvar Sala
                    </button>
                  </form>
                )}

                {/* 3. CADASTRO DE STATUS */}
                {activeTab === "status" && (
                  <form onSubmit={handleAddStatus} className={styles.form}>
                    <h2>Novo Status de Espaço</h2>
                    <div className={styles.field}>
                      <label>Nome do Status</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Reservado para Evento"
                        value={statusForm.nome}
                        onChange={(e) => setStatusForm({ ...statusForm, nome: e.target.value })}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Cor do Indicador</label>
                      <input
                        type="color"
                        value={statusForm.cor}
                        onChange={(e) => setStatusForm({ ...statusForm, cor: e.target.value })}
                        className={styles.colorPicker}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Descrição</label>
                      <input
                        type="text"
                        placeholder="Ex: Usado apenas durante defesas de TCC"
                        value={statusForm.descricao}
                        onChange={(e) => setStatusForm({ ...statusForm, descricao: e.target.value })}
                      />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                      Salvar Status
                    </button>
                  </form>
                )}
              </div>

              {/* LISTAGEM EM TEMPO REAL DOS ITENS CADASTRADOS */}
              <div className={styles.listCard}>
                <h2>
                  {activeTab === "lab" && `Laboratórios Cadastrados (${laboratorios.length})`}
                  {activeTab === "sala" && `Salas Cadastradas (${salas.length})`}
                  {activeTab === "status" && `Status Cadastrados (${statusList.length})`}
                </h2>

                {activeTab === "lab" && (
                  <ul className={styles.itemList}>
                    {laboratorios.map((lab) => (
                      <li key={lab.id} className={styles.item}>
                        <strong>{lab.nome}</strong>
                        <p> {lab.bloco} Cap: {lab.capacidade} pessoas</p>
                        {lab.equipamentos && <small> {lab.equipamentos}</small>}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "sala" && (
                  <ul className={styles.itemList}>
                    {salas.map((s) => (
                      <li key={s.id} className={styles.item}>
                        <strong>{s.nome}</strong>
                        <p> {s.bloco} • Tipo: {s.tipo} • Cap: {s.capacidade} pessoas</p>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "status" && (
                  <ul className={styles.itemList}>
                    {statusList.map((st) => (
                      <li key={st.id} className={styles.itemStatus}>
                        <span className={styles.colorDot} style={{ backgroundColor: st.cor }} />
                        <div>
                          <strong>{st.nome}</strong>
                          <p>{st.descricao}</p>
                        </div>
                      </li>
                    ))}
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