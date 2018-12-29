/**
 * 设置缓存
 * @param {*} key 键
 * @param {*} value 值
 */
function set(key, value) {
  var storage = window.sessionStorage;
  if (storage) {
    storage.setItem(key, value);
  }
}

/**
 * 设置 localStorage 缓存
 * @param {*} key 键
 * @param {*} value 值
 */
function setLocalStorage(key, value) {
  var storage = window.localStorage;
  if (storage) {
    storage.setItem(key, value);
  }
}
/**
 * 设置一个带有当前时间的缓存
 * 使用这个方法设置的缓存可以在 get 时带上过期时间
 * @param {*} key 键
 * @param {*} value 值
 */
function setWithTime(key, value) {
  var storage = window.sessionStorage;
  if (storage) {
    let c = {
      value: value,
      time: new Date().getTime()
    };
    storage.setItem(key, JSON.stringify(c));
  }
}

/**
 * 设置一个带有当前时间的 localStorage 缓存
 * 使用这个方法设置的缓存可以在 get 时带上过期时间
 * @param {*} key 键
 * @param {*} value 值
 */
function setLocalStorageWithTime(key, value) {
  var storage = window.localStorage;
  if (storage) {
    let c = {
      value: value,
      time: new Date().getTime()
    };
    storage.setItem(key, JSON.stringify(c));
  }
}
/**
 * 读取缓存
 * 注意：只有使用 setWithTime 设置的缓存才可以带上过期时间，否则可能发生异常或返回错误数据
 * @param {*} key 键
 * @param {*} expSeconds 可选：过期时间（秒），使用setWithTime设置的缓存才可以使用此参数
 */
function get(key, expSeconds) {
  let storage = window.sessionStorage;
  if (storage && storage.getItem(key)) {
    if (!expSeconds) {
      return storage.getItem(key);
    }
    let cache = JSON.parse(storage.getItem(key));
    if (new Date().getTime() - cache.time < expSeconds * 1000) {
      return cache.value;
    }
  }
}

/**
 * 读取 localStorage 缓存
 * 注意：只有使用 setLocalStorageWithTime 设置的缓存才可以带上过期时间，否则可能发生异常或返回错误数据
 * @param {*} key 键
 * @param {*} expSeconds 可选：过期时间（秒），使用setWithTime设置的缓存才可以使用此参数
 */
function getFromLocalStorage(key, expSeconds) {
  let storage = window.localStorage;
  if (storage && storage.getItem(key)) {
    if (!expSeconds) {
      return storage.getItem(key);
    }
    let cache = JSON.parse(storage.getItem(key));
    if (new Date().getTime() - cache.time < expSeconds * 1000) {
      return cache.value;
    }
  }
}
/**
 * 删除缓存
 * @param {*} key 键
 */
function del(key) {
  let storage = window.sessionStorage;
  if (storage && storage.getItem(key)) {
    storage.removeItem(key);
  }
}

/**
 * 删除 localStorage 缓存
 * @param {*} key 键
 */
function delLocalStorage(key) {
  let storage = window.localStorage;
  if (storage && storage.getItem(key)) {
    storage.removeItem(key);
  }
}
/**
 * 清除所有缓存
 */
function clear() {
  let localStorage = window.localStorage;
  if (localStorage) {
    localStorage.clear();
  }
  let sessionStorage = window.sessionStorage;
  if (sessionStorage) {
    sessionStorage.clear();
  }
}
/**
 * 缓存读写工具
 * 默认使用 sessionStorage, 同时提供 localStorage 的方法
 */
export default {
  set,
  setLocalStorage,
  setWithTime,
  setLocalStorageWithTime,
  get,
  getFromLocalStorage,
  del,
  delLocalStorage,
  clear
};