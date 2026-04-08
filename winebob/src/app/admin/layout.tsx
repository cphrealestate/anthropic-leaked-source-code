import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wine, Users, FileText, Settings, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/producers");

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Sidebar */}
      <aside className="w-[200px] flex-shrink-0 bg-white border-r border-card-border/30 flex flex-col">
        <div className="px-4 pt-4 pb-3 border-b border-card-border/20">
          <Link href="/" className="text-[13px] font-bold text-cherry" style={{ fontFamily: "Georgia, serif" }}>Winebob</Link>
          <span className="ml-1.5 text-[8px] font-bold text-white bg-cherry/80 px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>
        </div>
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          <SideLink href="/admin/producers" icon={<Users className="h-3.5 w-3.5" />} label="Producers" />
          <SideLink href="/admin/wines" icon={<Wine className="h-3.5 w-3.5" />} label="Wines" />
          <SideLink href="/admin/applications" icon={<FileText className="h-3.5 w-3.5" />} label="Applications" />
        </nav>
        <div className="px-4 py-3 border-t border-card-border/20">
          <p className="text-[10px] text-muted truncate">{session.user.email}</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function SideLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[5px] text-[11px] font-medium text-foreground/70 hover:bg-butter hover:text-foreground transition-colors">
      {icon} {label}
    </Link>
  );
}
