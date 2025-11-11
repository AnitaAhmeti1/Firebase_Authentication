export const options = { headerShown: false };

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState, useMemo } from "react";
import { auth } from "../firebase";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/(auth)/login");
      else setUser(u);
    });
    return unsub;
  }, [router]);

  const displayName = useMemo(() => {
    if (!user) return "";
    if (user.displayName && user.displayName.trim().length > 0) return user.displayName;
    const local = (user.email || "User").split("@")[0];
    
    return local
      .replace(/[._-]+/g, " ")
      .split(" ")
      .map(s => s ? s[0].toUpperCase() + s.slice(1) : s)
      .join(" ");
  }, [user]);

  const initial = useMemo(() => (displayName ? displayName[0].toUpperCase() : "U"), [displayName]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greet}>Welcome</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
        </View>

        <View style={{ height: 16 }} />

        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#F3F4F6" },
  card: { width: "100%", maxWidth: 520, backgroundColor: "white", padding: 22, borderRadius: 16, elevation: 3 },
  row: { flexDirection: "row", alignItems: "center" },
  greet: { color: "#6B7280", fontWeight: "600", fontSize: 14 },
  name: { fontSize: 24, fontWeight: "800", color: "#111827" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: "white", fontSize: 20, fontWeight: "800" },
  btn: { backgroundColor: "#111827", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
});
