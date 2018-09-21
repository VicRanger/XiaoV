import { S } from "./SuperManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class IceController extends cc.Component {

    @property
    radius: Array<number> = [];
    rbNode: cc.Node = null;
    g: cc.Graphics = null;
    DEBUG_mass: cc.Node = null;
    rotationOffset: number = 0;
    calcPolygons: Array<cc.Vec2> = []
    reduction: number = 0;
    color: cc.Color = null;
    snowPos: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property(Number)
    mass: number = 20;
    @property(String)
    type: string = "";

    onLoad() {
        S.installIceController(this);
        this.rbNode = this.node.getChildByName("RigidBody");
        this.g = this.node.getChildByName("Graphic").getComponent(cc.Graphics);
        this.DEBUG_mass = this.node.getChildByName("DEBUG_MASS");
        this.snowPos = this.node.getChildByName("SnowPos");
        this.DEBUG_mass.color = this.color;
        this.rotationOffset = this.node.rotation;
    }

    start() {
        this.g.node.position = cc.v2(2, 0);
    }

    CalcPolygons() {
        if (this.mass < 0) {
            return;
        }
        let rb = this.rbNode.getComponent(cc.PhysicsPolygonCollider);
        this.calcPolygons[0] = cc.v2(0, 0);
        let len = this.radius.length;
        let angle = 120 / (len - 1);
        for (var i = 0; i < len; i++) {
            this.calcPolygons[i + 1] = cc.v2(0, this.radius[i]).rotate(-S.DegsToRads(angle * i));
        }
        rb.points = this.calcPolygons;
        this.snowPos.position = cc.v2(0, this.radius[len / 2] + 2).rotate(-S.DegsToRads(60));
        rb.apply();
    }

    DrawPolygons() {
        this.g.clear();
        this.g.strokeColor = cc.color(this.color.getR(), this.color.getG(), this.color.getB(), 255);
        this.g.fillColor = this.color;
        this.g.lineWidth = 3;
        this.g.lineCap = cc.Graphics.LineCap.ROUND;
        this.g.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.g.moveTo(0, 0);
        for (let i = 0; i < this.calcPolygons.length; i++) {
            let item = this.calcPolygons[i];
            this.g.lineTo(item.x, item.y);
        }
        this.g.lineTo(0, 0);
        this.g.fill();
        this.g.stroke();
    }

    GameUpdate(dt) {
        this.CalcPolygons();
        this.DrawPolygons();
        this.rbNode.rotation = this.node.rotation - this.rotationOffset;
        this.g.node.rotation = this.node.rotation - this.rotationOffset;
        this.DEBUG_mass.rotation = -S.icesController.node.rotation - this.rotationOffset;
        if (this.mass - dt * this.reduction > 1) {
            this.mass -= dt * this.reduction;
            S.game.ApplyScore(dt * this.reduction);
        }
        this.DEBUG_mass.getComponent(cc.Label).string = parseInt(this.mass.toString()).toString();
    }
}
