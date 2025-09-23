import { Product } from "@/components/ui/product-card";
import lobsterImg from "@/assets/lobster.jpg";
import prawnsImg from "@/assets/prawns.jpg";
import musselsImg from "@/assets/mussels.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Lagosta Fresca",
    price: 45.90,
    image: lobsterImg,
    weight: "400-500g",
    available: true,
    states: ["CRU", "COZIDO"],
    prepTime: "20-25 min",
    description: "Lagosta fresca capturada hoje na costa portuguesa. Ideal para uma refeição especial."
  },
  {
    id: "2", 
    name: "Camarões Tigre",
    price: 24.50,
    image: prawnsImg,
    weight: "500g",
    available: true,
    states: ["CRU", "COZIDO"],
    prepTime: "10-15 min",
    description: "Camarões tigre frescos de primeira qualidade, perfeitos para grelhar ou cozer."
  },
  {
    id: "3",
    name: "Mexilhões da Ria",
    price: 8.90,
    image: musselsImg,
    weight: "1kg",
    available: true,
    states: ["CRU"],
    prepTime: "8-10 min", 
    description: "Mexilhões frescos da Ria de Aveiro, ideais para cataplana ou à bulhão pato."
  },
  {
    id: "4",
    name: "Santola Inteira",
    price: 32.50,
    image: lobsterImg,
    weight: "800g-1kg",
    available: false,
    states: ["CRU", "COZIDO"],
    prepTime: "25-30 min",
    description: "Santola fresca inteira, uma iguaria da gastronomia portuguesa."
  },
  {
    id: "5",
    name: "Lingueirão",
    price: 18.90,
    image: musselsImg,
    weight: "500g",
    available: true,
    states: ["CRU"],
    prepTime: "5-8 min",
    description: "Lingueirão fresco da costa alentejana, perfeito para grelhar na chapa."
  },
  {
    id: "6",
    name: "Polvinho Baby",
    price: 22.90,
    image: prawnsImg,
    weight: "400g",
    available: true,
    states: ["CRU", "COZIDO"],
    prepTime: "15-20 min",
    description: "Polvinho baby fresco e tenro, ideal para saladas ou à lagareiro."
  },
  {
    id: "7",
    name: "Sapateira Pequena",
    price: 15.90,
    image: lobsterImg,
    weight: "300-400g",
    available: true,
    states: ["CRU", "COZIDO"],
    prepTime: "20 min",
    description: "Sapateira pequena fresca, cheia de sabor do mar português."
  },
  {
    id: "8",
    name: "Amêijoas Japonesas",
    price: 12.50,
    image: musselsImg,
    weight: "500g",
    available: true,
    states: ["CRU"],
    prepTime: "5-10 min",
    description: "Amêijoas japonesas frescas, perfeitas para cataplana ou à bulhão pato."
  },
  {
    id: "9",
    name: "Gamba Vermelha",
    price: 38.90,
    image: prawnsImg,
    weight: "300g",
    available: true,
    states: ["CRU"],
    prepTime: "8-12 min",
    description: "Gamba vermelha premium da costa portuguesa, uma verdadeira delícia."
  },
  {
    id: "10",
    name: "Berbigão",
    price: 9.90,
    image: musselsImg,
    weight: "750g",
    available: false,
    states: ["CRU"],
    prepTime: "5-8 min",
    description: "Berbigão fresco da costa atlântica, ideal para acompanhar uma boa francesinha."
  }
];