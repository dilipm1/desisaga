import { useEffect, useState } from "react";

export interface Festival {
  id: string;
  name: string;
  date: string;
  ritual: string;
  items: string[];
  category: string;
}

export const DATED_FESTIVALS: Festival[] = [
  {
    id: "raksha-bandhan",
    name: "Raksha Bandhan",
    date: "2026-08-22",
    ritual: "The rakhi you tie for a sibling",
    items: ["rakhi", "roli-chawal", "sweets", "a card in your words"],
    category: "Raksha Bandhan",
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    date: "2026-08-26",
    ritual: "Welcoming Bappa home",
    items: ["eco idol", "modak", "durva grass", "aarti book"],
    category: "Ganesh Chaturthi",
  },
  {
    id: "navratri",
    name: "Navratri",
    date: "2026-10-15",
    ritual: "Nine nights of the goddess",
    items: ["dandiya", "chunri", "puja samagri", "Durga idol"],
    category: "Navratri",
  },
  {
    id: "diwali",
    name: "Diwali",
    date: "2026-11-08",
    ritual: "The festival of lights",
    items: ["clay diyas", "rangoli", "sweets box", "aarti thali"],
    category: "Diwali",
  },
  {
    id: "holi",
    name: "Holi",
    date: "2027-03-04",
    ritual: "The festival of colours",
    items: ["organic gulaal", "gujiya", "thandai mix"],
    category: "Holi",
  },
];

export const ANYTIME_RITUALS: Festival[] = [
  {
    id: "wedding",
    name: "Wedding",
    date: "",
    ritual: "A shagun for the couple",
    items: ["mangalsutra", "sindoor", "shagun envelope"],
    category: "Wedding",
  },
  {
    id: "housewarming",
    name: "Housewarming",
    date: "",
    ritual: "Aashirwad for the new home",
    items: ["Ganesh idol", "kalash", "coconut", "toran"],
    category: "Housewarming",
  },
  {
    id: "puja",
    name: "Puja",
    date: "",
    ritual: "A thali for everyday worship",
    items: ["brass thali", "camphor", "kumkum", "puja guide"],
    category: "Puja",
  },
];

export function getDaysLeft(date: string, from: Date = new Date()): number {
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDateLabel(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function getNextFestival(from: Date = new Date()): { festival: Festival; daysLeft: number } | null {
  for (const f of DATED_FESTIVALS) {
    const daysLeft = getDaysLeft(f.date, from);
    if (daysLeft >= 0) {
      return { festival: f, daysLeft };
    }
  }
  return null;
}

export function useToday() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const id = setTimeout(() => setToday(new Date()), 1000 * 60 * 30);
    return () => clearTimeout(id);
  }, []);

  return today;
}

export function useNextFestival() {
  const today = useToday();
  return getNextFestival(today);
}
