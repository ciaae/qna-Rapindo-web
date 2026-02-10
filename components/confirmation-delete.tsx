import { Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmationDeleteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel: () => void
    isDeleting?: boolean
    title?: string
    description?: string
    previewText?: string
}

export function ConfirmationDelete({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    isDeleting = false,
    title = 'Hapus Item',
    description = 'Apakah Anda yakin ingin menghapus item ini?',
    previewText,
}: ConfirmationDeleteProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            {description}
                            {previewText && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <p className="text-sm font-medium text-slate-900">
                                        "{previewText}"
                                    </p>
                                </div>
                            )}
                            <p className="mt-3 text-sm">
                                Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}