import doska from "@/assets/cat-doska.jpg";
import vagonka from "@/assets/cat-vagonka.jpg";
import pol from "@/assets/cat-pol.jpg";
import imitaciya from "@/assets/cat-imitaciya.jpg";
import brus from "@/assets/cat-brus.jpg";
import stupeni from "@/assets/cat-stupeni.jpg";
import shit from "@/assets/cat-shit.jpg";
import planken from "@/assets/cat-planken.jpg";
import bruski from "@/assets/cat-bruski.jpg";

import galHouse from "@/assets/gal-house.jpg";
import galTerrace from "@/assets/gal-terrace.jpg";
import galFence from "@/assets/gal-fence.jpg";
import galFurniture from "@/assets/gal-furniture.jpg";
import heroHouse from "@/assets/hero-house.jpg";
import emotion from "@/assets/emotion-interior.jpg";

export type Product = {
  title: string;
  text: string;
  image: string;
  alt: string;
};

/** Добавить новую позицию — просто дописать объект в массив. */
export const products: Product[] = [
  {
    title: "Доска сухая строганая",
    text: "Для строительства, отделки, мебели и интерьерных решений.",
    image: doska,
    alt: "Штабель сухой строганой доски в столярной мастерской",
  },
  {
    title: "Вагонка",
    text: "Натуральная отделка стен, потолков, домов, бань и загородных пространств.",
    image: vagonka,
    alt: "Стена, отделанная натуральной деревянной вагонкой",
  },
  {
    title: "Доска пола",
    text: "Теплый натуральный деревянный пол для дома и коммерческих помещений.",
    image: pol,
    alt: "Натуральный деревянный пол из массивной доски в светлой комнате",
  },
  {
    title: "Имитация бруса",
    text: "Эстетика деревянного дома для внутренней и наружной отделки.",
    image: imitaciya,
    alt: "Интерьер с отделкой стен имитацией бруса",
  },
  {
    title: "Клееный брус",
    text: "Стабильный и эстетичный материал для строительства и архитектурных решений.",
    image: brus,
    alt: "Конструкция из клееного бруса крупным планом",
  },
  {
    title: "Ступени",
    text: "Натуральное дерево для лестниц и индивидуальных интерьерных проектов.",
    image: stupeni,
    alt: "Ступени лестницы из массива дерева",
  },
  {
    title: "Мебельные щиты",
    text: "Для мебели, столешниц, подоконников, лестниц и интерьерных решений.",
    image: shit,
    alt: "Мебельный щит из массива дуба на верстаке",
  },
  {
    title: "Планкен",
    text: "Современное решение для фасадов, террас, заборов и архитектурных проектов.",
    image: planken,
    alt: "Фасад современного дома, облицованный планкеном",
  },
  {
    title: "Бруски и рейки камерной сушки",
    text: "Для строительства, отделки, декора, мебели и дизайнерских решений.",
    image: bruski,
    alt: "Связки брусков и рейки камерной сушки",
  },
];

export type Project = {
  category: string;
  material: string;
  image: string;
  alt: string;
  wide?: boolean;
  tall?: boolean;
};

/** Здесь легко заменить фотографии на реальные объекты. */
export const projects: Project[] = [
  {
    category: "Фасады",
    material: "Планкен, лиственница",
    image: heroHouse,
    alt: "Фасад современного дома из дерева",
    wide: true,
  },
  {
    category: "Террасы",
    material: "Террасная доска",
    image: galTerrace,
    alt: "Деревянная терраса загородного дома на закате",
    tall: true,
  },
  {
    category: "Интерьеры",
    material: "Вагонка, доска пола",
    image: emotion,
    alt: "Интерьер дома с деревянной отделкой и полом",
  },
  {
    category: "Дома",
    material: "Клееный брус, планкен",
    image: galHouse,
    alt: "Современный деревянный дом вечером",
  },
  {
    category: "Лестницы",
    material: "Ступени из массива",
    image: stupeni,
    alt: "Лестница с деревянными ступенями",
  },
  {
    category: "Заборы",
    material: "Планкен, рейка",
    image: galFence,
    alt: "Современный деревянный забор из вертикальной рейки",
  },
  {
    category: "Мебель и детали",
    material: "Мебельный щит",
    image: galFurniture,
    alt: "Мебель из массива дерева в интерьере",
  },
];
