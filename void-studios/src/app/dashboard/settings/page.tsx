"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import { clientAuth } from "@/lib/firebase/client";
import { authErrorMessage } from "@/lib/firebase-errors";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [savingName, setSavingName] = React.useState(false);
  const [savingEmail, setSavingEmail] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const saveName = async () => {
    if (!clientAuth.currentUser) return;
    setSavingName(true);
    try {
      await updateProfile(clientAuth.currentUser, { displayName: name });
      await apiFetch("/api/account", { method: "PATCH", body: JSON.stringify({ name }) });
      toast.success("Name updated");
      router.refresh();
    } catch (e) {
      toast.error(authErrorMessage(e));
    } finally {
      setSavingName(false);
    }
  };

  const saveEmail = async () => {
    if (!clientAuth.currentUser) return;
    setSavingEmail(true);
    try {
      await updateEmail(clientAuth.currentUser, email);
      await apiFetch("/api/account", { method: "PATCH", body: JSON.stringify({ email }) });
      toast.success("Email updated");
      router.refresh();
    } catch (e) {
      toast.error(authErrorMessage(e));
    } finally {
      setSavingEmail(false);
    }
  };

  const savePassword = async () => {
    if (!clientAuth.currentUser) return;
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(clientAuth.currentUser, password);
      setPassword("");
      toast.success("Password updated");
    } catch (e) {
      toast.error(authErrorMessage(e));
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await apiFetch("/api/account", { method: "DELETE" });
      if (clientAuth.currentUser) {
        try {
          await deleteUser(clientAuth.currentUser);
        } catch {
          // If reauth is required, the server data is already purged; sign out.
        }
      }
      await logout();
      toast.success("Account deleted");
      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error(authErrorMessage(e));
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account profile and security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={saveName} disabled={savingName}>{savingName ? "Saving…" : "Save name"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email</CardTitle>
          <CardDescription>Changing your email may require a recent login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={saveEmail} disabled={savingEmail}>{savingEmail ? "Saving…" : "Update email"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>Set a new password (recent login may be required).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <Button onClick={savePassword} disabled={savingPassword}>
            {savingPassword ? "Saving…" : "Update password"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="text-base text-primary">Danger zone</CardTitle>
          <CardDescription>Permanently delete your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently deletes your account, projects, generated assets and billing
            history. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteAccount} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
