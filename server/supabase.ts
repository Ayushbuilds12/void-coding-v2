import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Profile, Project, ChatMessage, Progress, Subscription, BillingHistory } from "../src/types";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  // Fall back to service role key, then anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseClient;
}

export function isSupabaseActive(): boolean {
  return getSupabaseClient() !== null;
}

// --- SECURE SUPABASE AUTH PROXIES ---

export async function supabaseSignUp(email: string, passwordHash: string, fullName: string, educationLevel: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // 1. Sign up user inside Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: passwordHash, // uses passwordHash for security in proxy
      options: {
        data: {
          full_name: fullName,
          education_level: educationLevel
        }
      }
    });

    if (authError || !authData.user) {
      console.error("Supabase signUp error:", authError);
      throw new Error(authError?.message || "Auth sign up failed");
    }

    const userId = authData.user.id;

    // 2. Create profile row in 'profiles' table
    const profile: Profile = {
      id: userId,
      email,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(fullName)}`,
      education_level: educationLevel,
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profile);

    if (profileError) {
      console.error("Supabase upsert profile error:", profileError);
    }

    // 3. Create default subscription row
    const subscription: Subscription = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      plan: "free",
      status: "active",
      razorpay_customer_id: null,
      razorpay_subscription_id: null,
      created_at: new Date().toISOString()
    };

    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert(subscription);

    if (subError) {
      console.error("Supabase default subscription insert error:", subError);
    }

    return {
      token: userId,
      profile
    };
  } catch (error: any) {
    console.error("Supabase SignUp flow exception:", error);
    throw error;
  }
}

export async function supabaseLogin(email: string, passwordHash: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: passwordHash
    });

    if (error || !data.user) {
      console.error("Supabase login error:", error);
      throw new Error(error?.message || "Invalid email or password");
    }

    // Fetch profile
    const { data: profile, error: pError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (pError || !profile) {
      // If profile missing, create it dynamically
      const newProfile: Profile = {
        id: data.user.id,
        email: data.user.email || email,
        full_name: data.user.user_metadata?.full_name || "SaaS Student",
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(email)}`,
        education_level: data.user.user_metadata?.education_level || "Beginner",
        created_at: new Date().toISOString()
      };
      await supabase.from("profiles").upsert(newProfile);
      return { token: data.user.id, profile: newProfile };
    }

    return {
      token: data.user.id,
      profile: profile as Profile
    };
  } catch (error: any) {
    console.error("Supabase Login Exception:", error);
    throw error;
  }
}

export async function supabaseGetProfileAndSubscription(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    let { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!subscription && profile) {
      // Create subscription on the fly if missing
      subscription = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: userId,
        plan: "free",
        status: "active",
        razorpay_customer_id: null,
        razorpay_subscription_id: null,
        created_at: new Date().toISOString()
      };
      await supabase.from("subscriptions").insert(subscription);
    }

    return {
      profile: profile as Profile,
      subscription: subscription as Subscription
    };
  } catch (e) {
    console.error("Supabase Get Profile & Sub Error:", e);
    return null;
  }
}

// --- SECURE SUPABASE DB QUERIES ---

export async function supabaseGetProjects(userId: string): Promise<Project[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("projects").select("*").eq("user_id", userId);
  return (data || []) as Project[];
}

export async function supabaseCreateProject(userId: string, name: string, description: string, title?: string, prompt?: string, generatedCode?: string, deploymentUrl?: string): Promise<Project> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is offline");

  const project: Project = {
    id: Math.random().toString(36).substring(2, 11),
    user_id: userId,
    name,
    title: title || name,
    description,
    status: "active",
    prompt,
    generated_code: generatedCode,
    deployment_url: deploymentUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await supabase.from("projects").insert(project);
  return project;
}

export async function supabaseUpdateProject(
  userId: string,
  projectId: string,
  name?: string,
  description?: string,
  status?: "active" | "completed" | "archived",
  title?: string,
  prompt?: string,
  generatedCode?: string,
  deploymentUrl?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (title !== undefined) {
    updates.title = title;
    if (name === undefined) updates.name = title;
  }
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (prompt !== undefined) updates.prompt = prompt;
  if (generatedCode !== undefined) updates.generated_code = generatedCode;
  if (deploymentUrl !== undefined) updates.deployment_url = deploymentUrl;

  const { data } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .eq("user_id", userId)
    .select()
    .single();

  return data as Project;
}

export async function supabaseDeleteProject(userId: string, projectId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  await supabase.from("chats").delete().eq("project_id", projectId);
  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId);
  return !error;
}

export async function supabaseGetChats(userId: string, projectId: string | null): Promise<ChatMessage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const query = supabase.from("chats").select("*").eq("user_id", userId);
  if (projectId) {
    query.eq("project_id", projectId);
  } else {
    query.is("project_id", null);
  }

  const { data } = await query.order("created_at", { ascending: true });
  return (data || []) as ChatMessage[];
}

export async function supabaseAddChatMessage(userId: string, projectId: string | null, role: "user" | "assistant", message: string): Promise<ChatMessage> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is offline");

  const chat: ChatMessage = {
    id: Math.random().toString(36).substring(2, 11),
    user_id: userId,
    project_id: projectId,
    role,
    message,
    created_at: new Date().toISOString()
  };

  await supabase.from("chats").insert(chat);
  return chat;
}

export async function supabaseClearChats(userId: string, projectId: string | null) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const query = supabase.from("chats").delete().eq("user_id", userId);
  if (projectId) {
    query.eq("project_id", projectId);
  } else {
    query.is("project_id", null);
  }
  await query;
}

export async function supabaseGetProgress(userId: string): Promise<Progress[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("progress").select("*").eq("user_id", userId);
  return (data || []) as Progress[];
}

export async function supabaseUpdateProgress(userId: string, lessonId: string, completionPercentage: number): Promise<Progress> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is offline");

  const now = new Date().toISOString();
  
  // Find current highest progress first
  const { data: existing } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single();

  if (existing) {
    if (completionPercentage > existing.completion_percentage) {
      const updates: any = { completion_percentage: completionPercentage };
      if (completionPercentage >= 100) {
        updates.completed_at = now;
      }
      const { data } = await supabase
        .from("progress")
        .update(updates)
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .select()
        .single();
      return data as Progress;
    }
    return existing as Progress;
  } else {
    const newProgress: Progress = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      lesson_id: lessonId,
      completion_percentage: completionPercentage,
      completed_at: completionPercentage >= 100 ? now : undefined
    };
    await supabase.from("progress").insert(newProgress);
    return newProgress;
  }
}

export async function supabaseUpdateSubscription(userId: string, plan: "free" | "pro", status: "active" | "cancelled" | "none", razorpaySubId?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const updates: any = {
    plan,
    status,
    created_at: new Date().toISOString()
  };

  if (razorpaySubId) {
    updates.razorpay_subscription_id = razorpaySubId;
    updates.razorpay_customer_id = `cust_${Math.random().toString(36).substring(2, 11)}`;
  }

  const { data } = await supabase
    .from("subscriptions")
    .upsert({ user_id: userId, ...updates })
    .select()
    .single();

  return data as Subscription;
}

export async function supabaseGetBillingHistory(userId: string): Promise<BillingHistory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("billing_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return (data || []) as BillingHistory[];
}

export async function supabaseAddBillingHistory(userId: string, amount: number, plan: string, paymentId: string): Promise<BillingHistory> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is offline");

  const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const history: BillingHistory = {
    id: Math.random().toString(36).substring(2, 11),
    user_id: userId,
    amount,
    currency: "INR",
    plan,
    status: "success",
    invoice_id: invoiceId,
    payment_id: paymentId,
    created_at: new Date().toISOString()
  };

  await supabase.from("billing_history").insert(history);
  return history;
}
