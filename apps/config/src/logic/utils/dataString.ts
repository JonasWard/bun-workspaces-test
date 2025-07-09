export const getDateString = () => {
  const now = new Date();
  return `${now.getFullYear().toString().slice(2)}.${now.getMonth() + 1}.${now.getDate()}`;
};
