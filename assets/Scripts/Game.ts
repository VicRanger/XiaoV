const { ccclass, property } = cc._decorator;
import { S } from "./SuperManager";

@ccclass
export default class Game extends cc.Component {

    @property
    score: number = 0;

    @property(cc.Node)
    scoreText: cc.Node = null;

    ApplyScore(delta: number, anim: boolean = false): void {
        this.score += delta;
        this.scoreText.getComponent(cc.Label).string = Math.round(this.score).toString();
        if (anim) {
            let seq = cc.sequence(cc.scaleTo(0.1, Math.max(delta / 10, 1.5)), cc.scaleTo(0.5, 1));
            this.scoreText.runAction(seq);
        }

    }

    onLoad() {
        S.game = this;
        this.node.on("slideleft", this.onSlideLeft, this);
        this.node.on("slideright", this.onSlideRight, this);
        this.node.on("slideup", this.onSlideUp, this);
        this.node.on("slidedown", this.onSlideDown, this);
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
    }

    onSlideLeft() {
        if (S.player.iceBlockInfo == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        // console.log(S.player.iceBlockInfo);
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
        let icesCnt = S.icesController.ices.length;
        for (let i = 0; i < icesCnt; i++) {
            let item = S.icesController.ices[i];
            item.mass = S.data.ice[item.type].mass;
        }
    }

    onSlideDown() {
        // console.log(S.player.isWalk);
        S.snowMakerController.AddIceBlockInfo();
        S.player.ReceiveIceBlock(S.snowMakerController.PopIceBlockInfo());
    }


    //推入一个可用冰块


    start() {

    }
}

