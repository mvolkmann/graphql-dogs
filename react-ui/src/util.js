export const getSortedValues = (obj, prop) =>
  Object.values(obj).sort((item1, item2) => {
    const v1 = item1[prop];
    const v2 = item2[prop];
    return v1.localeCompare(v2);
  });

export const isEmptyObject = obj => Object.keys(obj).length === 0;
