import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Reserva.module.css";

const API_URL = "http://localhost:3001/api";

export default function ReservaPage() {
  // Estado dinâmico carregado do Banco de Dados
  const [espacos, setEspacos] = useState([]);
  const [minhasReservas, setMinhasReservas] = useState([]);

  // Estado do modal/formulário de reserva selecionado
  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [reservaForm, setReservaForm] = useState({
    data: "",
    horarioInicio: "08:00",
    horarioFim: "10:00",
    finalidade: "",
  });

  // 1. CARREGAR RECURSOS E RESERVAS AO ABRIR A PÁGINA
  useEffect(() => {
    carregarEspacos();
    carregarReservas();
  }, []);

  async function carregarEspacos() {
    try {
      const res = await fetch(`${API_URL}/recursos`);
      if (res.ok) {
        const dados = await res.json();
        setEspacos(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
    }
  }

  async function carregarReservas() {
    try {
      const res = await fetch(`${API_URL}/reservas`);
      if (res.ok) {
        const dados = await res.json();
        setMinhasReservas(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  }

  // 2. SALVAR NOVA RESERVA NO BANCO DE DADOS
  const handleConfirmarReserva = async (e) => {
    e.preventDefault();

    const payload = {
      idRecurso: selectedEspaco.ID_Recurso || selectedEspaco.id,
      dataReserva: reservaForm.data,
      horarioInicio: reservaForm.horarioInicio,
      horarioFim: reservaForm.horarioFim,
      finalidade: reservaForm.finalidade,
      // Opcional: ID do Usuário caso sua API exija
      idUsuario: 1 
    };

    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar reserva");
      }

      alert(`Reserva confirmada para ${selectedEspaco.Nome_Recurso || selectedEspaco.nome}!`);
      setSelectedEspaco(null);
      setReservaForm({ data: "", horarioInicio: "08:00", horarioFim: "10:00", finalidade: "" });
      
      // Recarrega as reservas para exibir a nova lista atualizada do banco
      carregarReservas();
    } catch (error) {
      console.error("Erro ao solicitar reserva:", error);
      alert("Falha ao registrar reserva no banco de dados.");
    }
  };

  const espacosFiltrados = espacos.filter((e) => {
    const tipo = (e.Tipo || e.tipo || "").toLowerCase();
    if (filtroTipo === "todos") return true;
    return tipo === filtroTipo.toLowerCase();
  });

  return (
    <>
      <Head>
        <title>Reserva de Espaços - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.logo}>ReservaLab</span>
          <Link href="/cadastro" className={styles.adminBtn}>Painel do Professor</Link>
        </header>

        <main className={styles.main}>
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.title}>Reserva de Salas e Laboratórios</h1>
              <p className={styles.subtitle}>Escolha um espaço disponível e garanta seu horário de estudos ou aulas.</p>
            </div>

            {/* Filtro */}
            <div className={styles.filterGroup}>
              <button
                onClick={() => setFiltroTipo("todos")}
                className={`${styles.filterBtn} ${filtroTipo === "todos" ? styles.filterActive : ""}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroTipo("laboratório")}
                className={`${styles.filterBtn} ${filtroTipo === "laboratório" ? styles.filterActive : ""}`}
              >
                Laboratórios
              </button>
              <button
                onClick={() => setFiltroTipo("sala")}
                className={`${styles.filterBtn} ${filtroTipo === "sala" ? styles.filterActive : ""}`}
              >
                Salas
              </button>
            </div>
          </div>

          <div className={styles.gridContainer}>
            {/* LISTA DE ESPAÇOS DISPONÍVEIS */}
            <div className={styles.espacosSection}>
              <h2>Espaços Cadastrados</h2>
              <div className={styles.cardsGrid}>
                {espacosFiltrados.length === 0 ? (
                  <p className={styles.emptyText}>Nenhum espaço encontrado.</p>
                ) : (
                  espacosFiltrados.map((esp) => {
                    const id = esp.ID_Recurso || esp.id;
                    const nome = esp.Nome_Recurso || esp.nome;
                    const tipo = esp.Tipo || esp.tipo;
                    const bloco = esp.Bloco || esp.bloco;
                    const capacidade = esp.Capacidade || esp.capacidade;
                    const status = esp.Status || esp.status || "Disponível";
                    const statusCor = esp.StatusCor || esp.statusCor || "#22c55e";

                    return (
                      <div key={id} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <span className={styles.tagTipo}>{tipo}</span>
                          <span className={styles.statusBadge} style={{ color: statusCor, borderColor: statusCor }}>
                            ● {status}
                          </span>
                        </div>

                        <h3>{nome}</h3>
                        <p className={styles.cardInfo}>{bloco} | Cap: {capacidade} pessoas</p>

                        <button
                          disabled={status !== "Disponível"}
                          onClick={() => setSelectedEspaco(esp)}
                          className={styles.btnReservar}
                        >
                          {status === "Disponível" ? "Reservar Espaço" : "Indisponível"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* PAINEL DE MINHAS RESERVAS */}
            <div className={styles.minhasReservasSection}>
              <h2>Minhas Reservas ({minhasReservas.length})</h2>

              {minhasReservas.length === 0 ? (
                <p className={styles.emptyText}>Você ainda não possui reservas efetuadas.</p>
              ) : (
                <ul className={styles.reservaList}>
                  {minhasReservas.map((res) => (
                    <li key={res.ID_Reserva || res.id} className={styles.reservaCard}>
                      <strong>{res.Nome_Recurso || res.espacoNome || `Recurso #${res.ID_Recurso}`}</strong>
                      <p>
                        {res.Data_Reserva || res.data} | {res.Horario_Inicio || res.horarioInicio} - {res.Horario_Fim || res.horarioFim || res.horario}
                      </p>
                      <small>{res.Finalidade || res.finalidade}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* MODAL / FORMULÁRIO DE RESERVA */}
          {selectedEspaco && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Solicitar Reserva: {selectedEspaco.Nome_Recurso || selectedEspaco.nome}</h3>
                <p className={styles.modalSub}>
                  {selectedEspaco.Bloco || selectedEspaco.bloco} - Capacidade: {selectedEspaco.Capacidade || selectedEspaco.capacidade} pessoas
                </p>

                <form onSubmit={handleConfirmarReserva} className={styles.modalForm}>
                  <div className={styles.field}>
                    <label>Data da Reserva</label>
                    <input
                      type="date"
                      required
                      value={reservaForm.data}
                      onChange={(e) => setReservaForm({ ...reservaForm, data: e.target.value })}
                    />
                  </div>

                  <div className={styles.rowFields}>
                    <div className={styles.field}>
                      <label>Início</label>
                      <input
                        type="time"
                        required
                        value={reservaForm.horarioInicio}
                        onChange={(e) => setReservaForm({ ...reservaForm, horarioInicio: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Término</label>
                      <input
                        type="time"
                        required
                        value={reservaForm.horarioFim}
                        onChange={(e) => setReservaForm({ ...reservaForm, horarioFim: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Finalidade / Motivo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Monitoria de Cálculo I"
                      value={reservaForm.finalidade}
                      onChange={(e) => setReservaForm({ ...reservaForm, finalidade: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setSelectedEspaco(null)} className={styles.btnCancel}>
                      Cancelar
                    </button>
                    <button type="submit" className={styles.btnConfirm}>
                      Confirmar Reserva
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}