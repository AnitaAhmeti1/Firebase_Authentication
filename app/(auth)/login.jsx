import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

function mapFirebaseError(err) {
  const code = err?.code || "";
  const msg = (err?.message || "").toLowerCase();

  
  if (code === "auth/popup-closed-by-user") {
    return "You closed the Google login popup. Try again.";
  }
  if (code === "auth/cancelled-popup-request") {
    return "Another login popup was opened. Close it and try again.";
  }
  if (code === "auth/popup-blocked") {
    return "Your browser blocked the Google popup. Allow pop-ups and try again.";
  }
  if (code === "auth/unauthorized-domain" || msg.includes("unauthorized domain")) {
    return "Unauthorized domain. Add your domain in Firebase → Authentication → Authorized domains.";
  }

  
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Incorrect email or password.";
  }
  if (code === "auth/user-not-found") {
    return "No account found with this email.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again later.";
  }

  return "Something went wrong. Please try again.";
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim() || !password.trim()) return "Both fields are required.";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email)) return "Email format is not valid.";
    return "";
  };

  const onEmailLogin = async () => {
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (e) {
      setErr(mapFirebaseError(e));
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setErr("");
    setLoading(true);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, googleProvider);
      router.replace("/home");
    } catch (e) {
      setErr(mapFirebaseError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Use your account details</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!err && <Text style={styles.error}>{err}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={onEmailLogin} disabled={loading}>
          <Text style={styles.primaryText}>{loading ? "Signing in..." : "Login"}</Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />

        <TouchableOpacity style={styles.googleBtn} onPress={onGoogleLogin} disabled={loading}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")} style={{ marginTop: 14 }}>
          <Text style={styles.link}>Don't have an account? Create one</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 420, backgroundColor: "white", padding: 22, borderRadius: 16, elevation: 3 },
  title: { fontSize: 26, fontWeight: "800", color: "#111827" },
  subtitle: { color: "#6B7280", marginBottom: 16, marginTop: 2 },
  input: { width: "100%", backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  primaryBtn: { backgroundColor: "#111827", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "white", fontWeight: "700" },
  googleBtn: { backgroundColor: "white", borderWidth: 1, borderColor: "#E5E7EB", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  googleText: { color: "#111827", fontWeight: "700" },
  link: { color: "#2563EB", fontWeight: "600", textAlign: "center" },
  error: { color: "#DC2626", marginBottom: 6 },
});
