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

    }
    onLoad() {

    }
    update() {

    }
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.isTrig) return;
        if (otherCollider.node.group == "ice") {
            this.isTrig = true;
            this.node.removeComponent(cc.PhysicsBoxCollider);
            this.node.removeComponent(cc.RigidBody);
            let iceController: IceController = otherCollider.node.parent.getComponent(IceController);
            console.log(this.type)
            if (iceController.type == this.type) {
                this.Matches();
                iceController.mass += 10;
            } else {
                this.NotMatches();
                iceController.mass -= 2;
            }
        }
    }
    Install(type: string = "yellow", mass: number = 10) {
        this.type = type;
        this.mass = mass;
        this.node.color = S.data.iceBlock[type].color;
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
