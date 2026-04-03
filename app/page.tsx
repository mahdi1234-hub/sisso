"use client";

import { useChat } from "@ai-sdk/react";
import FrappeChart from "@/components/FrappeChart";
import { useEffect, useRef } from "react";
import { ArrowUp, Menu, Search } from "lucide-react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="min-h-screen bg-white text-[#1c1917] flex flex-col font-serif">
      {/* Header */}
      <header className="border-b border-[#1c1917]/10 py-6 px-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-12">
          <span className="text-[10px] uppercase tracking-widest font-medium">Sisso / Novera</span>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 hover:text-[#1c1917] transition-colors">Philosophy</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 hover:text-[#1c1917] transition-colors">Experience</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 hover:text-[#1c1917] transition-colors">Journal</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#1c1917]/60 hover:text-[#1c1917]">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-[#1c1917]/60 hover:text-[#1c1917]">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section (only shows if no messages) */}
          {messages.length === 0 && (
            <div className="mb-20 flex flex-col md:flex-row gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-full md:w-1/4 pt-2 border-t border-[#1c1917]">
                <span className="block text-[10px] uppercase tracking-widest mt-4">
                  01 — Philosophy
                </span>
              </div>
              <div className="w-full md:w-3/4">
                <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-10 font-light text-[#1c1917] max-w-3xl">
                  We design data spaces for clarity, not just utility. A collection of refined insights curated for the modern observer.
                </h2>
                <div className="border-t border-[#1c1917]/10 py-6 mb-10 flex flex-col md:flex-row gap-4 md:gap-12 md:items-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 font-medium">Light over noise</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 font-medium">Materials with intention</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1c1917]/60 font-medium">Silence as a feature</span>
                </div>
                
                {/* Visual Placeholder */}
                <div className="group relative w-full aspect-[21/9] overflow-hidden rounded-[2px] border border-black/10 mb-10">
                  <img 
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/34912fd8-c9c7-4c5c-8731-c9476acb42f8_1600w.jpg" 
                    alt="Architectural Detail" 
                    className="w-full h-full object-cover transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                
                <div className="max-w-2xl">
                  <p className="text-[#1c1917]/70 font-light leading-relaxed mb-8">
                    Sisso represents a departure from the standard analytical experience. 
                    We focus on light, materials, and silence in data visualization. 
                    Our agent is selected for its architectural merit and position within the digital landscape.
                  </p>
                  <a href="#" className="inline-block text-[10px] uppercase tracking-widest border-b border-[#1c1917] pb-1 hover:text-[#1c1917]/60 hover:border-[#1c1917]/60 transition-colors font-medium">
                    Explore the Sisso Journal
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-20 pb-24">
            {messages.map((m, idx) => (
              <div key={m.id} className="flex flex-col md:flex-row gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="w-full md:w-1/4 pt-2 border-t border-[#1c1917]/20">
                  <span className="block text-[10px] uppercase tracking-widest mt-4 text-[#1c1917]/60">
                    {m.role === "user" ? `0${idx + 2} — Inquiry` : `0${idx + 2} — Insight`}
                  </span>
                </div>
                <div className="w-full md:w-3/4">
                  <div className={`text-2xl md:text-3xl font-light leading-relaxed mb-8 ${m.role === "user" ? "text-[#1c1917]" : "text-[#1c1917]/80"}`}>
                    {m.content}
                  </div>

                  {/* Render Tool Results (Charts) */}
                  {m.toolInvocations?.map((toolInvocation) => {
                    const { toolCallId, toolName, state } = toolInvocation;

                    if (state === "result") {
                      const { result } = toolInvocation;
                      if (toolName === "renderChart") {
                        const args = toolInvocation.args;
                        return (
                          <div key={toolCallId} className="my-12 p-10 border border-[#1c1917]/10 rounded-[2px] bg-[#fafafa] group hover:border-[#1c1917]/20 transition-colors">
                            <FrappeChart
                              title={args.title}
                              data={args.data}
                              type={args.type}
                              height={args.height}
                              colors={args.colors || ["#1c1917", "#a8a29e", "#44403c"]}
                              axisOptions={args.axisOptions}
                              lineOptions={args.lineOptions}
                              barOptions={args.barOptions}
                            />
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Form */}
      <footer className="p-8 bg-white border-t border-[#1c1917]/10">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Inquire with intention..."
              className="w-full bg-transparent border-b border-[#1c1917]/20 py-4 pr-12 text-xl font-light focus:outline-none focus:border-[#1c1917] transition-colors placeholder:text-[#1c1917]/30"
            />
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              className="absolute right-0 bottom-4 p-2 text-[#1c1917]/40 hover:text-[#1c1917] disabled:opacity-30 disabled:hover:text-[#1c1917]/40 transition-all"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          </form>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-widest text-[#1c1917]/40 font-medium">Sisso Agent v1.0 — Powered by Cerebras & Frappe</span>
            <div className="flex gap-6">
              <span className="text-[9px] uppercase tracking-widest text-[#1c1917]/40">Privacy</span>
              <span className="text-[9px] uppercase tracking-widest text-[#1c1917]/40">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
