import { inject, InversionOfControlContainer, register } from './typescript-inject';

const inversionOfControlContainer = InversionOfControlContainer.getInstance();

class A {
  method(): string {
    return 'value from class A';
  }
}

describe('Typescript Dependency Injection library', () => {

  beforeEach(() => {
    inversionOfControlContainer['clearInstances'].call(inversionOfControlContainer);
  });

  describe('register function', () => {

    it('should register a string value', done => {
      // GIVEN

      // WHEN
      register('MyString', 'MyValue');

      // THEN
      expect(inversionOfControlContainer['instances']).toEqual([{
        instanceName: 'MyString',
        instanceValue: 'MyValue',
        isSingleton: true
      }]);
      done();
    });

    it('should register a factory', done => {
      // GIVEN
      const myFactory = () => new A();

      // WHEN
      register('MyFactory', myFactory);

      // THEN
      expect(inversionOfControlContainer['instances']).toEqual([{
        instanceName: 'MyFactory',
        instanceValue: myFactory,
        isSingleton: true
      }]);
      done();
    });

    it('should throw an error if an instance is already registered', done => {
      // GIVEN

      // WHEN
      register('MyString', 'MyValue');
      try {
        register('MyString', 'MyValue');
        fail('we should not reach here because an error should have been thrown');
        done();
      } catch (exception) {
        // THEN
        expect(exception).not.toBeNull();
        expect(exception.message).toEqual(`An instance with a name such as 'MyString' is already registered`);
        done();
      }
    });
  });

  describe('inject function', () => {

    it('should throw an error if there is no instance named as requested', done => {
      // GIVEN

      // WHEN
      try {
        const valueToInject = inject<string>('StringToInjectThatDoesNotExist');
        fail('we should not reach here because an error should have been thrown');
        done();
      } catch (exception) {
        // THEN
        expect(exception).not.toBeNull();
        expect(exception.message).toEqual('An instance with a name such as \'StringToInjectThatDoesNotExist\' does not exist');
        done();
      }
    });

    it('should throw an error if there is a similar name of instance', done => {
      // GIVEN
      inversionOfControlContainer['instances'] = [{
        instanceName: 'MyStringToInject',
        instanceValue: 'My string value to inject',
        isSingleton: true
      }];

      // WHEN
      try {
        const valueToInject = inject<string>('MyStringToinject');
        fail('we should not reach here because an error should have been thrown');
        done();
      } catch (exception) {
        // THEN
        expect(exception).not.toBeNull();
        expect(exception.message).toEqual(
          'An instance with a name such as \'MyStringToInject\' exists. Did you mispelled \'MyStringToinject\' ?');
        done();
      }
    });

    it('should inject a string value', done => {
      // GIVEN
      inversionOfControlContainer['instances'] = [{
        instanceName: 'MyStringToInject',
        instanceValue: 'My string value to inject',
        isSingleton: true
      }];

      // WHEN
      const injectedString = inject<string>('MyStringToInject');

      // THEN
      expect(injectedString).toEqual('My string value to inject');
      done();
    });

    it('should inject a factory', done => {
      // GIVEN
      const factory = () => new A();
      inversionOfControlContainer['instances'] = [{
        instanceName: 'MyClassA',
        instanceValue: factory,
        isSingleton: true
      }];

      // WHEN
      const injectedClass = inject<A>('MyClassA');

      // THEN
      expect(injectedClass).not.toBeNull();
      expect(injectedClass.method()).toEqual('value from class A');
      done();
    });

    it('should inject a singleton factory when a singleton was configured', done => {
      // GIVEN
      const factory = () => new A();
      inversionOfControlContainer['instances'] = [{
        instanceName: 'MyClassA',
        instanceValue: factory,
        isSingleton: true
      }];

      // WHEN
      const instance1 = inject<A>('MyClassA');
      const instance2 = inject<A>('MyClassA');

      // THEN
      const expectedArray = [];
      expectedArray['MyClassA'] = instance1;
      expect(inversionOfControlContainer['singletonInstancesValues']).toEqual(expectedArray);
      done();
    });

    it('should inject a prototype factory when a prototype was configured', done => {
      // GIVEN
      const factory = () => new A();
      inversionOfControlContainer['singletonInstancesValues'] = [];
      inversionOfControlContainer['instances'] = [{
        instanceName: 'MyClassA',
        instanceValue: factory,
        isSingleton: false
      }];

      // WHEN
      const instance1 = inject<A>('MyClassA');
      const instance2 = inject<A>('MyClassA');

      // THEN
      expect(inversionOfControlContainer['singletonInstancesValues']).toEqual([]);
      done();
    });
  });
});
