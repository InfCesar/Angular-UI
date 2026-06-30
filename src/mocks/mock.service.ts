import { Type } from '@angular/core';

export const createMockService = <T>(
  service: Type<T>,
  ...signalMembers: (keyof T)[]
): jasmine.SpyObj<T> => {
  const methodNames = Object.getOwnPropertyNames(service.prototype).filter(
    (key) => key !== 'constructor'
  );

  return jasmine.createSpyObj(service.name, [
    ...methodNames,
    ...signalMembers.map(String),
  ]) as jasmine.SpyObj<T>;
};
