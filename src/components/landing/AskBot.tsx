import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Tool, ToolHeader } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import portrait from "@/assets/victoria-portrait.jpg";
import { Btn } from "./Btn";

const greeting =
  "Здравствуйте! Я помощник Виктории. Помогу подобрать древесину так, чтобы потом не пришлось «рубить сплеча». Расскажите, пожалуйста, что Вы планируете построить или отделать?";

function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { consent: true } }),
    onError: (e) => {
      const m = e.message || "";
      if (m.includes("429")) toast.error("Слишком много запросов, попробуйте через минуту.");
      else if (m.includes("402")) toast.error("Бот временно недоступен. Напишите нам в WhatsApp.");
      else toast.error("Не удалось получить ответ. Попробуйте ещё раз.");
    },
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>{greeting}</MessageResponse>
            </MessageContent>
          </Message>
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent
                className={
                  m.role === "user"
                    ? "group-[.is-user]:bg-cognac group-[.is-user]:text-primary-foreground"
                    : ""
                }
              >
                {m.parts.map((p, i) => {
                  if (p.type === "text")
                    return m.role === "user" ? (
                      <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                    ) : (
                      <MessageResponse key={i}>{p.text}</MessageResponse>
                    );
                  if (p.type === "tool-save_lead")
                    return (
                      <Tool key={i} defaultOpen={false}>
                        <ToolHeader
                          type={p.type}
                          state={p.state}
                          title="Заявка передана Виктории"
                        />
                      </Tool>
                    );
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Подбираю ответ…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="border-t border-border p-3">
        <PromptInput
          onSubmit={(msg) => {
            const text = msg.text?.trim();
            if (!text || busy) return;
            sendMessage({ text });
            setInput("");
          }}
        >
          <PromptInputTextarea
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите Ваш вопрос…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && !busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

export function AskBot() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("bot-consent") === "1") {
      setAgreed(true);
      setStarted(true);
    }
  }, []);

  return (
    <>
      <Btn onClick={() => setOpen(true)} className="mt-6 w-full">
        <MessageCircle className="size-4" /> Спросить
      </Btn>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="flex-row items-center gap-3 border-b border-border p-4 text-left">
            <img src={portrait} alt="" className="size-11 rounded-full object-cover" />
            <div>
              <SheetTitle className="font-display text-xl">Помощник Виктории</SheetTitle>
              <SheetDescription className="text-xs">
                Подбор материала и консультация
              </SheetDescription>
            </div>
          </SheetHeader>
          {started ? (
            <Chat />
          ) : (
            <div className="flex flex-1 flex-col justify-center gap-6 p-6">
              <p className="font-display text-2xl leading-snug">
                Задайте вопрос о древесине — помогу подобрать материал и передам Ваш запрос Виктории.
              </p>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-0.5"
                />
                <span>
                  Я принимаю{" "}
                  <Link to="/privacy" target="_blank" className="text-cognac underline">
                    политику конфиденциальности
                  </Link>{" "}
                  и даю согласие на обработку персональных данных.
                </span>
              </label>
              <Btn
                onClick={() => {
                  if (!agreed) return;
                  sessionStorage.setItem("bot-consent", "1");
                  setStarted(true);
                }}
                className={agreed ? "" : "pointer-events-none opacity-50"}
              >
                Начать разговор
              </Btn>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
