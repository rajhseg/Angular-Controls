import { ReadViewTemplateDirective } from './view-template.directive';

describe('ViewTemplateDirective', () => {
  it('should create an instance', () => {
    const directive = new ReadViewTemplateDirective(null as any);
    expect(directive).toBeTruthy();
  });
});
