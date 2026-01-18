import { Dropzone } from "@/components/Dropzone";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Word Breaker</h1>
        <p className="text-gray-600">
          Retirez les protections d&apos;édition de vos fichiers Word
        </p>
      </div>

      <Dropzone />

      <p className="mt-8 text-sm text-gray-500 max-w-md text-center">
        Supporte les protections: formulaires, lecture seule, commentaires
        uniquement, suivi des modifications
      </p>
    </main>
  );
}
