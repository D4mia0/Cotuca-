import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Reserva.module.css";

const API_URL = "http://localhost:3001/api";

export default function ReservaPage() {
  const [espacos, setEspacos] = useState([]);
  const [todasReservas, setTodasReservas] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [reservaForm, setReservaForm] = useState({
    dataInicial: "",
    horaInicial: "08:00",
    horaFinal: "10:00",
    motivo: "",
  });

  function obterConfiguracaoStatus(statusNome) {
    switch (statusNome) {
      case "Livre":
        return { cor: "#22c55e", reservavel: true };
      case "Ocupado":
        return { cor: "#f97316", reservavel: false };
      case "Bloqueado":
        return { cor: "#ef4444", reservavel: false };
      case "Reservado":
        return { cor: "#3b82f6", reservavel: false };
      default:
        return { cor: "#64748b", reservavel: false };
    }
  }

  function calcularStatusEspaco(esp) {
    const reservaAtiva = todasReservas.find(
      (r) => r.Codigo_Recurso === esp.Codigo_Recurso && r.ID_Status !== 3
    );

    if (reservaAtiva) {
      return "Reservado";
    }

    return esp.Status ? esp.Status : "Livre";
  }

  function formatarData(dataIso) {
    if (!dataIso) return "";
    const dataApenas = String(dataIso).split("T")[0];
    const partes = dataApenas.split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : dataApenas;
  }

  function formatarHora(horaStr) {
    if (!horaStr) return "";
    return String(horaStr).includes("T")
      ? String(horaStr).split("T")[1].substring(0, 5)
      : String(horaStr).substring(0, 5);
  }

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    carregarEspacos();
    carregarTodasReservas();
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

  async function carregarTodasReservas() {
    try {
      const res = await fetch(`${API_URL}/reservas`);
      if (res.ok) {
        const dados = await res.json();
        setTodasReservas(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  }


  const handleConfirmarReserva = async (e) => {
    e.preventDefault();

    const payload = {
      codigoRecurso: selectedEspaco.Codigo_Recurso,
      dataInicial: reservaForm.dataInicial,
      dataFinal: reservaForm.dataInicial,
      horaInicial: reservaForm.horaInicial,
      horaFinal: reservaForm.horaFinal,
      idUsuario: usuarioLogado.ID_Usuario,
      idStatus: 4,
      motivo: reservaForm.motivo,
    };

    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || "Erro ao criar reserva");
      }

      alert(`Reserva confirmada para o espaço "${selectedEspaco.Nome}"!`);
      setSelectedEspaco(null);
      setReservaForm({ dataInicial: "", horaInicial: "08:00", horaFinal: "10:00", motivo: "" });

      carregarTodasReservas();
      carregarEspacos();
    } catch (error) {
      console.error("Erro ao solicitar reserva:", error);
      alert(`Falha no agendamento: ${error.message}`);
    }
  };

  const atualizarStatusReserva = async (idReserva, novoStatusId) => {
    try {
      const response = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idStatus: novoStatusId }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || "Erro ao atualizar status da reserva.");
      }

      alert("Reserva cancelada com sucesso!");
      carregarTodasReservas();
      carregarEspacos();
    } catch (error) {
      alert(`Falha ao atualizar: ${error.message}`);
    }
  };

  const atualizarStatusRecurso = async (codigoRecurso, novoStatusId) => {
    try {
      const response = await fetch(`${API_URL}/recursos/${codigoRecurso}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idStatus: parseInt(novoStatusId, 10) }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || "Erro ao atualizar status do recurso.");
      }

      alert("Status do espaço atualizado com sucesso!");
      carregarEspacos();
    } catch (error) {
      alert(`Falha ao alterar status do espaço: ${error.message}`);
    }
  };

  const minhasReservas = usuarioLogado
    ? todasReservas.filter((r) => r.ID_Usuario === usuarioLogado.ID_Usuario)
    : todasReservas;

  const espacosFiltrados = espacos.filter((e) => {
    if (filtroTipo === "todos") return true;
    return e.Tipo_Recurso.toLowerCase() === filtroTipo.toLowerCase();
  });

  return (
    <>
      <Head>
        <title>Reserva de Espaços - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.logo}>ReservaLab</span>
          {usuarioLogado && (
            <div className={styles.userInfo}>
              <span className={styles.userGreeting}>
                Olá, <strong>{usuarioLogado.Nome_Completo}</strong>
              </span>

              <Link href="/verReservas" className={styles.adminBtn}>
                Consultar Reservas
              </Link>

              {usuarioLogado.E_Professor === 1 && (
                <Link href="/cadastro" className={styles.adminBtn}>
                  Cadastrar Espaços
                </Link>
              )}
            </div>
          )}
        </header>

        <main className={styles.main}>
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.title}>Reserva de Salas e Laboratórios</h1>
              <p className={styles.subtitle}>
                Escolha um espaço disponível e garanta seu horário de estudos ou aulas.
              </p>
            </div>

            <div className={styles.filterGroup}>
              <button
                onClick={() => setFiltroTipo("todos")}
                className={`${styles.filterBtn} ${filtroTipo === "todos" ? styles.filterActive : ""}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroTipo("laboratorio")}
                className={`${styles.filterBtn} ${filtroTipo === "laboratorio" ? styles.filterActive : ""}`}
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

            <div className={styles.espacosSection}>
              <h2>Espaços Cadastrados</h2>
              <div className={styles.cardsGrid}>
                {espacosFiltrados.length === 0 ? (
                  <p className={styles.emptyText}>Nenhum espaço encontrado.</p>
                ) : (
                  espacosFiltrados.map((esp) => {
                    const statusAtual = calcularStatusEspaco(esp);
                    const { cor, reservavel } = obterConfiguracaoStatus(statusAtual);

                    const ehDonoOuSemDono =
                      !esp.ID_Usuario || Number(esp.ID_Usuario) === Number(usuarioLogado?.ID_Usuario);
                    const podeAlterarStatus = usuarioLogado?.E_Professor === 1 && ehDonoOuSemDono;

                    return (
                      <div key={esp.Codigo_Recurso} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <span className={styles.tagTipo}>{esp.Tipo_Recurso}</span>
                          <span
                            className={styles.statusBadge}
                            style={{
                              color: cor,
                              borderColor: cor,
                            }}
                          >
                            ● {statusAtual}
                          </span>
                        </div>

                        <h3>{esp.Nome}</h3>
                        <p className={styles.cardInfo}>
                          {esp.Localizacao} | Cap: {esp.Capacidade} pessoas
                        </p>
                        <small className={styles.equipamentosText}>
                          Equipamentos: {esp.Equipamentos ? esp.Equipamentos : "Nenhum"}
                        </small>

                        <button
                          disabled={!reservavel}
                          onClick={() => setSelectedEspaco(esp)}
                          className={styles.btnReservar}
                        >
                          {reservavel ? "Reservar Espaço" : statusAtual}
                        </button>

                        {podeAlterarStatus && (
                          <div className={styles.adminStatusControl}>
                            <label className={styles.adminStatusLabel}>
                              Alterar Status (Docente):
                            </label>
                            <select
                              value={esp.ID_Status ? esp.ID_Status : 1}
                              onChange={(e) =>
                                atualizarStatusRecurso(esp.Codigo_Recurso, e.target.value)
                              }
                              className={styles.adminStatusSelect}
                            >
                              <option value="1">Livre</option>
                              <option value="2">Ocupado</option>
                              <option value="3">Bloqueado</option>
                              <option value="4">Reservado</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className={styles.minhasReservasSection}>
              <h2>Minhas Reservas ({minhasReservas.length})</h2>

              {minhasReservas.length === 0 ? (
                <p className={styles.emptyText}>Você ainda não possui reservas efetuadas.</p>
              ) : (
                <ul className={styles.reservaList}>
                  {minhasReservas.map((res) => (
                    <li key={res.ID_Reserva} className={styles.reservaCard}>
                      <strong>{res.Nome_Recurso}</strong>
                      <p>
                        Data: {formatarData(res.Data_Inicial)} | Horário: {formatarHora(res.Hora_Inicial)} às {formatarHora(res.Hora_Final)}
                      </p>
                      {res.Motivo && (
                        <p className={styles.motivoText}>
                          Motivo: {res.Motivo}
                        </p>
                      )}
                      <p className={styles.statusText}>
                        Status: <strong style={{ color: obterConfiguracaoStatus(res.Status).cor }}>{res.Status}</strong>
                      </p>

                      {res.ID_Status !== 3 && (
                        <button
                          onClick={() => atualizarStatusReserva(res.ID_Reserva, 3)}
                          className={styles.btnCancelar}
                        >
                          Cancelar Reserva
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {selectedEspaco && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Solicitar Reserva: {selectedEspaco.Nome}</h3>
                <p className={styles.modalSub}>
                  {selectedEspaco.Localizacao} — Capacidade: {selectedEspaco.Capacidade} pessoas
                </p>

                <form onSubmit={handleConfirmarReserva} className={styles.modalForm}>
                  <div className={styles.field}>
                    <label>Data da Reserva</label>
                    <input
                      type="date"
                      required
                      value={reservaForm.dataInicial}
                      onChange={(e) => setReservaForm({ ...reservaForm, dataInicial: e.target.value })}
                    />
                  </div>

                  <div className={styles.rowFields}>
                    <div className={styles.field}>
                      <label>Início</label>
                      <input
                        type="time"
                        required
                        value={reservaForm.horaInicial}
                        onChange={(e) => setReservaForm({ ...reservaForm, horaInicial: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Término</label>
                      <input
                        type="time"
                        required
                        value={reservaForm.horaFinal}
                        onChange={(e) => setReservaForm({ ...reservaForm, horaFinal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Motivo da Reserva</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Aula Prática de Algoritmos"
                      value={reservaForm.motivo}
                      onChange={(e) => setReservaForm({ ...reservaForm, motivo: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setSelectedEspaco(null)}
                      className={styles.btnCancel}
                    >
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