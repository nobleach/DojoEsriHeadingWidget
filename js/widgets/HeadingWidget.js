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
          domConstruct.place(this.domNode, "heading-widget-holder", "only");
          var self = this;
          var compassContainer = dom.byId('compassContainer');
          var slider = document.getElementById('slider');
          var $slider = query('#slider');
          var sliderW2 = slider.clientWidth/2;
          var sliderH2 = slider.clientHeight/2;
          var radius = 100; //half of the circle obviously
          var deg = 0;
          var elP = domGeometry.position('compassContainer', false);
          var elPos = { x: elP.x, y: elP.y};
          var X = 0, Y = 0;
          var mdown = false;
          touch.press(compassContainer, function (e) {
            mdown = true;
          });
          touch.release(compassContainer, function (e) {
            mdown = false;
          });
          touch.move(compassContainer, function(e) {
            if (mdown) {
              var mPos = {x: e.clientX-elPos.x, y: e.clientY-elPos.y};
              var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
              deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position

              X = Math.round(radius* Math.sin(deg*Math.PI/180));
              Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));
              domStyle.set('slider', {
                left: X+radius-sliderW2+'px',
                top: Y+radius-sliderH2+'px'
              });
              // exact degrees to ball rotation
              domStyle.set('slider', {
                WebkitTransform: 'rotate(' + deg + 'deg)'
              });
              domStyle.set('slider', {
                '-moz-transform': 'rotate(' + deg + 'deg)'
              });
              //
              // PRINT DEGREES
              var heading = document.getElementById('degrees');
              self.heading = deg.toFixed(2);
              heading.innerHTML = deg.toFixed(2) + '&deg;';
            }
          });

        },
        setHeading: function() {
          topic.publish('heading-picked', this.heading);
          this.destroy();
        }
      }
    );
  });