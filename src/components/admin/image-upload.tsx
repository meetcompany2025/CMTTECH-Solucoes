import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    existingUrls?: string[];
    onRemoveExisting?: (url: string) => void;
    maxFiles?: number;
    label?: string;
    description?: string;
    accept?: Record<string, string[]>;
}

export function ImageUpload({
    files,
    onFilesChange,
    existingUrls = [],
    onRemoveExisting,
    maxFiles = 1,
    label = 'Imagens',
    description = 'Arraste e solte imagens aqui ou clique para selecionar',
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
}: ImageUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const remainingSlots = maxFiles - existingUrls.length - files.length;
        if (remainingSlots <= 0) return;

        const newFiles = acceptedFiles.slice(0, remainingSlots);
        onFilesChange([...files, ...newFiles]);
    }, [files, existingUrls, maxFiles, onFilesChange]);

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        onFilesChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles - existingUrls.length,
        disabled: existingUrls.length + files.length >= maxFiles
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-foreground">{label}</span>
                {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>

            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
                    ${existingUrls.length + files.length >= maxFiles ? 'opacity-50 cursor-not-allowed hidden' : ''}
                `}
            >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                    {isDragActive ? 'Solte as imagens aqui...' : 'Arraste & Solte ou Clique para Selecionar'}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing URLs */}
                {existingUrls.map((url, index) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);
                    return (
                        <div key={`existing-${index}`} className="relative group aspect-square rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                            {isVideo ? (
                                <div className="flex flex-col items-center gap-1">
                                    <Upload className="h-8 w-8 text-primary" />
                                    <span className="text-[10px] text-muted-foreground">Vídeo</span>
                                </div>
                            ) : (
                                <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                            )}
                            {onRemoveExisting && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onRemoveExisting(url)}
                                    type="button"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">Atual</div>
                        </div>
                    );
                })}

                {/* New Files */}
                {files.map((file, index) => {
                    const isVideo = file.type.startsWith('video/');
                    return (
                        <div key={`new-${index}`} className="relative group aspect-square rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                            {isVideo ? (
                                <div className="flex flex-col items-center gap-1">
                                    <Upload className="h-8 w-8 text-primary" />
                                    <span className="text-[10px] text-muted-foreground">Vídeo Novo</span>
                                </div>
                            ) : (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                />
                            )}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(index)}
                                type="button"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">Novo</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
