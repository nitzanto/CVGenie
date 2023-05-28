import Image from "next/image";
import HeroImage from '../public/hero.webp'
import { Logo } from "../components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-tl from-sky-300 via-purple-800 to-rose-900 w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm backdrop-filter backdrop-blur-sm bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600r rounded-md">
        <Logo className="animate-pulse relative w-96 h-96" />
        <p className="text-xl">
          AI-Driven Resumes that Open Doors
        </p>
        <Link href="post/new/" className="btn bg-gradient-to-r from-sky-300 to-purple-800 hover:from-rose-900 hover:to-violet-600">Begin</Link>
      </div>
    </div>
  );
}
