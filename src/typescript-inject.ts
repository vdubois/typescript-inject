interface Instance {
  instanceName: string;
  instanceValue: string | Function;
  isSingleton: boolean;
}

export class InversionOfControlContainer {

  static container: InversionOfControlContainer;
  private instances: Array<Instance> = [];
  private singletonInstancesValues: Array<any> = [];

  private constructor() {

  }

  static getInstance() {
    if (!this.container) {
      this.container = new InversionOfControlContainer();
    }
    return this.container;
  }

  private clearInstances() {
    this.instances = [];
  }
}

function instanceAlreadyExists(instanceName: string) {
  return InversionOfControlContainer.getInstance()['instances'].some(instance => instance.instanceName === instanceName);
}

export function register(instanceName: string, instanceValue: string | Function, isSingleton: boolean = true): void {
  if (instanceAlreadyExists(instanceName)) {
    throw new Error(`An instance with a name such as '${instanceName}' is already registered`);
  } else {
    InversionOfControlContainer.getInstance()['instances'].push({
      instanceName: instanceName,
      instanceValue: instanceValue,
      isSingleton: isSingleton
    });
  }
}

function instanceExists(instanceName: string) {
  const instances = InversionOfControlContainer.getInstance()['instances'];
  return instances.some(instance => instance.instanceName === instanceName);
}

function instanceWithSimilarNameExists(instanceName: string) {
  const instances = InversionOfControlContainer.getInstance()['instances'];
  return instances.some(instance => instance.instanceName.toUpperCase() === instanceName.toUpperCase());
}

function getInstanceWithSimilarNameExists(instanceName: string) {
  const instances = InversionOfControlContainer.getInstance()['instances'];
  return instances.find(instance => instance.instanceName.toUpperCase() === instanceName.toUpperCase());
}

function getInstanceWithName(instanceName: string): any {
  const instances = InversionOfControlContainer.getInstance()['instances'];
  const instance: any = instances.find(containerInstance => containerInstance.instanceName === instanceName);
  const instanceValue = instance.instanceValue;
  if (typeof instanceValue === 'function') {
    if (instance.isSingleton === true) {
      const singletonInstancesValues = InversionOfControlContainer.getInstance()['singletonInstancesValues'];
      if (!singletonInstancesValues[instance.instanceName]) {
        singletonInstancesValues[instance.instanceName] = instanceValue.call(instanceValue);
      }
      return singletonInstancesValues[instance.instanceName];
    } else {
      return instanceValue.call(instanceValue);
    }
  }
  return instanceValue;
}

export function inject<T>(instanceName: string): T {
  if (instanceExists(instanceName)) {
    return getInstanceWithName(instanceName);
  } else if (instanceWithSimilarNameExists(instanceName)) {
    const instanceWithSimilarName = getInstanceWithSimilarNameExists(instanceName);
    throw new Error(
      `An instance with a name such as '${instanceWithSimilarName.instanceName}' exists. Did you mispelled '${instanceName}' ?`);
  }
  throw new Error(`An instance with a name such as '${instanceName}' does not exist`);
}
