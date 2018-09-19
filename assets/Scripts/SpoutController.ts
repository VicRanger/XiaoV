import { S } from "./SuperManager";
import IceBlockController from "./IceBlockController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpoutController extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    iceBlockPref: cc.Prefab = null;

    @property
    spoutPos: cc.Node = null;

    onLoad() {
        S.spoutController = this;
        this.spoutPos = this.node.getChildByName("SpoutPos");
    }

    start() {
        this.GenerateIceBlock();
    }

    GenerateIceBlock(type: string = "yellow", mass: number = 10) {
        let iceBlockIns = cc.instantiate(this.iceBlockPref);
        let iceBlockController = iceBlockIns.getComponent(IceBlockController);
        iceBlockController.Install(type, mass);
        iceBlockIns.parent = this.node;
        iceBlockIns.position = this.spoutPos.position;
    }
    // update (dt) {}
}
