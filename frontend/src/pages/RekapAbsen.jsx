import { API_URL } from "../config";
import { useEffect, useState } from "react";
import axios from "axios";

const C = { navy: "#2c4a8a", text: "#1e2432", muted: "#6b7280", border: "#d8dde6" };

export default function RekapAbsen() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [jenisFilter, setJenisFilter] = useState("semua");

  const filtered = data.filter((d) => {
    const keyword = search.toLowerCase();

    const tanggal = new Date(d.waktu)
      .toLocaleDateString("id-ID")
      .toLowerCase();

    const hari = new Date(d.waktu)
      .toLocaleDateString("id-ID", {
        weekday: "long",
      })
      .toLowerCase();

    const cocokSearch =
      !search ||
      tanggal.includes(keyword) ||
      hari.includes(keyword) ||
      d.jenis?.toLowerCase().includes(keyword);

    const cocokJenis =
      jenisFilter === "semua" ||
      d.jenis === jenisFilter;

    return cocokSearch && cocokJenis;
  });

  useEffect(() => {

    const loadData = async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem("user")
          );

        const response =
          await axios.get(
            `${API_URL}/api/absensi/rekap/${user.id}`
          );

        setData(response.data);

      } catch (err) {

        console.log(err);

      }
    };

    loadData();

  }, []);

  const totalHariKerja = [
    ...new Set(
      filtered.map((item) =>
        new Date(item.waktu)
          .toLocaleDateString("id-ID")
      )
    )
  ].length;

  const handleExport = () => {
    const headers = [
      "Tanggal",
      "Hari",
      "Jam",
      "Jenis",
      "Latitude",
      "Longitude",
    ];

    const rows = filtered.map((r) => [
      new Date(r.waktu).toLocaleDateString("id-ID"),
      new Date(r.waktu).toLocaleDateString("id-ID", {
        weekday: "long",
      }),
      new Date(r.waktu).toLocaleTimeString("id-ID"),
      r.jenis,
      r.latitude,
      r.longitude,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download =
      `rekap-absensi-${new Date().getTime()}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title */}
      <div className="page-titlebar">
        <h2 style={{ margin: 0, fontSize: 16, color: C.navy, fontWeight: 700 }}>Rekap Absen</h2>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔍 Cari tanggal, hari, jenis..."
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              fontSize: 12,
              width: 250,
              outline: "none",
            }}
          />

          <select
            value={jenisFilter}
            onChange={(e) =>
              setJenisFilter(e.target.value)
            }
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              fontSize: 12,
              outline: "none",
            }}
          >
            <option value="semua">
              Semua Jenis
            </option>

            <option value="masuk">
              Masuk
            </option>

            <option value="keluar">
              Keluar
            </option>
          </select>

          <button
            onClick={handleExport}
            style={{
              padding: "8px 16px",
              background: C.navy,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{
        background: "white", borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        {/* Table header strip */}
        <div style={{
          background: "#e8eaef",
          padding: "10px 18px",
          borderBottom: `1px solid ${C.border}`,
          textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>
            Tabel Rekap Absensi Radian Edu Solution
          </div>
        </div>

        <div className="responsive-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f6fa" }}>
                {[
                  "Tanggal",
                  "Hari",
                  "Jam",
                  "Jenis",
                  "Lokasi"
                ].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px",
                    textAlign: "center",
                    color: C.text,
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody> {filtered.length === 0 ? (<tr> <td colSpan={5} style={{ textAlign: "center", padding: "50px", color: C.muted, fontSize: 13, }} > Tidak ada data absensi </td> </tr>) : (filtered.map((r, i) => (<tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafbfc", borderBottom: `1px solid ${C.border}`, transition: "0.2s", }} onMouseEnter={(e) => { e.currentTarget.style.background = "#eef4ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#fafbfc"; }} > <td style={{ padding: "14px", textAlign: "center", fontWeight: 600, color: C.text, }} > {new Date(r.waktu).toLocaleDateString("id-ID")} </td> <td style={{ padding: "14px", textAlign: "center", color: C.muted, }} > {new Date(r.waktu).toLocaleDateString("id-ID", { weekday: "long", })} </td> <td style={{ padding: "14px", textAlign: "center", color: C.navy, fontWeight: 700, fontVariantNumeric: "tabular-nums", }} > {new Date(r.waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", })} </td> <td style={{ padding: "14px", textAlign: "center", }} > <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize", background: r.jenis === "masuk" ? "#e8f5e9" : "#ffebee", color: r.jenis === "masuk" ? "#2e7d32" : "#c62828", }} > {r.jenis} </span> </td> <td style={{ padding: "14px", textAlign: "center", }} > <div style={{ display: "inline-block", background: "#eef3ff", color: C.navy, padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, lineHeight: 1.5, minWidth: 120, }} > 📍{" "} {Number(r.latitude).toFixed(5)} <br /> 🌐{" "} {Number(r.longitude).toFixed(5)} </div> </td> </tr>)))} </tbody>
          </table>
        </div>

        <div style={{
          padding: "10px 18px",
          borderTop: `1px solid ${C.border}`,
          fontSize: 11, color: C.muted,
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: 6,
        }}>
          <span>Menampilkan {filtered.length} dari {data.length} data</span>
          <span>
            Total Hari Kerja: {totalHariKerja} hari
          </span>
        </div>
      </div>
    </div>
  );
}

