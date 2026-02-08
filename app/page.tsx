"use client";
import YieldAssistant from '../components/YieldAssistant';
import type { NextPage } from "next";
import MonbuxLanding from "~~/components/landing/Landing";

const Home: NextPage = () => {
  return (
    <>
      <MonbuxLanding />
      <YieldAssistant />
    </>
  );
};

export default Home;