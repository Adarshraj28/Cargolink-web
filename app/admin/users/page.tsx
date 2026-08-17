"use client";

import { useState } from "react";
import { useAppState, setUserStatus } from "@/lib/store";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  useAppState();
  const state = useAppState();
  const [q, setQ] = useState("");

  const users = state.users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        (u.company ?? "").toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h2">Users</h1>
          <p className="mt-1 text-muted">{state.users.length} accounts on the platform.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email or company"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[800px]">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Company</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-[12.5px] text-muted">{u.email}</p>
                  </td>
                  <td><StatusBadge status={u.role} /></td>
                  <td>{u.company ?? "—"}</td>
                  <td><StatusBadge status={u.status} /></td>
                  <td className="text-muted">{formatDate(u.createdAt)}</td>
                  <td>
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => setUserStatus(u.id, u.status === "active" ? "suspended" : "active")}
                        className={`text-[13px] font-semibold ${u.status === "active" ? "text-danger hover:text-danger/80" : "text-success hover:text-success/80"}`}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">No users match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
