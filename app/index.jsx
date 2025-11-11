import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsLogged(!!u);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return null;

  return <Redirect href={isLogged ? "/home" : "/(auth)/login"} />;
}
