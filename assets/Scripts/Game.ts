const { ccclass, property } = cc._decorator;
import { S } from "./SuperManager";

@ccclass
export default class Game extends cc.Component {

    @property
    score: number = 0;
    pause: boolean = true;

    @property(cc.Node)
    scoreText: cc.Node = null;

    onLoad() {
        S.game = this;
        this.node.on("slideleft", this.onSlideLeft, this);
        this.node.on("slideright", this.onSlideRight, this);
        this.node.on("slideup", this.onSlideUp, this);
        this.node.on("slidedown", this.onSlideDown, this);
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        cc.audioEngine.play(S.audioManager.timi, false, 0.1);
        this.scheduleOnce(function () {
            this.Init();
        }, 1);
    }

    Init() {
        this.pause = false;
        for (let i = 0; i < 2; i++) {
            S.snowMakerController.AddIceBlockInfo();
        }
        S.player.ReceiveIceBlock(S.snowMakerController.PopIceBlockInfo());
    }

    onSlideLeft() {
        if (this.pause) {
            return;
        }
        if (S.player.iceBlockInfo == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        // console.log(S.player.iceBlockInfo);
        S.player.Walk(-1, S.snowMakerController.RecycleIceBlock, this, this.GetIceBlock, this);
    }

    onSlideRight() {
        if (this.pause) {
            return;
        }
        if (S.player.iceBlockInfo == null) {
            console.log("Game.js : 玩家没有持有冰块");
            return;
        }
        S.player.Walk(1, S.snowMakerController.PushNextIceBlock, this, this.GetIceBlock, this);
    }

    onSlideUp() {
        let icesCnt = S.icesController.ices.length;
        for (let i = 0; i < icesCnt; i++) {
            let item = S.icesController.ices[i];
            item.mass = S.data.ice[item.type].mass;
        }
    }

    onSlideDown() {

    }

    GetIceBlock() {
        console.log(123);
        this.scheduleOnce(function () {
            S.snowMakerController.AddIceBlockInfo();
            S.player.ReceiveIceBlock(S.snowMakerController.PopIceBlockInfo());
        }, 0.3);
    }

    PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

    ApplyScore(delta: number, anim: boolean = false): void {
        this.score += delta;
        this.scoreText.getComponent(cc.Label).string = this.PrefixInteger(Math.round(this.score), 6);
        if (anim) {
            let seq = cc.sequence(cc.scaleTo(0.1, Math.max(delta / 10, 1.2)), cc.scaleTo(0.5, 1));
            this.scoreText.runAction(seq);
        }

    }
    update(dt) {
        if (this.pause) return;
        S.icesController.GameUpdate(dt);
    }

}

