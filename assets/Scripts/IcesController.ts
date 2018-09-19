import { S } from "./SuperManager";
import IceController from "./IceController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class IcesController extends cc.Component {

    @property
    rotateAngle: number = 100;
    ices: Array<IceController> = [];

    onLoad() {
        S.icesController = this;
        this.rotateAngle = S.data.ices.rotateAngle;
        this.ices = this.node.getComponentsInChildren('IceController');
        console.log("ices onload");
    }
    start() {
        this.CalcRadius();
    }

    update(dt) {
        this.node.rotation = (this.node.rotation + this.rotateAngle * dt) % 360;
        this.CalcRadius();
    }

    CalcRadius() {
        let t = this.ices.length;
        let halfEdges = 8;
        for (var i = 0; i < t; i++) {
            let item = this.ices[i];
            for (var j = 0; j <= halfEdges; j++) {
                var frac = S.data.ices.smoothFrac[j];
                item.radius[j] = this.ices[S.modPrev(i, t)].mass / frac + item.mass * (frac - 1) / frac;
                item.radius[halfEdges * 2 - j + 1] = this.ices[S.modNext(i, t)].mass / frac + item.mass * (frac - 1) / frac;
            }
            // item.radius[halfEdges] = item.mass;
        }
        // console.log(this.ices);
    }

}
