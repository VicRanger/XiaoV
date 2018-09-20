import { S } from "./SuperManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    anim: cc.Animation = null;

    @property
    speed: number = 600;
    isWalk: boolean = false;
    iceBlockInfo: S.iceBlockInfo = null;

    @property(cc.Node)
    startPos: cc.Node = null;
    @property(cc.Node)
    leftPos: cc.Node = null;
    @property(cc.Node)
    rightPos: cc.Node = null;
    @property(cc.Prefab)
    iceBlockInfoPref: cc.Prefab = null;

    onLoad() {
        S.player = this;
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('idle');
        this.node.position = this.startPos.position;
        this.speed = S.data.player.speed;
    }

    Walk(dir: number, midFunc = function () { }, target: Object = this) {
        if (this.isWalk) {
            return;
        }
        this.isWalk = true;
        this.anim.play('walk');
        var callback = cc.callFunc(function () {
            this.anim.play('idle');
            this.isWalk = false;
        }, this);
        var midCallBack = cc.callFunc(midFunc, target);
        var seq = cc.sequence(
            cc.callFunc(this.chgDirFunc(dir), this),
            cc.moveTo(0.5, dir > 0 ? this.rightPos.position : this.leftPos.position, 0).easing(cc.easeCubicActionInOut()),
            midCallBack,
            cc.callFunc(this.chgDirFunc(-dir), this),
            cc.moveTo(0.5, this.startPos.position, 0).easing(cc.easeCubicActionInOut()),
            callback);
        this.node.runAction(seq);
    }

    chgDirFunc(dir: number) {
        return function () {
            this.node.scaleX *= this.node.scaleX * dir > 0 ? -1 : 1;
        };
    }

    ReceiveIceBlock(info: S.iceBlockInfo) {
        this.iceBlockInfo = info;
        let iceInfoBlockIns = cc.instantiate(this.iceBlockInfoPref);
        iceInfoBlockIns.parent = this.node.getChildByName("ice");
        let text: cc.Label = iceInfoBlockIns.getChildByName("Text").getComponent(cc.Label);
        console.log(info.mass);
        text.string = Math.ceil(info.mass).toString();
        console.log(S.data.iceBlock[info.type].color);
        iceInfoBlockIns.color = S.data.iceBlock[info.type].color;
    }

    PushIceBlock(): S.iceBlockInfo {
        let ret: S.iceBlockInfo = this.iceBlockInfo;
        this.iceBlockInfo = null;
        return ret;
    }

    FadeOutIceBlock(){
        
    }

    start() {

    }

}