interface RegisterOptions {
    isSingleton?: boolean;
    override?: boolean;
}
export declare class InversionOfControlContainer {
    static container: InversionOfControlContainer;
    private instances;
    private singletonInstancesValues;
    private constructor();
    static getInstance(): InversionOfControlContainer;
    private clearInstances;
}
export declare function register(instanceName: string, instanceValue: string | Function, registerOptions?: RegisterOptions): void;
export declare function inject<T>(instanceName: string): T;
export {};
