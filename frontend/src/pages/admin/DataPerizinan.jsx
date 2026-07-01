import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DataPerizinan() {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");

    const [tanggalAwal, setTanggalAwal] = useState("");
    const [tanggalAkhir, setTanggalAkhir] = useState("");

    useEffect(() => {
        loadPerizinan();
    }, []);

    const loadPerizinan = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/admin/perizinan`
            );

            setData(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredData = data.filter((item) => {

        const mulai = new Date(item.tanggal_mulai);

        const selesai = new Date(item.tanggal_selesai);

        const cocokNama =
            item.nama_lengkap
                .toLowerCase()
                .includes(search.toLowerCase());

        const cocokStatus =
            statusFilter === "Semua"
                ? true
                : item.status === statusFilter;

        const cocokTanggalAwal =
            !tanggalAwal ||
            mulai >= new Date(tanggalAwal);

        const cocokTanggalAkhir =
            !tanggalAkhir ||
            selesai <= new Date(tanggalAkhir);

        return (
            cocokNama &&
            cocokStatus &&
            cocokTanggalAwal &&
            cocokTanggalAkhir
        );

    });

    const ubahStatus = async (id, status) => {

        try {

            await axios.put(
                `${API_URL}/api/admin/perizinan/${id}`,
                {
                    status,
                }
            );

            loadPerizinan();

        } catch (err) {

            console.log(err);

        }

    };

    const exportExcel = (rows) => {

        const exportData = rows.map((item) => ({

            ID: item.id,

            Nama: item.nama_lengkap,

            Mulai: item.tanggal_mulai,

            Selesai: item.tanggal_selesai,

            Keterangan: item.keterangan,

            Status: item.status,

        }));

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Perizinan"
        );

        const excelBuffer =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array",
                }
            );

        const blob =
            new Blob(
                [excelBuffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

        saveAs(blob, "Data_Perizinan.xlsx");

    };

    return (
        <div>

            <h2
                style={{
                    color: "#2c4a8a",
                    marginBottom: 20,
                    fontWeight: 700,
                }}
            >
                Data Perizinan
            </h2>

            <div
                style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 14,
                    boxShadow: "0 5px 15px rgba(0,0,0,.08)",
                    marginBottom: 25,
                }}
            >

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 15,
                        alignItems: "center",
                    }}
                >

                    <input
                        type="text"
                        placeholder="🔍 Cari nama pegawai..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: 250,
                            padding: "12px 16px",
                            borderRadius: 10,
                            border: "1px solid #d0d7de",
                            outline: "none",
                            fontSize: 14,
                        }}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: "12px",
                            borderRadius: 10,
                            border: "1px solid #d0d7de",
                            minWidth: 170,
                            fontSize: 14,
                        }}
                    >

                        <option value="Semua">Semua Status</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Disetujui">Disetujui</option>
                        <option value="Ditolak">Ditolak</option>

                    </select>

                    <input
                        type="date"
                        value={tanggalAwal}
                        onChange={(e) => setTanggalAwal(e.target.value)}
                        style={{
                            padding: "11px",
                            borderRadius: 10,
                            border: "1px solid #d0d7de",
                        }}
                    />

                    <input
                        type="date"
                        value={tanggalAkhir}
                        onChange={(e) => setTanggalAkhir(e.target.value)}
                        style={{
                            padding: "11px",
                            borderRadius: 10,
                            border: "1px solid #d0d7de",
                        }}
                    />

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                        flexWrap: "wrap",
                        gap: 15,
                    }}
                >

                    <div
                        style={{
                            fontWeight: 600,
                            color: "#2c4a8a",
                            fontSize: 14,
                        }}
                    >

                        Menampilkan

                        <span
                            style={{
                                color: "#1e88e5",
                                fontWeight: 700,
                            }}
                        >

                            {" "}
                            {filteredData.length}

                        </span>

                        {" "}dari{" "}

                        <span
                            style={{
                                color: "#1e88e5",
                                fontWeight: 700,
                            }}
                        >

                            {data.length}

                        </span>

                        {" "}data

                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                        }}
                    >

                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("Semua");
                                setTanggalAwal("");
                                setTanggalAkhir("");
                            }}
                            style={{
                                background: "#f5f5f5",
                                border: "1px solid #ccc",
                                padding: "10px 18px",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >

                            Reset

                        </button>

                        <button
                            onClick={() => exportExcel(filteredData)}
                            style={{
                                background: "#1e88e5",
                                color: "white",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >

                            Export Hasil

                        </button>

                        <button
                            onClick={() => exportExcel(data)}
                            style={{
                                background: "#2c4a8a",
                                color: "white",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >

                            Export Semua

                        </button>

                    </div>

                </div>

            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 3px 10px rgba(0,0,0,.08)"
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
                                color: "white",
                            }}
                        >

                            <th style={th}>ID</th>

                            <th style={th}>Nama</th>

                            <th style={th}>Mulai</th>

                            <th style={th}>Selesai</th>

                            <th style={th}>Keterangan</th>

                            <th style={th}>Status</th>

                            <th style={th}>Aksi</th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.length === 0 && (

                            <tr>

                                <td
                                    colSpan={7}
                                    style={{
                                        textAlign: "center",
                                        padding: 25,
                                    }}
                                >
                                    Belum ada data
                                </td>

                            </tr>

                        )}

                        {filteredData.map((item) => (

                            <tr key={item.id}>

                                <td style={td}>{item.id}</td>

                                <td style={td}>{item.nama_lengkap}</td>

                                <td style={td}>{item.tanggal_mulai}</td>

                                <td style={td}>{item.tanggal_selesai}</td>

                                <td style={td}>{item.keterangan}</td>

                                <td style={td}>

                                    <span
                                        style={{
                                            padding: "5px 12px",
                                            borderRadius: 20,
                                            background:
                                                item.status === "Disetujui"
                                                    ? "#d4edda"
                                                    : item.status === "Ditolak"
                                                        ? "#f8d7da"
                                                        : "#fff3cd",
                                            color:
                                                item.status === "Disetujui"
                                                    ? "#155724"
                                                    : item.status === "Ditolak"
                                                        ? "#721c24"
                                                        : "#856404",
                                            fontWeight: 700,
                                            fontSize: 12,
                                        }}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td style={td}>

                                    <button
                                        onClick={() => ubahStatus(item.id, "Disetujui")}
                                        style={{
                                            background: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            marginRight: 8,
                                        }}
                                    >
                                        Setujui
                                    </button>

                                    <button
                                        onClick={() => ubahStatus(item.id, "Ditolak")}
                                        style={{
                                            background: "#E53935",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Tolak
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

const th = {
    padding: 12,
    fontSize: 14,
};

const td = {
    padding: 12,
    borderBottom: "1px solid #eee",
    textAlign: "center",
};