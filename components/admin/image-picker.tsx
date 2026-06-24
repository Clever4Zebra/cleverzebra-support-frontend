"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMedia, uploadMedia, deleteMedia } from "@/lib/admin-api";
import type { AdminMedia } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";

interface ImagePickerProps {
  onInsert: (url: string, altText: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePicker({ onInsert, open, onOpenChange }: ImagePickerProps) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<AdminMedia | null>(null);
  const [altText, setAltText] = useState("");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const res = await getMedia(params);
      setMedia(res.data);
    } catch {
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (open && tab === "library") {
      loadMedia();
    }
  }, [open, tab, loadMedia]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMedia(file, altText || undefined);
      toast.success("Image uploaded");
      onInsert(res.data.url, altText || res.data.filename);
      onOpenChange(false);
      resetState();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSelectFromLibrary() {
    if (!selectedMedia) return;
    onInsert(selectedMedia.url, altText || selectedMedia.alt_text || selectedMedia.filename);
    onOpenChange(false);
    resetState();
  }

  async function handleDelete(mediaItem: AdminMedia) {
    if (!confirm("Delete this image permanently?")) return;
    try {
      await deleteMedia(mediaItem.id);
      setMedia((prev) => prev.filter((m) => m.id !== mediaItem.id));
      if (selectedMedia?.id === mediaItem.id) setSelectedMedia(null);
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  }

  function resetState() {
    setSelectedMedia(null);
    setAltText("");
    setSearch("");
    setTab("upload");
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetState(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={tab === "upload" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("upload")}
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant={tab === "library" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("library")}
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            Media Library
          </Button>
        </div>

        {/* Upload Tab */}
        {tab === "upload" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Image File</Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleUpload}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Supported: JPEG, PNG, GIF, WebP, SVG. Max 10MB.
              </p>
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        )}

        {/* Library Tab */}
        {tab === "library" && (
          <div className="flex flex-col gap-3 min-h-0 flex-1 overflow-hidden">
            <Input
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") loadMedia(); }}
            />

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : media.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No images found. Upload one first.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className={`relative group cursor-pointer rounded-md border-2 overflow-hidden aspect-square ${
                        selectedMedia?.id === item.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <img
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center h-6 w-6 rounded bg-destructive text-destructive-foreground"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate">
                        {item.filename}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedMedia && (
              <div className="space-y-2 border-t pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{selectedMedia.filename}</span>
                  <span className="text-muted-foreground">
                    ({formatFileSize(selectedMedia.size)})
                  </span>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lib-alt-text" className="text-xs">Alt Text</Label>
                  <Input
                    id="lib-alt-text"
                    value={altText || selectedMedia.alt_text || ""}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image..."
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "library" && (
          <DialogFooter>
            <Button
              onClick={handleSelectFromLibrary}
              disabled={!selectedMedia}
            >
              Insert Selected Image
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

