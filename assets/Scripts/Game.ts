const { ccclass, property } = cc._decorator;
import { S } from "./SuperManager";

@ccclass
export default class Game extends cc.Component {

    @property
    nextIceBlock: Array<S.iceBlockInfo> = [];


    onLoad() {
        S.game = this;
        this.node.on("slideleft", this.onSlideLeft, this);
        this.node.on("slideright", this.onSlideRight, this);
        this.node.on("slideup", this.onSlideUp, this);
        this.node.on("slidedown", this.onSlideDown, this);
        cc.director.getPhysicsManager().enabled = true;
    }

    onSlideLeft() {
        S.player.Walk(-1);
    }

    onSlideRight() {
        this.AddIceBlockInfo();
        S.player.Walk(1, this.PushNextIceBlock, this);
    }

    onSlideUp() {
        console.log();
        let icesCnt = S.icesController.ices.length;
        for (let i = 0; i < icesCnt; i++) {
            let item = S.icesController.ices[i];
            item.mass = S.data.ice[item.type].mass;
        }
    }

    onSlideDown() {
        S.player.ReceiveIceBlock(this.GenerateIceBlockInfo());

    }

    //推入一个可用冰块
    PushNextIceBlock() {
        let info: S.iceBlockInfo = S.player.PushIceBlock();
        if (info == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        S.spoutController.GenerateIceBlock(info.type, info.mass);
    }

    //随机产生一个冰块
    GenerateIceBlockInfo(): S.iceBlockInfo {
        return new S.iceBlockInfo(S.GenerateType(), Math.random() * 10);
    }

    //随机产生一个冰块并加入队列
    AddIceBlockInfo(): void {
        this.nextIceBlock.push(this.GenerateIceBlockInfo());
    }

    //从队列里取一个冰块
    PopIceBlockInfo(): S.iceBlockInfo {
        if (this.nextIceBlock.length > 0) {
            return this.nextIceBlock.shift();
        }
        return null;
    }

    start() {

    }
}

