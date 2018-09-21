import { S } from "./SuperManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    anim: cc.Animation = null;
    walkDuration: number = 0;
    iceUnit: number = 0;
    isWalk: boolean = false;
    iceBlockInfo: S.iceBlockInfo = null;
    iceBlockInfoIns: cc.Node = null;

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
        this.walkDuration = S.data.player.walkDuration;
        this.iceUnit = S.data.player.iceUnit;
    }

    Walk(dir: number, midFunc = function () { }, midTarget: Object = this, endFunc = function () { }, endTarget: Object = this) {
        if (this.isWalk) {
            return;
        }
        this.isWalk = true;
        this.anim.play('walk');
        var endWalkCallback = cc.callFunc(function () {
            this.anim.play('idle');
            this.isWalk = false;
            if (this.node.scaleX < 0) {
                this.node.scaleX *= -1;
            }
        }, this);
        var midCallBack = cc.callFunc(midFunc, midTarget);
        var endCallBack = cc.callFunc(endFunc, endTarget);
        var seq = cc.sequence(
            cc.callFunc(this.chgDirFunc(dir, 1), this),
            cc.moveTo(
                this.walkDuration * this.iceBlockInfo.mass / this.iceUnit, dir > 0 ? this.rightPos.position : this.leftPos.position, 0)
                .easing(cc.easeCubicActionInOut()),
            midCallBack,
            cc.callFunc(this.chgDirFunc(-dir, 2), this),
            cc.moveTo(this.walkDuration, this.startPos.position, 0).easing(cc.easeCubicActionInOut()),
            endCallBack,
            endWalkCallback);
        this.node.runAction(seq);
    }

    chgDirFunc(dir: number, step: number) {
        // console.log(dir, step, this.node, this.iceBlockInfoIns);
        return function () {
            this.node.scaleX *= this.node.scaleX * dir > 0 ? -1 : 1;
            if (this.iceBlockInfoIns != null && step == 1) {
                this.iceBlockInfoIns.scaleX *= dir < 0 ? 1 : -1;
            }
        };
    }

    ReceiveIceBlock(info: S.iceBlockInfo) {
        if (this.isWalk) {
            console.log("Player.js : 玩家正在移动，无法获取冰块");
            return;
        }
        if (this.iceBlockInfo != null) {
            console.log("Player.js : 玩家已经持有冰块了");
            return;
        }
        this.iceBlockInfo = info;
        this.iceBlockInfoIns = cc.instantiate(this.iceBlockInfoPref);
        this.iceBlockInfoIns.parent = this.node.getChildByName("ice");
        let text: cc.Label = this.iceBlockInfoIns.getChildByName("Text").getComponent(cc.Label);
        // console.log(info.mass);
        text.string = Math.ceil(info.mass).toString();
        // console.log(S.data.iceBlock[info.type].color);
        this.iceBlockInfoIns.color = S.data.iceBlock[info.type].color;
    }

    PushIceBlock(): S.iceBlockInfo {
        let ret = this.iceBlockInfo;
        if (ret) {
            this.iceBlockInfo = null;
        }
        return ret;
    }

    FadeOutIceBlock() {
        if (this.iceBlockInfoIns == null) {
            console.log("Player.js : 淡出冰块时遇到null错误");
        }
        this.iceBlockInfoIns.scaleX *= -1;
        var callBack = cc.callFunc(function () {
            this.iceBlockInfoIns.destroy();
            this.iceBlockInfoIns = null;
        }, this);
        var seq = cc.sequence(cc.fadeTo(0.2, 0), callBack);
        this.iceBlockInfoIns.runAction(seq);
    }

    start() {

    }

}