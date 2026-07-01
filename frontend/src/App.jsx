import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import Absensi from "./pages/Absensi";
import Perizinan from "./pages/Perizinan";
import RekapAbsen from "./pages/RekapAbsen";
import LogBook from "./pages/LogBook";
import EditProfil from "./pages/EditProfil";
import DaftarFaceID from "./pages/DaftarFaceID";
import logo from "./assets/logo-radian.png";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DataPegawai from "./pages/admin/DataPegawai";
import DataPerizinan from "./pages/admin/DataPerizinan";
import DataAbsensi from "./pages/admin/DataAbsensi";
import DataLogbook from "./pages/admin/DataLogbook";
import KelolaLokasi from "./pages/admin/KelolaLokasi";

// =========== PALET WARNA SESUAI FIGMA ===========
export const C = {
  navy: "#2c4a8a",       // sidebar / topbar (solid)
  navyDark: "#243d72",
  navyDarker: "#1f3461",
  blue: "#1e88e5",       // tombol biru (live cam dll)
  blueLight: "#3b9eff",
  red: "#e53935",        // logout, absen pulang
  redDark: "#c62828",
  green: "#4caf50",      // absen masuk
  greenDark: "#388e3c",
  white: "#ffffff",
  bg: "#dcdcdc",         // bg konten utama (abu-abu seperti figma)
  contentBg: "#f5f6fa",
  text: "#1e2432",
  textMuted: "#6b7280",
  border: "#d8dde6",
  // stat card colors di dashboard
  statBlue: "#5fb4e6",
  statMint: "#5fdcb6",
  statGreen: "#52e08a",
};

const MENU_PEGAWAI = [
  { id: "home", label: "Home" },
  { id: "absensi", label: "Absensi" },
  { id: "rekap", label: "Rekap Absen" },
  { id: "logbook", label: "Logbook" },
  { id: "perizinan", label: "Perizinan" },
  { id: "faceid", label: "Daftar Face ID" },
];

const MENU_ADMIN = [
  { id: "admin-dashboard", label: "Dashboard Admin" },
  { id: "admin-users", label: "Data Pegawai" },
  { id: "admin-absensi", label: "Data Absensi" },
  { id: "admin-logbook", label: "Data Logbook" },
  { id: "admin-perizinan", label: "Data Perizinan" },
  { id: "lokasi-admin", label: "Kelola Lokasi Kantor" },
];

function TopBar({ onToggleSidebar }) {
  return (
    <header className="app-topbar" style={{
      height: 60,
      background: C.navy,
      display: "flex",
      alignItems: "center",
      padding: "0 22px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    }}>
      {/* Hamburger – hanya muncul di mobile via CSS */}
      <button
        className="sidebar-toggle"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="topbar-logo" style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}>
          <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
        </div>
        <div className="topbar-title" style={{
          color: "white",
          fontWeight: 800,
          fontSize: 17,
          letterSpacing: 1,
          fontFamily: '"Times New Roman", serif',
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          RADIAN EDU SOLUTION
        </div>
      </div>
    </header>
  );
}

function Sidebar({ page, setPage, user, fotoProfil, isOpen, onClose, isAdmin }) {
  // Wrapper handler agar saat user pilih menu di mobile, sidebar otomatis tertutup
  const handleNavigate = (id) => {
    setPage(id);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`app-sidebar ${isOpen ? "is-open" : ""}`}
      style={{
        width: 215,
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        minHeight: "calc(100vh - 60px)",
        position: "sticky",
        top: 60,
        alignSelf: "flex-start",
      }}
    >
      {/* Avatar Section — klik untuk buka Edit Profil */}
      <div style={{
        padding: "24px 16px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        <div
          onClick={() => {

            if (!isAdmin) {

              handleNavigate("pengaturan");

            }

          }}

          title={
            isAdmin
              ? "Admin tidak dapat mengubah profil"
              : "Klik untuk Edit Profil"
          }
          style={{
            width: 78, height: 78, borderRadius: "50%",
            background: fotoProfil ? `url(${fotoProfil}) center/cover` : "linear-gradient(135deg,#90a4ae,#607d8b)",
            border: "3px solid rgba(255,255,255,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
            color: "white",
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
          }}
        >
          {!fotoProfil && "👤"}
        </div>
        <button
          onClick={() => {

            if (!isAdmin) {

              handleNavigate("pengaturan");

            }

          }}
          style={{
            background: page === "pengaturan" ? "#5fb4e6" : C.blue,
            color: "white",
            padding: "6px 18px",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (page !== "pengaturan") e.currentTarget.style.background = "#5fb4e6"; }}
          onMouseLeave={e => { if (page !== "pengaturan") e.currentTarget.style.background = C.blue; }}
        >
          {user?.role || "Siswa PKL"}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: 2 }}>
        {(isAdmin ? MENU_ADMIN : MENU_PEGAWAI).map(item => {
          const active = page === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: active
                  ? "rgba(255,255,255,0.13)"
                  : "transparent",
                border: "none",
                borderLeft: active
                  ? "3px solid #5fb4e6"
                  : "3px solid transparent",
                color: active
                  ? "white"
                  : "rgba(255,255,255,0.85)",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                textAlign: "center",
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.07)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background =
                    "transparent";
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "14px 18px 18px" }}>
        <button onClick={() => handleNavigate("__logout")} style={{
          width: "100%",
          padding: "10px 14px",
          background: C.red,
          border: "none",
          color: "white",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "0 2px 6px rgba(229,57,53,0.4)",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.redDark}
          onMouseLeave={e => e.currentTarget.style.background = C.red}
        >
          Logout
          <span style={{ fontSize: 14 }}>↪</span>
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [absenLog, setAbsenLog] = useState([]);
  const [fotoProfil, setFotoProfil] = useState(null);
  // State khusus untuk membuka/menutup sidebar di mobile (UI saja)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  console.log("ROLE:", user);
  console.log("IS ADMIN:", isAdmin);

  const navigate = (p) => {
    if (p === "__logout") {
      setUser(null);
      setAbsenLog([]);
      setPage("login");
    } else setPage(p);
  };

  // Saat user pindah halaman, lock body scroll bila sidebar terbuka
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (page === "login") return <Login onLogin={u => {
    setUser(u);

    if (u.role === "admin") {
      setPage("admin-dashboard");
    } else {
      setPage("home");
    }
  }} goRegister={() => setPage("register")} />;
  if (page === "register") return <Register goLogin={() => setPage("login")} />;

  const renderPage = () => {
    console.log("PAGE SEKARANG:", page);
    switch (page) {
      case "admin-dashboard": return <DashboardAdmin setPage={navigate} />;
      case "admin-users": return <DataPegawai />;
      case "admin-perizinan": return <DataPerizinan />;
      case "admin-absensi": return <DataAbsensi />;
      case "admin-logbook": return <DataLogbook />;
      case "lokasi-admin": return <KelolaLokasi />;
      case "home": return <DashboardHome setPage={navigate} absenLog={absenLog} user={user} />;
      case "absensi": return <Absensi absenLog={absenLog} setAbsenLog={setAbsenLog} user={user} />;
      case "perizinan": return <Perizinan user={user} />;
      case "rekap": return <RekapAbsen absenLog={absenLog} />;
      case "logbook": return <LogBook user={user} />;
      case "faceid": return <DaftarFaceID user={user} />;
      case "pengaturan":

        if (isAdmin) {

          return (

            <div
              style={{
                background: "#fff",
                padding: 40,
                borderRadius: 15,
                textAlign: "center",
                boxShadow: "0 5px 15px rgba(0,0,0,.08)"
              }}
            >

              <h2 style={{ color: "#E53935" }}>
                Akses Ditolak
              </h2>

              <p>
                Admin tidak dapat mengakses halaman Edit Profil.
              </p>

            </div>

          );

        }

        return (

          <EditProfil
            user={user}
            setUser={setUser}
            fotoProfil={fotoProfil}
            setFotoProfil={setFotoProfil}
          />

        );
      default: return <DashboardHome setPage={navigate} absenLog={absenLog} user={user} />;
    }
  };

  return (
    <div className="app-shell" style={{ background: C.bg }}>
      <TopBar onToggleSidebar={() => setSidebarOpen(o => !o)} />

      <div className="app-body">
        {/* Backdrop hanya tampak di mobile saat sidebar terbuka */}
        <div
          className={`sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar
          page={page}
          setPage={navigate}
          user={user}
          fotoProfil={fotoProfil}
          isAdmin={isAdmin}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="app-main" style={{ background: C.bg }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
