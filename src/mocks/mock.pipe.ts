import { Pipe, PipeTransform } from "@angular/core"

export const createMockPipe = (name: string, transformFn: (value: unknown, ...args: unknown[]) => unknown, standalone = true)=>{
    @Pipe({
        name,
        standalone: standalone
    })
    class MockComponent implements PipeTransform {
        transform = transformFn
    }

    return MockComponent;
}