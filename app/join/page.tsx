"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, PlusCircle, Users } from "lucide-react";

// ── Mock live rooms ──────────────────────────────────────────────────────────

const liveRooms = [
  {
    id: "1",
    name: "Trivia Night Room",
    playersJoined: 4,
    maxPlayers: 10,
    avatars: ["🧑‍💻", "👩‍🎨", "🧑‍🚀", "👩‍🔬"],
    extraPlayers: 6,
  },
  {
    id: "2",
    name: "Science Showdown",
    playersJoined: 7,
    maxPlayers: 12,
    avatars: ["🧙‍♂️", "🦸‍♀️", "🧑‍🎤"],
    extraPlayers: 4,
  },
];

// ── Digit avatar colors for the mock avatars ─────────────────────────────────

const avatarGradients = [
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-600",
];

// ── Component ────────────────────────────────────────────────────────────────

const CODE_LENGTH = 6;

export default function JoinRoomPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isJoining, setIsJoining] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isFilled = digits.every((d) => d !== "");

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Allow only digits
      const char = value.replace(/\D/g, "").slice(-1);
      const next = [...digits];
      next[index] = char;
      setDigits(next);

      // Auto-advance
      if (char && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, CODE_LENGTH);
      if (!pasted) return;

      const next = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setDigits(next);

      // Focus on next empty or last
      const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    },
    [digits]
  );

  const handleJoin = useCallback(() => {
    if (!isFilled) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setIsJoining(true);
    const code = digits.join("");

    // Simulate a brief loading state, then navigate
    setTimeout(() => {
      router.push(`/live/play/${code}`);
    }, 800);
  }, [digits, isFilled, router]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 pb-20">
        {/* ── Breadcrumb / Back ── */}
        <Link
          href="/home"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* ── Page Header ── */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Join a Room
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Play with your friends live &amp; compete for glory
          </p>
        </div>

        {/* ── Room Code Card ── */}
        <div
          className={`rounded-3xl border border-border/50 bg-card p-8 shadow-sm animate-slide-up ${
            shake ? "animate-shake" : ""
          }`}
        >
          <p className="text-center text-sm font-bold text-foreground">
            Enter Room Code
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Enter the 6-digit code shared by your host
          </p>

          {/* ── 6 digit inputs ── */}
          <div className="mt-6 flex justify-center gap-2.5 sm:gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                aria-label={`Digit ${i + 1}`}
                className={`
                  h-14 w-12 sm:h-16 sm:w-14
                  rounded-xl border-2 border-dashed
                  text-center text-xl sm:text-2xl font-bold
                  text-foreground bg-background
                  outline-none transition-all duration-200
                  ${
                    digit
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-md shadow-purple-500/10"
                      : "border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600"
                  }
                  focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg focus:shadow-purple-500/10
                `}
              />
            ))}
          </div>

          {/* ── Join Room Button ── */}
          <button
            type="button"
            onClick={handleJoin}
            disabled={isJoining}
            className={`
              mt-8 w-full rounded-full
              bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500
              px-8 py-4 text-base font-bold text-white
              shadow-lg shadow-purple-500/25
              hover:shadow-xl hover:shadow-purple-500/40
              hover:-translate-y-0.5
              transition-all duration-300
              flex items-center justify-center gap-2.5
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
            `}
          >
            {isJoining ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Joining…
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Join Room
              </>
            )}
          </button>
        </div>

        {/* ── Or host a game ── */}
        <div className="mt-8 flex flex-col items-center gap-3 animate-slide-up animation-delay-100">
          <p className="text-sm text-muted-foreground font-medium">
            Or create your own room
          </p>
          <Link
            href="/host"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-6 py-2.5 text-sm font-semibold text-purple-600 dark:text-purple-400 shadow-sm hover:border-purple-400/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4" />
            Host a Game
          </Link>
        </div>

        {/* ── Live Rooms Preview ── */}
        <div className="mt-10 space-y-4 animate-slide-up animation-delay-200">
          {liveRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-950/20 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Room header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-bold text-foreground">
                    {room.name}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Live Now
                </span>
              </div>

              {/* Players info */}
              <p className="mt-1 text-xs text-muted-foreground">
                <Users className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                {room.playersJoined} / {room.maxPlayers} Players joined
              </p>

              {/* Avatar row */}
              <div className="mt-3 flex items-center">
                {room.avatars.map((emoji, idx) => (
                  <div
                    key={idx}
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${
                      avatarGradients[idx % avatarGradients.length]
                    } text-lg shadow-md ring-2 ring-amber-50 dark:ring-amber-950 ${
                      idx > 0 ? "-ml-2" : ""
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
                {room.extraPlayers > 0 && (
                  <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-bold text-foreground ring-2 ring-amber-50 dark:ring-amber-950">
                    +{room.extraPlayers}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
