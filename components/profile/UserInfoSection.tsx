"use client";

import { useState } from "react";
import AvatarPicker from "./AvatarPicker";
import type { UserProfile } from "@/lib/types/user";
import { Button } from "../ui/button";
import { updateUserProfile } from "@/lib/profile/getUserProfile";

interface Props {
  user: UserProfile;
}

export default function UserInfoSection({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const isChanged = name !== user.name;

  async function handleSave() {
    try {
      setSaving(true);

      await updateUserProfile(user.id, name);

      user.name = name;
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="
        rounded-2xl 
        border 
        bg-card 
        shadow-sm 
        hover:shadow-md 
        transition-shadow
        p-6 
        space-y-6
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          User Info
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile details
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Content */}
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <AvatarPicker
          name={name}
          avatarUrl={user.avatar_url}
        />

        {/* Form */}
        <div className="flex-1 max-w-sm space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Display Name
            </label>

            <input
              className="
                w-full 
                rounded-lg 
                border 
                bg-background 
                px-3 py-2 
                text-sm 
                outline-none 
                focus:ring-2 
                focus:ring-primary/30 
                transition
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={saving || !isChanged}
              className="text-sm font-medium"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>

            {isChanged && !saving && (
              <span className="text-xs text-muted-foreground">
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}