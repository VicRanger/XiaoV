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
        this.GenerateIceBlock(new S.iceBlockInfo("yellow",10));
    }

    GenerateIceBlock(info:S.iceBlockInfo) {
        let iceBlockIns = cc.instantiate(this.iceBlockPref);
        let iceBlockController = iceBlockIns.getComponent(IceBlockController);
        iceBlockController.Install(info);
        iceBlockIns.parent = this.node;
        iceBlockIns.position = this.spoutPos.position;
    }
    // update (dt) {}
}
