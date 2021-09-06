import Vue from 'vue';
import axios from 'axios';

export default function(contents) {
  const vo = new Vue({
    el: contents.querySelector('#dreamkast'),
    data: {
      items: [],
    },
    created: function() {
      axios({
        method: 'get',
        url: '/json/dreamkast.json',
      })
      .then(response => {
        this.items = response.data.slice(0, 5);
      })
      .catch(result => {
      });
    },
    mounted: function() {
    },
    computed: {
    },
    methods: {
      classnamesItem: function(i) {
        return [
          `p-section-dreamkast__item--0${i + 1}`,
        ];
      },
      stylesItemThumb: function(i) {
        return `background-image:url(${this.items[i].src})`;
      },
    }
  });

  return vo;
}
