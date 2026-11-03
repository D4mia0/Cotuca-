import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/VerReservas.module.css";

const API_URL = "http://localhost:3001/api";

export default function VerReservasPage() {
  const [todasReservas, setTodasReservas] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [filtros, setFiltros] = useState({
    codigoRecurso: "",
    nomeRecurso: "",
    dataInicial: "",
    dataFinal: "",
    hora: "",
    usuario: "",
    idStatus: "todos",
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    carregarReservas();
  }, []);

  async function carregarReservas() {
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

  function handleFiltroChange(e) {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  }

  function limparFiltros() {
    setFiltros({
      codigoRecurso: "",
      nomeRecurso: "",
      dataInicial: "",
      dataFinal: "",
      hora: "",
      usuario: "",
      idStatus: "todos",
    });
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

  function obterCorStatus(statusNome) {
    switch (statusNome) {
      case "Livre":
        return "#22c55e";
      case "Ocupado":
        return "#f97316";
      case "Bloqueado":
        return "#ef4444";
      case "Reservado":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  }

  // Lógica de filtragem dos dados
  const reservasFiltradas = todasReservas.filter((reserva) => {
    // Filtro Código do Recurso
    if (filtros.codigoRecurso) {
      if (String(reserva.Codigo_Recurso) !== String(filtros.codigoRecurso)) {
        return false;
      }
    }

    // Filtro Nome do Recurso
    if (filtros.nomeRecurso) {
      const nomeMatch = reserva.Nome_Recurso
        ? reserva.Nome_Recurso.toLowerCase().includes(filtros.nomeRecurso.toLowerCase())
        : false;
      if (!nomeMatch) return false;
    }

    // Filtro por Usuário
    if (filtros.usuario) {
      const usuarioMatch = reserva.Nome_Completo
        ? reserva.Nome_Completo.toLowerCase().includes(filtros.usuario.toLowerCase())
        : false;
      if (!usuarioMatch) return false;
    }

    // Filtro por Status
    if (filtros.idStatus !== "todos") {
      if (String(reserva.ID_Status) !== String(filtros.idStatus)) {
        return false;
      }
    }

    // Filtro por Data Inicial
    if (filtros.dataInicial) {
      const dataReserva = String(reserva.Data_Inicial).split("T")[0];
      if (dataReserva < filtros.dataInicial) return false;
    }

    // Filtro por Data Final
    if (filtros.dataFinal) {
      const dataReserva = String(reserva.Data_Inicial).split("T")[0];
      if (dataReserva > filtros.dataFinal) return false;
    }

    // Filtro por Hora
    if (filtros.hora) {
      const horaInicio = formatarHora(reserva.Hora_Inicial);
      const horaFim = formatarHora(reserva.Hora_Final);
      if (filtros.hora < horaInicio || filtros.hora > horaFim) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <Head>
        <title>Consulta de Reservas - Reserva Lab</title>
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.logo}>ReservaLab</span>
          <div className={styles.headerActions}>
            <Link href="/reserva" className={styles.navLink}>
              ← Voltar para Reservas
            </Link>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Consulta de Reservas</h1>
            <p className={styles.subtitle}>
              Filtre e consulte agendamentos por recurso, período, usuário e status.
            </p>
          </div>

          {/* PAINEL DE FILTROS */}
          <div className={styles.filterCard}>
            <div className={styles.filterGrid}>
              <div className={styles.field}>
                <label>Cód. Recurso</label>
                <input
                  type="number"
                  name="codigoRecurso"
                  placeholder="Ex: 5"
                  value={filtros.codigoRecurso}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className={styles.field}>
                <label>Nome do Recurso</label>
                <input
                  type="text"
                  name="nomeRecurso"
                  placeholder="Ex: Lab de Informática"
                  value={filtros.nomeRecurso}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className={styles.field}>
                <label>Usuário</label>
                <input
                  type="text"
                  name="usuario"
                  placeholder="Nome do usuário"
                  value={filtros.usuario}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className={styles.field}>
                <label>Status</label>
                <select
                  name="idStatus"
                  value={filtros.idStatus}
                  onChange={handleFiltroChange}
                >
                  <option value="todos">Todos</option>
                  <option value="1">Livre</option>
                  <option value="2">Ocupado</option>
                  <option value="3">Bloqueado</option>
                  <option value="4">Reservado</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Data Início</label>
                <input
                  type="date"
                  name="dataInicial"
                  value={filtros.dataInicial}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className={styles.field}>
                <label>Data Fim</label>
                <input
                  type="date"
                  name="dataFinal"
                  value={filtros.dataFinal}
                  onChange={handleFiltroChange}
                />
              </div>

              <div className={styles.field}>
                <label>Horário Específico</label>
                <input
                  type="time"
                  name="hora"
                  value={filtros.hora}
                  onChange={handleFiltroChange}
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button onClick={limparFiltros} className={styles.btnClear}>
                Limpar Filtros
              </button>
            </div>
          </div>

          {/* TABELA DE RESULTADOS */}
          <div className={styles.resultsCard}>
            <h2>Resultados da Consulta ({reservasFiltradas.length})</h2>

            {reservasFiltradas.length === 0 ? (
              <p className={styles.emptyText}>Nenhuma reserva encontrada para os filtros selecionados.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Cód.</th>
                      <th>Recurso</th>
                      <th>Usuário</th>
                      <th>Data</th>
                      <th>Horário</th>
                      <th>Motivo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasFiltradas.map((item) => (
                      <tr key={item.ID_Reserva}>
                        <td>#{item.Codigo_Recurso}</td>
                        <td>
                          <strong>{item.Nome_Recurso}</strong>
                          <span className={styles.subText}>{item.Tipo_Recurso}</span>
                        </td>
                        <td>{item.Nome_Completo}</td>
                        <td>{formatarData(item.Data_Inicial)}</td>
                        <td>
                          {formatarHora(item.Hora_Inicial)} - {formatarHora(item.Hora_Final)}
                        </td>
                        <td>{item.Motivo ? item.Motivo : "N/A"}</td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{
                              color: obterCorStatus(item.Status),
                              borderColor: obterCorStatus(item.Status),
                            }}
                          >
                            ● {item.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          &copy; 2026 Reserva Lab. Consulta de Reservas.
        </footer>
      </div>
    </>
  );
}