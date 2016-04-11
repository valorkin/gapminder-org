import {Component, ViewEncapsulation} from 'angular2/core';
import {CanActivate, OnActivate, ComponentInstruction} from 'angular2/router';
import {checkContentType, DynamicContentDetailRouteParams, DynamicContentRouteParams} from './tools';
import {NodePageContent} from '../../structures/content-type.structures';
import {ContenfulContent} from '../../services/contentful-content.service';
import {ToDate} from '../../pipes/to-date.pipe';
import {EntriesView} from '../entries-view/entries-view.component';
import {Sidebar} from '../sidebar/sidebar.component';

@Component({
  template: <string> require('./dynamic-content-details.component.html'),
  directives: [EntriesView, Sidebar],
  styles: [
    <string> require('./dynamic-content-details.component.styl')
  ],
  encapsulation: ViewEncapsulation.None,
  pipes: [ToDate]
})
@CanActivate(checkContentType)
export class DynamicComponentDetails implements OnActivate {
  private content: NodePageContent;
  private contentType: string;

  constructor(private _contentfulContent: ContenfulContent) {
  }

  routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction): void {
    this.contentType = (next.params as DynamicContentRouteParams).contentType;
    this._contentfulContent
      .getNodePage((next.params as DynamicContentDetailRouteParams).contentSlug)
      .subscribe(
        content => this.content = content
      );
  }
}

