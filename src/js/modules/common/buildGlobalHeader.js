import Vue from 'vue';

export default function() {
  const vo = new Vue({
    el: '#global-header',
    data: {
      currentId: -1,
      isMounted: false,
      isShownBar: false,
      isShown: false,
      isBlack: false,
      isOveredHamburger: 0,
      isOpenedNavi: 0,
    },
    mounted: function() {
      this.isMounted = true;
    },
    methods: {
      hideBar: function() {
        this.currentId = -1;
        this.isShownBar = false;
      },
      showBar: function(id) {
        this.currentId = id;
        this.isShownBar = true;
      },
      hide: function() {
        this.isShown = false;
      },
      show: function() {
        this.isShown = true;
      },
      toggleNavi: function() {
        this.isOpenedNavi = (this.isOpenedNavi !== 1) ? 1 : 2;
      },
      mouseoverHamburger: function() {
        this.isOveredHamburger = 1;
      },
      mouseoutHamburger: function() {
        this.isOveredHamburger = 2;
      },
    }
  });

  return vo;
}
