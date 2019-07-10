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
  markStartOfLoop: pm => {
    // Run in the pre-request of the first script inside loop
    pm.environment.set('__LoopFirstReqName', pm.info.requestId);
  },
  markEndOfLoop: (pm, postman) => {
    // Run in the post-request of the final script inside loop
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(pm.environment.get('__LoopVarName'));

    if (i !== null && d !== null && i < d.length - 1) {
      postman.setNextRequest(pm.environment.get('__LoopFirstReqName'));
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
    // Place in pre-req of the loop folder
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(`_${envLoopVariableName}`);

    pm.environment.set('__LoopVarName', `_${envLoopVariableName}`);

    if (i !== null && d !== null) {
      Object.keys(d[i]).forEach(key => {
        pm.environment.set(key, d[i][key]);
      });
    }
  },
  teardownEnvVars: pm => {
    const i = pm.environment.get('_IterationCount');
    const d = pm.environment.get(pm.environment.get('__LoopVarName'));

    if (i !== null && d !== null) {
      Object.keys(d[i]).forEach(key => {
        pm.environment.unset(key, d[i][key]);
      });
    }
  }
};
