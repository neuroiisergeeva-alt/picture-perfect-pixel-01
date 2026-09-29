import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Catalog } from "@/components/landing/Catalog";
import { Projects } from "@/components/landing/Projects";
import {
  About,
  Advantages,
  Audience,
  Emotion,
  Process,
  Production,
} from "@/components/landing/Sections";
import { CtaBand, ContactForm, Footer, MobileBar } from "@/components/landing/Contacts";

const title = "Пиломатериалы и изделия из дерева — эксперт с опытом более 10 лет";
const description =
  "Помогаю выбирать пиломатериалы для строительства, отделки и интерьера: доска, вагонка, планкен, клееный брус, ступени, мебельные щиты. Собственное производство, опт и розница, поставки по России.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Advantages />
        <Catalog />
        <Emotion />
        <Process />
        <Audience />
        <Projects />
        <Production />
        <CtaBand />
        <ContactForm />
      </main>
      <Footer />
      <MobileBar />
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </>
  );
}
