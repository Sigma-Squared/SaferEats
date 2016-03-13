'use strict';
class SimpleQuadTree {
    constructor(min_x, min_y, max_x, max_y,  thisdepth, max_depth, root) {
        thisdepth = thisdepth || 1;
        this.root = root;
        this.min_x = min_x;
        this.min_y = min_y;
        this.max_x = max_x;
        this.max_y = max_y;
        this.width = max_x - min_x;
        this.height= max_y - min_y;
        
        if (thisdepth < max_depth) {
            this.leaf = false;
            let mid_x = this.min_x+this.width/2;
            let mid_y = this.min_y+this.height/2;
            this.tl = new SimpleQuadTree(min_x, min_y, mid_x, mid_y, thisdepth+1, max_depth, false);
            this.tr = new SimpleQuadTree(mid_x, min_y, max_x, mid_y, thisdepth+1, max_depth, false);
            this.bl = new SimpleQuadTree(min_x, mid_y, mid_x, max_y, thisdepth+1, max_depth, false);
            this.br = new SimpleQuadTree(mid_x, mid_y, max_x, max_y, thisdepth+1, max_depth, false);
            this.children = [this.tl, this.tr, this.bl, this.br];
        }
        else {
            this.leaf = true;
            this.restaurants = []
        }
        
    }
    insert(restaurant) {
        if (this.root && !this.contains(restaurant.location)) return false;
        if (this.leaf) {
            this.restaurants.push(restaurant);
            return true;
        }
        else {
            for (let child of this.children) {
                if (child.contains(restaurant.location)) {
                    return child.insert(restaurant);
                }
            }
            return false;
        }
    }
    find (loc) {
        if (this.root && !this.contains(loc)) return null;
        if (this.leaf)
            return this.restaurants;
        else {
            for (let child of this.children) {
                if (child.contains(loc)) {
                    return child.find(loc);
                }
            }
            return [];
        }
    }
    draw(ctx) {
        if (!this.leaf) {
            this.tl.draw(ctx)
            this.tr.draw(ctx);
            this.bl.draw(ctx);
            this.br.draw(ctx);
        }
        else {
          for (let rest of this.restaurants) {
            ctx.fillRect(rest.location[0], rest.location[1], 2,2);
          }
          if (this.restaurants.length > 0)
            ctx.strokeStyle = 'red';
          else
            ctx.strokeStyle = 'black';
          ctx.strokeRect(this.min_x, this.min_y, this.width, this.height );
        }
        
    }
    contains(loc) {
        let x = loc.longitude, y = loc.latitude;
        return ((x>=this.min_x && x<this.max_x) && (y>=this.min_y && y<this.max_y));
    }
    tostring() {
      return `QTree (${this.min_x},${this.min_y},${this.max_x},${this.max_y})`;
    }
}
module.exports = SimpleQuadTree;