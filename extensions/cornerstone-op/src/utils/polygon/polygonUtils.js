/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 16, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';

/**
 * Computes the bounding rectangle of the specified points.
 * @param {types.Point[]} points
 * @return {types.BoundingRectangle} the bounds
 */
function computeBoundingBox(points) {
    /** @type {types.BoundingRectangle} */
    const boundingRectangle = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
    };

    let initialized = false;
    points.forEach((point) => {
        if (!initialized) {
            boundingRectangle.left = point.x;
            boundingRectangle.top = point.y;
            boundingRectangle.right = point.x;
            boundingRectangle.bottom = point.y;

            initialized = true;
            return;
        }

        boundingRectangle.left = Math.min(boundingRectangle.left, point.x);
        boundingRectangle.top = Math.min(boundingRectangle.top, point.y);
        boundingRectangle.right = Math.max(boundingRectangle.right, point.x);
        boundingRectangle.bottom = Math.max(boundingRectangle.bottom, point.y);
        boundingRectangle.width = Math.abs(boundingRectangle.left - boundingRectangle.right);
        boundingRectangle.height = Math.abs(boundingRectangle.top - boundingRectangle.bottom);
    });

    return boundingRectangle;
}

/**
 * Find compute the intersection of two lines.
 * @param {types.Point} p1 First point of line 1
 * @param {types.Point} p2 Second point of line 1
 * @param {types.Point} q1 First point of line 2
 * @param {types.Point} q2 Second point of line 2
 * @returns {{ doesIntersect: boolean, intersectionPoint?: types.Point }} whether the lines intersect. If so, the intersection point.
 */
function lineSegmentIntersection(p1, p2, q1, q2) {
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const { x: x3, y: y3 } = q1;
    const { x: x4, y: y4 } = q2;

    /* Compute a1, b1, c1 (Coefficients of line eqns.) where line joining points 1 and 2
     * is "a1 x  +  b1 y  +  c1  =  0".
     */

    const a1 = y2 - y1;
    const b1 = x1 - x2;
    const c1 = x2 * y1 - x1 * y2;

    /* Compute r3 and r4 ('Sign' values).
     */

    const r3 = a1 * x3 + b1 * y3 + c1;
    const r4 = a1 * x4 + b1 * y4 + c1;

    /* Check signs of r3 and r4.  If both point 3 and point 4 lie on
     * same side of line 1, the line segments do not intersect.
     */

    if (r3 !== 0 && r4 !== 0 && Math.sign(r3) === Math.sign(r4)) {
        return {
            doesIntersect: false /* not intersected */
        };
    }

    /* Compute a2, b2, c2 (Coefficients of line eqns.) */

    const a2 = y4 - y3;
    const b2 = x3 - x4;
    const c2 = x4 * y3 - x3 * y4;

    /* Compute r1 and r2 ('Sign' values) */

    const r1 = a2 * x1 + b2 * y1 + c2;
    const r2 = a2 * x2 + b2 * y2 + c2;

    /* Check signs of r1 and r2.  If both point 1 and point 2 lie
     * on same side of second line segment, the line segments do
     * not intersect.
     */

    if (r1 !== 0 && r2 !== 0 && Math.sign(r1) === Math.sign(r2)) {
        return {
            doesIntersect: false /* not intersected */
        };
    }

    /* Line segments intersect: compute intersection point.
     */

    const denom = a1 * b2 - a2 * b1;
    if (denom === 0) {
        return {
            doesIntersect: false /* colinear (not intersected) */
        };
    }

    const offset = denom < 0 ? -denom / 2 : denom / 2;

    /* The denom/2 is to get rounding instead of truncating.  It
     * is added or subtracted to the numerator, depending upon the
     * sign of the numerator.
     */

    let num = b1 * c2 - b2 * c1;
    const x = (num < 0 ? num - offset : num + offset) / denom;

    num = a2 * c1 - a1 * c2;
    const y = (num < 0 ? num - offset : num + offset) / denom;

    return {
        doesIntersect: true, /* intersected */
        intersectionPoint: {
            x,
            y
        }
    };
}

/**
 * Check if the list of vertices is a complex (intersected) polygon.
 * @param {types.Point[]} vertices
 * @returns {boolean} if the shape is complex (intersected)
 */
function checkIsComplex(vertices) {
    const vertexCount = vertices.length;

    // the line segments immediately preceding and succeeding a given segment are never considered as "intersecting"
    for (let n = 2; n < vertexCount - 1; n++) {
        for (let i = 0; i <= n - 2; i++) {
            const type = lineSegmentIntersection(vertices[n], vertices[n + 1], vertices[i], vertices[i + 1]);
            if (type.doesIntersect) {
                return true;
            }
        }
    }

    // when checking against the last line segment, skip the first line segment (since they are adjacent)
    for (let i = 1; i < (vertexCount - 2); i++) {
        const type = lineSegmentIntersection(vertices[vertexCount - 1], vertices[0], vertices[i], vertices[i + 1]);
        if (type.doesIntersect) {
            return true;
        }
    }

    return false;
}

//------------------------------------------------------------------------------
/**
 * Test if the testPoint is left of the edge.
 * @param {types.Point} point0 First point of the edge.
 * @param {types.Point} point1 Second point of the edge.
 * @param {types.Point} testPoint The point to test.
 * @returns {number} positive if the testPoint is left of the edge. negative otherwise.
 */
function isLeft(point0, point1, testPoint) {
    // this is a dot product of the vector test to p0, with a normal to the vector p0 to p1.
    return (point1.x - point0.x) * (testPoint.y - point0.y) - (testPoint.x - point0.x) * (point1.y - point0.y);
}

/**
 * Counts the winding number around the testPoint.
 * @param {types.Point} testPoint The point to test.
 * @param {types.Point[]} vertices Vertices of the polygon.
 * @returns {number} the winding number around the testPoint.
 */
function countWindings(testPoint, vertices) {
    let wn = 0; // the winding number counter
    const vertexCount = vertices.length;

    // loop through all edges of the polygon
    let point0 = vertexCount - 1;
    for (let point1 = 0; point1 < vertexCount; point0 = point1, point1++) {
        // edge from point0 to point1
        if (vertices[point0].y <= testPoint.y) {
            // start y <= testPoint.y
            if (vertices[point1].y > testPoint.y) { // an upward crossing
                if (isLeft(vertices[point0], vertices[point1], testPoint) > 0) { // testPoint left of edge
                    wn++; // have a valid up intersect
                }
            }
        } else if (vertices[point1].y <= testPoint.y) { // a downward crossing
            // start y > testPoint.y (no test needed)
            if (isLeft(vertices[point0], vertices[point1], testPoint) < 0) { // testPoint right of edge
                --wn; // have a valid down intersect
            }
        }
    }

    return wn;
}

/**
 * Gets whether the point is bounded by the vertices.
 * @param {types.Point} point
 * @param {types.Point[]} vertices
 * @returns {boolean} if the point is bounded.
 */
function isPointInBounds(point, vertices) {
    return countWindings(point, vertices) !== 0;
}

/**
 * Computes the area enclosed by the vertices that form a complex (intersected) polygon.
 * @param {types.Point[]} vertices
 * @returns {number} the area
 */
function computeComplexArea(vertices) {
    // This algorithm is more computationally expensive and provides a weaker approximation of
    // the area of an n-polygon when compared with Formula.AreaOfPolygon, although it does
    // compute the desired area of a self-intersecting polygon.

    const bounds = computeBoundingBox(vertices);

    let areaInPixels = 0;
    for (let x = bounds.left; x <= bounds.right; x++) {
        for (let y = bounds.top; y <= bounds.bottom; y++) {
            if (countWindings({ x, y }, vertices) !== 0) {
                areaInPixels++;
            }
        }
    }

    return areaInPixels;
}

/**
 * Computes the area enclosed by the vertices that form a simple polygon.
 * @param {types.Point[]} vertices
 * @returns {number} the area
 */
function computeSimpleArea(vertices) {
    // technically, this formula does work for complex polygons, it's just that we define inside/outside a complex polygon differently.
    const vertexCount = vertices.length;

    let result = 0;
    let point0 = vertexCount - 1;

    for (let point1 = 0; point1 < vertexCount; point0 = point1, point1++) {
        result += vertices[point0].x * vertices[point1].y - vertices[point1].x * vertices[point0].y;
    }

    return Math.abs(result / 2);
}

/**
 * Computes the area enclosed by the vertices.
 * @param {types.Point[]} vertices
 * @returns {number} the area
 */
function computeArea(vertices) {
    const doesIntersect = checkIsComplex(vertices);
    if (doesIntersect) {
        return computeComplexArea(vertices);
    }

    return computeSimpleArea(vertices);
}

/**
 * Computes the mean, variance and stdDev of the pixel values of the area bounded by the vertices.
 * @param {types.Point[]} vertices
 * @param {number[]} pixels
 * @param {types.BoundingRectangle} bounds
 * @returns {{ count: number, mean: number, variance: number, stdDev: number}} the result
 */
function computeMeanStdDev(vertices, pixels, bounds) {
    let sum = 0;
    let sumSquared = 0;
    let count = 0;
    let index = 0;

    for (let y = bounds.top; y < bounds.top + bounds.height; y++) {
        for (let x = bounds.left; x < bounds.left + bounds.width; x++) {
            const point = { x, y };

            if (isPointInBounds(point, vertices)) {
                sum += pixels[index];
                sumSquared += pixels[index] * pixels[index];
                count++;
            }

            index++;
        }
    }

    if (count === 0) {
        return {
            count,
            mean: 0.0,
            variance: 0.0,
            stdDev: 0.0
        };
    }

    const mean = sum / count;
    const variance = sumSquared / count - mean * mean;

    return {
        count,
        mean,
        variance,
        stdDev: Math.sqrt(variance)
    };
}

export {
    computeBoundingBox,
    computeMeanStdDev,
    computeArea,
};
