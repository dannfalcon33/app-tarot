import { Suspense } from "react";
import { TarotReadingRoom } from "../page";

interface SessionReadingPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionReadingPage({
  params,
}: SessionReadingPageProps) {
  const { sessionId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-purple-200">
          Recuperando tu sesión ritual de Universe Tarot...
        </div>
      }
    >
      <TarotReadingRoom routeSessionId={sessionId} />
    </Suspense>
  );
}

