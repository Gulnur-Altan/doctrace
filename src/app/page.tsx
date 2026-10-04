
"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to investigate this question."
      );
    } finally {
      setLoading(false);
    }
  }

  function useExample(example: string) {
    setQuestion(example);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f3] text-[#252322]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 md:px-10">
        <header className="flex items-center justify-between border-b border-[#ded9d4] pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#252322] text-sm font-bold text-white">
                D
              </div>

              <h1 className="text-xl font-semibold tracking-tight">
                DocTrace
              </h1>
            </div>

            <p className="mt-2 text-sm text-[#746e69]">
              AI documentation investigation agent
            </p>
          </div>

          <div className="hidden rounded-full border border-[#d8d2cc] bg-white px-3 py-1.5 text-xs font-medium text-[#625d58] sm:block">
            Angular 20 → 21
          </div>
        </header>

        <section className="flex flex-1 flex-col py-12">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-10">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-[#8a6f58]">
                Documentation investigation
              </p>

              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
                Investigate Angular migration questions.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#68615c]">
                Ask a technical question and DocTrace will investigate the
                connected Sanity Knowledge Base before generating an answer.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-[#d8d2cc] bg-white p-3 shadow-sm">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What should I consider when migrating an Angular 20 application to Angular 21?"
                  rows={4}
                  className="w-full resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-[#aaa39d]"
                />

                <div className="flex items-center justify-between border-t border-[#ebe7e3] pt-3">
                  <span className="px-3 text-xs text-[#928b85]">
                    Powered by Sanity Context MCP
                  </span>

                  <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="rounded-xl bg-[#252322] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3a3735] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Investigating..." : "Investigate"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#8b847e]">
                Try an example
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "What are the main breaking changes in Angular 21?",
                  "How does zoneless change detection affect migration?",
                  "What should I review in my Angular testing setup?",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => useExample(example)}
                    className="rounded-full border border-[#d8d2cc] bg-white px-3.5 py-2 text-left text-xs text-[#625d58] transition hover:border-[#aaa39d] hover:bg-[#f2efec]"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="mt-10 rounded-2xl border border-[#ded9d4] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#8a6f58]" />
                  <p className="text-sm text-[#68615c]">
                    Investigating the documentation...
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="h-3 w-4/5 animate-pulse rounded bg-[#eeeae6]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#eeeae6]" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-[#eeeae6]" />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-800">
                  Investigation failed
                </p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}

            {answer && !loading && (
              <section className="mt-10">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6f6862]">
                    Investigation result
                  </h3>

                  <span className="rounded-full bg-[#eee9e4] px-3 py-1 text-xs font-medium text-[#6f6257]">
                    Sanity Knowledge Base
                  </span>
                </div>

                <article className="rounded-2xl border border-[#d8d2cc] bg-white p-6 shadow-sm md:p-8">
                  <div className="whitespace-pre-wrap text-[15px] leading-7 text-[#373330]">
                    {answer}
                  </div>
                </article>
              </section>
            )}
          </div>
        </section>

        <footer className="border-t border-[#ded9d4] pt-5 text-xs text-[#918a84]">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <span>DocTrace · Sanity Challenge 2026</span>
            <span>
              Structured content → Knowledge Base → Context MCP → AI agent
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}