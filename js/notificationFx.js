/**
 * notificationFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	var docElem = window.document.documentElement,
		support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	
	/**
	 * extend obj function
	 */
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * NotificationFx function
	 */
	function NotificationFx( options ) {	
		this._init(options);
	}

	/**
	 * NotificationFx options
	 */
	NotificationFx.prototype.options = {
		// element to which the notification will be appended
		// defaults to the document.body
		wrapper : document.body,
		// the message
		message : 'yo!',
		// layout type: growl|attached|bar|other
		layout : 'growl',
		// effects for the specified layout:
		// for growl layout: scale|slide|genie|jelly
		// for attached layout: flip|bouncyflip
		// for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
		// ...
		effect : 'slide',
		// notice, warning, error, success
		// will add class ns-type-warning, ns-type-error or ns-type-success
		type : 'error',
		// if the user doesn´t close the notification then we remove it 
		// after the following time
		ttl : 6000,
		// callbacks
		onClose : function() { return false; },
		onOpen : function() { return false; }
	}

	/**
	 * init function
	 * initialize and cache some vars
	 */
	NotificationFx.prototype._init = function(options) {
		this.options = extend( {}, this.options );
		extend( this.options, options );

		// create HTML structure
		this.ntf = document.createElement( 'div' );
		this.ntf.className = 'ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type;
		var strinner = '<div class="ns-box-inner">';
		strinner += this.options.message;
		strinner += '</div>';
		strinner += '<span class="ns-close"></span></div>';
		this.ntf.innerHTML = strinner;

		// append to body or the element specified in options.wrapper
		// this.options.wrapper.insertBefore( this.ntf, this.options.wrapper.firstChild );
	}

	/**
	 * init events
	 */
	NotificationFx.prototype._initEvents = function() {
		var self = this;
		var closeBtn = self.ntf.querySelector( '.ns-close' );
		// dismiss notification
		function dismissCallback() {
			closeBtn.removeEventListener('click', dismissCallback);
			self.dismiss();
		}
		closeBtn.addEventListener( 'click', dismissCallback);
	}

	/**
	 * show the notification
	 */
	NotificationFx.prototype.show = function(options) {
		var self = this;

		if (options) {
			self._init(options);
		}
		self.options.wrapper.insertBefore( self.ntf, self.options.wrapper.firstChild );
		// init events
		self._initEvents();

		self.active = true;

		classie.remove( self.ntf, 'ns-hide' );
		self.ntf.offsetHeight;

		if (typeof self.options.onOpen === 'function')
			self.options.onOpen();

		classie.add( self.ntf, 'ns-show' );

		if(self.options.ttl) { // checks to make sure ttl is not set to false in notification initialization
			self.dismissttl = setTimeout( function() {
				if( self.active ) {
					self.dismiss();
				}
			}, self.options.ttl );
		}
	}

	/**
	 * dismiss the notification
	 */
	NotificationFx.prototype.dismiss = function() {
		var self = this;
		self.active = false;
		clearTimeout( self.dismissttl );
		classie.remove( self.ntf, 'ns-show' );
		self.ntf.offsetHeight;

		// callback
		if (typeof self.options.onClose === 'function')
			self.options.onClose();

		// after animation ends remove ntf from the DOM
		var onEndAnimationFn = function( ev ) {
			if( support.animations ) {
				if( ev.target !== self.ntf ) return false;
				self.ntf.removeEventListener( animEndEventName, onEndAnimationFn );
			}
			self.options.wrapper.removeChild( self.ntf );
		};

		if( support.animations ) {
			self.ntf.addEventListener( animEndEventName, onEndAnimationFn );
			classie.add( self.ntf, 'ns-hide' );
		}
		else {
			classie.add( self.ntf, 'ns-hide' );
			onEndAnimationFn();
		}
	}

	/**
	 * add to global namespace
	 */
	window.NotificationFx = NotificationFx;

} )( window );
