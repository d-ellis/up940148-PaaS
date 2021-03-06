// Require GCloud Datastore
const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore({ namespace: 'paas-signoff' });

const kind = 'register';

function key(id) {
  return ds.key([kind, id]);
}

async function setEntity(reg, val) {
  const entity = {
    key: key(reg),
    data: { name: reg, val },
  };
  await ds.save(entity);
}

module.exports.get = async (reg) => {
  // Get the register
  const [data] = await ds.get(key(reg));
  // If register doesn't exist:
  if (data === undefined) {
    // Return 0
    return 0;
  }
  return data.val;
};

module.exports.put = async (reg, val) => {
  try {
    await setEntity(reg, val);
  } catch (e) {
    return e;
  }
};

module.exports.post = async (reg, val) => {
  // Get current value
  const [data] = await ds.get(key(reg));
  // If register doesn't exist:
  if (data === undefined) {
    // Create register with value
    try {
      await setEntity(reg, val);
    } catch (e) {
      return e;
    }
  } else {
    // Add value to stored value
    val += data.val;
    // Update register
    try {
      await setEntity(reg, val);
    } catch (e) {
      return e;
    }
  }
  // Return register value
  return val;
};

module.exports.delete = async (reg) => {
  // Delete register
  try {
    await ds.delete(key(reg));
  } catch (e) {
    return e;
  }
};
