Array.prototype.flat = function (depth = 1) {
  return this.reduce((arr, val) => {
      return arr.concat(
          Array.isArray(val) && depth > 0 ?
              val.flat(--depth) : Array.isArray(val) ? [val] : val)
  }, []);
};
