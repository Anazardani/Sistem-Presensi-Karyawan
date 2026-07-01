-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2026 at 07:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `presensi`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `jenis` enum('masuk','keluar') DEFAULT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `absensi`
--

INSERT INTO `absensi` (`id`, `user_id`, `jenis`, `latitude`, `longitude`, `waktu`) VALUES
(21, 4, 'masuk', '-7.743944', '110.552368', '2026-06-26 08:52:56'),
(22, 4, 'keluar', '-7.743944', '110.552368', '2026-06-26 08:53:21'),
(23, 4, 'masuk', '-7.881', '110.5672', '2026-07-01 16:40:53');

-- --------------------------------------------------------

--
-- Table structure for table `logbook`
--

CREATE TABLE `logbook` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hari_tanggal` date NOT NULL,
  `jam_pengajuan` time NOT NULL,
  `pekerjaan` text NOT NULL,
  `output_hasil` text NOT NULL,
  `lokasi_file` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logbook`
--

INSERT INTO `logbook` (`id`, `user_id`, `nama`, `email`, `hari_tanggal`, `jam_pengajuan`, `pekerjaan`, `output_hasil`, `lokasi_file`, `created_at`) VALUES
(10, 4, 'Muhammad Haidar Ghiffari', 'ghiffa8@gmail.com', '2026-06-26', '16:32:00', 'coding', 'website', '-', '2026-06-26 09:32:30');

-- --------------------------------------------------------

--
-- Table structure for table `lokasi_kantor`
--

CREATE TABLE `lokasi_kantor` (
  `id` int(11) NOT NULL,
  `nama_lokasi` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `latitude` decimal(12,9) NOT NULL,
  `longitude` decimal(12,9) NOT NULL,
  `radius` int(11) DEFAULT 100,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lokasi_kantor`
--

INSERT INTO `lokasi_kantor` (`id`, `nama_lokasi`, `alamat`, `latitude`, `longitude`, `radius`, `status`, `created_at`) VALUES
(1, 'Radian Depok', 'Depok', -6.354407961, 106.838932251, 100, 'Aktif', '2026-07-01 08:14:32'),
(2, 'Radian Jogja', 'Yogyakarta', -7.761407549, 110.372844238, 100, 'Aktif', '2026-07-01 08:14:32'),
(3, 'Radian Surabaya', 'Surabaya', -7.261305357, 112.786007781, 100, 'Aktif', '2026-07-01 08:14:32'),
(4, 'Radian Gun', 'Klaten', -7.770950033, 110.544576261, 100, 'Aktif', '2026-07-01 16:24:25'),
(5, 'Radian Wonosari', 'Wonosari', -7.880702422, 110.567146351, 100, 'Aktif', '2026-07-01 16:39:41');

-- --------------------------------------------------------

--
-- Table structure for table `perizinan`
--

CREATE TABLE `perizinan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `keterangan` text NOT NULL,
  `status` enum('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perizinan`
--

INSERT INTO `perizinan` (`id`, `user_id`, `nama`, `email`, `tanggal_mulai`, `tanggal_selesai`, `keterangan`, `status`, `created_at`) VALUES
(2, 4, 'Muhammad Haidar Ghiffari', 'ghiffa8@gmail.com', '2026-06-29', '2026-06-29', 'sakit', 'Disetujui', '2026-06-26 08:23:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `face_descriptor` longtext DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `posisi` varchar(100) DEFAULT NULL,
  `nik` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `instansi` varchar(100) DEFAULT 'RADIAN',
  `foto_profil` varchar(255) DEFAULT NULL,
  `role` enum('admin','pegawai') DEFAULT 'pegawai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama_lengkap`, `email`, `password`, `no_hp`, `created_at`, `face_descriptor`, `username`, `posisi`, `nik`, `alamat`, `instansi`, `foto_profil`, `role`) VALUES
(3, 'Muhammad Haidar Ghiffari', 'ghiffa029@gmail.com', '$2b$10$6RTDUF1RquSb6/rn61CI6eCcuVXDB5DkG/ezlA3mP/5q4c/OH/w4e', '089532583154', '2026-06-25 10:38:36', NULL, '', '', '', '', '', NULL, 'admin'),
(4, 'Muhammad Haidar Ghiffari', 'ghiffa8@gmail.com', '$2b$10$tM9eQWstVlwQJ7Q2QCYD8OuiLZhk0diUexTCG0IAfFB25v8Xbj9fm', '089751385712', '2026-06-26 08:22:39', '[-0.12544749677181244,0.0879703089594841,0.07354214042425156,-0.011748393066227436,-0.06624335050582886,-0.07639524340629578,-0.009832427836954594,-0.22883889079093933,0.13661736249923706,-0.0409567654132843,0.22273239493370056,-0.012493105605244637,-0.13695025444030762,-0.15201742947101593,0.011110223829746246,0.12428944557905197,-0.1443093866109848,-0.1257394254207611,-0.005116076674312353,-0.036526668816804886,0.06703230738639832,-0.0006457675481215119,0.11239288747310638,0.12002046406269073,-0.12701815366744995,-0.3223990499973297,-0.04653393477201462,-0.17744241654872894,0.09236519783735275,-0.0302409790456295,-0.07397770136594772,0.053198736160993576,-0.24257737398147583,-0.05324743688106537,-0.020802121609449387,0.03936755657196045,0.026812179014086723,-0.002158406423404813,0.2052162140607834,-0.004684219602495432,-0.27880311012268066,-0.019792934879660606,-0.05154425650835037,0.22160093486309052,0.22904662787914276,-0.02574087493121624,0.05440771207213402,-0.15327636897563934,0.10654754191637039,-0.14526039361953735,0.08694508671760559,0.1209145113825798,0.06499937921762466,-0.028167875483632088,-0.019443249329924583,-0.1851537972688675,-0.05360737442970276,0.05444427579641342,-0.17342062294483185,0.05358327552676201,0.06881624460220337,-0.08881348371505737,-0.03168420493602753,-0.09921762347221375,0.20101501047611237,0.05542900040745735,-0.12216600030660629,-0.08546132594347,0.09045855700969696,-0.15703679621219635,0.012780958786606789,0.11138150840997696,-0.13798296451568604,-0.2083750218153,-0.35290443897247314,0.03736501559615135,0.3870505690574646,0.11132406443357468,-0.25360262393951416,0.017857611179351807,-0.1428065299987793,0.044122062623500824,0.13803401589393616,0.1774246245622635,0.0023249066434800625,0.08635824918746948,-0.06173771619796753,-0.024063678458333015,0.11804257333278656,-0.05621477589011192,-0.013807534240186214,0.2931816279888153,-0.04918802157044411,0.057929277420043945,0.013772827573120594,0.08728709071874619,-0.08726377040147781,0.00937658455222845,-0.08673311769962311,-0.02319946326315403,-0.02112344652414322,-0.02854102849960327,0.058030299842357635,0.09814758598804474,-0.23251529037952423,0.11358719319105148,0.006558654364198446,0.02772313356399536,0.03879765793681145,-0.054901719093322754,-0.030102908611297607,-0.13653181493282318,0.11777342855930328,-0.23979800939559937,0.16776442527770996,0.1834438592195511,0.007580104283988476,0.20889773964881897,0.047931768000125885,0.10396839678287506,-0.0606796070933342,-0.0324956476688385,-0.12590552866458893,0.08219520002603531,0.14051201939582825,-0.06237034872174263,0.055902574211359024,-0.0015406606253236532]', NULL, NULL, NULL, NULL, 'RADIAN', NULL, 'pegawai'),
(5, 'Tito Taufiqur', 'Titi@gmail.com', '$2b$10$wyZD37s1gpJNNQIjzuZTVOVgbsdn9DYyPnwJo.Pvcn4Br7ZP3M8.W', '089616393759', '2026-07-01 16:43:28', NULL, NULL, NULL, NULL, NULL, 'RADIAN', NULL, 'pegawai');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logbook`
--
ALTER TABLE `logbook`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lokasi_kantor`
--
ALTER TABLE `lokasi_kantor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perizinan`
--
ALTER TABLE `perizinan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `logbook`
--
ALTER TABLE `logbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lokasi_kantor`
--
ALTER TABLE `lokasi_kantor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `perizinan`
--
ALTER TABLE `perizinan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
