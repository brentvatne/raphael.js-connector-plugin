class Connector
    constructor: (@source, @target, @paper, @is_double_headed) ->
        @gimme_shortcut_variables_for @source, @target

    gimme_shortcut_variables_for: (source, target) ->
        #x's and y's are all in the top left of the element
        [@x1, @y1, @w1, @h1] = [source.attrs.x, source.attrs.y, source.attrs.width, source.attrs.height]
        [@x2, @y2, @w2, @h2] = [target.attrs.x, target.attrs.y, target.attrs.width, target.attrs.height]
        #top right bottom left (x's and y's are all centered)
        [@t1, @r1, @b1, @l1] = [source.top(), source.right(), source.bottom(), source.left()]
        [@t2, @r2, @b2, @l2] = [target.top(), target.right(), target.bottom(), target.left()]

    swap_source_and_target: () ->
        temp = @source
        @source = @target
        @target = temp
        @gimme_shortcut_variables_for @source, @target

    left_to_right: () ->
    right_to_left: () ->
    bottom_to_top: () ->
    top_to_bottom: () ->
    
    #not implemented in RightAngleConnector
    left_to_top: () ->
    right_to_top: () ->
    left_to_bottom: () ->
    right_to_bottom: () ->
    top_to_left: () ->
    top_to_right: () ->
    bottom_to_right: () ->
    bottom_to_left: () ->

class RightAngleConnector extends Connector
    left_to_right: () ->
        #draw line from middle-right of source to x-midpoint between source and target
        x_midpoint  = @r1.x + (@l2.x - @r1.x)*0.5
        start_point = "#{@r1.x} #{@r1.y}"
        end_point   = "#{x_midpoint} #{@r1.y}"
        line        = "M #{start_point} L #{end_point}"

        #start drawing down or up, to arrive even in y to the middle of the target
        start_point = end_point
        end_point   = "#{x_midpoint} #{@l2.y}"
        line       += "M #{start_point} L #{end_point}"

        #connect the line to the middle of the target
        start_point = end_point
        end_point   = "#{@l2.x}, #{@l2.y}"
        line       += "M #{start_point} L #{end_point}"

        if @is_double_headed 
            [@paper.path(line), 
             @paper.arrowhead(@r1.x, @r1.y, "left")
             @paper.arrowhead(@l2.x, @l2.y, "right")]
        else
            [@paper.path(line), @paper.arrowhead(@l2.x, @l2.y, "right")]

    right_to_left: () ->
        @swap_source_and_target()
        @left_to_right()
        @swap_source_and_target()

    bottom_to_top: () ->
        #draw line from middle bottom to the y-midpoint between the source and target, maintaining the same x
        y_midpoint  = @b1.y + (@t2.y - @b1.y - 30) #*0.9
        start_point = "#{@b1.x} #{@b1.y}"
        end_point   = "#{@b1.x} #{y_midpoint}"
        line        = "M #{start_point} L #{end_point}"

        #start drawing moving the line either left or right until over the x middle of the target
        start_point = end_point
        end_point   = "#{@t2.x} #{y_midpoint}"
        line       += "M #{start_point} L #{end_point}"

        #connect with the top middle of the target object
        start_point = end_point
        end_point   = "#{@t2.x} #{@t2.y}"
        line       += "M #{start_point} L #{end_point}"

        if @is_double_headed
            [@paper.path(line), 
             @paper.arrowhead(@b1.x, @b1.y, "up")
             @paper.arrowhead(@t2.x, @t2.y, "down")]
        else
            [@paper.path(line), @paper.arrowhead(@t2.x, @t2.y, "down")]

    top_to_bottom: () ->
        @swap_source_and_target()
        @bottom_to_top()
        @swap_source_and_target()

#these methods all return the MIDDLE
#keep in mind that the x and y refer to the top left of an element
Raphael.el.bottom = () ->
    {x: @attrs.x + @attrs.width*0.5, y: @attrs.y + @attrs.height}

Raphael.el.top = () ->
    {x: @attrs.x + @attrs.width*0.5, y: @attrs.y}

Raphael.el.right = () ->
    {x: @attrs.x + @attrs.width, y: @attrs.y + @attrs.height*0.5}

Raphael.el.left = () ->
    {x: @attrs.x, y: @attrs.y + @attrs.height*0.5}

Raphael.el.is_above = (other_element) ->
    bottom_edge_of_this = @top()
    top_edge_of_other = other_element.top()

    bottom_edge_of_this.y < top_edge_of_other.y
    
Raphael.el.is_below = (other_element) ->
    top_edge_of_this = @top()
    bottom_edge_of_other = other_element.bottom();

    top_edge_of_this.y > bottom_edge_of_other.y     

Raphael.el.is_inline_with = (other_element) ->
    not @is_below(other_element) and not @is_above(other_element)

Raphael.el.is_right_of = (other_element) ->
    left_edge_of_this = @left()
    right_edge_of_other = other_element.right()

    left_edge_of_this.x > right_edge_of_other.x

Raphael.el.is_left_of = (other_element) ->
    right_edge_of_this = @right()
    left_edge_of_other = other_element.left()

    right_edge_of_this.x < left_edge_of_other.x

Raphael.fn.connector = (source, target, options = { double_headed: false }, connector_class = RightAngleConnector) ->
    paper = this; double_headed = options.double_headed || false;

    connector = new connector_class(source, target, paper, double_headed) 

    if source.is_above target
        connector.bottom_to_top()
    else if source.is_below target
        connector.top_to_bottom()

    else if source.is_left_of target
        connector.left_to_right()

    else if source.is_right_of target
        connector.right_to_left()
    else
        #this would only occur if the source and target are 'coincident' ie on top of each other

Raphael.fn.arrowhead = (x, y, direction = "right", size = 6, color = "black") ->

    arrowhead_path_string = "M #{x} #{y} L #{x - size} #{y - size} L #{x - size} #{y + size} L #{x} #{y}"

    arrowhead = @path(arrowhead_path_string)
    arrowhead.attr "fill", color

    switch direction
        when "right" then degrees = 0
        when "down"  then degrees = 90
        when "left"  then degrees = 180
        when "up"    then degrees = 270

    arrowhead.rotate((degrees),x,y)

#makes an element active if it has been made inactive before
#otherwise it does nothing
Raphael.el.active = () ->
    @attr(this.active_attr) if @active_attr?

#sets an element as inactive, this will be used to declare when
#elements are not used in a given project
Raphael.el.inactive = () ->
    @active_attr = @attr()
    @attr(fill: "#ccc")
