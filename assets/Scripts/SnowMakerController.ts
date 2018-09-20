import { S } from "./SuperManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SnowMakerController extends cc.Component {

    @property
    waterValue: number = 0;
    nextIceBlock: Array<S.iceBlockInfo> = [];

    onLoad() {
        S.snowMakerController = this;
    }

    start() {

    }

    update() {

    }
    RecycleIceBlock() {
        let info: S.iceBlockInfo = S.player.PushIceBlock();
        if (info == null) {
            console.log("SnowMakerController.js : 玩家没有持有冰块");
            return;
        }
        S.player.FadeOutIceBlock();
    }

    PushNextIceBlock() {
        let info: S.iceBlockInfo = S.player.PushIceBlock();
        if (info == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        S.spoutController.GenerateIceBlock(info);
        S.player.FadeOutIceBlock();
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
}
