// Web is a review surface. Native persistence uses expo-sqlite/kv-store.
export const persistence = {
  read: async () => typeof localStorage === 'undefined' ? null : localStorage.getItem('vakit.state.v1'),
  write: async (value: string) => { localStorage.setItem('vakit.state.v1', value); },
};
