import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type UploadedFile = {
    url: string;
    name?: string;
};

export interface FileUploadProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
    isImage?: boolean;
    label?: string;
    description?: string;
    previewType?: "image" | "document";
    height?: string;
    width?: string;
}

export function FileUpload({
    id,
    value,
    onChange,
    accept = "*",
    maxSize = 2, // Default 2MB
    className = "",
    isImage = false,
    label,
    description,
    previewType = "document",
    height = "h-24",
    width = "w-full",
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error("File too large", {
                description: `Please upload a file smaller than ${maxSize}MB`,
            });
            return;
        }

        // For image types, validate that they are images
        if (isImage && !file.type.startsWith("image/")) {
            toast.error("Invalid file type", {
                description: "Please upload an image file (JPEG, PNG)",
            });
            return;
        }

        // For PDF documents, validate they are PDF or images
        if (
            accept.includes(".pdf") &&
            !(file.type.startsWith("image/") || file.type === "application/pdf")
        ) {
            toast.error("Invalid file type", {
                description: "Please upload an image or PDF file",
            });
            return;
        }

        try {
            setIsUploading(true);

            // Create form data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("documentType", id);

            // Upload the file to your API endpoint using fetch
            const response = await fetch(
                "https://phd.geu.ac.in/form/uploadFile",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Upload failed with status: ${response.status}`
                );
            }

            const data = await response.json();
            const fileUrl = data.url;

            if (!fileUrl) {
                throw new Error("No URL returned from server");
            }

            // Update with the URL from the server
            onChange(fileUrl);
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Upload failed", {
                description:
                    "There was a problem uploading your file. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        onChange("");
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {label && (
                <div className="text-center">
                    <h3 className="font-medium">{label}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {value ? (
                <div
                    className={`relative ${height} ${width} overflow-hidden rounded-md border`}
                >
                    {previewType === "image" ? (
                        <img
                            src={value}
                            alt="Preview"
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                            <span className="font-medium text-green-600">
                                File Uploaded
                            </span>
                        </div>
                    )}
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
                        onClick={clearFile}
                    >
                        ✕
                    </Button>
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute left-2 top-2 p-1 bg-slate-200 rounded hover:bg-slate-300"
                    >
                        View
                    </a>
                </div>
            ) : (
                <div
                    className={`flex ${height} ${width} items-center justify-center rounded-md border border-dashed cursor-pointer ${
                        dragOver ? "border-primary bg-primary/10" : ""
                    } ${isUploading ? "opacity-50" : ""}`}
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-1 text-center">
                        {isUploading ? (
                            <span className="text-xs text-muted-foreground">
                                Uploading...
                            </span>
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                Drop file here or click to upload
                            </span>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept={accept}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            id={id}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
