import Vue from 'vue';
import axios from 'axios';
import Hover from 'js-util/Hover';
import sleep from 'js-util/sleep';

const ITEM_NUM_IN_GROUP = 3;

export default function(contents) {
  const vo = new Vue({
    el: contents.querySelector('#latest-studio'),
    data: {
      items: [],
      currentGroupNum: 0,
      maxGroupNum: 0,
    },
    created: function() {
      axios({
        method: 'get',
        url: '/json/latest-studio.json',
      })
      .then(response => {
        this.items = response.data;
        this.maxGroupNum = Math.floor(response.data.length / ITEM_NUM_IN_GROUP);
      })
      .catch(result => {
      });
    },
    mounted: async function() {
      await sleep(1000);
      [ ...this.$el.querySelectorAll('.js-hover') ].map(item => {
        new Hover(item);
      });
    },
    computed: {
      classnamesNavPrev: function() {
        return {
          'is-disabled': this.currentGroupNum <= 0,
        };
      },
      classnamesNavNext: function() {
        return {
          'is-disabled': this.currentGroupNum >= this.maxGroupNum,
        };
      },
    },
    methods: {
      stylesItem: function(i) {
        return `background-image:url(${this.items[i].src})`;
      },
      classnamesItem: function(i) {
        return [
          `p-section-studio__item--0${i + 1}`,
          `p-section-studio__item--0${i % ITEM_NUM_IN_GROUP + 1}sp`,
          {
            'is-shown': this.currentGroupNum === Math.floor(i / ITEM_NUM_IN_GROUP),
            'is-hidden': this.currentGroupNum !== Math.floor(i / ITEM_NUM_IN_GROUP),
          }
        ];
      },
      goPrevGroup: function() {
        this.currentGroupNum = Math.max(this.currentGroupNum - 1, 0);
      },
      goNextGroup: function() {
        this.currentGroupNum = Math.min(this.currentGroupNum + 1, this.maxGroupNum);
      },
    }
  });

  return vo;
}
