"use client";

import CinematicFocus from "@/components/focus/cinematic-focus";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DeepFocusPage() {
  return (
    <ProtectedRoute>
      <CinematicFocus />
    </ProtectedRoute>
  );
}
