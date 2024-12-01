"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  infoText?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  loading?: boolean;
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  infoText,
  children,
  onSubmit,
  submitText = "Save Changes",
  loading = false
}: ModalFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {infoText && (
            <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700">{infoText}</p>
            </div>
          )}
          
          {children}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            {onSubmit && (
              <Button onClick={onSubmit} disabled={loading}>
                {loading ? "Saving..." : submitText}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 