function getTrilateration(position1, position2, position3) {
    var xa = position1.x;
    var ya = position1.y;
    var xb = position2.x;
    var yb = position2.y;
    var xc = position3.x;
    var yc = position3.y;
    var ra = position1.distance;
    var rb = position2.distance;
    var rc = position3.distance;

   /* var S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
    var T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
    var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
    var x = ((y * (ya - yb)) - T) / (xb - xa);*/






 var S = (Math.pow(p3.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p3.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p3.r, 2.)) / 2.0;
 var T = (Math.pow(p1.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p1.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p1.r, 2.)) / 2.0 ;

 var y = ((-7 * (p2.x - p3.x)) - (S * (p2.x - p1.x))) / (((p1.y - p2.y) * (p2.x - p3.x)) - ((p3.y - p2.y) * (p2.x - p1.x)));
 var x = ((y * (p1.y -p2.y )) - T) / (p2.x - p1.x);





    return {
        x: x,
        y: y
    };
}





