const { ccclass, property } = cc._decorator;
import { S } from "./SuperManager";

@ccclass
export default class Game extends cc.Component {

    onLoad() {
        S.game = this;
        this.node.on("slideleft", this.onSlideLeft, this);
        this.node.on("slideright", this.onSlideRight, this);
        this.node.on("slideup", this.onSlideUp, this);
        this.node.on("slidedown", this.onSlideDown, this);
        cc.director.getPhysicsManager().enabled = true;
    }

    onSlideLeft() {
        if (S.player.iceBlockInfo == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        console.log(S.player.iceBlockInfo);
        S.player.Walk(-1, S.snowMakerController.RecycleIceBlock, this);
    }

    onSlideRight() {
        if (S.player.iceBlockInfo == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        S.player.Walk(1, S.snowMakerController.PushNextIceBlock, this);
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
        S.snowMakerController.AddIceBlockInfo();
        S.player.ReceiveIceBlock(S.snowMakerController.PopIceBlockInfo());
    }


    //推入一个可用冰块


    start() {

    }
}

