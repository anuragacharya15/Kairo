import { formatDate } from "@/lib/profile/formatDate";
import { getProviderLabel } from "@/lib/profile/getProviderLabel";
import { UserAccountInfo } from "@/lib/types/user";

interface Props {
  user: UserAccountInfo;
}

interface InfoRowProps {
  label: string;
  value: string;
}

export default function AccountInfoSection({ user }: Props) {
  return (
    <section className="
      rounded-2xl 
      border 
      bg-card 
      shadow-sm 
      hover:shadow-md 
      transition-shadow
      p-6 
      space-y-5
    ">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Account Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Your account details and login info
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Info */}
      <div className="flex flex-col gap-3">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Provider" value={getProviderLabel(user.provider)} />
        <InfoRow label="Joined" value={formatDate(user.created_at)} />
      </div>
    </section>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="
      flex items-center justify-between 
      text-sm 
      py-2 px-2 
      rounded-md 
      hover:bg-muted/40 
      transition-colors
    ">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}