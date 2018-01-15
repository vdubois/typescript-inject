export declare class InversionOfControlContainer {
    static container: InversionOfControlContainer;
    private instances;
    private constructor();
    static getInstance(): InversionOfControlContainer;
    private clearInstances();
}
export declare function register(instanceName: string, instanceValue: string | Function, isSingleton?: boolean): void;
export declare function inject<T>(instanceName: string): T;
