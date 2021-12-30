const ls = localStorage;

export const getItemLS = (key) => JSON.parse(ls.getItem(key));

export const setItemLS = (key, value) => ls.setItem(key, JSON.stringify(value));
