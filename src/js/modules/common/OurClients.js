import Vue from 'vue';
import axios from 'axios';

const ITEM_NUM_IN_GROUP = 6;

export default function(contents) {
  const vo = new Vue({
    el: contents.querySelector('#our-clients'),
    data: {
      itemsCelebrity: [],
      itemsTestimonial: [],
      currentNumCelebrity: 0,
      currentNumTestimonial: 0,
      timer: null,
      isTransitedOnce: false,
      isDisabledAutoRun: false,
    },
    created: function() {
      Promise.all([
        axios({
          method: 'get',
          url: '/json/our-clients-celebrity.json',
        }),
        axios({
          method: 'get',
          url: '/json/our-clients-testimonial.json',
        })
      ])
      .then(response => {
        this.itemsCelebrity = response[0].data;
        this.itemsTestimonial = response[1].data;
      })
      .catch(result => {
      });
    },
    mounted: function() {
    },
    computed: {
      getSrcThumb: function() {
        return (this.itemsTestimonial.length > 0) ? this.itemsTestimonial[this.currentNumTestimonial].thumb : '';
      },
      getSrcLogo: function() {
        return (this.itemsTestimonial.length > 0)
          ? `/img/section/clients/logo_${this.itemsTestimonial[this.currentNumTestimonial].logo}.svg`
          : '';
      },
      getLogoModifier: function() {
        return (this.itemsTestimonial.length > 0)
          ? `p-clients-logo--${this.itemsTestimonial[this.currentNumTestimonial].logo}`
          : '';
      },
      getPersonName: function() {
        return (this.itemsTestimonial.length > 0) ? this.itemsTestimonial[this.currentNumTestimonial].personName : '';
      },
      getPersonRole: function() {
        return (this.itemsTestimonial.length > 0) ? this.itemsTestimonial[this.currentNumTestimonial].personRole : '';
      },
      getSummary: function() {
        return (this.itemsTestimonial.length > 0) ? this.itemsTestimonial[this.currentNumTestimonial].summary : '';
      },
      getHref: function() {
        return (this.itemsTestimonial.length > 0) ? this.itemsTestimonial[this.currentNumTestimonial].href : '';
      },
      classnamesNavPrev: function() {
        return {
          'is-disabled': this.currentNumTestimonial <= 0,
        };
      },
      classnamesNavNext: function() {
        return {
          'is-disabled': this.currentNumTestimonial >= this.itemsTestimonial.length - 1,
        };
      },
    },
    methods: {
      classnamesItem: function(i) {
        return [
          {
            'is-current': this.currentNumCelebrity === i,
          }
        ]
      },
      classnamesPerson: function(i) {
        return [
          {
            'is-shown': this.currentNumCelebrity === i,
            'is-hidden': this.currentNumCelebrity !== i,
            'is-transited-once': this.isTransitedOnce === true,
          }
        ]
      },
      stylesPerson: function(i) {
        return `background-image:url(${this.itemsCelebrity[i].person})`;
      },
      showCelebrity: function(i) {
        clearTimeout(this.timer);
        this.currentNumCelebrity = i;
        this.isTransitedOnce = true;
        this.isDisabledAutoRun = true;
      },
      showCelebrityAuto: function() {
        if (this.isDisabledAutoRun === true) return;
        this.timer = setTimeout(() => {
          this.currentNumCelebrity = (this.currentNumCelebrity === this.itemsCelebrity.length - 1)
            ? 0
            : this.currentNumCelebrity + 1;
          this.isTransitedOnce = true;
          if (this.isDisabledAutoRun === false) {
            this.showCelebrityAuto();
          }
        }, 5000);
      },
      stopCelebrityAuto: function() {
        clearTimeout(this.timer);
      },
      goPrevTestimonial: function() {
        this.currentNumTestimonial = Math.max(this.currentNumTestimonial - 1, 0);
      },
      goNextTestimonial: function() {
        this.currentNumTestimonial = Math.min(this.currentNumTestimonial + 1, this.itemsTestimonial.length - 1);
      },
    }
  });

  return vo;
}
