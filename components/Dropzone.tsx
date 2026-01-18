"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Status = "idle" | "uploading" | "success" | "error";

export function Dropzone() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/unprotect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process file");
      }

      // Get the blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Extract filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "unprotected.docx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus("success");

      // Reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: status === "uploading",
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full max-w-xl p-12 border-2 border-dashed rounded-lg cursor-pointer
        transition-colors duration-200
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
        ${status === "uploading" ? "opacity-50 cursor-wait" : "hover:border-gray-400 hover:bg-gray-100"}
        ${status === "success" ? "border-green-500 bg-green-50" : ""}
        ${status === "error" ? "border-red-500 bg-red-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4 text-center">
        {/* Icon */}
        <div className="text-gray-400">
          {status === "uploading" ? (
            <svg
              className="w-16 h-16 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : status === "success" ? (
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>

        {/* Text */}
        {status === "idle" && (
          <>
            <p className="text-gray-700 font-medium">
              {isDragActive
                ? "Déposez le fichier ici..."
                : "Déposez votre fichier .docx ici"}
            </p>
            <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
          </>
        )}

        {status === "uploading" && (
          <p className="text-gray-700 font-medium">Traitement en cours...</p>
        )}

        {status === "success" && (
          <p className="text-green-700 font-medium">
            Fichier déprotégé avec succès !
          </p>
        )}

        {status === "error" && (
          <p className="text-red-700 font-medium">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
