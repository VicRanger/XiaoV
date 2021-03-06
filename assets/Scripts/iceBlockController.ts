import IceController from "./IceController";
import { S } from "./SuperManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class iceBlockController extends cc.Component {

    @property(String)
    type: string = "";
    mass: number = 10;
    isTrig: boolean = false;

    start() {
        let rb = this.getComponent(cc.RigidBody);
        rb.gravityScale = this.mass / 2 + 1;
    }
    onLoad() {

    }
    update() {

    }
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isTrig) return;
        if (otherCollider.node.group == "ice") {
            // console.log(this);
            this.isTrig = true;
            this.node.removeComponent(cc.PhysicsBoxCollider);
            this.node.removeComponent(cc.RigidBody);
            let iceController: IceController = otherCollider.node.parent.getComponent(IceController);
            // console.log(this.type)
            if (iceController.type == this.type) {
                this.Matches();
                iceController.mass += this.mass;
                S.game.ApplyScore(this.mass, true);
            } else {
                this.NotMatches();
                iceController.mass -= this.mass / 2;
            }
        }
    }
    Install(info: S.iceBlockInfo) {
        this.type = info.type;
        this.mass = info.mass;
        this.node.color = S.data.iceBlock[info.type].color;
    }
    MoveToIces() {
        S.SetParent(this.node, this.node.parent.parent);
        let movement = cc.spawn(cc.moveTo(1, S.icesController.node.position), cc.fadeTo(0.25, 0), cc.scaleTo(0.3, 0.1, 0.1).easing(cc.easeCubicActionIn()));
        this.node.runAction(movement);
    }
    Matches() {
        this.scheduleOnce(this.MoveToIces, 0.3);
    }
    NotMatches() {
        this.scheduleOnce(this.MoveToIces, 0.3);
    }
}
