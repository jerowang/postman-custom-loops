module.exports = {
  environment: {
    set: (n, v) => console.log(`Environment set ${n}: ${v}`),
    get: n => console.log(`Environment get ${n}`),
    has: n => console.log(`Environment has ${n}`),
    unset: n => console.log(`Environment unset ${n}`)
  },
  variables: {
    set: (n, v) => console.log(`Variables set ${n}: ${v}`),
    get: n => console.log(`Variables get ${n}`)
  },
  iterationData: {
    get: n => console.log(`Iteration Data get ${n}`)
  }
};
