import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {EntriesView} from '../../shared/components/entries-view/entries-view.component';
import {ContenfulContent} from '../../shared/services/contentful-content.service';
import {NodePageContent} from '../../shared/structures/content-type.structures';
import {Sidebar} from '../../shared/components/sidebar/sidebar.component.ts';
import {ToDate} from '../../shared/pipes/to-date.pipe';

@Component({
  template: <string> require('./blogs-post.component.html'),
  styles: [<string> require('./blogs-post.component.styl')],
  directives: [EntriesView, Sidebar],
  pipes: [ToDate]
})
export class BlogsPost implements OnInit {
  private content: NodePageContent;

  constructor(private _params: RouteParams,
              private _contentfulContent: ContenfulContent) {
  }

  ngOnInit(): void {
    this._contentfulContent.getNodePage(
      this._params.get('slug')
      )
      .subscribe(
        content => this.content = content
      );
  }
}
