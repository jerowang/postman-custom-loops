module.exports = {
  setupTestSuite: (pm, arrayOfFields) => {
    // Run this in pre-request of each test suite that requires a loop
    // This only needs to be run once per execution, and it should work (fingers crossed)

    arrayOfFields.forEach(field => {
      const prevVal = pm.environment.get(`_${field}`);
      if (prevVal === 'Dynamic' || prevVal === '' || !prevVal) {
        let tmp = pm.iterationData.get(field);
        if (['[', '{'].includes(tmp.substring(0, 1))) {
          tmp = JSON.parse(tmp);
        }
        pm.environment.set(`_${field}`, tmp);
      }
    });

    pm.environment.set('_IterationCount', 0);
  },
  markBeginOfLoop: pm => {
    // Run in the pre-request of the first script inside loop
    pm.environment.set('_IterationCount', 0);
  },
  markEndOfLoop: (pm, envLoopVariableName, firstRequestInLoop) => {
    // Run in the post-request of the final script inside loop
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(envLoopVariableName);

    if (i !== null && d !== null && i < d.length - 1) {
      postman.setNextRequest(firstRequestInLoop);
      pm.environment.set('_IterationCount', i + 1);
    } else {
      pm.environment.set('_IterationCount', 0);
    }
  },
  resetIterationCounter: pm => {
    // Resets iteration count for whatever reason
    pm.environment.set('_IterationCount', 0);
  },
  setupEnvVars: (pm, envLoopVariableName) => {
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(envLoopVariableName);

    if (i !== null && d !== null) {
      Object.keys(d[i]).forEach(key => {
        pm.environment.set(key, d[i][key]);
      });
    }
  },
  teardownEnvVars: (pm, envLoopVariableName) => {
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(envLoopVariableName);

    if (i !== null && d !== null) {
      Object.keys(d[i]).forEach(key => {
        pm.environment.unset(key, d[i][key]);
      });
    }
  }
};
