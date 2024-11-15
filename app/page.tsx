"use client";

import { useState } from "react";

export default function Home() {
  const [status, ] = useState("📸 Enable Webcam");
  const [script, ] = useState("No script generated.");


  return (
    <div className="min-h-screen w-1/3 mx-auto items-center text-center font-body">
      {/* TITLE */}
      <div className="py-12">
        <h1 className="text-[9rem] font-bold pb-6 font-title border-2">
          ATTENBOT
        </h1>
        <h2 className="text-2xl font-subtitle italic py-4">
          A webcam narrator in the style of a certain BBC presenter.
        </h2>
      </div>

      {/* ATTENBOT */}
      <div className="flex py-12">
        <div className="w-1/2">
          <video
            id="webcam"
            className="w-full rounded-sm aspect-square bg-zinc-800"
            autoPlay
          >
            <track kind="captions" label="No captions available" default />
          </video>
          <button className="font-extrabold bg-foreground text-background px-4 my-4">START THE ATTENBOT</button>
        </div>

        <div className="w-1/2">
          <div className="flex">
            <h2 className="font-extrabold w-2/5">Status:</h2>
            <h2 className="w-3/5 text-left">{status}</h2>
          </div>
          <p className="bg-zinc-800 m-4 text-xs h-48">{script}</p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-16 text-zinc-400">
        <h3 className="text-lg font-bold text-white">
          How does it work?
        </h3>
        <div className="flex py-4">
          <h2 className="pr-2">1.</h2>
          <p>
            ATTENBOT first analyses and summarises the photo with
            <a href="https://platform.openai.com/docs/guides/vision" className="hover:text-white text-zinc-300 font-bold">
              {" "}
              OpenAI's GPT-4 Vision{" "}
            </a>
            to generate a script in the style of a BBC earth nature documentary.
          </p>
        </div>
        <div className="flex py-4">
          <h2 className="pr-2">2.</h2>
          <p>
            Then, this script is fed to an
            <a href="https://elevenlabs.io/" className="hover:text-white text-zinc-300 font-bold"> ElevenLabs </a>
            model trained to synthesise an audio transcript in a lovingly
            familiar tone.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex space-x-2 text-center bg-foreground w-fit mx-auto mb-20 px-4 text-background font-body font-bold">
        <a href="https://sammata.nz/">Contact</a>
        <p>•</p> 
        <a href="https://github.com/sam-mata/attenbot">Project Files</a>
        <p>•</p>
        <a href="https://x.com/charliebholtz/status/1724815159590293764">Original</a>
      </div>
    </div>
  );
}
