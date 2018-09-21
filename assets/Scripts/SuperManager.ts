import Canvas from "./Canvas";
import Player from "./Player";
import Game from "./Game";
import IcesContoller from "./IcesController";
import IceContoller from "./IceController";
import SpoutController from "./SpoutController";
import SnowMakerController from "./SnowMakerController";
export module S {
    export var canvas: Canvas = null;
    export var player: Player = null;
    export var game: Game = null;
    export var icesController: IcesContoller = null;
    export var spoutController: SpoutController = null;
    export var snowMakerController: SnowMakerController = null;
    export var iceInPlayer: cc.Node = null;
    export var SLIDE_DIR: Array<Array<number>> = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    export var DEBUG_DIR: Array<string> = ["右划", "上划", "左划", "下划"];
    export var DegsToRads: Function = function (x: number) {
        return x / 180 * Math.PI
    }
    export var AbsSub: Function = function (x: number, y: number) {
        return Math.abs(x - y);
    }
    export var modPrev: Function = function (x: number, mod: number) {
        return (x - 1 + mod) % mod;
    }
    export var modNext: Function = function (x: number, mod: number) {
        return (x + 1 + mod) % mod;
    }
    export var installIceController: Function = function (x: IceContoller) {
        let type: string = x.type;
        x.reduction = data.ice[type].reduction;
        x.mass = data.ice[type].mass;
        x.color = data.ice[type].color;
    }
    export var GenerateType: Function = function () {
        return data.colors[Math.floor(3 * Math.random())];
    }
    export var SetParent: Function = function (node: cc.Node, par: cc.Node): void {
        let originPos: cc.Vec2 = node.parent.convertToWorldSpaceAR(node.position);
        let curPos: cc.Vec2 = par.convertToNodeSpaceAR(originPos);
        node.parent = par;
        node.setPosition(curPos);
    }
    export var data = {
        colors: ["red", "blue", "yellow"],
        player: {
            walkDuration: 0.5,
            iceUnit: 10
        },
        ices: {
            rotateAngle: 20,
            smoothFrac: [2, 3, 5, 8, 12, 17, 23, 30, 38],
            // smoothFrac: [2, 4, 10, 18, 28, 40, 54, 70, 88],
        },
        iceBlock: {
            red: {
                color: cc.color(220, 90, 105, 255)
            },
            blue: {
                color: cc.color(90, 161, 215, 255)
            },
            yellow: {
                color: cc.color(234, 234, 40, 255)
            },
        },
        ice: {
            red: {
                reduction: 0.7,
                mass: 70,
                color: cc.color(220, 90, 105, 255)
            },
            blue: {
                reduction: 0.8,
                mass: 80,
                color: cc.color(90, 161, 215, 255)
            },
            yellow: {
                reduction: 0.9,
                mass: 90,
                color: cc.color(234, 234, 40, 255)
            },
        }
    }
    export class iceBlockInfo {
        constructor(type: string = "yellow", mass: number = 0) {
            this.type = type;
            this.mass = mass;
        }
        public type: string = "";
        public mass: number = 0;
    }
}