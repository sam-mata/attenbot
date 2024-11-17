"use client";

import AttenBot from '../app/AttenBot';

export default function Home() {
  return (
    <div className="min-h-screen lg:w-1/3 px-8 mx-auto items-center text-center font-body">
      {/* TITLE */}
      <div className="py-12">
        <div className="lg:text-[9rem] text-[5rem] font-bold font-title border-2">
          ATTENBOT
        </div>
        <h2 className="lg:text-2xl text-xl font-subtitle italic py-4">
          A webcam narrator in the style of a certain BBC presenter.
        </h2>
      </div>

      {/* ATTENBOT */}
      <AttenBot />

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
      <div className="flex space-x-2 text-center bg-foreground w-fit mx-auto mb-20 px-2 text-background font-body font-bold">

        <a href="https://github.com/sam-mata/attenbot">Made with ❤️ by Sam Mata</a>
      </div>
    </div>
  );
}