/**
* Pjax
*
* Copyright (c) 2019 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

import axios from 'axios';
import sleep from 'js-util/sleep';
import ConsoleSignature from '../common/ConsoleSignature';
import page from './page';
import getPage from './getPage';

const consoleSignature = new ConsoleSignature('page transition in this website with original pjax module', 'https://github.com/ykob/pjax', '#497');

const preloader = document.querySelector('.p-preloader');

const CLASSNAME_LINK = 'js-pjax-link';
const CLASSNAME_EXCLUDED = 'js-pjax-excluded';
const CLASSNAME_PAGE = 'js-pjax-page';
const CLASSNAME_CONTENTS = 'js-pjax-contents';
const CLASSNAME_CONTENTS_BEFORE = 'js-pjax-contents-before';
const CLASSNAME_CONTENTS_AFTER = 'js-pjax-contents-after';
const CLASSNAME_TRANSITION_ARRIVED = 'is-arrived-contents';
const CLASSNAME_TRANSITION_LEAVED = 'is-leaved-contents';
const TIME_REMOVE_PREV_CONTENTS = 2000;
const GA_TRACKING_ID = 'UA-xxxxxxxxx-1';

export default class Pjax {
  constructor() {
    this.modules = null;
    this.elm = {
      page: document.querySelector(`.${CLASSNAME_PAGE}`),
      contents: document.querySelector(`.${CLASSNAME_CONTENTS}`),
      contentsBefore: document.querySelector(`.${CLASSNAME_CONTENTS_BEFORE}`),
      contentsAfter: document.querySelector(`.${CLASSNAME_CONTENTS_AFTER}`),
    };
    this.href = location.pathname + location.search;
    this.currentPage = null;
    this.isTransition = false;
    this.isPageLoaded = false;
  }
  async onLoad() {
    // The process when the page is loaded first.
    preloader.classList.add('is-shown');
    preloader.classList.remove('is-hidden');

    // Switch pages before and after.
    this.switchPage();

    // The initialize function that should run before the transition effect.
    page.common.initBeforeTransit([document], this.modules, this.isPageLoaded);
    await this.currentPage.initBeforeTransit(
      this.elm.contents, this.elm.contentsBefore, this.elm.contentsAfter, this.modules
    );

    // Start Scroll Manager at finished Pjax initialize.
    await this.modules.scrollManager.start();

    // Bind the transition event by Pjax after first initializing.
    this.onPjaxLinks(document);

    // Finish the transition effect.
    this.transitEnd();

    // Enable the flag that means finished page loading.
    this.isPageLoaded = true;

    // Set each events.
    this.on();

    return;
  }
  switchPage() {
    // Get the individual function of the current page.
    this.currentPage = getPage(this.elm.page.dataset.pageId, page);
  }
  send() {
    // run axios.
    axios.get(this.href)
      .then((response) => {
        // succeed to post.
        this.replaceContent(response);
      })
      .catch((error) => {
        // failed to post.
        console.error(`A post by axios had an error : ${error.response.status} ${error.response.statusText}`);
        if (error.response.status === 404) this.replaceContent(error.response);
      });

    // fire the page transition effect.
    this.leave();
  }
  async replaceContent(response) {
    // Run the clear function that does to empty the previous page attributes.
    this.currentPage.clear(this.modules);

    // Get contents of a current page.
    const currentContents = this.elm.contents;
    const currentContentsBefore = this.elm.contentsBefore;
    const currentContentsAfter = this.elm.contentsAfter;
    currentContents.classList.remove('js-contents')

    // Get next page elements.
    const responseHtml = document.createElement('div');
    responseHtml.innerHTML = response.data;
    const responsePage = responseHtml.querySelector(`.${CLASSNAME_PAGE}`);
    const responseContents = responseHtml.querySelector(`.${CLASSNAME_CONTENTS}`);
    const responseContentsBefore = responseHtml.querySelector(`.${CLASSNAME_CONTENTS_BEFORE}`);
    const responseContentsAfter = responseHtml.querySelector(`.${CLASSNAME_CONTENTS_AFTER}`);

    // Set the position fixed to pile up page contents both the previous and the next.
    currentContents.style.position = 'fixed';
    currentContents.style.top = 0;
    currentContents.style.left = 0;
    responseContents.style.position = 'fixed';
    responseContents.style.top = '0';
    responseContents.style.left = '0';

    await sleep(1000);

    // Add DOM elements of a next page.
    this.elm.page.dataset.pageId = responsePage.dataset.pageId;
    this.elm.page.appendChild(responseContents);
    this.elm.page.appendChild(responseContentsBefore);
    this.elm.page.appendChild(responseContentsAfter);
    this.elm.contents = responseContents;
    this.elm.contentsBefore = responseContentsBefore;
    this.elm.contentsAfter = responseContentsAfter;
    document.title = responseHtml.querySelector('title').innerHTML;

    // Back to the page top.
    window.scrollTo(0, 0);

    // Send log to Google Analytice???
    // if (window.ga) ga('send', 'pageview', window.location.pathname.replace(/^\/?/, '/') + window.location.search);
    if (window.gtag) {
      gtag('config', GA_TRACKING_ID, {
        'page_title': document.title,
        'page_path':  window.location.pathname.replace(/^\/?/, '/') + window.location.search
      });
    }

    // Run some functions when switch pages.
    this.switchPage();

    // After running the timer for the page transition effect, remove the current page.
    // Not use sleep() to not stop following processes.
    setTimeout(() => {
      this.elm.page.removeChild(currentContents);
      this.elm.page.removeChild(currentContentsBefore);
      this.elm.page.removeChild(currentContentsAfter);
    }, TIME_REMOVE_PREV_CONTENTS);

    // ????????????????????????????????????????????????????????????????????????
    page.common.initBeforeTransit(
      [this.elm.contents, this.elm.contentsBefore, this.elm.contentsAfter],
      this.modules, this.isPageLoaded
    );
    await this.currentPage.initBeforeTransit(
      this.elm.contents, this.elm.contentsBefore, this.elm.contentsAfter, this.modules
    );

    // ????????????????????????????????????????????????????????????????????????????????????
    this.onPjaxLinks(this.elm.contents);
    this.onPjaxLinks(this.elm.contentsBefore);
    this.onPjaxLinks(this.elm.contentsAfter);

    // Initialize Scroll Manager.
    await this.modules.scrollManager.start();

    // Finish the transition effect.
    this.transitEnd();
  }
  transitStart(showPreloader) {
    // The transition effect before to switch page.
    if (this.isTransition) return;

    if (showPreloader) {
      preloader.classList.add('is-shown');
      preloader.classList.remove('is-hidden');
    }

    this.isTransition = true;
    this.modules.scrollManager.isWorkingScroll = false;
    this.href = location.pathname + location.search;
    this.send();
  }
  transitEnd() {
    // The transition effect after to switch page.
    this.arrive();

    // ??????????????????????????????????????????wrapper???sytle??????????????????
    this.elm.contents.style.position = '';
    this.elm.contents.style.top = '';

    // ??????????????????????????????????????????
    this.isTransition = false;
    this.modules.scrollManager.isWorkingScroll = true;

    // history.back????????????????????????????????????????????????????????????????????????????????????URI???????????????????????????????????????????????????????????????
    if (this.href !== location.pathname + location.search) {
      this.transitStart();
      return;
    }

    // ????????????????????????????????????????????????????????????????????????
    page.common.initAfterTransit(
      [this.elm.contents, this.elm.contentsBefore, this.elm.contentsAfter], this.modules
    );
    this.currentPage.initAfterTransit(
      this.elm.contents, this.elm.contentsBefore, this.elm.contentsAfter, this.modules
    );

    preloader.classList.add('is-hidden');
    preloader.classList.remove('is-shown');
  }
  arrive() {
    // toggle CSS classes for to add page transition effect to the content element that exists after the transition.
    this.elm.contents.classList.add(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contentsBefore.classList.add(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contentsAfter.classList.add(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contents.classList.remove(CLASSNAME_TRANSITION_LEAVED);
    this.elm.contentsBefore.classList.remove(CLASSNAME_TRANSITION_LEAVED);
    this.elm.contentsAfter.classList.remove(CLASSNAME_TRANSITION_LEAVED);
  }
  leave() {
    // toggle CSS classes for to add page transition effect to the content element that exists before the transition.
    this.elm.contents.classList.remove(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contentsBefore.classList.remove(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contentsAfter.classList.remove(CLASSNAME_TRANSITION_ARRIVED);
    this.elm.contents.classList.add(CLASSNAME_TRANSITION_LEAVED);
    this.elm.contentsBefore.classList.add(CLASSNAME_TRANSITION_LEAVED);
    this.elm.contentsAfter.classList.add(CLASSNAME_TRANSITION_LEAVED);
  }
  on() {
    // On several events.

    // About History API.
    window.addEventListener('popstate', (event) => {
      event.preventDefault();
      history.scrollRestoration = 'manual';
      this.transitStart(true);
    });
  }
  transit(href, showPreloader = true) {
    if (href == location.pathname + location.search) {
      return;
    }
    history.pushState(null, null, href);
    this.transitStart(showPreloader);
  }
  onPjaxLinks(content) {
    const self = this;

    // ???????????????????????????????????????????????????????????????????????????????????????
    const elms = content.getElementsByTagName('a');

    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    for (var i = 0; i < elms.length; i++) {
      const elm = elms[i];
      const href = elm.getAttribute('href');
      const target = elm.getAttribute('target');
      if (
        elm.classList.contains(CLASSNAME_LINK) // It has the class name to set Pjax transition.
        || (
          !elm.classList.contains(CLASSNAME_EXCLUDED) // It has the class name to exclude Pjax transition.
          && target !== '_blank' // It doesn't have "_blank" value in target attribute.
          && href.indexOf('#') !== 0 // It doesn't link to an anchor on the same page.
          && !(href.indexOf('http') > -1 && href.match(location.host) === null) // It doesn't have this website's hostname in the href attribute value.
        )
      ) {
        elm.addEventListener('click', function(event) {
          event.preventDefault();
          self.transit(this.getAttribute('href'));
        });
      }
    }
  }
}
