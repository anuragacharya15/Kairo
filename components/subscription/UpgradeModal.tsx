"use client";

import { Dialog } from "@headlessui/react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Upgrade Required",
  message = "You’ve reached the limit for your current plan.",
}: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-7 flex flex-col items-center text-center gap-5">

          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl" />
            <div className="relative p-4 rounded-full bg-yellow-100">
              <Crown className="text-yellow-600" size={28} />
            </div>
          </div>

          {/* Title */}
          <Dialog.Title className="text-xl font-semibold tracking-tight">
            {title}
          </Dialog.Title>

          {/* Message */}
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {message}
          </p>

          {/* Features (visual only, no logic) */}
          <div className="w-full rounded-xl border bg-muted/30 p-4 text-left text-sm space-y-2">
            <p className="font-medium">Pro benefits:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Unlimited courses & topics</li>
              <li>• Share roadmaps with others</li>
              <li>• Cloud whiteboard sync</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <Button
              className="w-full font-medium"
              onClick={() => (window.location.href = "/billing")}
            >
              Upgrade to Pro 🚀
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onClose}
            >
              Maybe later
            </Button>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}