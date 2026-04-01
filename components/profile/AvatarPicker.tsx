"use client";

import { getInitials } from "@/lib/profile/getInitials";

interface Props {
  name: string;
  avatarUrl?: string | null;
}

export default function AvatarPicker({ name, avatarUrl }: Props) {
  const initials = getInitials(name);

  return (
    <div className="relative group w-fit">
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="
            w-20 h-20 
            rounded-full 
            object-cover 
            ring-2 ring-border 
            shadow-sm
          "
        />
      ) : (
        <div
          className="
            w-20 h-20 
            rounded-full 
            bg-muted 
            flex items-center justify-center 
            text-xl font-semibold 
            text-muted-foreground 
            ring-2 ring-border
            shadow-sm
          "
        >
          {initials}
        </div>
      )}

      {/* Overlay hover */}
      <div className="
        absolute inset-0 
        rounded-full 
        bg-black/40 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity 
        flex items-center justify-center
      ">
        <span className="text-xs text-white font-medium">
          Change
        </span>
      </div>

      {/* Disabled button (for now hidden visually but accessible) */}
      <button
        disabled
        className="absolute inset-0 cursor-not-allowed opacity-0"
        aria-label="Change avatar"
      />
    </div>
  );
}