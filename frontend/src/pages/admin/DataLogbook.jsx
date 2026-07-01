import { API_URL } from "../../config";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function DataLogbook() {

    const [data, setData] = useState([]);

    const [statistik, setStatistik] = useState({
        total: 0,
        hariIni: 0,
        mingguIni: 0,
        bulanIni: 0,
    });

    const [search, setSearch] = useState("");

    const [tanggal, setTanggal] = useState("");

    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(null);

    useEffect(() => {

        loadLogbook();

        loadStatistik();

    }, []);

    const loadLogbook = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/admin/logbook`
            );

            setData(res.data);
            

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const loadStatistik = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/admin/logbook/statistik`
            );

            setStatistik(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredData = useMemo(() => {

        return data.filter((item) => {

            const cocokNama =
                item.nama
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const cocokPekerjaan =
                item.pekerjaan
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            let cocokTanggal = true;

            if (tanggal) {

                const tglData = new Date(item.hari_tanggal);

                const yyyy = tglData.getFullYear();

                const mm = String(tglData.getMonth() + 1).padStart(2, "0");

                const dd = String(tglData.getDate()).padStart(2, "0");

                const tanggalData = `${yyyy}-${mm}-${dd}`;

                cocokTanggal = tanggalData === tanggal;

            }

            return (
                (cocokNama || cocokPekerjaan) &&
                cocokTanggal
            );

        });

    }, [
        data,
        search,
        tanggal
    ]);
    const exportExcel = (rows) => {

        const excel = rows.map((item) => ({

            Nama: item.nama,

            Email: item.email,

            Tanggal: item.hari_tanggal,

            Jam: item.jam_pengajuan,

            Pekerjaan: item.pekerjaan,

            Output: item.output_hasil,

            File: item.lokasi_file,

        }));

        const ws =
            XLSX.utils.json_to_sheet(excel);

        const wb =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Logbook"
        );

        XLSX.writeFile(
            wb,
            "Data_Logbook.xlsx"
        );

    };

    const cardStyle = {
        background: "white",
        borderRadius: 15,
        padding: 20,
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
        flex: 1,
        minWidth: 220,
    };

    return (

        <div>

            <h2
                style={{
                    color: "#2c4a8a",
                    marginBottom: 25,
                    fontWeight: 700,
                }}
            >
                Data Logbook
            </h2>

            {/* CARD */}

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                    marginBottom: 25,
                }}
            >

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#888",
                            marginBottom: 10,
                        }}
                    >
                        Total Logbook
                    </div>

                    <h1
                        style={{
                            color: "#2c4a8a",
                        }}
                    >
                        {statistik.total}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#888",
                            marginBottom: 10,
                        }}
                    >
                        Hari Ini
                    </div>

                    <h1
                        style={{
                            color: "#43A047",
                        }}
                    >
                        {statistik.hariIni}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#888",
                            marginBottom: 10,
                        }}
                    >
                        Minggu Ini
                    </div>

                    <h1
                        style={{
                            color: "#FB8C00",
                        }}
                    >
                        {statistik.mingguIni}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#888",
                            marginBottom: 10,
                        }}
                    >
                        Bulan Ini
                    </div>

                    <h1
                        style={{
                            color: "#8E24AA",
                        }}
                    >
                        {statistik.bulanIni}
                    </h1>

                </div>

            </div>

            {/* FILTER */}

            <div
                style={{
                    background: "white",
                    padding: 18,
                    borderRadius: 15,
                    marginBottom: 25,
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                    alignItems: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,.06)"
                }}
            >

                <input

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    placeholder="Cari nama / pekerjaan..."

                    style={{
                        flex: 1,
                        minWidth: 260,
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                    }}

                />

                <input

                    type="date"

                    value={tanggal}

                    onChange={(e) =>
                        setTanggal(e.target.value)
                    }

                    style={{
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                    }}

                />

                <button

                    onClick={() => {

                        setSearch("");

                        setTanggal("");

                    }}

                    style={{
                        padding: "11px 18px",
                        border: "none",
                        borderRadius: 10,
                        background: "#9E9E9E",
                        color: "white",
                        cursor: "pointer",
                    }}

                >

                    Reset

                </button>

                <button

                    onClick={() =>
                        exportExcel(filteredData)
                    }

                    style={{
                        padding: "11px 18px",
                        border: "none",
                        borderRadius: 10,
                        background: "#2c4a8a",
                        color: "white",
                        cursor: "pointer",
                    }}

                >

                    Export Excel

                </button>

            </div>

            {/* INFO */}

            <div
                style={{
                    marginBottom: 15,
                    color: "#666",
                    fontWeight: 600,
                }}
            >

                Menampilkan

                <span
                    style={{
                        color: "#2c4a8a",
                        fontWeight: 700,
                    }}
                >

                    {" "}
                    {filteredData.length}
                    {" "}

                </span>

                dari

                <span
                    style={{
                        color: "#2c4a8a",
                        fontWeight: 700,
                    }}
                >

                    {" "}
                    {data.length}
                    {" "}

                </span>

                data

            </div>

            {/* TABEL */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 5px 20px rgba(0,0,0,.08)",
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#2c4a8a",
                                color: "#fff",
                            }}
                        >

                            <th style={th}>No</th>

                            <th style={th}>Pegawai</th>

                            <th style={th}>Tanggal</th>

                            <th style={th}>Jam</th>

                            <th style={th}>Pekerjaan</th>

                            <th style={th}>Output</th>

                            <th style={th}>File</th>

                            <th style={th}>Aksi</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading && (

                            <tr>

                                <td
                                    colSpan={8}
                                    style={{
                                        padding: 40,
                                        textAlign: "center",
                                    }}
                                >
                                    Loading...
                                </td>

                            </tr>

                        )}

                        {!loading &&
                            filteredData.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={8}
                                        style={{
                                            padding: 40,
                                            textAlign: "center",
                                            color: "#888",
                                        }}
                                    >
                                        Tidak ada data
                                    </td>

                                </tr>

                            )}

                        {!loading &&
                            filteredData.map((item, index) => (

                                <tr
                                    key={item.id}
                                    style={{
                                        transition: ".2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        e.currentTarget.style.background =
                                        "#f8fbff"
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.background =
                                        "#fff"
                                    }
                                >

                                    <td style={td}>
                                        {index + 1}
                                    </td>

                                    <td style={td}>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    background: "#2c4a8a",
                                                    color: "#fff",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontWeight: 700,
                                                }}
                                            >

                                                {item.nama
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </div>

                                            <div>

                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                    }}
                                                >

                                                    {item.nama}

                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: "#777",
                                                    }}
                                                >

                                                    {item.email}

                                                </div>

                                            </div>

                                        </div>

                                    </td>

                                    <td style={td}>
                                        {item.hari_tanggal}
                                    </td>

                                    <td style={td}>
                                        {item.jam_pengajuan}
                                    </td>

                                    <td style={td}>

                                        {item.pekerjaan.length > 40
                                            ? item.pekerjaan.substring(0, 40) + "..."
                                            : item.pekerjaan}

                                    </td>

                                    <td style={td}>

                                        {item.output_hasil.length > 35
                                            ? item.output_hasil.substring(0, 35) + "..."
                                            : item.output_hasil}

                                    </td>

                                    <td style={td}>

                                        {item.lokasi_file
                                            ? "📄 Ada"
                                            : "-"}

                                    </td>

                                    <td style={td}>

                                        <button

                                            onClick={() =>
                                                setSelected(item)
                                            }

                                            style={{
                                                background: "#2c4a8a",
                                                color: "#fff",
                                                border: "none",
                                                padding: "8px 15px",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                            }}

                                        >

                                            Detail

                                        </button>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

            {/* MODAL DETAIL */}

            {selected && (

                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,.45)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                    }}
                >

                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: 750,
                            maxWidth: "95%",
                            background: "#fff",
                            borderRadius: 18,
                            overflow: "hidden",
                            boxShadow: "0 10px 35px rgba(0,0,0,.25)"
                        }}
                    >

                        <div
                            style={{
                                background: "#2c4a8a",
                                color: "#fff",
                                padding: 20
                            }}
                        >

                            <h2 style={{ margin: 0 }}>
                                Detail Logbook
                            </h2>

                        </div>

                        <div
                            style={{
                                padding: 25,
                                display: "grid",
                                gridTemplateColumns: "180px 1fr",
                                gap: 15,
                            }}
                        >

                            <b>Nama</b>
                            <div>{selected.nama}</div>

                            <b>Email</b>
                            <div>{selected.email}</div>

                            <b>Tanggal</b>
                            <div>{selected.hari_tanggal}</div>

                            <b>Jam Pengajuan</b>
                            <div>{selected.jam_pengajuan}</div>

                            <b>Pekerjaan</b>

                            <div
                                style={{
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.7
                                }}
                            >
                                {selected.pekerjaan}
                            </div>

                            <b>Output Hasil</b>

                            <div
                                style={{
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.7
                                }}
                            >
                                {selected.output_hasil}
                            </div>

                            <b>File</b>

                            <div>

                                {selected.lokasi_file ? (

                                    <a
                                        href={`${API_URL}/uploads/${selected.lokasi_file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            color: "#1976d2",
                                            fontWeight: 700,
                                            textDecoration: "none"
                                        }}
                                    >

                                        📄 Lihat / Download File

                                    </a>

                                ) : (

                                    "-"

                                )}

                            </div>

                            <b>Dibuat</b>

                            <div>

                                {selected.created_at}

                            </div>

                        </div>

                        <div
                            style={{
                                background: "#f5f6fa",
                                padding: 20,
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >

                            <button

                                onClick={() => setSelected(null)}

                                style={{
                                    padding: "10px 24px",
                                    background: "#2c4a8a",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontWeight: 600
                                }}

                            >

                                Tutup

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

const th = {

    padding: 14,

    textAlign: "center",

    fontWeight: 700,

    fontSize: 14,

};

const td = {

    padding: 14,

    borderBottom: "1px solid #eee",

    textAlign: "center",

};