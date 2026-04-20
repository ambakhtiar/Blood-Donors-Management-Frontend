"use client";

import { useCallback, useRef, useState } from "react";
import { uploadImage, deleteUploadedImage } from "@/services/upload.service";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const MAX_FILES = 3;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UploadedImage {
  url: string;
  publicId: string;
  preview: string; // local object URL for instant preview
}

interface ImageUploaderProps {
  value: string[]; // array of Cloudinary secure_urls
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

function extractPublicId(url: string): string {
  // secure_url format: https://res.cloudinary.com/{cloud}/image/upload/v{ts}/{folder}/{id}.{ext}
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;
  const withVersion = parts[1];
  const withoutVersion = withVersion.replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[^.]+$/, ""); // remove extension
}

export default function ImageUploader({
  value,
  onChange,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    () =>
      value.map((url) => ({ url, publicId: extractPublicId(url), preview: url }))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Validate count
      const remaining = MAX_FILES - uploadedImages.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${MAX_FILES} images allowed`);
        return;
      }
      const toUpload = fileArray.slice(0, remaining);

      // Validate types & sizes
      for (const file of toUpload) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: Only JPEG, PNG, WebP, GIF images allowed`);
          return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name}: File size must be under ${MAX_SIZE_MB}MB`);
          return;
        }
      }

      setUploading(true);
      try {
        const results = await Promise.all(
          toUpload.map(async (file) => {
            const preview = URL.createObjectURL(file);
            const url = await uploadImage(file);
            return {
              url,
              publicId: extractPublicId(url),
              preview,
            };
          })
        );

        const newImages = [...uploadedImages, ...results];
        setUploadedImages(newImages);
        onChange(newImages.map((img) => img.url));
        toast.success(
          `${results.length} image${results.length > 1 ? "s" : ""} uploaded`
        );
      } catch {
        toast.error("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [uploadedImages, onChange]
  );

  const handleRemove = useCallback(
    async (index: number) => {
      const img = uploadedImages[index];
      try {
        await deleteUploadedImage(img.publicId);
      } catch {
        // best-effort delete — don't block UI
      }
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      onChange(newImages.map((i) => i.url));
      URL.revokeObjectURL(img.preview);
    },
    [uploadedImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!disabled && e.dataTransfer.files.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const isFull = uploadedImages.length >= MAX_FILES;

  return (
    <div className="space-y-3">
      {/* Uploaded previews */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {uploadedImages.map((img, i) => (
            <div key={img.url} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                disabled={disabled}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone — hidden when full */}
      {!isFull && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-2
            rounded-xl border-2 border-dashed cursor-pointer
            py-8 px-4 text-center transition-all duration-200
            ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-accent/40"}
            ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />

          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {dragOver ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <Upload className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dragOver ? "Drop images here" : "Click or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  JPEG, PNG, WebP · max {MAX_SIZE_MB}MB each
                </p>
              </div>
            </>
          )}

          {/* Slot counter */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground tabular-nums">
            {uploadedImages.length}/{MAX_FILES}
          </div>
        </div>
      )}

      {/* Full state hint */}
      {isFull && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Maximum {MAX_FILES} images reached. Remove one to add another.
        </div>
      )}
    </div>
  );
}
