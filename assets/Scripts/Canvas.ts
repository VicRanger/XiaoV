import { S } from "./SuperManager";
import Game from "./Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Canvas extends cc.Component {

    @property(cc.Node)
    gNode: cc.Node = null;
    @property
    g: cc.Graphics = null;
    sp: cc.Vec2 = null;
    ep: cc.Vec2 = null;

    onLoad() {
        S.canvas = this;
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.g = this.gNode.getComponent(cc.Graphics);
    }

    start() {
        this.g.strokeColor = cc.color(0, 255, 0, 255);
    }
    
    onTouchStart(e: cc.Event.EventTouch) {
        this.sp = e.getLocation();
        // S.player.node.position = this.node.convertToNodeSpaceAR(e.getLocation());
    }
    onTouchMove(e: cc.Event.EventTouch) {
        this.ep = e.getLocation();
        this.g.clear();
        this.g.moveTo(this.sp.x, this.sp.y);
        this.g.lineTo(this.ep.x, this.ep.y);
        this.g.stroke();
    }
    onTouchEnd(e: cc.Event.EventTouch) {
        var dir = this.sp.sub(this.ep).normalize();
        var para1 = dir.cross(cc.v2(1, 0));
        var para2 = dir.cross(cc.v2(0, 1));
        for (var i = 0; i < 4; i++) {
            if (S.AbsSub(para1, S.SLIDE_DIR[i][0]) + S.AbsSub(para2, S.SLIDE_DIR[i][1]) < 0.3) {
                console.log(S.DEBUG_DIR[i]);
                switch (i) {
                    case 0:
                        S.game.node.emit('slideright', S.game);
                        break;
                    case 1:
                        S.game.node.emit('slideup', S.game);
                        break;    
                    case 2:
                        S.game.node.emit('slideleft', S.game);
                        break;
                    case 3:
                        S.game.node.emit('slidedown', S.game);
                        break;
                }
                break;
            }
        }
    }
    update () {
    }
}
