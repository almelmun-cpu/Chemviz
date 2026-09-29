
const fs = require('fs');
let code = fs.readFileSync('server/services/pubchem.js', 'utf8');

const newCode = \sync function fetchDescription(cid) {
  try {
    const res = await axios.get(\\\\\\/compound/cid/\\\/description/JSON\\\, { timeout: 3000 });
    const infoList = res.data?.InformationList?.Information || [];
    const desc = infoList.find(i => i.Description)?.Description;
    return desc || null;
  } catch (err) {
    return null;
  }
}

\;

code = code.replace('/**\n * Attach 3D (or 2D) coordinates', newCode + '/**\n * Attach 3D (or 2D) coordinates');

code = code.replace('result = await attach3DData(result, cid);\n  return result;', 'result = await attach3DData(result, cid);\n  result.description = await fetchDescription(cid);\n  return result;');

code = code.replace('result = await attach3DData(result, cid);\n\n  return result;', 'result = await attach3DData(result, cid);\n  result.description = await fetchDescription(cid);\n  return result;');

fs.writeFileSync('server/services/pubchem.js', code);
console.log('done');

