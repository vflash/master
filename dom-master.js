﻿
var domMaster;

(function() {
	'use strict'; domMaster = new_master(document);

	// по умолчанию все параметры вставляются через nn.setAttribute(x, v);
	// за исключением приведенного списка и параметров начинаюшиеся с символа "_" пример {_xxxx: 333}

	var u, badIE = '\v'=='v' && document.createElement('span').style.opacity === u; // badIE = IE<9


	function new_master(d, NS) {
		var NS = NS || {
			'svg': 'http://www.w3.org/2000/svg',
			'constructor': null
		};

		d = d ? d.ownerDocument || d : document;

		master.document = d;
		master.NS = NS;

		master.text = text;
		master.map = map;
		master.clone = clone;
		master.html = html;
		master.tolist = tolist; // эксперементальный функционал

		return master;


		function master(nn, q) {
			//if (nn === 'text') return d.createTextNode(q); // в ж. этот функционал . нужно использовать _.text("eeeeee")
			if (!nn) return;

			var u
			, append_index = 1 // с какого аргумента наченаются потомки
			, params = false
			, nsnode = false
			, is_group // флаг что это группа (nodeType < 0)
			, pn, i, x, id, css
			;

			if (typeof q === 'object' && q !== null && !q.nodeType) {
				if (q.length === u || !isArray(q)) {
					append_index = 2; // потомки с 3-го аргумента
					params = q;
				};
			}; 

			// create element
			switch (nn) {
				case 'div': case 'li': case 'br': case 'span': case 'a': case 'td':
					nn = d.createElement(nn);
					break;

				case 'DocumentFragment': nn = d.createDocumentFragment(); params = false; break;
				case 'body': nn = d.body; break;


				default:
					if (typeof nn !== 'string') {
						if (typeof nn === 'function') {
							if (!nn.prototype.nodeType) nn.prototype.nodeType = -1;
							nn = new nn(master, params, false);
							i = nn.nodeType;
							is_group = i < 0;
							if (!is_group) params = false;

						} else {
							i = nn.nodeType;
							is_group = i < 0;
						};

						if (!i) return nn;
						break;
					};

					if (nn.indexOf(':') !== -1) {
						i = nn.indexOf(':');
						nsnode = NS[nn.substring(0, i)];
						if (!nsnode) return null;

						nn = nn.substring(++i);
					};

					// tag.className className#idNode
					if (nn.indexOf('#') > 0) {
						x = nn.indexOf('#');
						id = nn.substring(x + 1);
					} else {
						x = u;
					};

					i = nn.indexOf('.');
					if (i > 0) {
						css = x ? nn.substring(i + 1, x) : nn.substring(i + 1);
						x = i;
					};

					if (x) nn = nn.substring(0, x);

					nn = nn === 'body' ? d.body 
						: nsnode ? d.createElementNS(nsnode, nn||'div') 
							: nn === 'button' && badIE ? d.createElement('<button type="'+(params.type||'button')+'">')
								: d.createElement(nn||'div')
					;
			};

			if (is_group) {
				// params
				if (params) {
					// nn._set_parameters - дает право мастеру изменянять значения через функцию set({key: value, ...})
					if (nn._set_parameters === true && typeof nn.set == 'function') {
						nn.set(params);
					};
				};

				

				// append
				if (typeof nn.appendChild !== 'function') {
					pn = nn; while(pn.nodeType < 0) pn = pn.box || pn.node || false;
					//pn = nn.box || nn.node || false;
					if (pn.nodeType > 0) {
						append_nativ(d, pn, arguments, append_index);
					};
				} else {
					append_other(d, nn, arguments, append_index);
				};

				return nn;
			};

			if (params) {
				if (nsnode) {
					set_attrNS(d, nn, params||false, css, id);
				} else {
					set_attr(d, nn, params, css, id);
				};

			} else {
				if (css) nsnode ? nn.setAttribute('class', css) : nn.className = css;
				if (id) nn.id = id;
			};

			append_nativ(d, nn, arguments
				, append_index
			);

			return nn;
		};
	};



	// ----------------------------------------------------------------------






	function append_nativ(d, pn, m, i) {
		var l = m.length, a;

		while(i < l) {
			a = m[i++];

			if (a === false || a == null || a !== a ) continue; 

			if (typeof a === 'object') { 
				if (a.nodeType > 0) {
					pn.appendChild(a);

				} else if (a.nodeType < 0) {
					if (a = a.node) {
						while(a.nodeType < 0) a = a.node || false;

						if (a.nodeType > 0) {
							pn.appendChild(a);

						} else if (isArray(a)) {
							append_nativ(d, pn, a, 0);
						};
					};

				} else if (isArray(a)) {
					append_nativ(d, pn, a, 0);
				};

			} else {
				pn.appendChild(d.createTextNode(a));
			};
		};
	};

	// у обьекта свой способ добавления потомков
	function append_other(d, nn, m, si) {
		var i = si, l = m.length, a, x;
		
		while(i < l) {
			if (a = m[i++]) {
				if (a.nodeType) {
					nn.appendChild(a);
				};

			} else if (a !== 0) {
				continue;
			};

			switch (typeof a) {
				case 'number': if (a !== a) break;
				case 'string':
					nn.appendChild(d.createTextNode(a));
					break;

				case 'object':
					if (isArray(a)) append_other(nn, a);
			};

		};
	};



	// set params

	function set_attrNS(d, nn, params, css, id) {
		if (!params) {
			if (css) nn.setAttribute('class', css);
			if (id) nn.id = id;
			return;
		};

		var u, x, v;
		for (x in params) {
			v = params[x];

			if (v == null) continue;

			switch (x) {
				case 'id': if (v) id = v; break;

				case 'class': case 'css':
					if (v) css = css ? css + ' ' + v : v;
					break;

				default:
					if (x.charCodeAt(0) === 95) { // "_"
						nn[x] = v;
					} else {
						nn.setAttribute(x, v);
					};
			};
		};

		if (css) nn.setAttribute('class', css);
		if (id) nn.id = id;
	};

	var attr_to_param = { constructor: null
		, 'name': badIE ? null : 'name'
		//, 'type': badIE ? null : 'type'
		, 'value': typeof opera == 'object' ? null : 'value'
		, 'title': 'title'
		, 'src': 'src'
		, 'href': 'href'
		, 'tabindex': 'tabIndex'
		, 'zindex': 'zIndex'
		, 'checked': 'checked'
		, 'disabled': 'disabled'
	};


	function set_attr(d, nn, params, css, id) {
		var u, x, v, i;

		for (x in params) {
			v = params[x];

			if (v === u || v === null) continue;

			if (x == 'css' || x === 'class') {
				if (v) css = css ? css + ' ' + v : v;
				continue;
			};

			if (i = attr_to_param[x]) {
				nn[i] = v;
				continue;
			};

			switch (x) {
				case 'text': 
					if (v || v === '' || v === 0) {
						nn.appendChild(d.createTextNode(v));
					};
					break;

				case 'id': if (v) id = v; break;
				case 'style': nn.style.cssText = String(v); break;

				case 'onclick': case 'onmousedown': case 'onmouseup': case 'onmousemove': case 'onmouseover': case 'onmouseout': case 'onchange': case 'onsubmit': case 'onresize': case 'onscroll': case 'onselectstart': case 'onfocus': case 'onblur':
					if (typeof v === 'function') {
						nn[x] = v;
					} else {
						nn.setAttribute(x, v);
					};
					break;

				default:
					if (x.charCodeAt(0) === 95) { // "_"
						nn[x] = v; 
					} else {
						nn.setAttribute(x, v);
					};
			};
		};

		if (css) nn.className = css;
		if (id) nn.id = id;
	};

	var isArray = Array.isArray || new function (o) {
		var x = Object.prototype.toString, s = x.call([]);
		return function (o) {
			return x.call(o) === s
		}
	};


	function text(v, fn) {
		return typeof fn === 'function' ? textFunc(this.document, v, fn)
			: this.document.createTextNode(v || (v === 0 ? 0 : ''))
		;
	};

	function textFunc(d, v, fn) {
		var n = d.createTextNode('');
		(n.set = function() {n.data = fn.apply(n, arguments)})(v);

		return n;
	};

	function clone(doc) {
		return new_master(doc||this.document, this.NS);
	};



	var N2A;
	try {N2A = Array.prototype.slice.call(document.documentElement.childNodes) instanceof Array} catch (e) { }

	function html(x) {
		var n = this.nullNode || (this.nullNode = this.document.createElement('div')), a, i;
		n.innerHTML = x;
		n = n.childNodes;

		if (i = n.length) {
			if (N2A) return Array.prototype.slice.call(n);

			for (a = []; i--; ) a[i] = n[i];
			return a
		}
	};




	function map(a, func) {
		if (!a || typeof func !== 'function') {
			return;
		};

		if (typeof a === 'number') {
			a = {length: a};
		};

		var l = a.length
		, i = 1
		, iend = l - 1
		, m = []
		, e = {first: true, last: l === 1, list: a, index: 0, push: push} //, master: this
		, v, u
		;

		function push(v) {m.push(v)};

		if (0 < l) {
			v = func(a[0], e, this);
			if (v || v === 0 || v === '') {
				m.push(v)
			};

			e.first = false;
		};

		for (; i < l; i++) {
			if (i === iend) e.last = true;
			e.index = i;

			v = func(a[i], e, this);
			if (v !== u) m.push(v);
		};

		return m;
	};



	/*
	_('div'
		, _.tolist("Стоимость товара %0 руб. %1 коп."
			, ns.rub = _.text('00')
			, ns.kop = _.text('00')
		)
	)
	*/

	function tolist(s) {
		var u
		, arg_length = arguments.length
		, sbuff = ''
		, xa = []
		, pp = 0
		, key, i, j, z
		;
		
		for(i = s.indexOf('%'); i !== -1; i = s.indexOf('%', i)) {
			z = i++;
			j = s.charCodeAt(i);
			if (j !== j) {
				break;
			};

			if (j === 37) { // %
				sbuff += s.substring(pp, i++);
				pp = i;
				continue;
			} 
			else if (j < 48 && j > 57) {
				continue;
			};

			key = j - 48;

			j = s.charCodeAt(++i);
			while(j > 47 && j < 58) {
				key = key * 10 + (j - 48);
				j = s.charCodeAt(++i);
			};

			if (j === 37) i += 1;

			++key;
			if (key < arg_length && arguments[key] !== u) {
				if(sbuff || z > pp) {
					xa.push(sbuff + s.substring(pp, z));
					sbuff = '';
				};

				xa.push(arguments[key]);
				arguments[key] = u;

				pp = i;
			};
		};

		if (pp < s.length) {
			xa.push( sbuff + s.substr(pp) );
		};
		
		return xa;
	};

})();
