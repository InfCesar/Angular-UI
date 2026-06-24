import { Pipe, PipeTransform } from '@angular/core';

export const createMockPipe = (
  name: string,
  transformFn: (value: unknown, ...args: unknown[]) => unknown
) => {
  @Pipe({
    name,
  })
  class MockComponent implements PipeTransform {
    transform = transformFn;
  }

  return MockComponent;
};
