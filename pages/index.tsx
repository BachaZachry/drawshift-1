import { useEffect } from "react";
import { AuthPopup } from "components/Auth";
import Header from "components/Header";
import Navbar from "components/Navbar";
import { useRouter } from "next/router";
import Head from "next/head";
import Card from "components/landing/Card";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "lib/hooks";
import { loadUser, uStatus } from "lib/userSlice";

export default function Home() {
  return (
    <div className="h-screen lg:overflow-y-hidden">
      <Head>
        <title>Drawshift</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Toaster />
      <AuthPopup />
      <div className="fixed mt-28">
        <img className="w-screen" src="./wave.svg" />
      </div>
      <div className="relative pb-20 bg-gray-800">
        <Navbar />
        <Header name="Start" />
      </div>

      <Card />
    </div>
  );
}
