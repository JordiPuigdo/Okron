"use client";

import React, { useState } from "react";
import Link from "next/link";
import Layout from "components/Layout";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [preventiusSubMenuOpen, setPreventiusSubMenuOpen] = useState(false);
  const [correctiveSubMenuOpen, setCorrectiveSubMenuOpen] = useState(false);
  const [historicSubMenuOpen, setHistoricSubMenuOpen] = useState(false);

  const toggleHistoricSubMenu = () => {
    setHistoricSubMenuOpen(!historicSubMenuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const togglePreventiusSubMenu = () => {
    setPreventiusSubMenuOpen(!preventiusSubMenuOpen);
  };
  const toggleCorrectiveSubMenu = () => {
    setCorrectiveSubMenuOpen(!correctiveSubMenuOpen);
  };

  return (
    <Layout>
      <></>
    </Layout>
  );
}
