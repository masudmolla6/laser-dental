// utils/iconMap.js
// MongoDB তে icon component store করা যায় না, তাই doctor document এ "iconKey" string
// রাখা হয় (যেমন "zap"). এই map দিয়ে সেই key থেকে আসল lucide icon component resolve করা হয়।
//
// নতুন specialization/achievement icon লাগলে এখানে নতুন entry add করো,
// সাথে admin form এর icon-picker dropdown এও সেই key যুক্ত করতে হবে।

import {
  Zap,
  Sparkles,
  Shield,
  GraduationCap,
  Heart,
  Stethoscope,
  Users,
  BadgeCheck,
  Award,
  Calendar,
  Building2,
  Star,
  Smile,
  HeartPulse,
  AlignCenter,
  Anchor,
} from "lucide-react";

export const iconMap = {
  zap: Zap,
  sparkles: Sparkles,
  shield: Shield,
  graduationCap: GraduationCap,
  heart: Heart,
  stethoscope: Stethoscope,
  users: Users,
  badgeCheck: BadgeCheck,
  award: Award,
  calendar: Calendar,
  building2: Building2,
  star: Star,
  smile: Smile,
  heartPulse: HeartPulse,
  alignCenter: AlignCenter,
  anchor: Anchor,
};

// Fallback icon — kono iconKey map e na thakle ei icon dekhabe (crash korbe na)
export const getIcon = (key) => iconMap[key] || Stethoscope;

// Admin form e dropdown banate ei list use korte parba
export const iconOptions = Object.keys(iconMap);