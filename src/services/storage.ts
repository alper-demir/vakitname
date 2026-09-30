import Storage from 'expo-sqlite/kv-store';

export const persistence = {
  read: () => Storage.getItem('vakit.state.v1'),
  write: (value: string) => Storage.setItem('vakit.state.v1', value),
};
