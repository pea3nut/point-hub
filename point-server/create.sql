-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2019-11-09 08:04:52
-- 服务器版本： 5.5.47-0ubuntu0.14.04.1
-- PHP 版本： 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- 数据库： `point_hub`
--
CREATE DATABASE IF NOT EXISTS `<PEA_DATABASE_NAME>` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `<PEA_DATABASE_NAME>`;

-- --------------------------------------------------------

--
-- 表的结构 `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `app_name` char(100) NOT NULL,
  `event_page` char(100) NOT NULL,
  `event_flag` varchar(100) NOT NULL,
  `content` tinytext NOT NULL,
  `uid` char(20) DEFAULT NULL,
  `date` int(11) DEFAULT NULL,
  `time` datetime NOT NULL,
  `ip` char(200) NOT NULL,
  `duration` int(12) NOT NULL,
  `referer` varchar(256) NOT NULL,
  `sdk_version` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转储表的索引
--

--
-- 表的索引 `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_name` (`app_name`,`event_page`,`event_flag`),
  ADD KEY `time` (`time`),
  ADD KEY `date` (`date`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
