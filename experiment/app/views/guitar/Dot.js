var PIXI = require('pixi.js/bin/pixi.dev.js');
var animate = require('app/util/animate');

module.exports = (function() {
  'use strict';

  var dotTextures = {};

  /**
   * Creates a new guitar dot point.
   * @param {number} pid - The ID for this dot.
   * @constructor
   */
  return function Dot(pid) {
    var onActivateCallback_;

    var gridDotMiddle;
    var gridDotUpperWhiteTouch;
    var gridDot;
    var gridDotUpper;
    var guitarString;
    var position = new PIXI.Point(0, 0);

    buildViews();

    var self = {
      gridDotMiddle,
      gridDotUpperWhiteTouch,
      gridDot,
      gridDotUpper,
      pid,
      setPosition,
      animateWhiteCircle,
      onActivate,
      enable,
      disable,
      animateMiddleDot,
      getString: () => guitarString,
      setString,
      getPosition: () => position
    };

    /**
     * Creates a new guitar dot point.
     * @param {Object} v - This string object.
     */
    function setString(v) {
      guitarString = v;

      if (v) {
        animateMiddleDot(1);
        animateWhiteCircle();
      } else {
        animateMiddleDot(0);
        animateWhiteCircle();
      }
    }

    /**
     * On activate.
     * @param {function} cb - The callback for onActivate.
     */
    function onActivate(cb) {
      onActivateCallback_ = cb;
    }

    /**
     * Creates the dot graphic.
     * @param {number} size - The dot size.
     * @param {number} color - The dot number.
     */
    function createDotGraphic(size, color) {
      if (!dotTextures[size]) {
        var dot = new PIXI.Graphics();
        dot.beginFill(0xffffff, 1);
        dot.drawCircle(0, 0, size);
        dot.endFill();

        dotTextures[size] = dot.generateTexture(window.devicePixelRatio > 1.5 ? 2 : 1);
      }

      var dotContainer = new PIXI.DisplayObjectContainer();
      var s = new PIXI.Sprite(dotTextures[size]);
      s.tint = color;
      s.anchor.x = s.anchor.y = 0.5;
      dotContainer.addChild(s);
      return dotContainer;
    }

    /**
     * Build all of the dot views.
     */
    function buildViews() {
      gridDot = createDotGraphic(10, 0x0d47a0);

      gridDotUpper = createDotGraphic(25, 0x536dfd);
      gridDotUpper.alpha = 0;

      gridDotUpperWhiteTouch = createDotGraphic(30, 0xffffff);
      gridDotUpperWhiteTouch.scale.x = gridDotUpperWhiteTouch.scale.y = 0.3;
      gridDot.addChildAt(gridDotUpperWhiteTouch, 0);

      gridDotMiddle = createDotGraphic(10, 0x536dfd);
      gridDotMiddle.alpha = 0;

      var shadowDotUpper2 = createDotGraphic(10, 0x000000);
      shadowDotUpper2.alpha = 0.09;
      shadowDotUpper2.position.x = shadowDotUpper2.position.y = 2;

      gridDotMiddle.addChildAt(shadowDotUpper2, 0);

      gridDot.id = pid;
      gridDot.hitArea = new PIXI.Circle(0, 0, 25);

      enable();
    }

    /**
     * Enable interactivity on the dot.
     */
    function enable() {
      gridDot.interactive = true;

      gridDot.mousedown = gridDot.touchstart = function( /* data */ ) {
       // data.originalEvent.preventDefault();
        // console.log( data.originalEvent.type + " originalEvent" )
        onActivateCallback_(self);
      };
    }

    /**
     * Disable interactivity on the dot.
     */
    function disable() {
      gridDot.interactive = false;
      gridDot.mousedown = gridDot.touchstart = null;
    }

    /**
     * Animate the dot when clicked/tapped.
     * @param {number} delay - The animation delay.
     */
    function animateWhiteCircle(delay) {
      gridDotUpperWhiteTouch.alpha = 0.3;
      gridDotUpperWhiteTouch.scale.x = gridDotUpperWhiteTouch.scale.y = 0.3;

      animate.to(gridDotUpperWhiteTouch.scale, 0.5, { x: 1.2, y: 1.2, delay:delay });
      animate.to(gridDotUpperWhiteTouch, 0.5, { alpha: 0, delay:delay });
    }

    /**
     * Creates a new guitar dot point.
     * @param {Object} v - This string object.
     */
    function animateMiddleDot(v) {
      animate.to(gridDotMiddle, 0.1, { alpha: v });
    }

    var positionTarget = { x: 0, y: 0, onUpdate: onUpdatePosition, ease: Expo.easeOut };

    /**
     * When position updates, update the position of the dot.
     */
    function onUpdatePosition() {
      gridDotUpper.position = position;
      gridDot.position = position;
      gridDotMiddle.position = position;

      if (guitarString) {
        guitarString.updateDotPosition(self);
      }
    }

    /**
     * When position updates, update the position of the dot.
     * @param {PIXI.Point} pos - The PIXI point object of the dot.
     */
    function setPosition(pos) {
      positionTarget.x = pos.x;
      positionTarget.y = pos.y;

      animate.to(position, 0.3, positionTarget);
    }

    return self;
  };
})();