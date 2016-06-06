
import {
  it,
  beforeEachProviders,
  beforeEach,
  injectAsync
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {getBaseTestProviders, TestContentfulNodePage} from '../../../../shared/tools/tests.tools';
import {GapminderOverviewComponent} from './gapminder-overview.component';

describe('Component: Gapminder Overview', () => {

  beforeEachProviders(() => [
    ...getBaseTestProviders(),
    GapminderOverviewComponent
  ]);

  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEachProviders(() => [
      TestComponentBuilder
    ]);

    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(GapminderOverviewComponent)
        .then((f: ComponentFixture<any>) => fixture = f);
    }));

    it('should have proper slide title', (done: () => void) => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element.querySelector('.title').textContent).toBe(
        TestContentfulNodePage.fields.title
      );
      done();
    });

    it('should have proper slide description', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element.querySelector('.block-description > p').textContent).toBe(
        TestContentfulNodePage.fields.description
      );
    });

    it('should have the read more link ', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element.querySelectorAll('.block-description a.more-info').length).toBe(1);
    });

  });
});
