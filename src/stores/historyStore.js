import { useAuthStore } from "@/stores/auth";
import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", () => {
  function formatDate(value) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch (e) {
      return value;
    }
  }

  function opponentName(g) {
    const auth = useAuthStore();
    const meId = auth.currentUser?.id;
    if (!meId) return "-";
    if (g.player1 && g.player1.id === meId)
      return g.player2?.nickname || `#${g.player2_user_id}`;
    return g.player1?.nickname || `#${g.player1_user_id}`;
  }

  function resultLabel(g) {
    const auth = useAuthStore();
    if (g.is_draw) return "Draw";
    if (!g.winner_user_id) return "—";
    return g.winner_user_id === auth.currentUser?.id ? "Victory" : "Defeat";
  }

  function resultClass(g) {
    const label = resultLabel(g);
    if (label === "Victory") return "text-green-600 font-semibold";
    if (label === "Defeat") return "text-red-600 font-semibold";
    return "text-slate-600";
  }

  function humanizeSeconds(sec) {
    if (sec == null || isNaN(sec)) return "—";
    sec = Number(sec);
    if (sec <= 0) return "0s";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const parts = [];
    if (h) parts.push(h + "h");
    if (m) parts.push(m + "m");
    if (s || parts.length === 0) parts.push(s + "s");
    return parts.join(" ");
  }

  function formatDuration(g) {
    // prefer total_time if available (assume seconds)
    if (
      g.total_time !== undefined &&
      g.total_time !== null &&
      g.total_time !== ""
    ) {
      return humanizeSeconds(g.total_time);
    }
    if (g.began_at && g.ended_at) {
      try {
        const b = new Date(g.began_at);
        const e = new Date(g.ended_at);
        if (!isNaN(b.getTime()) && !isNaN(e.getTime())) {
          const diff = Math.max(
            0,
            Math.round((e.getTime() - b.getTime()) / 1000)
          );
          return humanizeSeconds(diff);
        }
      } catch (e) {}
    }
    return "—";
  }
  return { formatDate, opponentName, resultLabel, resultClass, formatDuration };
});
