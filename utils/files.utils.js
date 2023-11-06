const converInProperFormat = (arr,sheetName) => {
  const header = arr[0];
  const rows = arr.slice(1).map((row, i) => {
    const obj = {};
    header.forEach((header, index) => {
      obj[header] = row[index];
    });
    obj[sheetName+"rowNum"] = i
    return obj;
  });
  return rows;
};

module.exports = { converInProperFormat };
