import { getCurrentUser } from "@/lib/auth/server";
import { UserMenuDropdown } from "./user-menu-dropdown";

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <UserMenuDropdown id={user.id} name={user.name} email={user.email} />;
}
