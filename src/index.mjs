const TIMESTAMP = Math.floor(Date.now() / 3600000);

export const ORDER_KEY_ID = `__object_order_${TIMESTAMP}__`;

const ORDER_KEY = Symbol.for(ORDER_KEY_ID);
const STRINGIFIED_ORDER_KEY = String(ORDER_KEY);

const traps = {
  defineProperty(target, key, descriptor) {
    if (key === ORDER_KEY) {
      descriptor.value.push(ORDER_KEY);
    } else if (!(key in target) && ORDER_KEY in target) {
      target[ORDER_KEY].push(key);
    }

    return Reflect.defineProperty(target, key, descriptor);
  },

  deleteProperty(target, key) {
    const deleted = Reflect.deleteProperty(target, key);

    if (deleted && key in target && ORDER_KEY in target) {
      const index = target[ORDER_KEY].indexOf(key);
      if (index !== -1) {
        target[ORDER_KEY].splice(index, 1);
      }
    }

    return deleted;
  },

  ownKeys(target) {
    if (ORDER_KEY in target) {
      return target[ORDER_KEY];
    }

    return Reflect.ownKeys(target);
  },

  set(target, key, value) {
    const hasKey = key in target;
    const set = Reflect.set(target, key, value);

    if (set && !hasKey && ORDER_KEY in target) {
      target[ORDER_KEY].push(key);
    }

    return set;
  },
};

export default function createObj(target, order = Reflect.ownKeys(target)) {
  const t = new Proxy(target, traps);
  setOrder(t, order);
  return t;
}

export function setOrder(target, order) {
  if (ORDER_KEY in target) {
    target[ORDER_KEY].length = 0;
    target[ORDER_KEY].push(...order);
    return true;
  } else {
    return Reflect.defineProperty(target, ORDER_KEY, {
      configurable: true,
      value: order,
    });
  }
}

export function getOrder(target) {
  return target[ORDER_KEY];
}

export function serialize(target, deep) {
  const newTarget = { ...target };

  if (ORDER_KEY in target) {
    Object.defineProperty(newTarget, STRINGIFIED_ORDER_KEY, {
      enumerable: true,
      value: target[ORDER_KEY].filter(item => item !== ORDER_KEY),
    });
  }

  if (deep) {
    for (const key of Object.keys(target)) {
      if (key === STRINGIFIED_ORDER_KEY) continue;
      const value = target[key];
      if (value !== null && typeof value === 'object') {
        newTarget[key] = serialize(value, true);
      }
    }
  }

  return newTarget;
}

export function deserialize(target, deep) {
  const newTarget = createObj(
    target,
    STRINGIFIED_ORDER_KEY in target
      ? target[STRINGIFIED_ORDER_KEY]
      : Reflect.ownKeys(target),
  );

  delete newTarget[STRINGIFIED_ORDER_KEY];

  if (deep) {
    for (const key of Object.keys(target)) {
      const value = target[key];
      if (value !== null && typeof value === 'object') {
        target[key] = deserialize(value, true);
      }
    }
  }

  return newTarget;
}

export function isOrderedObject(target) {
  return ORDER_KEY in target;
}
