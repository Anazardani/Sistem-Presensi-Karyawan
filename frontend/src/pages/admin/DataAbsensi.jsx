import { API_URL } from "../../config";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function DataAbsensi() {

    const [data, setData] = useState([]);

    const [statistik, setStatistik] = useState({
        total: 0,
        masuk: 0,
        keluar: 0,
    });

    const [search, setSearch] = useState("");

    const [tanggal, setTanggal] = useState("");

    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(null);

    useEffect(() => {

        loadAbsensi();
        loadStatistik();

    }, []);

    const loadAbsensi = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/admin/absensi`
            );

            setData(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    }

    const loadStatistik = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/admin/absensi/statistik`
            );

            setStatistik(res.data);

        } catch (err) {

            console.log(err);

        }

    }

    const filteredData = useMemo(() => {

        return data.filter((item) => {

            const cocokNama =
                item.nama_lengkap
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const tanggalData =
                item.tanggal
                    ? item.tanggal.toString().slice(0, 10)
                    : "";

            const cocokTanggal =
                !tanggal || tanggalData === tanggal;

            return cocokNama && cocokTanggal;

        });

    }, [
        data,
        search,
        tanggal
    ]);

    const exportExcel = (rows) => {

        const excelData = rows.map(item => ({

            Nama: item.nama_lengkap,

            Instansi: item.instansi,

            Posisi: item.posisi,

            Tanggal: item.tanggal,

            "Jam Masuk": item.jam_masuk,

            "Jam Keluar": item.jam_pulang,

            Latitude: item.latitude,

            Longitude: item.longitude

        }));

        const ws = XLSX.utils.json_to_sheet(
            excelData
        );

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Absensi"
        );

        XLSX.writeFile(
            wb,
            "Data_Absensi.xlsx"
        );

    }

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
                Data Absensi
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
                        Total Absensi
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
                        Absen Masuk
                    </div>

                    <h1
                        style={{
                            color: "#43A047",
                        }}
                    >
                        {statistik.masuk}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#888",
                            marginBottom: 10,
                        }}
                    >
                        Absen Keluar
                    </div>

                    <h1
                        style={{
                            color: "#E53935",
                        }}
                    >
                        {statistik.keluar}
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
                        setSearch(
                            e.target.value
                        )}

                    placeholder="Cari nama pegawai..."

                    style={{
                        flex: 1,
                        minWidth: 250,
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                    }}

                />

                <input

                    type="date"

                    value={tanggal}

                    onChange={(e) =>
                        setTanggal(
                            e.target.value
                        )}

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
                    {filteredData.length}{" "}
                </span>
                dari
                <span
                    style={{
                        color: "#2c4a8a",
                        fontWeight: 700,
                    }}
                >
                    {" "}
                    {data.length}{" "}
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
                            <th style={th}>Instansi</th>
                            <th style={th}>Posisi</th>
                            <th style={th}>Tanggal</th>
                            <th style={th}>Masuk</th>
                            <th style={th}>Keluar</th>
                            <th style={th}>Status</th>
                            <th style={th}>Aksi</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading && (

                            <tr>

                                <td
                                    colSpan={9}
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
                                        colSpan={9}
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
                            filteredData.map((item, index) => {

                                let status = "Belum Hadir";

                                if (item.jam_masuk && !item.jam_pulang) {
                                    status = "Hadir";
                                }

                                if (item.jam_masuk && item.jam_pulang) {
                                    status = "Lengkap";
                                }

                                return (

                                    <tr
                                        key={index}
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
                                                    {item.nama_lengkap
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {item.nama_lengkap}
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#777",
                                                        }}
                                                    >
                                                        ID : {item.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={td}>
                                            {item.instansi}
                                        </td>

                                        <td style={td}>
                                            {item.posisi}
                                        </td>

                                        <td style={td}>
                                            {item.tanggal}
                                        </td>

                                        <td style={td}>
                                            {item.jam_masuk || "-"}
                                        </td>

                                        <td style={td}>
                                            {item.jam_pulang || "-"}
                                        </td>

                                        <td style={td}>

                                            <span
                                                style={{
                                                    background:
                                                        status === "Lengkap"
                                                            ? "#d4edda"
                                                            : status === "Hadir"
                                                                ? "#fff3cd"
                                                                : "#f8d7da",

                                                    color:
                                                        status === "Lengkap"
                                                            ? "#155724"
                                                            : status === "Hadir"
                                                                ? "#856404"
                                                                : "#721c24",

                                                    padding: "6px 14px",
                                                    borderRadius: 20,
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {status}
                                            </span>

                                        </td>

                                        <td style={td}>

                                            <button

                                                onClick={() =>
                                                    setSelected(item)
                                                }

                                                style={{
                                                    background:
                                                        "#2c4a8a",

                                                    color: "#fff",

                                                    border: "none",

                                                    padding:
                                                        "8px 14px",

                                                    borderRadius: 8,

                                                    cursor: "pointer",
                                                }}

                                            >

                                                Detail

                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

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
                            width: 700,
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
                                padding: 20,
                                color: "#fff"
                            }}
                        >

                            <h2 style={{ margin: 0 }}>
                                Detail Absensi
                            </h2>

                        </div>

                        <div
                            style={{
                                padding: 25,
                                display: "grid",
                                gridTemplateColumns: "170px 1fr",
                                gap: 15
                            }}
                        >

                            <b>Nama</b>
                            <div>{selected.nama_lengkap}</div>

                            <b>Instansi</b>
                            <div>{selected.instansi}</div>

                            <b>Posisi</b>
                            <div>{selected.posisi}</div>

                            <b>Tanggal</b>
                            <div>{selected.tanggal}</div>

                            <b>Jam Masuk</b>
                            <div>{selected.jam_masuk || "-"}</div>

                            <b>Jam Pulang</b>
                            <div>{selected.jam_pulang || "-"}</div>

                            <b>Latitude</b>
                            <div>{selected.latitude}</div>

                            <b>Longitude</b>
                            <div>{selected.longitude}</div>

                            <b>Google Maps</b>

                            <div>

                                <a
                                    href={`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: "#1976d2",
                                        fontWeight: 700
                                    }}
                                >

                                    Lihat Lokasi

                                </a>

                            </div>

                        </div>

                        <div
                            style={{
                                padding: 20,
                                display: "flex",
                                justifyContent: "flex-end",
                                background: "#f5f6fa"
                            }}
                        >

                            <button

                                onClick={() => setSelected(null)}

                                style={{
                                    padding: "10px 22px",
                                    background: "#2c4a8a",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer"
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
    padding: 15,
    fontWeight: 700,
    fontSize: 14,
    textAlign: "center",
};

const td = {
    padding: 14,
    borderBottom: "1px solid #eee",
    textAlign: "center",
    fontSize: 14,
};
