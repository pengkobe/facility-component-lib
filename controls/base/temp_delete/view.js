  1 /**
  2  * Hilo
  3  * Copyright 2015 alibaba.com
  4  * Licensed under the MIT License
  5  */
  6 
  7 /**
  8  * @language=zh
  9  * @class View类是所有可视对象或组件的基类。
 10  * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 11  * @module hilo/view/View
 12  * @requires hilo/core/Hilo
 13  * @requires hilo/core/Class
 14  * @requires hilo/event/EventMixin
 15  * @requires hilo/geom/Matrix
 16  * @property {String} id 可视对象的唯一标识符。
 17  * @property {Number} x 可视对象的x轴坐标。默认值为0。
 18  * @property {Number} y 可视对象的y轴坐标。默认值为0。
 19  * @property {Number} width 可视对象的宽度。默认值为0。
 20  * @property {Number} height 可视对象的高度。默认值为0。
 21  * @property {Number} alpha 可视对象的透明度。默认值为1。
 22  * @property {Number} rotation 可视对象的旋转角度。默认值为0。
 23  * @property {Boolean} visible 可视对象是否可见。默认为可见，即true。
 24  * @property {Number} pivotX 可视对象的中心点的x轴坐标。默认值为0。
 25  * @property {Number} pivotY 可视对象的中心点的y轴坐标。默认值为0。
 26  * @property {Number} scaleX 可视对象在x轴上的缩放比例。默认为不缩放，即1。
 27  * @property {Number} scaleY 可视对象在y轴上的缩放比例。默认为不缩放，即1。
 28  * @property {Boolean} pointerEnabled 可视对象是否接受交互事件。默认为接受交互事件，即true。
 29  * @property {Object} background 可视对象的背景样式。可以是CSS颜色值、canvas的gradient或pattern填充。
 30  * @property {Graphics} mask 可视对象的遮罩图形。
 31  * @property {String|Function} align 可视对象相对于父容器的对齐方式。取值可查看Hilo.align枚举对象。
 32  * @property {Container} parent 可视对象的父容器。只读属性。
 33  * @property {Number} depth 可视对象的深度，也即z轴的序号。只读属性。
 34  * @property {Drawable} drawable 可视对象的可绘制对象。供高级开发使用。
 35  * @property {Array} boundsArea 可视对象的区域顶点数组。格式为：[{x:10, y:10}, {x:20, y:20}]。
 36  */
 37 var View = (function(){
 38 
 39 return Class.create(/** @lends View.prototype */{
 40     Mixes: EventMixin,
 41     constructor: function(properties){
 42         properties = properties || {};
 43         this.id = this.id || properties.id || Hilo.getUid("View");
 44         Hilo.copy(this, properties, true);
 45     },
 46 
 47     id: null,
 48     x: 0,
 49     y: 0,
 50     width: 0,
 51     height: 0,
 52     alpha: 1,
 53     rotation: 0,
 54     visible: true,
 55     pivotX: 0,
 56     pivotY: 0,
 57     scaleX: 1,
 58     scaleY: 1,
 59     pointerEnabled: true,
 60     background: null,
 61     mask: null,
 62     align: null,
 63     drawable: null,
 64     boundsArea: null,
 65     parent: null,
 66     depth: -1,
 67 
 68     /**
 69      * @language=zh
 70      * 返回可视对象的舞台引用。若对象没有被添加到舞台，则返回null。
 71      * @returns {Stage} 可视对象的舞台引用。
 72      */
 73     getStage: function(){
 74         var obj = this, parent;
 75         while(parent = obj.parent) obj = parent;
 76         //NOTE: don't use `instanceof` to prevent circular module requirement.
 77         //But it's not a very reliable way to check it's a stage instance.
 78         if(obj.canvas) return obj;
 79         return null;
 80     },
 81 
 82     /**
 83      * @language=zh
 84      * 返回可视对象缩放后的宽度。
 85      * @returns {Number} 可视对象缩放后的宽度。
 86      */
 87     getScaledWidth: function(){
 88         return this.width * this.scaleX;
 89     },
 90 
 91     /**
 92      * @language=zh
 93      * 返回可视对象缩放后的高度。
 94      * @returns {Number} 可视对象缩放后的高度。
 95      */
 96     getScaledHeight: function(){
 97         return this.height * this.scaleY;
 98     },
 99 
100     /**
101      * @language=zh
102      * 添加此对象到父容器。
103      * @param {Container} container 一个容器。
104      * @param {Uint} index 要添加到索引位置。
105      * @returns {View} 可视对象本身。
106      */
107     addTo: function(container, index){
108         if(typeof index === 'number') container.addChildAt(this, index);
109         else container.addChild(this);
110         return this;
111     },
112 
113     /**
114      * @language=zh
115      * 从父容器里删除此对象。
116      * @returns {View} 可视对象本身。
117      */
118     removeFromParent: function(){
119         var parent = this.parent;
120         if(parent) parent.removeChild(this);
121         return this;
122     },
123 
124     /**
125      * @language=zh
126      * 获取可视对象在舞台全局坐标系内的外接矩形以及所有顶点坐标。
127      * @returns {Array} 可视对象的顶点坐标数组vertexs。另vertexs还包含属性：
128      * <ul>
129      * <li><b>x</b> - 可视对象的外接矩形x轴坐标。</li>
130      * <li><b>y</b> - 可视对象的外接矩形y轴坐标。</li>
131      * <li><b>width</b> - 可视对象的外接矩形的宽度。</li>
132      * <li><b>height</b> - 可视对象的外接矩形的高度。</li>
133      * </ul>
134      */
135     getBounds: function(){
136         var w = this.width, h = this.height,
137             mtx = this.getConcatenatedMatrix(),
138             poly = this.boundsArea || [{x:0, y:0}, {x:w, y:0}, {x:w, y:h}, {x:0, y:h}],
139             vertexs = [], point, x, y, minX, maxX, minY, maxY;
140 
141         for(var i = 0, len = poly.length; i < len; i++){
142             point = mtx.transformPoint(poly[i], true, true);
143             x = point.x;
144             y = point.y;
145 
146             if(i == 0){
147                 minX = maxX = x;
148                 minY = maxY = y;
149             }else{
150                 if(minX > x) minX = x;
151                 else if(maxX < x) maxX = x;
152                 if(minY > y) minY = y;
153                 else if(maxY < y) maxY = y;
154             }
155             vertexs[i] = point;
156         }
157 
158         vertexs.x = minX;
159         vertexs.y = minY;
160         vertexs.width = maxX - minX;
161         vertexs.height = maxY - minY;
162         return vertexs;
163     },
164 
165     /**
166      * @language=zh
167      * 获取可视对象相对于其某个祖先（默认为最上层容器）的连接矩阵。
168      * @param {View} ancestor 可视对象的相对的祖先容器。
169      * @private
170      */
171     getConcatenatedMatrix: function(ancestor){
172         var mtx = new Matrix(1, 0, 0, 1, 0, 0);
173 
174         for(var o = this; o != ancestor && o.parent; o = o.parent){
175             var cos = 1, sin = 0,
176                 rotation = o.rotation % 360,
177                 pivotX = o.pivotX, pivotY = o.pivotY,
178                 scaleX = o.scaleX, scaleY = o.scaleY;
179 
180             if(rotation){
181                 var r = rotation * Math.PI / 180;
182                 cos = Math.cos(r);
183                 sin = Math.sin(r);
184             }
185 
186             if(pivotX != 0) mtx.tx -= pivotX;
187             if(pivotY != 0) mtx.ty -= pivotY;
188             mtx.concat(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, o.x, o.y);
189         }
190         return mtx;
191     },
192 
193     /**
194      * @language=zh
195      * 检测由x和y参数指定的点是否在其外接矩形之内。
196      * @param {Number} x 要检测的点的x轴坐标。
197      * @param {Number} y 要检测的点的y轴坐标。
198      * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
199      * @returns {Boolean} 点是否在可视对象之内。
200      */
201     hitTestPoint: function(x, y, usePolyCollision){
202         var bound = this.getBounds(),
203             hit = x >= bound.x && x <= bound.x + bound.width &&
204                   y >= bound.y && y <= bound.y + bound.height;
205 
206         if(hit && usePolyCollision){
207             hit = pointInPolygon(x, y, bound);
208         }
209         return hit;
210     },
211 
212     /**
213      * @language=zh
214      * 检测object参数指定的对象是否与其相交。
215      * @param {View} object 要检测的可视对象。
216      * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
217      */
218     hitTestObject: function(object, usePolyCollision){
219         var b1 = this.getBounds(),
220             b2 = object.getBounds(),
221             hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width &&
222                   b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;
223 
224         if(hit && usePolyCollision){
225             hit = polygonCollision(b1, b2);
226         }
227         return !!hit;
228     },
229 
230     /**
231      * @language=zh
232      * 可视对象的基本渲染实现，用于框架内部或高级开发使用。通常应该重写render方法。
233      * @param {Renderer} renderer 渲染器。
234      * @param {Number} delta 渲染时时间偏移量。
235      * @protected
236      */
237     _render: function(renderer, delta){
238         if((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)){
239             renderer.transform(this);
240             this.render(renderer, delta);
241             renderer.endDraw(this);
242         }
243     },
244     /**
245      * @language=zh
246      * 冒泡鼠标事件
247     */
248     _fireMouseEvent:function(e){
249         e.eventCurrentTarget = this;
250         this.fire(e);
251 
252         // 处理mouseover事件 mouseover不需要阻止冒泡
253         // handle mouseover event, mouseover needn't stop propagation.
254         if(e.type == "mousemove"){
255             if(!this.__mouseOver){
256                 this.__mouseOver = true;
257                 var overEvent = Hilo.copy({}, e);
258                 overEvent.type = "mouseover";
259                 this.fire(overEvent);
260             }
261         }
262         else if(e.type == "mouseout"){
263             this.__mouseOver = false;
264         }
265 
266         // 向上冒泡
267         // handle event propagation
268         var parent = this.parent;
269         if(!e._stopped && !e._stopPropagationed && parent){
270             if(e.type == "mouseout" || e.type == "touchout"){
271                 if(!parent.hitTestPoint(e.stageX, e.stageY, true)){
272                     parent._fireMouseEvent(e);
273                 }
274             }
275             else{
276                 parent._fireMouseEvent(e);
277             }
278         }
279     },
280 
281     /**
282      * @language=zh
283      * 更新可视对象，此方法会在可视对象渲染之前调用。此函数可以返回一个Boolean值。若返回false，则此对象不会渲染。默认值为null。
284      * 限制：如果在此函数中改变了可视对象在其父容器中的层级，当前渲染帧并不会正确渲染，而是在下一渲染帧。可在其父容器的onUpdate方法中来实现。
285      * @type Function
286      * @default null
287      */
288     onUpdate: null,
289 
290     /**
291      * @language=zh
292      * 可视对象的具体渲染逻辑。子类可通过覆盖此方法实现自己的渲染。
293      * @param {Renderer} renderer 渲染器。
294      * @param {Number} delta 渲染时时间偏移量。
295      */
296     render: function(renderer, delta){
297         renderer.draw(this);
298     },
299 
300     /**
301      * @language=zh
302      * 返回可视对象的字符串表示。
303      * @returns {String} 可视对象的字符串表示。
304      */
305     toString: function(){
306         return Hilo.viewToString(this);
307     }
308 });
309 
310 /**
311  * @language=zh
312  * @private
313  */
314 function pointInPolygon(x, y, poly){
315     var cross = 0, onBorder = false, minX, maxX, minY, maxY;
316 
317     for(var i = 0, len = poly.length; i < len; i++){
318         var p1 = poly[i], p2 = poly[(i+1)%len];
319 
320         if(p1.y == p2.y && y == p1.y){
321             p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
322             if(x >= minX && x <= maxX){
323                 onBorder = true;
324                 continue;
325             }
326         }
327 
328         p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
329         if(y < minY || y > maxY) continue;
330 
331         var nx = (y - p1.y)*(p2.x - p1.x) / (p2.y - p1.y) + p1.x;
332         if(nx > x) cross++;
333         else if(nx == x) onBorder = true;
334 
335         //当射线和多边形相交
336         if(p1.x > x && p1.y == y){
337             var p0 = poly[(len+i-1)%len];
338             //当交点的两边在射线两旁
339             if(p0.y < y && p2.y > y || p0.y > y && p2.y < y){
340                 cross ++;
341             }
342         }
343     }
344 
345     return onBorder || (cross % 2 == 1);
346 }
347 
348 /**
349  * @language=zh
350  * @private
351  */
352 function polygonCollision(poly1, poly2){
353     var result = doSATCheck(poly1, poly2, {overlap:-Infinity, normal:{x:0, y:0}});
354     if(result) return doSATCheck(poly2, poly1, result);
355     return false;
356 }
357 
358 /**
359  * @language=zh
360  * @private
361  */
362 function doSATCheck(poly1, poly2, result){
363     var len1 = poly1.length, len2 = poly2.length,
364         currentPoint, nextPoint, distance,
365         min1, max1, min2, max2, dot, overlap, normal = {x:0, y:0};
366 
367     for(var i = 0; i < len1; i++){
368         currentPoint = poly1[i];
369         nextPoint = poly1[(i < len1-1 ? i+1 : 0)];
370 
371         normal.x = currentPoint.y - nextPoint.y;
372         normal.y = nextPoint.x - currentPoint.x;
373 
374         distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
375         normal.x /= distance;
376         normal.y /= distance;
377 
378         min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;
379         for(var j = 1; j < len1; j++){
380             dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
381             if(dot > max1) max1 = dot;
382             else if(dot < min1) min1 = dot;
383         }
384 
385         min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;
386         for(j = 1; j < len2; j++){
387             dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
388             if(dot > max2) max2 = dot;
389             else if(dot < min2) min2 = dot;
390         }
391 
392         if(min1 < min2){
393             overlap = min2 - max1;
394             normal.x = -normal.x;
395             normal.y = -normal.y;
396         }else{
397             overlap = min1 - max2;
398         }
399 
400         if(overlap >= 0){
401             return false;
402         }else if(overlap > result.overlap){
403             result.overlap = overlap;
404             result.normal.x = normal.x;
405             result.normal.y = normal.y;
406         }
407     }
408 
409     return result;
410 }
411 
412 })();