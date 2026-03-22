import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, XCircle, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

const ROLE_COLORS: Record<string, string> = {
  artist: "#C8FF3E",
  promoter: "#FF5C8A",
  venue: "#FFB83E",
  production: "#7B5CF0",
  photo_video: "#3EC8FF",
  admin: "#FF5C5C",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });

  const filtered = users?.filter(u => {
    if (search && !u.display_name?.toLowerCase().includes(search.toLowerCase()) && !u.user_id?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (planFilter !== "all" && u.subscription_plan !== planFilter) return false;
    if (verifiedFilter === "verified" && !u.is_verified) return false;
    if (verifiedFilter === "unverified" && u.is_verified) return false;
    return true;
  }) ?? [];

  const toggleVerify = async (userId: string, current: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_verified: !current }).eq("user_id", userId);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(!current ? "User verified" : "Verification removed");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const changePlan = async (userId: string, plan: string) => {
    const { error } = await supabase.from("profiles").update({ subscription_plan: plan }).eq("user_id", userId);
    if (error) { toast.error("Failed to update plan"); return; }
    toast.success(`Plan changed to ${plan}`);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const toggleAdmin = async (userId: string) => {
    // Check if user already has admin role
    const { data: existing } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    // We need to use edge function since only service_role can insert/delete user_roles
    const { error } = await supabase.functions.invoke("admin-claim-action", {
      body: { action: existing ? "remove_admin" : "grant_admin", user_id: userId },
    });
    if (error) { toast.error("Failed to update admin role"); return; }
    toast.success(existing ? "Admin role removed" : "Admin role granted");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const toggleSuspend = async (userId: string, current: boolean) => {
    const { error } = await supabase.from("profiles").update({ suspended: !current } as any).eq("user_id", userId);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(!current ? "User suspended" : "User unsuspended");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const deleteUser = async (userId: string, displayName: string) => {
    if (!confirm(`Delete ${displayName || "this user"}? This cannot be undone.`)) return;
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("User deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <div>
      <h1 className="font-syne font-bold text-xl text-[#F0F2F7] mb-6 lowercase">users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6478]" />
          <Input
            placeholder="search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#0E1420] border-white/[0.06] text-[#F0F2F7] text-xs h-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32 bg-[#0E1420] border-white/[0.06] text-xs h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all roles</SelectItem>
            <SelectItem value="artist">artist</SelectItem>
            <SelectItem value="promoter">promoter</SelectItem>
            <SelectItem value="venue">venue</SelectItem>
            <SelectItem value="production">production</SelectItem>
            <SelectItem value="photo_video">photo/video</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-28 bg-[#0E1420] border-white/[0.06] text-xs h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all plans</SelectItem>
            <SelectItem value="free">free</SelectItem>
            <SelectItem value="pro">pro</SelectItem>
            <SelectItem value="agency">agency</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
          <SelectTrigger className="w-32 bg-[#0E1420] border-white/[0.06] text-xs h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all status</SelectItem>
            <SelectItem value="verified">verified</SelectItem>
            <SelectItem value="unverified">unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-[11px] text-[#5A6478] mb-3 font-display">{filtered.length} users</p>

      {/* Table */}
      <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[#5A6478] font-display font-normal lowercase">user</th>
                <th className="text-left px-4 py-3 text-[#5A6478] font-display font-normal lowercase">role</th>
                <th className="text-left px-4 py-3 text-[#5A6478] font-display font-normal lowercase">plan</th>
                <th className="text-left px-4 py-3 text-[#5A6478] font-display font-normal lowercase">verified</th>
                <th className="text-left px-4 py-3 text-[#5A6478] font-display font-normal lowercase">joined</th>
                <th className="text-right px-4 py-3 text-[#5A6478] font-display font-normal lowercase">actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#1C2535] flex items-center justify-center text-[10px] font-bold text-[#8892A4]">
                          {(u.display_name || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-[#F0F2F7] font-medium flex items-center gap-1">
                          {u.display_name || "unnamed"}
                          {(u as any).suspended && <Badge variant="destructive" className="text-[8px] px-1 py-0">suspended</Badge>}
                        </p>
                        <p className="text-[10px] text-[#5A6478]">{u.city}{u.state ? `, ${u.state}` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] border-white/[0.1]" style={{ color: ROLE_COLORS[u.role ?? ""] ?? "#8892A4" }}>
                      {u.role || "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={u.subscription_plan || "free"} onValueChange={v => changePlan(u.user_id, v)}>
                      <SelectTrigger className="w-20 h-6 text-[10px] bg-transparent border-white/[0.08]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">free</SelectItem>
                        <SelectItem value="pro">pro</SelectItem>
                        <SelectItem value="agency">agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVerify(u.user_id, !!u.is_verified)} className="transition-colors active:scale-95">
                      {u.is_verified ? <CheckCircle className="w-4 h-4 text-[#3EFFBE]" /> : <XCircle className="w-4 h-4 text-[#5A6478]" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[#8892A4]">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => toggleSuspend(u.user_id, !!(u as any).suspended)}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {(u as any).suspended ? "unsuspend" : "suspend"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px] text-[#FF5C5C] hover:text-[#FF5C5C]"
                        onClick={() => deleteUser(u.user_id, u.display_name || "")}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#5A6478]">no users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
