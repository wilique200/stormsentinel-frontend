"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi, ChatMessageOut, ApiError } from "@/lib/api";

interface Props {
  snapshotId: number;
  locationLabel: string;
}

export function ChatPanel({ snapshotId, locationLabel }: Props) {
  const [draft, setDraft] = useState("");
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["chat", snapshotId],
    queryFn: () => chatApi.getHistory(snapshotId),
  });

  const sendMutation = useMutation({
    mutationFn: (message: string) => chatApi.sendMessage(snapshotId, message),
    onMutate: (message: string) => {
      setPendingUserMessage(message);
    },
    onSuccess: () => {
      setPendingUserMessage(null);
      queryClient.invalidateQueries({ queryKey: ["chat", snapshotId] });
    },
    onError: () => {
      setPendingUserMessage(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = draft.trim();
    if (!message || sendMutation.isPending) return;
    setDraft("");
    sendMutation.mutate(message);
  }

  const messages: ChatMessageOut[] = historyQuery.data || [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, pendingUserMessage, sendMutation.isPending]);

  return (
    <div className="mt-5 bg-base-panel border border-base-line rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-base-line">
        <div className="font-display text-[9px] tracking-[0.25em] text-base-muted">
          ASK STORMSENTINEL
        </div>
        <div className="font-body text-[11px] text-base-muted mt-0.5">
          Grounded on this {locationLabel} assessment — not live weather data
        </div>
      </div>

      <div ref={scrollRef} className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
        {historyQuery.isLoading && (
          <p className="font-body text-xs text-base-muted text-center py-4">Loading conversation...</p>
        )}

        {!historyQuery.isLoading && messages.length === 0 && !pendingUserMessage && (
          <p className="font-body text-xs text-base-muted text-center py-4">
            Ask about what&apos;s driving these scores, or what any of the caveats above mean.
          </p>
        )}

        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} content={m.content} />
        ))}

        {pendingUserMessage && <ChatBubble role="user" content={pendingUserMessage} />}

        {sendMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-base-card rounded-lg px-3 py-2 border border-base-line">
              <span className="font-display text-[10px] text-base-muted tracking-widest animate-pulse">
                THINKING...
              </span>
            </div>
          </div>
        )}

        {sendMutation.isError && (
          <p className="font-body text-xs text-hazard-heat text-center py-1">
            {sendMutation.error instanceof ApiError
              ? sendMutation.error.message
              : "Couldn't reach the assistant — try again."}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3 border-t border-base-line">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Why is wildfire risk elevated here?"
          className="flex-1 bg-black/30 border border-base-line rounded-lg px-3 py-2 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
        />
        <button
          type="submit"
          disabled={sendMutation.isPending || !draft.trim()}
          className="font-display text-[11px] font-semibold tracking-wide px-4 py-2 rounded-lg text-white disabled:opacity-50 transition-opacity"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)" }}
        >
          SEND
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 font-body text-[12.5px] leading-relaxed whitespace-pre-wrap ${
          isUser ? "text-white" : "text-gray-300 bg-base-card border border-base-line"
        }`}
        style={isUser ? { background: "linear-gradient(135deg, #F9731633 0%, #8B5CF633 100%)", border: "1px solid #8B5CF640" } : undefined}
      >
        {content}
      </div>
    </div>
  );
}
