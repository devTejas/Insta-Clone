function debouncedCb(callback, delay) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => callback.call(context, ...args), delay);
  };
}

export default debouncedCb;
