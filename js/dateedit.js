Array.prototype.delete_element = function(obj) {
  // prototype.js
  var idx = this.indexOf(obj);
  if (idx > -1) {
    this.splice(idx, 1);
  }
};

function DateSelector(id, y, m, d, listener) {
  this.id = id;
  this.is_range = false;

  var div = document.createElement("div")
  div.setAttribute("id", "event_date[" + id + "]");
  this.element = div;

  var self = this;
  
  var delsw = document.createElement("a");
  delsw.appendChild(document.createTextNode("削除"));
  delsw.setAttribute("style", "margin-right:0.5em;");
  delsw.setAttribute("href", "javascript:;");
  delsw.onclick = function(e) {
    self.destroy();
  }
  
  div.appendChild(delsw);

  var span = this.create_select_element("event_date_from", id, y, m, d);
  div.appendChild(span);
  this.date_from = span;

  var sw = document.createElement("a");
  sw.setAttribute("id", "event_date_switch[" + id + "]");
  sw.appendChild(document.createTextNode(">>"));
  sw.setAttribute("href", "javascript:;");
  this.switch_element = sw;
  
  sw.onclick = function(e) {
    self.toggle_range();
    return null;
  }
  div.appendChild(sw);
  
  this.listener = listener;
}

DateSelector.prototype.destroy = function() {
  this.element.parentNode.removeChild(this.element);
  this.listener.del(this);
};

DateSelector.prototype.create_select_element = function(prefix, id, y, m, d) {
  var span = document.createElement("span");
  span.setAttribute("id", prefix + "[" + id + "]");

  var ymd = this.create_ymd_elements(prefix + "_", "[" + id + "]", y,m,d);
  this[prefix + "_ymd"] = ymd;
  
  span.appendChild(ymd[0]);
  span.appendChild(document.createTextNode(" 年 "));
  span.appendChild(ymd[1]);
  span.appendChild(document.createTextNode(" 月 "));
  span.appendChild(ymd[2]);
  span.appendChild(document.createTextNode(" 日 "));

  return span;  
};

DateSelector.prototype.create_ymd_elements = function(prefix, suffix, y, m, d) {
  var ymin = y - 5;
  var ymax = y + 5;
  var result = new Array;

  result[0] = document.createElement("select");
  result[0].setAttribute("name", prefix + "year" + suffix);
  this.add_options(result[0], y, ymin, ymax);

  result[1] = document.createElement("select");
  result[1].setAttribute("name", prefix + "month" + suffix);
  this.add_options(result[1], m, 1, 12);

  result[2] = document.createElement("select");
  result[2].setAttribute("name", prefix + "date" + suffix);
  this.add_options(result[2], d, 1, 31);

  return result;
};

DateSelector.prototype.add_options = function(e, def, min, max) {
  for(var i = min; i <= max; i++) {
    var o = document.createElement("option");
    o.setAttribute("value", i)
    if (def == i) {
      o.setAttribute("selected", "selected");
    }
    o.appendChild(document.createTextNode(i));
    e.appendChild(o);
  }
};

DateSelector.prototype.create_options_html = function(def, min, max) {    
  result = '';
  for(var i = min; i <= max; i++) {
    result += '<option value="' + i + '"';
    if (def == i) {
      result += 'selected';
    }
    result += '>' + i + '</option>\n';
  }
  return result;
};

DateSelector.prototype.get_date_from = function() {
  var s = this.event_date_from_ymd;
  return [Number(s[0].value), Number(s[1].value), Number(s[2].value)];
};

DateSelector.prototype.get_date_to = function() {
  var s = this.event_date_to_ymd;
  return [Number(s[0].value), Number(s[1].value), Number(s[2].value)];
};

DateSelector.prototype.add_ymd = function(d, n) {
  var d = new Date(d[0], d[1]-1, d[2]);
  d = new Date(d.getTime() + 86400000 * n);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
};

DateSelector.prototype.toggle_range = function() {
  if (this.is_range) {
    this.element.removeChild(this.range_mark);
    this.element.removeChild(this.date_to);
    
    var sw = this.switch_element;
    sw.replaceChild(document.createTextNode(">>"), sw.firstChild);
    this.is_range = false;
    this.range_mark = null;
    this.date_to = null;
  } else {
    var d = this.add_ymd(this.get_date_from(), 1);
    this.show_end_date(d[0], d[1], d[2]);
  }
};

DateSelector.prototype.show_end_date = function(y,m,d) {
  var sw = this.switch_element;
    
  this.range_mark = document.createElement("a");
  this.range_mark.appendChild(document.createTextNode(" ～ "));
  this.range_mark.setAttribute("href", "javascript:;");

  var s = this;
  this.range_mark.onclick = function(e) {
    s.toggle_range();
    return null;
  }

  this.element.insertBefore(this.range_mark, sw);
    
  var span = this.create_select_element("event_date_to", this.id, y, m, d);
  this.element.insertBefore(span, sw);
  this.date_to = span;
    
  sw.replaceChild(document.createTextNode("<<"), sw.firstChild);
  this.is_range = true;
};

DateSelector.prototype.to_s = function() {
  var a = this.get_date_from();
  var y = a[0];
  var m = a[1];
  var d = a[2];
  if (m < 10) m = "0" + m;
  if (d < 10) d = "0" + d;
  var result = y + "-" + m + "-" + d;

  if (this.is_range) {
    a = this.get_date_to();
    y = a[0];
    m = a[1];
    d = a[2];
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    result += " " + y + "-" + m + "-" + d;
  }
  return result;  
};
