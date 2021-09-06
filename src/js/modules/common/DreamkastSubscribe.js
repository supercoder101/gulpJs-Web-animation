import Vue from 'vue';

export default function() {
  const vo = new Vue({
    el: '#dreamkast-subscribe',
    data: {
      isOpened: 0,
    },
    methods: {
      toggleNavi: function() {
        this.isOpened = (this.isOpened !== 1) ? 1 : 2;
      },
    }
  });

  return vo;
}
