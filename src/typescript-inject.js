"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InversionOfControlContainer {
    constructor() {
        this.instances = [];
        this.singletonInstancesValues = [];
    }
    static getInstance() {
        if (!this.container) {
            this.container = new InversionOfControlContainer();
        }
        return this.container;
    }
    clearInstances() {
        this.instances = [];
    }
}
exports.InversionOfControlContainer = InversionOfControlContainer;
function instanceAlreadyExists(instanceName) {
    return InversionOfControlContainer.getInstance()['instances'].some(instance => instance.instanceName === instanceName);
}
function register(instanceName, instanceValue, registerOptions = {
    isSingleton: true,
    override: false
}) {
    if (registerOptions.override === false && instanceAlreadyExists(instanceName)) {
        throw new Error(`An instance with a name such as '${instanceName}' is already registered`);
    }
    else {
        InversionOfControlContainer.getInstance()['instances'].push({
            instanceName: instanceName,
            instanceValue: instanceValue,
            isSingleton: registerOptions.isSingleton
        });
    }
}
exports.register = register;
function instanceExists(instanceName) {
    const instances = InversionOfControlContainer.getInstance()['instances'];
    return instances.some(instance => instance.instanceName === instanceName);
}
function instanceWithSimilarNameExists(instanceName) {
    const instances = InversionOfControlContainer.getInstance()['instances'];
    return instances.some(instance => instance.instanceName.toUpperCase() === instanceName.toUpperCase());
}
function getInstanceWithSimilarNameExists(instanceName) {
    const instances = InversionOfControlContainer.getInstance()['instances'];
    return instances.find(instance => instance.instanceName.toUpperCase() === instanceName.toUpperCase());
}
function getInstanceWithName(instanceName) {
    const instances = InversionOfControlContainer.getInstance()['instances'];
    const instance = instances.find(containerInstance => containerInstance.instanceName === instanceName);
    const instanceValue = instance.instanceValue;
    if (typeof instanceValue === 'function') {
        if (instance.isSingleton === true) {
            const singletonInstancesValues = InversionOfControlContainer.getInstance()['singletonInstancesValues'];
            if (!singletonInstancesValues[instance.instanceName]) {
                singletonInstancesValues[instance.instanceName] = instanceValue.call(instanceValue);
            }
            return singletonInstancesValues[instance.instanceName];
        }
        else {
            return instanceValue.call(instanceValue);
        }
    }
    return instanceValue;
}
function inject(instanceName) {
    if (instanceExists(instanceName)) {
        return getInstanceWithName(instanceName);
    }
    else if (instanceWithSimilarNameExists(instanceName)) {
        const instanceWithSimilarName = getInstanceWithSimilarNameExists(instanceName);
        throw new Error(`An instance with a name such as '${instanceWithSimilarName.instanceName}' exists. Did you mispelled '${instanceName}' ?`);
    }
    throw new Error(`An instance with a name such as '${instanceName}' does not exist`);
}
exports.inject = inject;
