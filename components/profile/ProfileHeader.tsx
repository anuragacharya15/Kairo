export default function ProfileHeader() {
  return (
    <div className="flex items-center justify-between">
      {/* Left */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your account settings and subscription
        </p>
      </div>

      {/* Right (future actions) */}
      <div className="hidden md:flex items-center gap-2">
        {/* placeholder for future buttons like logout / edit */}
      </div>
    </div>
  );
}