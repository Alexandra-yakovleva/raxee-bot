export const shuffleItems = <T>(item: T[]) => {
  const res = [...item];

  for (let i = res.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }

  return res;
};
