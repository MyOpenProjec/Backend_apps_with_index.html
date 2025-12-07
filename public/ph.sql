-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Des 2025 pada 12.18
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ph`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedule_servo`
--

CREATE TABLE `schedule_servo` (
  `id` int(11) NOT NULL,
  `time` varchar(8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `schedule_servo`
--

INSERT INTO `schedule_servo` (`id`, `time`, `created_at`) VALUES
(4, '10', '2025-12-07 11:11:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sensor_ph`
--

CREATE TABLE `sensor_ph` (
  `id` int(11) NOT NULL,
  `sensor` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sensor_ph`
--

INSERT INTO `sensor_ph` (`id`, `sensor`, `timestamp`) VALUES
(33, '22.84', '2025-12-06 23:39:36'),
(34, '22.84', '2025-12-06 23:39:37'),
(35, '22.84', '2025-12-06 23:39:39'),
(36, '22.84', '2025-12-06 23:39:40'),
(37, '22.84', '2025-12-06 23:39:41'),
(38, '22.84', '2025-12-06 23:39:43'),
(39, '22.84', '2025-12-06 23:39:44'),
(40, '22.84', '2025-12-06 23:39:45'),
(41, '22.84', '2025-12-06 23:39:47'),
(42, '22.84', '2025-12-06 23:39:48'),
(43, '22.84', '2025-12-06 23:39:49'),
(44, '22.84', '2025-12-06 23:39:51'),
(45, '22.84', '2025-12-06 23:39:52'),
(46, '22.84', '2025-12-06 23:39:53'),
(47, '22.84', '2025-12-06 23:39:55'),
(48, '22.84', '2025-12-06 23:39:56'),
(49, '22.84', '2025-12-06 23:39:57'),
(50, '22.84', '2025-12-06 23:39:59'),
(51, '22.84', '2025-12-06 23:40:00'),
(52, '22.84', '2025-12-06 23:40:01'),
(53, '22.84', '2025-12-06 23:40:03'),
(54, '22.84', '2025-12-06 23:40:04'),
(55, '22.84', '2025-12-06 23:40:05'),
(56, '22.84', '2025-12-06 23:40:07'),
(57, '22.84', '2025-12-06 23:40:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `servo`
--

CREATE TABLE `servo` (
  `id` int(11) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `servo`
--

INSERT INTO `servo` (`id`, `keterangan`, `timestamp`) VALUES
(10, 'ON', '2025-12-06 23:39:42'),
(11, 'ON', '2025-12-06 23:39:43'),
(12, 'OFF', '2025-12-06 23:39:44'),
(13, 'ON', '2025-12-06 23:39:59'),
(14, 'OFF', '2025-12-06 23:40:00'),
(15, 'ON', '2025-12-07 10:52:29'),
(16, 'ON', '2025-12-07 10:52:30'),
(17, 'OFF', '2025-12-07 10:52:31'),
(18, 'ON', '2025-12-07 10:55:33'),
(19, 'OFF', '2025-12-07 10:55:37'),
(20, 'AUTO-ON', '2025-12-07 11:10:04'),
(21, 'AUTO-ON', '2025-12-07 11:10:05'),
(22, 'AUTO-ON', '2025-12-07 11:10:06'),
(23, 'AUTO-ON', '2025-12-07 11:10:07'),
(24, 'AUTO-ON', '2025-12-07 11:10:08'),
(25, 'AUTO-OFF', '2025-12-07 11:10:09'),
(26, 'AUTO-OFF', '2025-12-07 11:10:10'),
(27, 'AUTO-OFF', '2025-12-07 11:10:11'),
(28, 'AUTO-OFF', '2025-12-07 11:10:12'),
(29, 'AUTO-OFF', '2025-12-07 11:10:13'),
(30, 'AUTO-ON', '2025-12-07 11:11:24'),
(31, 'AUTO-ON', '2025-12-07 11:11:25'),
(32, 'AUTO-ON', '2025-12-07 11:11:26'),
(33, 'AUTO-ON', '2025-12-07 11:11:27'),
(34, 'AUTO-ON', '2025-12-07 11:11:28'),
(35, 'AUTO-OFF', '2025-12-07 11:11:29'),
(36, 'AUTO-OFF', '2025-12-07 11:11:30'),
(37, 'AUTO-OFF', '2025-12-07 11:11:31'),
(38, 'AUTO-OFF', '2025-12-07 11:11:32'),
(39, 'AUTO-OFF', '2025-12-07 11:11:33');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `schedule_servo`
--
ALTER TABLE `schedule_servo`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sensor_ph`
--
ALTER TABLE `sensor_ph`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `servo`
--
ALTER TABLE `servo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `schedule_servo`
--
ALTER TABLE `schedule_servo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `sensor_ph`
--
ALTER TABLE `sensor_ph`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT untuk tabel `servo`
--
ALTER TABLE `servo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
