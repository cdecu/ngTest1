import { NgTest1Page } from './app.po';

describe('ng-test1 App', function() {
  let page: NgTest1Page;

  beforeEach(() => {
    page = new NgTest1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
