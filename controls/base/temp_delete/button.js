  1 /**
  2  * Hilo
  3  * Copyright 2015 alibaba.com
  4  * Licensed under the MIT License
  5  */
  6 
  7 /**
  8  * @language=zh
  9  * <iframe src='../../../examples/Button.html?noHeader' width = '320' height = '170' scrolling='no'></iframe>
 10  * <br/>
 11  * 示例:
 12  * <pre>
 13  * var btn = new Hilo.Button({
 14  *     image: buttonImage,
 15  *     upState: {rect:[0, 0, 64, 64]},
 16  *     overState: {rect:[64, 0, 64, 64]},
 17  *     downState: {rect:[128, 0, 64, 64]},
 18  *     disabledState: {rect:[192, 0, 64, 64]}
 19  * });
 20  * </pre>
 21  * @class Button类表示简单按钮类。它有弹起、经过、按下和不可用等四种状态。
 22  * @augments View
 23  * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。此外还包括：
 24  * <ul>
 25  * <li><b>image</b> - 按钮图片所在的image对象。</li>
 26  * </ul>
 27  * @module hilo/view/Button
 28  * @requires hilo/core/Hilo
 29  * @requires hilo/core/Class
 30  * @requires hilo/view/View
 31  * @requires hilo/view/Drawable
 32  * @property {Object} upState 按钮弹起状态的属性或其drawable的属性的集合。
 33  * @property {Object} overState 按钮经过状态的属性或其drawable的属性的集合。
 34  * @property {Object} downState 按钮按下状态的属性或其drawable的属性的集合。
 35  * @property {Object} disabledState 按钮不可用状态的属性或其drawable的属性的集合。
 36  * @property {String} state 按钮的状态名称。它是 Button.UP|OVER|DOWN|DISABLED 之一。 只读属性。
 37  * @property {Boolean} enabled 指示按钮是否可用。默认为true。只读属性。
 38  * @property {Boolean} useHandCursor 当设置为true时，表示指针滑过按钮上方时是否显示手形光标。默认为true。
 39  */
 40  var Button = Class.create(/** @lends Button.prototype */{
 41     Extends: View,
 42     constructor: function(properties){
 43         properties = properties || {};
 44         this.id = this.id || properties.id || Hilo.getUid("Button");
 45         Button.superclass.constructor.call(this, properties);
 46 
 47         this.drawable = new Drawable(properties);
 48         this.setState(Button.UP);
 49     },
 50 
 51     upState: null,
 52     overState: null,
 53     downState: null,
 54     disabledState: null,
 55 
 56     state: null,
 57     enabled: true,
 58     useHandCursor: true,
 59 
 60     /**
 61      * @language=zh
 62      * 设置按钮是否可用。
 63      * @param {Boolean} enabled 指示按钮是否可用。
 64      * @returns {Button} 按钮本身。
 65      */
 66     setEnabled: function(enabled){
 67         if(this.enabled != enabled){
 68             if(!enabled){
 69                 this.setState(Button.DISABLED);
 70             }else{
 71                 this.setState(Button.UP);
 72             }
 73         }
 74         return this;
 75     },
 76 
 77     /**
 78      * @language=zh
 79      * 设置按钮的状态。此方法由Button内部调用，一般无需使用此方法。
 80      * @param {String} state 按钮的新的状态。
 81      * @returns {Button} 按钮本身。
 82      */
 83     setState: function(state){
 84         if(this.state !== state){
 85             this.state = state;
 86             this.pointerEnabled = this.enabled = state !== Button.DISABLED;
 87 
 88             var stateObj;
 89             switch(state){
 90                 case Button.UP:
 91                     stateObj = this.upState;
 92                     break;
 93                 case Button.OVER:
 94                     stateObj = this.overState;
 95                     break;
 96                 case Button.DOWN:
 97                     stateObj = this.downState;
 98                     break;
 99                 case Button.DISABLED:
100                     stateObj = this.disabledState;
101                     break;
102             }
103 
104             if(stateObj){
105                 this.drawable.init(stateObj);
106                 Hilo.copy(this, stateObj, true);
107             }
108         }
109 
110         return this;
111     },
112 
113     /**
114      * @language=zh
115      * overwrite
116      * @private
117      */
118     fire: function(type, detail){
119         if(!this.enabled) return;
120 
121         var evtType = typeof type === 'string' ? type : type.type;
122         switch(evtType){
123             case 'mousedown':
124             case 'touchstart':
125             case 'touchmove':
126                 this.setState(Button.DOWN);
127                 break;
128             case "mouseover":
129                 this.setState(Button.OVER);
130                 break;
131             case 'mouseup':
132                 if(this.overState) this.setState(Button.OVER);
133                 else if(this.upState) this.setState(Button.UP);
134                 break;
135             case 'touchend':
136             case 'touchout':
137             case 'mouseout':
138                 this.setState(Button.UP);
139                 break;
140         }
141 
142         return Button.superclass.fire.call(this, type, detail);
143     },
144 
145     Statics: /** @lends Button */ {
146         /**
147          * @language=zh
148          * 按钮弹起状态的常量值，即：'up'。
149          * @type String
150          */
151         UP: 'up',
152         /**
153          * @language=zh
154          * 按钮经过状态的常量值，即：'over'。
155          * @type String
156          */
157         OVER: 'over',
158         /**
159          * @language=zh
160          * 按钮按下状态的常量值，即：'down'。
161          * @type String
162          */
163         DOWN: 'down',
164         /**
165          * @language=zh
166          * 按钮不可用状态的常量值，即：'disabled'。
167          * @type String
168          */
169         DISABLED: 'disabled'
170     }
171  });