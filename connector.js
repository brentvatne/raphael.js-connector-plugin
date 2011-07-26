(function() {
  var Connector, RightAngleConnector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Connector = (function() {
    function Connector(source, target, paper, is_double_headed) {
      this.source = source;
      this.target = target;
      this.paper = paper;
      this.is_double_headed = is_double_headed;
      this.gimme_shortcut_variables_for(this.source, this.target);
    }
    Connector.prototype.gimme_shortcut_variables_for = function(source, target) {
      var _ref, _ref2, _ref3, _ref4;
      _ref = [source.attrs.x, source.attrs.y, source.attrs.width, source.attrs.height], this.x1 = _ref[0], this.y1 = _ref[1], this.w1 = _ref[2], this.h1 = _ref[3];
      _ref2 = [target.attrs.x, target.attrs.y, target.attrs.width, target.attrs.height], this.x2 = _ref2[0], this.y2 = _ref2[1], this.w2 = _ref2[2], this.h2 = _ref2[3];
      _ref3 = [source.top(), source.right(), source.bottom(), source.left()], this.t1 = _ref3[0], this.r1 = _ref3[1], this.b1 = _ref3[2], this.l1 = _ref3[3];
      return _ref4 = [target.top(), target.right(), target.bottom(), target.left()], this.t2 = _ref4[0], this.r2 = _ref4[1], this.b2 = _ref4[2], this.l2 = _ref4[3], _ref4;
    };
    Connector.prototype.swap_source_and_target = function() {
      var temp;
      temp = this.source;
      this.source = this.target;
      this.target = temp;
      return this.gimme_shortcut_variables_for(this.source, this.target);
    };
    Connector.prototype.left_to_right = function() {};
    Connector.prototype.right_to_left = function() {};
    Connector.prototype.bottom_to_top = function() {};
    Connector.prototype.top_to_bottom = function() {};
    Connector.prototype.left_to_top = function() {};
    Connector.prototype.right_to_top = function() {};
    Connector.prototype.left_to_bottom = function() {};
    Connector.prototype.right_to_bottom = function() {};
    Connector.prototype.top_to_left = function() {};
    Connector.prototype.top_to_right = function() {};
    Connector.prototype.bottom_to_right = function() {};
    Connector.prototype.bottom_to_left = function() {};
    return Connector;
  })();
  RightAngleConnector = (function() {
    __extends(RightAngleConnector, Connector);
    function RightAngleConnector() {
      RightAngleConnector.__super__.constructor.apply(this, arguments);
    }
    RightAngleConnector.prototype.left_and_right = function(ends_at) {
      var arrowhead_attrs, end_point, line, start_point, x_midpoint, _ref;
      if (ends_at == null) {
        ends_at = "right";
      }
      if (ends_at === "left") {
        this.swap_source_and_target();
      }
      x_midpoint = this.r1.x + (this.l2.x - this.r1.x) * 0.5;
      start_point = "" + this.r1.x + " " + this.r1.y;
      end_point = "" + x_midpoint + " " + this.r1.y;
      line = "M " + start_point + " L " + end_point;
      start_point = end_point;
      end_point = "" + x_midpoint + " " + this.l2.y;
      line += "M " + start_point + " L " + end_point;
      start_point = end_point;
      end_point = "" + this.l2.x + ", " + this.l2.y;
      line += "M " + start_point + " L " + end_point;
      if (this.is_double_headed) {
        return this.paper.create_set([this.paper.path(line), this.paper.arrowhead(this.r1.x, this.r1.y, "left"), this.paper.arrowhead(this.l2.x, this.l2.y, "right")]);
      } else {
        arrowhead_attrs = (function() {
          switch (ends_at) {
            case "right":
              return [this.l2.x, this.l2.y, ends_at];
            case "left":
              return [this.r1.x, this.r1.y, ends_at];
          }
        }).call(this);
        return this.paper.create_set([this.paper.path(line), (_ref = this.paper).arrowhead.apply(_ref, arrowhead_attrs)]);
      }
    };
    RightAngleConnector.prototype.left_to_right = function() {
      return this.left_and_right("right");
    };
    RightAngleConnector.prototype.right_to_left = function() {
      return this.left_and_right("left");
    };
    RightAngleConnector.prototype.top_and_bottom = function(ends_at) {
      var arrowhead_attrs, end_point, line, set, start_point, y_midpoint, _ref;
      if (ends_at == null) {
        ends_at = "top";
      }
      if (ends_at === "bottom") {
        this.swap_source_and_target();
      }
      y_midpoint = this.b1.y + (this.t2.y - this.b1.y - 30);
      start_point = "" + this.b1.x + " " + this.b1.y;
      end_point = "" + this.b1.x + " " + y_midpoint;
      line = "M " + start_point + " L " + end_point;
      start_point = end_point;
      end_point = "" + this.t2.x + " " + y_midpoint;
      line += "M " + start_point + " L " + end_point;
      start_point = end_point;
      end_point = "" + this.t2.x + " " + this.t2.y;
      line += "M " + start_point + " L " + end_point;
      set = this.paper.set();
      if (this.is_double_headed) {
        return this.paper.create_set([this.paper.path(line), this.paper.arrowhead(this.b1.x, this.b1.y, "up"), this.paper.arrowhead(this.t2.x, this.t2.y, "down")]);
      } else {
        arrowhead_attrs = (function() {
          switch (ends_at) {
            case "top":
              return [this.t2.x, this.t2.y, "down"];
            case "bottom":
              return [this.b1.x, this.b1.y, "up"];
          }
        }).call(this);
        return this.paper.create_set([this.paper.path(line), (_ref = this.paper).arrowhead.apply(_ref, arrowhead_attrs)]);
      }
    };
    RightAngleConnector.prototype.bottom_to_top = function() {
      return this.top_and_bottom("top");
    };
    RightAngleConnector.prototype.top_to_bottom = function() {
      return this.top_and_bottom("bottom");
    };
    return RightAngleConnector;
  })();
  Raphael.el.belongs_to_set = function(set, type) {
    if (type == null) {
      type = null;
    }
    return this._parent_set = set;
  };
  Raphael.fn.create_set = function(elements) {
    var element, set, _i, _len;
    set = this.set(elements);
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      element.belongs_to_set(set);
    }
    return set;
  };
  Raphael.el.apply_to_entire_set = function(fn, args) {
    var element, _i, _len, _ref, _results;
    if (this._parent_set != null) {
      _ref = this._parent_set;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(element[fn].call(element, args));
      }
      return _results;
    } else {
      return this[fn].call(this, args);
    }
  };
  Raphael.el.bottom = function() {
    var shape;
    shape = this.type;
    if (shape === "rect") {
      return {
        x: this.attrs.x + this.attrs.width * 0.5,
        y: this.attrs.y + this.attrs.height
      };
    } else if (shape === "circle") {
      return {
        x: this.attrs.cx,
        y: this.attrs.cy + this.attrs.r
      };
    } else {
      return console.log("Raphael.el.bottom error: unsupported shape");
    }
  };
  Raphael.el.top = function() {
    var shape;
    shape = this.type;
    if (shape === "rect") {
      return {
        x: this.attrs.x + this.attrs.width * 0.5,
        y: this.attrs.y
      };
    } else if (shape === "circle") {
      return {
        x: this.attrs.cx,
        y: this.attrs.cy - this.attrs.r
      };
    } else {
      return console.log("Raphael.el.top error: unsupported shape");
    }
  };
  Raphael.el.right = function() {
    var shape;
    shape = this.type;
    if (shape === "rect") {
      return {
        x: this.attrs.x + this.attrs.width,
        y: this.attrs.y + this.attrs.height * 0.5
      };
    } else if (shape === "circle") {
      return {
        x: this.attrs.cx + this.attrs.r,
        y: this.attrs.cy
      };
    } else {
      return console.log("Raphael.el.right error: unsupported shape");
    }
  };
  Raphael.el.left = function() {
    var shape;
    shape = this.type;
    if (shape === "rect") {
      return {
        x: this.attrs.x,
        y: this.attrs.y + this.attrs.height * 0.5
      };
    } else if (shape === "circle") {
      return {
        x: this.attrs.cx - this.attrs.r,
        y: this.attrs.cy
      };
    } else {
      return console.log("Raphael.el.left error: unsupported shape");
    }
  };
  Raphael.el.is_above = function(other_element) {
    var bottom_edge_of_this, top_edge_of_other;
    bottom_edge_of_this = this.bottom();
    top_edge_of_other = other_element.top();
    return bottom_edge_of_this.y < top_edge_of_other.y;
  };
  Raphael.el.is_below = function(other_element) {
    var bottom_edge_of_other, top_edge_of_this;
    top_edge_of_this = this.top();
    bottom_edge_of_other = other_element.bottom();
    return top_edge_of_this.y > bottom_edge_of_other.y;
  };
  Raphael.el.is_inline_with = function(other_element) {
    return !this.is_below(other_element) && !this.is_above(other_element);
  };
  Raphael.el.is_right_of = function(other_element) {
    var left_edge_of_this, right_edge_of_other;
    left_edge_of_this = this.left();
    right_edge_of_other = other_element.right();
    return left_edge_of_this.x > right_edge_of_other.x;
  };
  Raphael.el.is_left_of = function(other_element) {
    var left_edge_of_other, right_edge_of_this;
    right_edge_of_this = this.right();
    left_edge_of_other = other_element.left();
    return right_edge_of_this.x < left_edge_of_other.x;
  };
  Raphael.fn.connector = function(source, target, options, connector_type) {
    var connector, double_headed, paper;
    if (options == null) {
      options = {
        double_headed: false
      };
    }
    if (connector_type == null) {
      connector_type = RightAngleConnector;
    }
    paper = this;
    double_headed = options.double_headed || false;
    connector = new connector_type(source, target, paper, double_headed);
    if (source.is_above(target)) {
      return connector.bottom_to_top();
    } else if (source.is_below(target)) {
      return connector.top_to_bottom();
    } else if (source.is_left_of(target)) {
      return connector.left_to_right();
    } else if (source.is_right_of(target)) {
      return connector.right_to_left();
    } else {
      return console.log("Raphael.fn.connector: source and target seem to have no position relative to one another");
    }
  };
  Raphael.fn.arrowhead = function(x, y, direction, size, color) {
    var arrowhead, arrowhead_path_string, degrees;
    if (direction == null) {
      direction = "right";
    }
    if (size == null) {
      size = 6;
    }
    if (color == null) {
      color = "black";
    }
    arrowhead_path_string = "M " + x + " " + y + " L " + (x - size) + " " + (y - size) + " L " + (x - size) + " " + (y + size) + " L " + x + " " + y;
    arrowhead = this.path(arrowhead_path_string);
    arrowhead.attr("fill", color);
    degrees = (function() {
      switch (direction) {
        case "right":
          return 0;
        case "down":
          return 90;
        case "left":
          return 180;
        case "up":
          return 270;
      }
    })();
    return arrowhead.rotate(degrees, x, y);
  };
  Raphael.el.active = function() {
    if (this.active_attr != null) {
      return this.attr(this.active_attr);
    }
  };
  Raphael.el.inactive = function() {
    this.active_attr = this.attr();
    return this.attr({
      fill: "#ccc"
    });
  };
}).call(this);
