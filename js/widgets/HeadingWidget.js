define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/HeadingWidget.html",
  "dojo/dom-construct",
  "dojo/dom-geometry",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/query",
  "dojo/touch",
  "dojo/topic",
  "dojo/domReady!"
],
  function(declare, _WidgetBase, _TemplatedMixin, template, domConstruct, domGeometry, dom, domStyle, query, touch, topic) {

    return declare("HeadingWidget",[_WidgetBase, _TemplatedMixin], {
        templateString: template,
        heading:null,

        constructor: function() {

        },
        postCreate: function() {
          var self = this;
          domConstruct.place(this.domNode, "heading-widget-holder", "only");
          if (window.DeviceMotionEvent) {
            window.addEventListener('deviceorientation', self.deviceOrientationHandler, false);
          } else {
            document.getElementById("dmEvent").innerHTML = "Not supported."
          }
        },

        deviceOrientationHandler: function(eventData) {
          console.log(eventData);
          var self = this;
          var heading = document.getElementById('degrees');
          // var deg = eventData.alpha;
          var deg = eventData.compassHeading || eventData.webkitCompassHeading || 0;
          self.heading = parseInt(deg, 10);
          heading.innerHTML = self.heading + '&deg;';
          var arrow = document.getElementById("arrow");

          domStyle.set('arrow', {
            WebkitTransform: 'rotate(' + deg + 'deg)'
          });
          domStyle.set('arrow', {
            '-moz-transform': 'rotate(' + deg + 'deg)'
          });
        },

        setHeading: function() {
          topic.publish('heading-picked', this.heading);
          this.destroy();
        }
      }
    );
  });
