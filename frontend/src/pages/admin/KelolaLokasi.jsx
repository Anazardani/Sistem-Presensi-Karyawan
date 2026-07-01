import { API_URL } from "../../config";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function KelolaLokasi() {

    const [lokasi, setLokasi] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        nama_lokasi: "",
        alamat: "",
        latitude: "",
        longitude: "",
        radius: 100,
        status: "Aktif",
    });

    useEffect(() => {

        loadLokasi();

    }, []);

    const loadLokasi = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/admin/lokasi`
            );

            setLokasi(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const filteredData = useMemo(() => {

        return lokasi.filter((item) =>

            item.nama_lokasi
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [lokasi, search]);

    const exportExcel = (rows) => {

        const excelData = rows.map(item => ({

            "Nama Lokasi": item.nama_lokasi,

            "Alamat": item.alamat,

            Latitude: item.latitude,

            Longitude: item.longitude,

            Radius: item.radius,

            Status: item.status,

        }));

        const ws = XLSX.utils.json_to_sheet(excelData);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Lokasi Kantor"
        );

        XLSX.writeFile(
            wb,
            "Lokasi_Kantor.xlsx"
        );

    };

    const hapusLokasi = async (id) => {

        if (!window.confirm("Yakin ingin menghapus lokasi?"))
            return;

        try {

            await axios.delete(
                `${API_URL}/api/admin/lokasi/${id}`
            );

            loadLokasi();

        } catch (err) {

            console.log(err);

        }

    };

    const simpanLokasi = async () => {

        try {

            if (editId) {

                await axios.put(

                    `${API_URL}/api/admin/lokasi/${editId}`,

                    form

                );

            } else {

                await axios.post(

                    `${API_URL}/api/admin/lokasi`,

                    form

                );

            }

            setShowModal(false);

            setEditId(null);

            setForm({

                nama_lokasi: "",

                alamat: "",

                latitude: "",

                longitude: "",

                radius: 100,

                status: "Aktif",

            });

            loadLokasi();

        } catch (err) {

            console.log(err);

        }

    };

    const cardStyle = {

        background: "#fff",

        borderRadius: 15,

        padding: 20,

        flex: 1,

        minWidth: 220,

        boxShadow: "0 5px 20px rgba(0,0,0,.08)",

    };

    return (

        <div>

            <h2
                style={{
                    color: "#2c4a8a",
                    fontWeight: 700,
                    marginBottom: 25,
                }}
            >
                Kelola Lokasi Kantor
            </h2>

            {/* CARD STATISTIK */}

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
                            color: "#777",
                            marginBottom: 10,
                        }}
                    >
                        Total Lokasi
                    </div>

                    <h1
                        style={{
                            color: "#2c4a8a",
                            margin: 0,
                        }}
                    >
                        {lokasi.length}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#777",
                            marginBottom: 10,
                        }}
                    >
                        Lokasi Aktif
                    </div>

                    <h1
                        style={{
                            color: "#43A047",
                            margin: 0,
                        }}
                    >
                        {
                            lokasi.filter(
                                x => x.status === "Aktif"
                            ).length
                        }
                    </h1>

                </div>

                <div style={cardStyle}>

                    <div
                        style={{
                            color: "#777",
                            marginBottom: 10,
                        }}
                    >
                        Lokasi Nonaktif
                    </div>

                    <h1
                        style={{
                            color: "#E53935",
                            margin: 0,
                        }}
                    >
                        {
                            lokasi.filter(
                                x => x.status !== "Aktif"
                            ).length
                        }
                    </h1>

                </div>

            </div>

            {/* TOOLBAR */}

            <div
                style={{
                    background: "#fff",
                    padding: 18,
                    borderRadius: 15,
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                    flexWrap: "wrap",
                    boxShadow: "0 5px 20px rgba(0,0,0,.08)"
                }}
            >

                <input

                    placeholder="Cari lokasi..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    style={{
                        width: 300,
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        outline: "none",
                    }}

                />

                <div
                    style={{
                        display: "flex",
                        gap: 10
                    }}
                >

                    <button

                        onClick={() =>
                            exportExcel(filteredData)
                        }

                        style={{
                            background: "#43A047",
                            color: "#fff",
                            border: "none",
                            padding: "12px 18px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontWeight: 600,
                        }}

                    >

                        Export Excel

                    </button>

                    <button

                        onClick={() => {

                            setEditId(null);

                            setForm({

                                nama_lokasi: "",

                                alamat: "",

                                latitude: "",

                                longitude: "",

                                radius: 100,

                                status: "Aktif",

                            });

                            setShowModal(true);

                        }}

                        style={{
                            background: "#2c4a8a",
                            color: "#fff",
                            border: "none",
                            padding: "12px 18px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontWeight: 600,
                        }}

                    >

                        + Tambah Lokasi

                    </button>

                </div>

            </div>

            {/* TABEL */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 5px 20px rgba(0,0,0,.08)"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#2c4a8a",
                                color: "#fff"
                            }}
                        >

                            <th style={th}>No</th>

                            <th style={th}>Nama Lokasi</th>

                            <th style={th}>Alamat</th>

                            <th style={th}>Radius</th>

                            <th style={th}>Status</th>

                            <th style={th}>Maps</th>

                            <th style={th}>Aksi</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading && (

                            <tr>

                                <td
                                    colSpan={7}
                                    style={{
                                        padding: 35,
                                        textAlign: "center"
                                    }}
                                >
                                    Loading...
                                </td>

                            </tr>

                        )}

                        {!loading && filteredData.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{
                                    transition: ".2s",
                                }}
                                onMouseEnter={(e) =>
                                    e.currentTarget.style.background = "#f8fbff"
                                }
                                onMouseLeave={(e) =>
                                    e.currentTarget.style.background = "#fff"
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
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                                background: "#2c4a8a",
                                                color: "#fff",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontWeight: 700,
                                            }}
                                        >
                                            📍
                                        </div>

                                        <div>

                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {item.nama_lokasi}
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
                                    {item.alamat}
                                </td>

                                <td style={td}>
                                    {item.radius} Meter
                                </td>

                                <td style={td}>

                                    <span
                                        style={{
                                            background:
                                                item.status === "Aktif"
                                                    ? "#d4edda"
                                                    : "#f8d7da",

                                            color:
                                                item.status === "Aktif"
                                                    ? "#155724"
                                                    : "#721c24",

                                            padding: "6px 14px",

                                            borderRadius: 20,

                                            fontWeight: 700,

                                            fontSize: 12,
                                        }}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td style={td}>

                                    <a

                                        href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}

                                        target="_blank"

                                        rel="noreferrer"

                                        style={{
                                            color: "#1976d2",
                                            fontWeight: 700,
                                            textDecoration: "none",
                                        }}

                                    >

                                        Lihat Maps

                                    </a>

                                </td>

                                <td style={td}>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 8,
                                        }}
                                    >

                                        <button

                                            onClick={() => {

                                                setEditId(item.id);

                                                setForm({

                                                    nama_lokasi: item.nama_lokasi,

                                                    alamat: item.alamat,

                                                    latitude: item.latitude,

                                                    longitude: item.longitude,

                                                    radius: item.radius,

                                                    status: item.status,

                                                });

                                                setShowModal(true);

                                            }}

                                            style={{
                                                background: "#1976d2",
                                                color: "#fff",
                                                border: "none",
                                                padding: "8px 14px",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                                fontWeight: 600,
                                            }}

                                        >

                                            Edit

                                        </button>

                                        <button

                                            onClick={() =>
                                                hapusLokasi(item.id)
                                            }

                                            style={{
                                                background: "#E53935",
                                                color: "#fff",
                                                border: "none",
                                                padding: "8px 14px",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                                fontWeight: 600,
                                            }}

                                        >

                                            Hapus

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {showModal && (

                <div
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
                        style={{
                            width: 600,
                            maxWidth: "95%",
                            background: "#fff",
                            borderRadius: 16,
                            padding: 25,
                        }}
                    >

                        <h2
                            style={{
                                marginBottom: 20,
                                color: "#2c4a8a",
                            }}
                        >
                            {editId ? "Edit Lokasi" : "Tambah Lokasi"}
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gap: 15,
                            }}
                        >

                            <input
                                placeholder="Nama Lokasi"
                                value={form.nama_lokasi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nama_lokasi: e.target.value,
                                    })
                                }
                                style={inputStyle}
                            />

                            <textarea
                                placeholder="Alamat"
                                value={form.alamat}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        alamat: e.target.value,
                                    })
                                }
                                rows={3}
                                style={{
                                    ...inputStyle,
                                    resize: "none",
                                }}
                            />

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 15,
                                }}
                            >

                                <input
                                    placeholder="Latitude"
                                    value={form.latitude}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            latitude: e.target.value,
                                        })
                                    }
                                    style={inputStyle}
                                />

                                <input
                                    placeholder="Longitude"
                                    value={form.longitude}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            longitude: e.target.value,
                                        })
                                    }
                                    style={inputStyle}
                                />

                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 15,
                                }}
                            >

                                <input
                                    type="number"
                                    placeholder="Radius"
                                    value={form.radius}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            radius: e.target.value,
                                        })
                                    }
                                    style={inputStyle}
                                />

                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            status: e.target.value,
                                        })
                                    }
                                    style={inputStyle}
                                >

                                    <option value="Aktif">
                                        Aktif
                                    </option>

                                    <option value="Nonaktif">
                                        Nonaktif
                                    </option>

                                </select>

                            </div>

                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 10,
                                marginTop: 25,
                            }}
                        >

                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#9E9E9E",
                                    color: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                Batal
                            </button>

                            <button
                                onClick={simpanLokasi}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#2c4a8a",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                }}
                            >
                                Simpan
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
    fontWeight: 700,
    fontSize: 14,
};

const td = {
    padding: 14,
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

const inputStyle = {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14,
};