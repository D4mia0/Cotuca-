import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Reserva.module.css";

export default function ReservaPage() {
  // Lista unificada de espaços cadastrados no sistema
  const [espacos] = useState([
    { id: "lab1", nome: "Lab de Informática 01", tipo: "Laboratório", capacidade: 40, bloco: "Bloco A", status: "Disponível", statusCor: "#22c55e" },
    { id: "lab2", nome: "Lab de Química Analítica", tipo: "Laboratório", capacidade: 25, bloco: "Bloco C", status: "Em Manutenção", statusCor: "#f59e0b" },
    { id: "sala101", nome: "Sala 101 - Estudo em Grupo", tipo: "Sala", capacidade: 10, bloco: "Bloco B", status: "Disponível", statusCor: "#22c55e" },
    { id: "sala202", nome: "Auditório Principal", tipo: "Sala", capacidade: 120, bloco: "Bloco Central", status: "Disponível", statusCor: "#22c55e" },
  ]);

  // Lista de Reservas Realizadas
  const [minhasReservas, setMinhasReservas] = useState([
    { id: 1, espacoNome: "Lab de Informática 01", data: "2026-10-20", horario: "14:00 - 16:00", finalidade: "Trabalho de Programação" },
  ]);

  // Estado do modal/formulário de reserva selecionado
  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [reservaForm, setReservaForm] = useState({
    data: "",
    horarioInicio: "08:00",
    horarioFim: "10:00",
    finalidade: "",
  });

  const handleConfirmarReserva = (e) => {
    e.preventDefault();
    const novaReserva = {
      id: Date.now(),
      espacoNome: selectedEspaco.nome,
      data: reservaForm.data,
      horario: `${reservaForm.horarioInicio} - ${reservaForm.horarioFim}`,
      finalidade: reservaForm.finalidade,
    };

    setMinhasReservas([novaReserva, ...minhasReservas]);
    alert(`Reserva solicitada para ${selectedEspaco.nome}!`);
    setSelectedEspaco(null);
    setReservaForm({ data: "", horarioInicio: "08:00", horarioFim: "10:00", finalidade: "" });
  };

  const espacosFiltrados = espacos.filter((e) => {
    if (filtroTipo === "todos") return true;
    return e.tipo.toLowerCase() === filtroTipo.toLowerCase();
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
                {espacosFiltrados.map((esp) => (
                  <div key={esp.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.tagTipo}>{esp.tipo}</span>
                      <span className={styles.statusBadge} style={{ color: esp.statusCor, borderColor: esp.statusCor }}>
                        ● {esp.status}
                      </span>
                    </div>

                    <h3>{esp.nome}</h3>
                    <p className={styles.cardInfo}> {esp.bloco} |  Cap: {esp.capacidade} pessoas</p>

                    <button
                      disabled={esp.status !== "Disponível"}
                      onClick={() => setSelectedEspaco(esp)}
                      className={styles.btnReservar}
                    >
                      {esp.status === "Disponível" ? "Reservar Espaço" : "Indisponível"}
                    </button>
                  </div>
                ))}
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
                    <li key={res.id} className={styles.reservaCard}>
                      <strong>{res.espacoNome}</strong>
                      <p> {res.data} |  {res.horario}</p>
                      <small>{res.finalidade}</small>
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
                <h3>Solicitar Reserva: {selectedEspaco.nome}</h3>
                <p className={styles.modalSub}>{selectedEspaco.bloco} • Capacidade: {selectedEspaco.capacidade} pessoas</p>

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