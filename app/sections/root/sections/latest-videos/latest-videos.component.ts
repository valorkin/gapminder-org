import {Component, Input, OnInit} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {AsyncPipe} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {ContenfulContent} from '../../../../shared/services/contentful-content.service';
import {ContentfulNodePage} from '../../../../shared/structures/aliases.structures';
import {ToDate} from '../../../../shared/pipes/to-date.pipe';

@Component({
  selector: 'latest-videos',
  template: <string> require('./latest-videos.html'),
  styles: [<string> require('./latest-videos.styl')],
  directives: [RouterLink],
  pipes: [AsyncPipe, ToDate]
})
export class LatestVideosComponent implements OnInit {
  @Input()
  private limit: number = 3;
  private videos: Observable<ContentfulNodePage[]>;

  constructor(private _contentfulContent: ContenfulContent) {
  }

  ngOnInit(): any {
    this.videos = this._contentfulContent.getLatestVideo(this.limit);
  }
}
