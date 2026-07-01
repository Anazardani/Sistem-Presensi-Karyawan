import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUsers,
  FaClipboardCheck,
  FaBook,
  FaFileAlt,
  FaArrowUp,
} from "react-icos/fa";

export default function DashboardAdmin({ setPage }) {
  const [data, setData] = useState({
    totalUser: 0,
    totalAbsensi: 0,
    totalLogbook: 0,
    totalPerizinan: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/dashboard`
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        padding: 30,
        background: "#f4f7fb",
        minHeight: "100vh"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              color: "#23408e"
            }}
          >
            Dashboard Admin
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: 8
            }}
          >
            Selamat datang kembali 👋
          </p>

        </div>

        <div
          style={{
            background: "#fff",
            padding: "15px 22px",
            borderRadius: 15,
            boxShadow: "0 8px 25px rgba(0,0,0,.08)"
          }}
        >

          <b>

            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}

          </b>

        </div>

      </div>

      {/* CARD */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 25
        }}
      >

        <Card
          title="Total Pegawai"
          value={data.totalUser}
          icon={<FaUsers size={35} />}
          color="#4F8EF7"
        />

        <Card
          title="Total Absensi"
          value={data.totalAbsensi}
          icon={<FaClipboardCheck size={35} />}
          color="#34C759"
        />

        <Card
          title="Total Logbook"
          value={data.totalLogbook}
          icon={<FaBook size={35} />}
          color="#F39C12"
        />

        <Card
          title="Total Perizinan"
          value={data.totalPerizinan}
          icon={<FaFileAlt size={35} />}
          color="#E74C3C"
        />

      </div>

      {/* ROW KEDUA */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 25,
          marginTop: 30
        }}
      >

        {/* AKTIVITAS */}

        <div
          style={panel}
        >

          <h3
            style={{
              marginTop: 0,
              color: "#23408e"
            }}
          >
            Aktivitas Hari Ini
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
              marginTop: 20
            }}
          >

            <MiniCard
              warna="#4F8EF7"
              title="Pegawai"
              value={data.totalUser}
            />

            <MiniCard
              warna="#34C759"
              title="Absensi"
              value={data.totalAbsensi}
            />

            <MiniCard
              warna="#F39C12"
              title="Logbook"
              value={data.totalLogbook}
            />

          </div>

        </div>

        {/* QUICK ACTION */}

        <div
          style={panel}
        >

          <h3
            style={{
              marginTop: 0,
              color: "#23408e"
            }}
          >
            Quick Action
          </h3>

          <button
            style={btn}
            onClick={() => setPage("admin-users")}
          >
            Kelola Pegawai
          </button>

          <button
            style={btn}
            onClick={() => setPage("admin-absensi")}
          >
            Kelola Absensi
          </button>

          <button
            style={btn}
            onClick={() => setPage("admin-logbook")}
          >
            Kelola Logbook
          </button>

          <button
            style={btn}
            onClick={() => setPage("admin-perizinan")}
          >
            Kelola Perizinan
          </button>

        </div>

      </div>

      {/* ROW KETIGA */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 25,
          marginTop: 30
        }}
      >

        <div style={panel}>

          <h3
            style={{
              marginTop: 0,
              color: "#23408e"
            }}
          >
            Informasi
          </h3>

          <p>Total Pegawai : {data.totalUser}</p>

          <p>Total Absensi : {data.totalAbsensi}</p>

          <p>Total Logbook : {data.totalLogbook}</p>

          <p>Total Perizinan : {data.totalPerizinan}</p>

        </div>

        <div style={panel}>

          <h3
            style={{
              marginTop: 0,
              color: "#23408e"
            }}
          >
            Statistik Bulan Ini
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20
            }}
          >

            <Stat
              title="Pegawai Aktif"
              value={data.totalUser}
            />

            <Stat
              title="Absensi"
              value={data.totalAbsensi}
            />

            <Stat
              title="Perizinan"
              value={data.totalPerizinan}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  icon,
  color
}) {

  return (

    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 25,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)"
      }}
    >

      <div>

        <p
          style={{
            margin: 0,
            color: "#777"
          }}
        >
          {title}
        </p>

        <h1
          style={{
            margin: "15px 0 8px",
            color: "#23408e"
          }}
        >
          {value}
        </h1>

        <span
          style={{
            color: "#34C759",
            display: "flex",
            alignItems: "center",
            gap: 5
          }}
        >
          <FaArrowUp />

          Update
        </span>

      </div>

      <div
        style={{
          width: 75,
          height: 75,
          borderRadius: "50%",
          background: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff"
        }}
      >

        {icon}

      </div>

    </div>

  )

}

function MiniCard({
  title,
  value,
  warna
}) {

  return (

    <div
      style={{
        background: warna,
        color: "#fff",
        borderRadius: 15,
        padding: 20
      }}
    >

      <h4>{title}</h4>

      <h2>{value}</h2>

    </div>

  )

}

function Stat({
  title,
  value
}) {

  return (

    <div
      style={{
        textAlign: "center"
      }}
    >

      <h1
        style={{
          color: "#23408e"
        }}
      >
        {value}
      </h1>

      <p>{title}</p>

    </div>

  )

}

const panel = {
  background: "#fff",
  borderRadius: 20,
  padding: 25,
  boxShadow: "0 8px 25px rgba(0,0,0,.08)"
};

const btn = {
  width: "100%",
  padding: 15,
  marginTop: 15,
  background: "#23408e",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 600
};