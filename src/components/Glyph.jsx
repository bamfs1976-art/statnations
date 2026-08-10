import {
  Trophy, Medal, Award, Crown, Star, Flame, Zap, Target, BarChart3, TrendingUp,
  TrendingDown, Calendar, CalendarDays, ClipboardList, Globe2, Flag, MapPin,
  Users, Swords, Activity, Bike, Mic2, Snowflake, Vote, Atom, Settings, Bird,
  AlertTriangle, RefreshCw, Check, X, Minus, Plus, BookOpen, Library, Share2,
  Link2, Tv, FlaskConical, Stethoscope, Plane, CircleDot, Volleyball, Dumbbell,
  Shield, Circle, Leaf, PawPrint, Shirt, Handshake, ScrollText, FileText,
  Castle, Search, Hourglass, Wind, GraduationCap, StickyNote, Home, Copyright,
  Sparkles, Footprints, Mountain, ArrowRight,
} from 'lucide-react';

/**
 * One place that turns the emoji still living in data tables into real SVGs.
 *
 * Emoji render as tofu boxes wherever the platform has no emoji font, and their
 * size, colour and baseline are outside our control. Rather than rewrite every
 * data literal in the app, the values are resolved here at render time: pass the
 * emoji (or a name like "trophy") and get a lucide icon back.
 */
const MAP = {
  '🏆': Trophy, '🥇': Medal, '🏅': Award, '👑': Crown, '★': Star, '🌟': Star,
  '🔥': Flame, '⚡': Zap, '🎯': Target, '📊': BarChart3, '📈': TrendingUp,
  '📉': TrendingDown, '💪': Dumbbell, '📅': Calendar, '🗓': CalendarDays,
  '📆': CalendarDays, '📋': ClipboardList, '🌍': Globe2, '🌐': Globe2,
  '🏳': Flag, '🏴': Flag, '🏟': MapPin, '👥': Users, '⚔': Swords, '⚔️': Swords,
  '🏃': Activity, '🚴': Bike, '🎤': Mic2, '❄️': Snowflake,
  '🗳': Vote, '⚛': Atom, '⚙': Settings, '🕊': Bird, '⚠': AlertTriangle,
  '⚠️': AlertTriangle, '🔄': RefreshCw, '✅': Check, '❌': X, '➖': Minus,
  '➕': Plus, '📖': BookOpen, '📚': Library, '📤': Share2, '🔗': Link2,
  '📺': Tv, '🧪': FlaskConical, '🩺': Stethoscope, '✈️': Plane,
  '⚽': CircleDot, '🏉': Volleyball, '🏈': Volleyball, '🏏': Shield,
  '🏑': Shield, '🥍': Shield, '🎾': CircleDot,
  // Rugby and Olympic module tabs
  '🍂': Leaf, '🦁': PawPrint, '🛡️': Shield, '🛡': Shield, '🤯': Zap,
  '🧑‍🏫': GraduationCap, '🎽': Shirt, '🤝': Handshake, '🤼': Users,
  '📜': ScrollText, '📝': StickyNote, '📄': FileText, '🏰': Castle,
  '🔍': Search, '⏳': Hourglass, '💨': Wind, '🏠': Home, '©️': Copyright,
  '⭐': Star, '🟢': Circle, '🔜': ArrowRight, '🎿': Mountain, '⛷️': Mountain,
  '🥈': Medal, '🥉': Medal, '✨': Sparkles, '🦶': Footprints, '🇪🇺': Globe2,
};

/* Regional-indicator pairs (🇫🇷, 🇦🇺 …) and the tag-sequence flags for England,
   Scotland and Wales all resolve to the same neutral flag mark: the nation is
   always named right next to it. */
const FLAG_SEQ = /^(?:[\u{1F1E6}-\u{1F1FF}]{1,2}|\u{1F3F4}[\u{E0000}-\u{E007F}]+)$/u;

/* Resolve any emoji-ish value to a lucide component; unknown values fall back. */
function glyphFor(value) {
  if (!value || typeof value !== 'string') return null;
  if (MAP[value]) return MAP[value];
  if (FLAG_SEQ.test(value)) return Flag;
  return MAP[value.replace(/️/g, '')] || null;
}

/**
 * Renders `value` as an icon. Decorative by default — every call site in this app
 * puts the label next to it, so the icon carries no information of its own.
 */
export default function Glyph(props) {
  const size = props.size || 16;
  // Member access rather than a local alias: the linter treats an aliased
  // component as one created during render.
  const resolved = { Icon: glyphFor(props.value) };
  if (!resolved.Icon) {
    if (props.fallback === false) return null;
    resolved.Icon = Circle;
  }
  return <resolved.Icon size={size} aria-hidden="true"
    style={{ color: props.color || 'currentColor', flexShrink: 0, ...props.style }} />;
}
