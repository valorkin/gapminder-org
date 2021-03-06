'use strict';

const _ = require('lodash');
const rss = require('rss');
const express = require('express');
const routeCache = require('route-cache');

const routeUtils = require('../route.utils');
const contentful = require('./../contentful.service.js');

/* eslint-disable */
const feed = new rss({
  title: 'Gapminder\'s RSS Feed',
  description: 'Gapminder.org RSS Feed',
  author: 'Gapminder.org',
  feed_url: 'https://www.gapminder.org/feed/rss',
  site_url: 'https://www.gapminder.org',
  image_url: 'https://www.gapminder.org/public/logo.png'
});

const router = express.Router();

const ERROR_STATUS = 400;
const SUCCESS_STATUS = 200;

const FIVE_MINUTES_IN_SECONDS = 5 * 60;

module.exports = app => {
  const db = app.get('gp.mongodb');
  const rssRepo = require('./rss.repository.js')(db);

  router.post('/rss', routeUtils.auth, (req, res) => {
    feed.feed_url = `https://${req.headers.host}`;
    feed.site_url = feed.feed_url;

    const entry = req.body;

    if (_.get(entry.sys, 'contentType.sys.id') !== 'article') {
      return res.sendStatus(SUCCESS_STATUS);
    }

    const article = toArticle(entry);

    isArticleTaggedByBlog(article, (error, isTagged) => {
      if (!isTagged) {
        return res.sendStatus(SUCCESS_STATUS);
      }

      if (error) {
        return res.sendStatus(ERROR_STATUS);
      }

      const rssItemGuid = _.get(article, 'fields.slug');
      const feedItem = toFeedItem(article.fields, feed.site_url);

      return rssRepo.upsertFeedItemByGuid(rssItemGuid, feedItem, error => {
        if (error) {
          return res.sendStatus(ERROR_STATUS);
        }

        return res.sendStatus(SUCCESS_STATUS);
      });
    });
  });

  router.get('/feed/rss', routeCache.cacheSeconds(FIVE_MINUTES_IN_SECONDS), (req, res) => {
    feed.items = [];

    return rssRepo.findAllFeedItems((error, items) => {
      if (error) {
        return res.sendStatus(ERROR_STATUS);
      }

      _.forEach(items, product => feed.item(product));

      res.set('Content-Type', 'application/rss+xml');
      return res.send(feed.xml());
    });
  });

  app.use(router);
};

function toFeedItem(articleFields, host) {
  return {
    title: articleFields.title,
    description: articleFields.description || '',
    url: `${host}/${articleFields.slug}`,
    guid: articleFields.slug,
    categories: [],
    author: 'gapminder.org',
    date: articleFields.createdAt,
    enclosure: false,
    custom_elements: []
  };
}

function toArticle(entry) {
  const clone = _.cloneDeep(entry);
  clone.fields = _.mapValues(clone.fields, value => _.get(value, 'en-US'));
  return clone;
}

function isArticleTaggedByBlog(article, onVerified) {
  contentful.findTagBySlug('blog', (error, blogTag) => {
    if (error) {
      return onVerified(error);
    }

    const articleTags = _.get(article, 'fields.tags');
    const blogTagPattern = {sys: {id: _.get(blogTag, 'sys.id')}};

    return onVerified(null, !!_.find(articleTags, blogTagPattern));
  });
}
/* eslint-enable */
