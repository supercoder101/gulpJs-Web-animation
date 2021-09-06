import Vue from 'vue';
import zeroPadding from 'js-util/zeroPadding'

export default function() {
  const vo = new Vue({
    el: '#service-content',
    data: {
      currentId: 0,
      maxId: 2,
    },
    computed: {
      getNumber: function() {
        return zeroPadding(this.currentId + 1, 2);
      },
    },
    methods: {
      goToNext() {
        this.currentId = Math.min(this.currentId + 1, this.maxId);
      },
      goToPrev() {
        this.currentId = Math.max(this.currentId - 1, 0);
      }
    }
  });

  return vo;
}
