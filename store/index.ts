import { acceptHMRUpdate, defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const session = ref(null);

  function updateSession({ name, email, expiresIn }) {
    session.value = { name, email, expiresIn };
  }

  function clearSession() {
    session.value = null;
  }

  return { session, updateSession, clearSession };
});

// hmr functionality

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}