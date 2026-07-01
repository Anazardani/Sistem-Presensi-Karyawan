import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DataPegawai() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log("LOAD USERS");

      const response = await axios.get(
        `${API_URL}/api/admin/users`
      );

      console.log("DATA DARI API:", response.data);

      setUsers(response.data);
    } catch (err) {
      console.error("ERROR LOAD USERS:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h2
        style={{
          color: "#2c4a8a",
          marginBottom: 20,
        }}
      >
        Data Pegawai
      </h2>

      <div
        style={{
          marginBottom: 15,
          fontWeight: 600,
          color: "#555",
        }}
      >
        Total Pegawai: {users.length}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>No HP</th>
                <th style={thStyle}>Posisi</th>
                <th style={thStyle}>Instansi</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={tdStyle}>{user.id}</td>

                    <td style={tdStyle}>
                      {user.nama_lengkap}
                    </td>

                    <td style={tdStyle}>
                      {user.email}
                    </td>

                    <td style={tdStyle}>
                      {user.no_hp}
                    </td>

                    <td style={tdStyle}>
                      {user.posisi || "-"}
                    </td>

                    <td style={tdStyle}>
                      {user.instansi || "-"}
                    </td>

                    <td style={tdStyle}>
                      {user.role}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Tidak ada data pegawai
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
};