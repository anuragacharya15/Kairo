import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInfoSection from "@/components/profile/UserInfoSection";
import BillingSection from "@/components/profile/BillingSection";
import AccountInfoSection from "@/components/profile/AccountInfoSection";
import { getUserProfile } from "@/lib/profile/getUserProfile";
import {
  normalizeSubscription,
  normalizeAccountInfo,
} from "@/lib/profile/normalizeProfile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfileContent() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) redirect("/auth/login");

  const profile = await getUserProfile(
    session.user.id,
    session.access_token
  );

  const userInfo = {
    id: session.user.id,
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatar_url,
  };

  const subscription = normalizeSubscription(profile.subscription);
  const accountInfo = normalizeAccountInfo(profile);

  return (
    <div className="flex-1 px-6 md:px-10 py-8 md:py-10 bg-muted/30 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <ProfileHeader />

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserInfoSection user={userInfo} />
          <BillingSection subscription={subscription} />
        </div>

        {/* Bottom Section */}
        <AccountInfoSection user={accountInfo} />

      </div>
    </div>
  );
}